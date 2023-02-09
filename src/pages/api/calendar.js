import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';

import middleware from '@/middleware';
import Calendar from '@/models/calendar';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    try {
        const newEvent = new Calendar({
            userId: new ObjectId(req.userId),
            title: req.body.title,
            date: req.body.start,
            start: req.body.start,
            end: req.body.end
        });

        await newEvent.save();

        return res.status(200).send({ status: 'ok', message: 'Successfully added' });
    } catch (e) {
        return res.status(400).send({ status: 'error', message: 'Failed to add new event. Please try again.' });
    }
});

handler.get(async (req, res) => {
    try {
        const events = await Calendar.find({ userId: new ObjectId(req.userId) });

        return res.status(200).json(events);
    } catch (e) {
        return res.status(400).send({ status: 'error', message: 'Failed to get all events. Sorry. Please refresh.' });
    }
});

export default handler;
