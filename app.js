const express = require('express')

const app = express()

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await app.listen(port)
        console.log(`App started on port ${port}`);
    } catch (error) {
        console.log(error);
    }
}

start()