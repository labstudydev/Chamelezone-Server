/* ==================== START modules ==================== */

const { ErrorHandler, handleError } = require('./costomModules/customError')
const express       = require('express')
const hbs           = require('express-handlebars')
const app           = express()
const bodyParser    = require('body-parser')
const router        = require('./router/index')

/* ==================== END modules ==================== */

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials'    
}))

app.set("view engine", "hbs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.use(router)

app.use((error, request, response, next) => {
    handleError(error, response)
    console.log(__filename + " == handleError : " + error.statusCode + ", message: " + error.message)
})

app.get("/addressSearch", (request, response) => {
    response.status(200).render('map/addressSearch.hbs')
})

app.listen(3000, () => {
    console.log("The server is running on Port 3000")
})