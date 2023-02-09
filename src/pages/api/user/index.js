import bcrypt from 'bcryptjs';
import nextConnect from 'next-connect';

import User from '@/models/user';
import middleware from '@/middleware';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
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
});

handler.get(async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json(users);
    } catch (e) {
        return res.status(400).send({ status: 'error', message: 'Failed to get all users. Sorry. Please refresh.' });
    }
});

export default handler;
