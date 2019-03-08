import jwt from 'jsonwebtoken';
import User from '../models/users';

export default (req, res, next) => {
    const header = req.headers.authorization;
    let token;

    // in pib-frontend App.js
    // options.headers.set('Authorization', `Bearer ${token}`);
    if (header) token = header.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'pos.auth.invalid_token' });
            } else {
                User.findOne({ email: decoded.email }).then(user => {
                    req.currentUser = user;
                    next();
                });
            }
        });
    } else {
        res.status(401).json({ message: 'No token' });
    }
};
