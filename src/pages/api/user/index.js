import bcrypt from 'bcryptjs';

import database from '@/middleware/database';
import User from '@/models/user';

export default async function handler(req, res) {
    await database();

    if (req.method === 'GET') {
        try {
            const users = await User.find();

            return res.status(200).json(users);
        } catch (e) {
            return res.status(400).send({ status: 'error', message: 'Failed to get all users. Sorry. Please refresh.' });
        }
    } else if (req.method === 'PUT') {
        try {
            const oldUser = await User.findOne({ email: req.body.email });

            if (oldUser) return res.status(401).send({ status: 'error', message: 'You already registered.' });
            else {
                const newUser = new User({ name: req.body.name, email: req.body.email, password: bcrypt.hashSync(req.body.password, 8), birth: req.body.birth });

                await newUser.save();

                return res.status(200).send({ status: 'ok', message: 'Successfully added new user.' });
            }
        } catch (e) {
            return res.status(400).send({ status: 'error', message: 'Failed to add new user. Please try again.' });
        }
    }
}
