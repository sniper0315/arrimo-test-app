import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import database from '@/middleware/database';
import User from '@/models/user';

export default async function handler(req, res) {
    await database();

    if (req.method === 'POST') {
        try {
            const user = await User.findOne({ email: req.body.username });

            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: 86400 }); // 1 day token

                    return res.status(200).send({ token });
                } else return res.status(403).send({ status: 'error', message: 'Your password is incorrect. Please try again!' });
            } else return res.status(401).send({ status: 'error', message: 'Your email is incorrect. Please try again!' });
        } catch (e) {
            return res.status(402).send({ status: 'error', message: 'Failed to find. Sorry. Please refresh.' });
        }
    } else if (req.method === 'PUT') {
        try {
            const oldUser = await User.findOne({ email: req.body.email });

            if (oldUser) return res.status(401).send({ status: 'error', message: 'You already registered.' });
            else {
                const newUser = new User({ name: req.body.username, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8), birth: req.body.birth });

                await newUser.save();

                return res.status(200).send({ status: 'ok', message: 'You registered successfully' });
            }
        } catch (e) {
            return res.status(400).send({ status: 'error', message: 'Failed to find. Sorry.' });
        }
    }

    return res.status(403).json('Invalid Request');
}
