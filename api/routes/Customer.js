module.exports = app => {
    const controller = require('./../controllers/Customer')();

	app.route('/api/v1/newAccount').post(controller.newAccount);
}