const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const config = require("./../../config/default.json");
class Utils {
    checkRequiredFields(requiredFields, obj) {
        const OBJ_KEYS = Object.keys(obj || {});
        const data = requiredFields.filter(key => OBJ_KEYS.indexOf(key) === -1);

        return [data.length === 0, data];
    }
    randomString(lenght=6) {
        let random_string = '';
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < lenght; i++) {
            random_string += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return random_string;
    }

    nodemailerInstance(){
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });
    }
    sendEmail(to, subject, text, html) {
        const OPTIONS = {
            from: process.env.NODEMAILER_EMAIL,
            to,
            subject,
            text,
            html
        };
        return new Promise((resolve, reject) => {
            this.nodemailerInstance().sendMail(OPTIONS, (error, info) => error ? reject(error) : resolve(info));
        });
    }
    generateJWTToken(params = {}){
        return jwt.sign(params, config.APPLICATION_ID, {
            expiresIn: 86400 // 1 day
        });
    }
}
module.exports = new Utils();