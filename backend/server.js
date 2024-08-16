const app = require('../backend/app')
const connect = require('../backend/database')
const dotenv = require('dotenv')


dotenv.config({ path: '../backend/config.env' })


//CONNECTING DATABASE
connect()


//MAKING SERVER WHICH WILL RECEIVE ALL KINDS OF REQUESTS
app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})





