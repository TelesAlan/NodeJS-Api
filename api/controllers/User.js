const User = require("./../models/User");
const Customer = require("./../models/Customer");
const Utils = require("./../utils");

module.exports = () => {
	controller = {};

	controller.checkLogin = async (req, res) => {
		try{
			const [hasAllFields, fields] = Utils.checkRequiredFields(["EMAIL", "PASSWORD"], req.body.data);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

			const { EMAIL, PASSWORD } = req.body.data;
			const data = await User.findOne({ EMAIL });
			if(!data)
				return res.status(400).json({
					STATUS: false,
					message: `Poxa :( Parece que você ainda não tem cadastro em nossa plataforma`
				});
			
			if(!data.PASSWORD)
				return res.status(400).json({
					STATUS: false,
					message: `Poxa :( Parece que você ainda não cadastrou uma senha`
				});

			const customerData = await Customer.findOne({ EMAIL, _id: data.CD_CUSTOMER });
			if(customerData.STATUS !== "ACTIVE")
				return res.status(400).json({
					STATUS: false,
					message: `Poxa :( Seu usuário está sem acesso a plataforma`
				});

			const userData = await User.findOne({ EMAIL, PASSWORD });
			if(!userData)
				return res.status(400).json({
					STATUS: false,
					message: `Poxa :( Verifique se seus dados estão corretos`
				});

			const TOKEN = Utils.randomString().toUpperCase();
			const NOW = new Date();
			await User.findOneAndUpdate({_id: userData._id}, {
				TOKEN,
				EXPIRATION_TOKEN_DATE: new Date(NOW.setMinutes(NOW.getMinutes() + 30))
			});

			const EMAIL_TEMPLATE = `
				<h1>O seu token para fazer o Login é: ${TOKEN}</h1>
				Ele tem validade de ${30} minutos
			`;
			
			Utils.sendEmail(EMAIL, "Token de confirmação", undefined, EMAIL_TEMPLATE).then(info => {
				res.status(200).json({
					STATUS: true,
					message: "E-mail enviado com sucesso"
				});
			}).catch(error => { throw error });
		}catch(err){
			res.status(500).json({ STATUS: false, message: err.toString()});
		}
	};

	controller.login = async (req, res) => {
		try{
			const [hasAllFields, fields] = Utils.checkRequiredFields(["EMAIL", "TOKEN", "PASSWORD"], req.body.data);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

				const { EMAIL, PASSWORD, TOKEN } = req.body.data;

				const data = await User.findOne({ EMAIL });
				if(!data)
					return res.status(400).json({
						STATUS: false,
						message: `Poxa :( Parece que você ainda não tem cadastro em nossa plataforma`
					});
				
				if(!data.PASSWORD)
					return res.status(400).json({
						STATUS: false,
						message: `Poxa :( Parece que você ainda não cadastrou uma senha`
					});
	
				const customerData = await Customer.findOne({ EMAIL, _id: data.CD_CUSTOMER });
				if(customerData.STATUS !== "ACTIVE")
					return res.status(400).json({
						STATUS: false,
						message: `Poxa :( Seu usuário está sem acesso a plataforma`
					});
	
				const userData = await User.findOne({ EMAIL, PASSWORD });
				if(!userData)
					return res.status(400).json({
						STATUS: false,
						message: `Poxa :( Verifique se seus dados estão corretos`
					});
					
				if(userData.TOKEN !== TOKEN || new Date(userData.EXPIRATION_TOKEN_DATE).getTime() < new Date().getTime())
					return res.status(400).send({ 
						STATUS: false, 
						message: `Poxa :( Seu token não está mais válido`
					});
			
				res.status(200).send({ 
					STATUS: true, 
					message: {
						email: userData.EMAIL,
						name: customerData.NAME,
						token: Utils.generateJWTToken({ id: userData._id, email: userData.EMAIL, name: customerData.NAME })
					}
				});
		}catch(err){
			res.status(500).json({ STATUS: false, message: err.toString()});
		}
	};

	controller.checkEmailToChangePassword = async (req, res) => {
		try{
			const [hasAllFields, fields] = Utils.checkRequiredFields(["EMAIL"], req.body.data);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

			const { EMAIL } = req.body.data;
			const data = await User.findOne({ EMAIL });
			if(!data)
				return res.status(400).json({
					STATUS: false,
					message: `Poxa :( Parece que você ainda não tem cadastro em nossa plataforma`
				});

			const TOKEN = Utils.randomString().toUpperCase();
			const NOW = new Date();
			await User.findOneAndUpdate({_id: userData._id}, {
				TOKEN,
				EXPIRATION_TOKEN_DATE: new Date(NOW.setMinutes(NOW.getMinutes() + 30))
			});

			const EMAIL_TEMPLATE = `
				<h1>O seu token para fazer a alteração de senha: ${TOKEN}</h1>
				Ele tem validade de ${30} minutos
			`;
			
			Utils.sendEmail(EMAIL, "Alteração de senha", undefined, EMAIL_TEMPLATE).then(info => {
				res.status(200).json({
					STATUS: true,
					message: "E-mail enviado com sucesso"
				});
			}).catch(error => { throw error });
		}catch(err){
			res.status(500).json({ STATUS: false, message: err.toString()});
		}
	};

	controller.changePassword = async (req, res) => {
		try{
			const [hasAllFields, fields] = Utils.checkRequiredFields(["EMAIL", "TOKEN", "PASSWORD", "CONFIRM_PASSWORD"], req.body.data);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

			const { EMAIL, TOKEN, PASSWORD, CONFIRM_PASSWORD } = req.body.data;
			if(PASSWORD !== CONFIRM_PASSWORD)
				return res.status(400).send({ 
					STATUS: false, 
					message:  `Poxa :( As senhas não estão correspondentes`
				});

			if(!(await User.findOne({ EMAIL, TOKEN, EXPIRATION_TOKEN_DATE: {$gte: new Date()} })))
				return res.status(400).send({ 
					STATUS: false, 
					message: `Poxa :( Seu token não está mais válido`
				});
			
			await User.findOneAndUpdate({ EMAIL, TOKEN }, {
				PASSWORD, UPDATED_AT: new Date()
			}, {upsert: true});
			
			return res.status(200).send({ 
				STATUS: true, 
				message: `Senha alterada com sucesso`
			});
		}catch(err){
			res.status(500).json({ STATUS: false, message: err.toString()});
		}
	};

	return controller;
}