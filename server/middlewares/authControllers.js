const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config');

module.exports = {
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const parsed = jwt.verify(token, jwtSecret);
            req.token = parsed;

            if (!parsed) {
                res.redirect('/tutorials/tutorials')
            } 
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({error: 'Invalid token'})
        }
    },
};

