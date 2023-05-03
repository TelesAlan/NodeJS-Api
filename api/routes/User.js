module.exports = app => {
    const controller = require('./../controllers/User')();

	app.route('/api/v1/checkLogin').post(controller.checkLogin);
	app.route('/api/v1/login').post(controller.login);

	app.route('/api/v1/checkEmailToChangePassword').post(controller.checkEmailToChangePassword);
	app.route('/api/v1/changePassword').put(controller.changePassword);
} 