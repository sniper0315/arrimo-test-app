import nextConnect from 'next-connect';

import middleware from '@/middleware';
import User from '@/models/user';
import { ObjectId } from 'mongodb';

const handler = nextConnect();

handler.use(middleware);

handler.put(async (req, res) => {
    try {
        await User.findByIdAndUpdate(new ObjectId(req.query.id), {
            name: req.body.name,
            email: req.body.email,
            birth: req.body.birth
        });

        return res.status(200).send({ status: 'ok', message: 'Successfully updated.' });
    } catch (e) {
        return res.status(400).send({ status: 'error', message: 'Failed to update data.' });
    }
});

handler.delete(async (req, res) => {
    try {
        await User.findByIdAndDelete(new ObjectId(req.query.id));

        return res.status(200).send({ status: 'ok', message: 'Successfully deleted.' });
    } catch (e) {
        return res.status(400).send({ status: 'error', message: 'Failed to delete data.' });
    }
});

export default handler;
