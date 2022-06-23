const model = require('../models/connection')

// check if the user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/user/profile');
    }
}

// check if the user is logged in
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    }else{
        req.flash('error', 'You must login first');
        return res.redirect('/user/login');
    } 
}

// check if user is host of connection
exports.isHost = (req, res, next)=>{
    
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.hostname == req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
}

exports.isNotHost = (req, res, next)=>{
    
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.hostname != req.session.user){
                return next();
            }else{
                let err = new Error('As a host, you cannot RSVP for your own connection');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
}

