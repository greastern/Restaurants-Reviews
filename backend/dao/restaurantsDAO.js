//import { ConnectionCheckedInEvent } from "mongodb"
// store a reference to the db
let restaurants // create a variable called restaurants that is used to store a reference to the db

export default class RestaurantsDAO{
    static async injectDB(conn) { // 'injectDB' method is how we initially connect to the db
        if (restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    static async getRestaurants({ // method that will get the list of restaurants in the db
// options created for this method:
        filters = null, // filters created like cuisine, zipcode, default is show nothing
        page = 0, // default to start at page 0
        restaurantsPerPage = 20, // show 20 restaurants per page
    }={}){
        let query 
        if (filters) {
            if ("name" in filters) {
           query = {$text: { $search: filters["name"]}}   
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor 
// this will find all the restaurants in the query
        try { 
            cursor = await restaurants
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
         
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page) // limit the results to resteraunts per page and also skip to the specific page with the results

        try {
            const restaurantsList = await displayCursor.toArray() // set restaurants list to an arrray
            const totalNumRestaurants = await restaurants.countDocuments(query) 
// return the array
            return { restaurantsList, totalNumRestaurants } 
        } catch (e) {
            console.error(
                `unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return{ restaurantsList: [], totalNumRestaurants: 0 }
        }  
    }
}

