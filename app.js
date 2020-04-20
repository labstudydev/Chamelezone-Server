const { ErrorHandler, handleError , NullCheckErrorHandler, nullCheckHandleError}     = require('./costomModules/customError')
const createServer                      = require('auto-sni')
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

app.listen(3000, () => {
    console.log('The server is running on Port 3000')
})

var server = createServer({
    email: 'hiyong27@gmail.com', // Emailed when certificates expire.
    agreeTos: true, // Required for letsencrypt.
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    domains: ["shopinshop.tk"], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
    dir: "~/letsencrypt/etc", // Directory for storing certificates. Defaults to "~/letsencrypt/etc" if not present.
    ports: {
        http: 80, // Optionally override the default http port.
        https: 443 // // Optionally override the default https port.
    }
})

server.once("listening", ()=> {
    console.log("We are ready to go.");
});