require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//imported modules
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const notFoundMiddleware = require('./middlewares/notfound')
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_P))
app.use(fileUpload())


//Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/file.html')
})
app.post('/', (req, res)=>{
    if(req.files){
        res.send('success')
    }
    console.log(req.files.pictures);


})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)

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