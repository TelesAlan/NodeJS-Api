const Car = require("./../models/Car");
const Utils = require("./../utils");

module.exports = () => {
    const controller = {};

    controller.newCar = async (req, res) => {
        try{
            const [hasAllFields, fields] = Utils.checkRequiredFields(["NAME", "BRAND", "YEAR", "MODEL"], req.body.data);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });
			
			const { NAME, BRAND, YEAR, MODEL } = req.body.data;

			if(await Car.findOne({ NAME, BRAND, YEAR, MODEL }))
				return res.status(400).send({ 
					STATUS: false, 
					message: `Poxa :( Este carro já está cadastrado` 
				});

            await Car.create({ CD_CUSTOMER: req.auth.id, NAME, BRAND, YEAR, MODEL });

			res.status(201).json({
				STATUS: true,
				message: "Carro cadastrado com sucesso!"
			}); 
        }catch(err){
            res.status(500).json({ STATUS: false, message: err.toString()});
        }
    };

    controller.getCars = async (req, res) => {
        try{
			res.status(200).json({
				STATUS: true,
				data: await Car.find({ CD_CUSTOMER: req.auth.id }).select("NAME BRAND YEAR MODEL CREATED_AT")
			});
        }catch(err){
            res.status(500).json({ STATUS: false, message: err.toString()});
        }
    };

    controller.getSpecificCar = async (req, res) => {
        try{
            const [hasAllFields, fields] = Utils.checkRequiredFields(["ID"], req.params);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

            const { ID } = req.params;
			res.status(200).json({
				STATUS: true,
				data: await Car.findOne({ _id: ID, CD_CUSTOMER: req.auth.id }).select("NAME BRAND YEAR MODEL CREATED_AT") || undefined
			});
        }catch(err){
            res.status(500).json({ STATUS: false, message: err.toString()});
        }
    };

    controller.deleteCar = async (req, res) => {
        try{
            const [hasAllFields, fields] = Utils.checkRequiredFields(["ID"], req.params);
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

            const { ID } = req.params;
            if(!await Car.findOne({ _id: ID, CD_CUSTOMER: req.auth.id }))
                return res.status(400).send({ 
                    STATUS: false, 
                    message: `Poxa :( Não encontramos esse carro na base de dados` 
                });

            const response = await Car.findByIdAndDelete({ CD_CUSTOMER: req.auth.id, _id: ID });
			res.status(!!response ? 200 : 400).json({
				STATUS: !!response,
				message: !!response ? "Carro removido com sucesso" : "Ocorreu um erro ao remover o carro, tente novamente mais tarde!"
			});
        }catch(err){
            res.status(500).json({ STATUS: false, message: err.toString()});
        }
    };

    controller.updateCar = async (req, res) => {
        try{
            const [hasAllFields, fields] = Utils.checkRequiredFields(["ID", "NAME", "BRAND", "YEAR", "MODEL"], {...req.params, ...req.body.data});
            if(!hasAllFields && fields.length > 0)
                return res.status(400).json({
                    STATUS: false,
                    message: `Required field(s): '${fields.join(", ")}'.`
                });

            const { ID } = req.params;
            const { NAME, BRAND, YEAR, MODEL } = req.body.data;
            if(!await Car.findOne({ _id: ID, CD_CUSTOMER: req.auth.id }))
                return res.status(400).send({ 
                    STATUS: false, 
                    message: `Poxa :( Não encontramos esse carro na base de dados` 
                });

            const response = await Car.findByIdAndUpdate({ CD_CUSTOMER: req.auth.id, _id: ID }, {
                NAME, BRAND, YEAR, MODEL,
                UPDATED_AT: new Date(),
                UPDATED_BY: req.auth.id
            });
			res.status(!!response ? 200 : 400).json({
				STATUS: !!response,
				message: !!response ? "Carro alterado com sucesso" : "Ocorreu um erro ao alterar o carro, tente novamente mais tarde!"
			});
        }catch(err){
            res.status(500).json({ STATUS: false, message: err.toString()});
        }
    };
    
    return controller;
}