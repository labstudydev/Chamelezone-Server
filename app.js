const { ErrorHandler, handleError , NullCheckErrorHandler, nullCheckHandleError}     = require('./costomModules/customError')
const https = require('https')
const greenlock = require('greenlock-express')
var createServer = require("auto-sni")
const express                           = require('express')
const hbs                               = require('express-handlebars')
const app                               = express()
const bodyParser                        = require('body-parser')
// const router                            = require('./router/index')
const routerApiV1                       = require('./router/api/v1.0')
const routerApiV2                       = require('./router/api/v2.0')

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials'    
}))

app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/image', express.static(__dirname + '/public/uploads'))
app.use(express.static('pulbic'))
app.use(routerApiV1)
app.use(routerApiV2)

app.use((error, request, response, next) => {
    if (error instanceof ErrorHandler) {
        handleError(error, response)
        console.log(__filename + ' == handleError: ' + error.statusCode + ', message: ' + error.message)
    } 
    if (error instanceof NullCheckErrorHandler) {
        nullCheckHandleError(error, response)
        console.log(__filename + ' == handleError: ' + error.statusCode + ', key: ' + error.key)
    }
})

app.get('/addressSearch', (request, response) => {
    // response.status(200).render('map/addressSearch.hbs')
    response.status(200).render('views/map/addressSearch.hbs')
})

app.listen(80, () => {
    console.log('The server is running on Port 80')
})