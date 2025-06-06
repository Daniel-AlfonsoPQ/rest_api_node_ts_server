import express from 'express';
import colors from 'colors';
import router from './router';
import db from './config/db';

async function connectDB () {
    try {
        await db.authenticate();
        db.sync()
        console.log(colors.blue('Database connected successfully!'));
    } catch (error) {
        console.error( colors.red.bold('Error connecting to the database:' + error));
    }
}


connectDB()
const server = express();
server.use('/api/products', router);


export default server;