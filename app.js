require('dotenv').config()
require('express-async-errors')

const express = require('express')

//imported modules
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const notFoundMiddleware = require('./middlewares/notfound')
const authRouter = require('./routes/authRoute')

const app = express()

//middlewares
app.use(express.json())

//Routes
app.get('/', (req, res) => {
    res.send("Welcome to the Home Route")
})
app.use('/api/v1/auth', authRouter)

//Middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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