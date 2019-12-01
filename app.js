/* ==================== START modules ==================== */
const express       = require('express');
const hbs           = require('express-handlebars');
const app           = express();
const bodyParser    = require('body-parser');
const router        = require('./router/index');
var userRouter = require('./router/user/user');

/* ==================== END modules ==================== */

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials'    
}))

app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(router);

app.use('/user', userRouter);

app.use((request, response, next) => {
    //config
    next();
});

app.listen(3000, () => {
    console.log("The server is running on Port 3000");
});