// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const connectionRoutes = require('./routes/connectionRoutes'); 
const navigation = require('./routes/navigation');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

// connect to mongoDB
mongoose.connect(url)
.then(()=>{
    // start server
    app.listen(port, host, () => {
    console.log("Server is running on port", port);
})
})
.catch(err=>console.log(err.message));

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// create session
app.use(session({
    secret:'4389rqernkfnas943eifnwn',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/NBAD'})
}));

// flash messages
app.use(flash());
app.use((req, res, next)=>{
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

// setup routes
app.use('/', navigation)
app.use('/connections', connectionRoutes);
app.use('/user', userRoutes);

// error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) =>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status)
    res.render('error', {error: err});
});
