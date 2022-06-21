import RestaurantsDAO  from "../dao/restaurantsDAO.js"

// Create the RestaurantsController class
export default class RestaurantsController {
    static async apiGetRestaurants (req, res, next) { // creating the api to get restaurants
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) :20
        const page = req.query.page ? parseInt(req.query.page,10) : 0

        let filters = {}
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants ({
        filters,
        page,
        restaurantsPerPage,
        })

        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_restaurants: totalNumRestaurants,
        }
        res.json(response) // send a json response with all the above information in the response to whereever the url
    }
}