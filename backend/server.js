// configure an express server, attach the cores and express json middleware since we are recieving and sending json
import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

// applying middleware
app.use(cors())
app.use(express.json())

// specify some of the initial routes, putting most of the routes in another file
app.use("/api/v1/restaurants", restaurants)
app.use("*", (req, res) => res.status(404).json({error: "not found"})) //this is a route to make a message if someone goes to a route that does not exist: * means wildcard

// export app as a module
export default app 