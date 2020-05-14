const { ErrorHandler, handleError , NullCheckErrorHandler, nullCheckHandleError }     = require('./costomModules/customError')
const express                           = require('express')
const hbs                               = require('express-handlebars')
const app                               = express()
const bodyParser                        = require('body-parser')
const routerApiV1                       = require('./router/api/v1.0')
const routerApiV1_1                     = require('./router/api/v1.1')
const routerApiV2                       = require('./router/api/v2.0')
const https                             = require('https')
const http                              = require('http')
const fs                                = require('fs')

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
app.use(routerApiV1_1)
app.use(routerApiV2)

/* openssl localhost */ 
// const options = {
//     key: fs.readFileSync('./keys/private.pem'),
// 	cert: fs.readFileSync('./keys/public.pem')
// }

/* letsencrypt ec2 server */ 
const options = {
    ca: fs.readFileSync('/etc/letsencrypt/live/shopinshop.tk/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/shopinshop.tk/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/shopinshop.tk/cert.pem')
}

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
    response.status(200).render('map/addressSearch.hbs')
})

http.createServer(app).listen(3000, function() {
    console.log("HTTP server listening on port " + 3000)
})

https.createServer(options, app).listen(3030, function() {
    console.log("HTTPS server listening on port " + 3030)
})
