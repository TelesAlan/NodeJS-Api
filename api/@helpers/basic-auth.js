module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ STATUS: false, message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (username !== process.env.BASIC_AUTHENTICATION_USER || password !== process.env.BASIC_AUTHENTICATION_PASSWORD) {
        return res.status(401).json({
            STATUS: false,
            message: 'Invalid Authentication Credentials' 
        });
    }
    next();
}