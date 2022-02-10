require('dotenv').config()

const express = require('express')

//imported files
const connectDB = require('./db/connect')

const app = express()

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        console.log('Successfully Connected to the database.');
        await app.listen(port)
        console.log(`App started on port ${port}.`);
    } catch (error) {
        console.log(error);
    }
}

start()