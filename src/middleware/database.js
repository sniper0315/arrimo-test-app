import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connection = {};

async function database() {
    if (connection.isConnected) return;

    const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    connection.isConnected = db.connections[0].readyState;
}

export default database;
