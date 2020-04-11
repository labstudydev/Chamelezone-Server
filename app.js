const { ErrorHandler, handleError , NullCheckErrorHandler, nullCheckHandleError}     = require('./costomModules/customError')
const express                           = require('express')
const hbs                               = require('express-handlebars')
const app                               = express()
const bodyParser                        = require('body-parser')
const router                            = require('./router/index')

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
app.use(router)

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

app.listen(3000, () => {
    console.log('The server is running on Port 3000')
})