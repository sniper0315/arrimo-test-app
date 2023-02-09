import nextConnect from 'next-connect';

import database from './database';
import auth from './auth';

const middleware = nextConnect();

middleware.use(database);
middleware.use(auth);

export default middleware;
