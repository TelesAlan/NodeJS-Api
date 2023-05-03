const Customer = require("./../models/Customer");
const User = require("./../models/User");
const Utils = require("./../utils");

module.exports = () => {
    const controller = {};

    controller.newAccount = async (req, res) => {
        try{
            const [hasAllFields, fields] = Utils.checkRequiredFields(["NAME", "PHONE", "EMAIL", "PASSWORD"], req.body.data);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });
			
			const { NAME, PHONE, EMAIL, PASSWORD } = req.body.data;

			if(await User.findOne({ EMAIL }))
				return res.status(400).send({ 
					STATUS: false, 
					message: `Poxa :( Este e-mail já está cadastrado na base de dados` 
				});

            const { _id } = await Customer.create({
                NAME,
				PHONE
            });
			
			await User.create({
				CD_CUSTOMER: _id,
				EMAIL,
				PASSWORD
			});

			const EMAIL_TEMPLATE = `
				<h1>Obrigado por fazer o cadastro em nossa API</h1>
				<p>Agora acesse [AQUI VAI O LINK DO SITE] para realizar o login</p>
			`;

			Utils.sendEmail(EMAIL, "Cadastro API", undefined, EMAIL_TEMPLATE).then(info => {
				res.status(201).json({
					STATUS: true,
					message: "Usuário cadastrado com sucesso!"
				});
			}).catch(error => { throw error });
        }catch(err){
            res.status(500).json({ STATUS: false, message: err.toString()});
        }
    };
    
    return controller;
}