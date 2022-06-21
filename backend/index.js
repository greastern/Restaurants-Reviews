// connect to the db and start the server
import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"

// configure .env and load in enviroment variables 
dotenv.config()

// get access to mongoclient
const MongoClient = mongodb.MongoClient

// set port number  from .env, if that does not work then set to 8000
const port = process.env.PORT || 8000

// connect to the db
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true,}
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => { // starting the webserver after the Db is connected to   
    await RestaurantsDAO.injectDb(client)
    app.listen(port, () => {
        console.log('listening on port '+port)
    })   
})