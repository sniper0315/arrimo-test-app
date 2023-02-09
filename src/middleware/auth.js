import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
    const token = getCookie('user_token', { req, res });

    if (!token) {
        return res.status(405).send({
            message: 'No token provided! Please login first.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(406).send({
                message: 'Unauthorized!'
            });
        }

        req.userId = decoded.id;

        return next();
    });
}
