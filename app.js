require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//security packages
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')

//imported modules
const connectDB = require('./db/connect')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const notFoundMiddleware = require('./middlewares/notfound')
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')
const orderRouter = require('./routes/orderRoute')

const app = express()

app.set('trust proxy', 1)
//use security packages
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
app.use(cors())
app.use(xss())
app.use(helmet())


app.use(express.static('./public'))
//middlewares
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_P))
app.use(fileUpload())


//Routes
app.get('/', (req, res) => {
    res.send("Welcome")
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)

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