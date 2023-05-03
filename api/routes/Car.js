const JWTAuth = require('../@helpers/jwt-auth');
module.exports = app => {
    const controller = require('./../controllers/Car')();

	app.route('/api/v1/newCar').post(JWTAuth, controller.newCar);
	app.route('/api/v1/getCars').get(JWTAuth, controller.getCars);
	app.route('/api/v1/getSpecificCar/:ID').get(JWTAuth, controller.getSpecificCar);
	app.route('/api/v1/deleteCar/:ID').delete(JWTAuth, controller.deleteCar);
	app.route('/api/v1/updateCar/:ID').put(JWTAuth, controller.updateCar);
}