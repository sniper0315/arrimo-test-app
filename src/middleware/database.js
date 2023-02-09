import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connection = {};

async function database(req, res, next) {
    if (connection.isConnected) return next();

    const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    connection.isConnected = db.connections[0].readyState;

    return next();
}

export default database;
