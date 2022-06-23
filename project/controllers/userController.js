const {validationResult} = require('express-validator');
const User = require('../models/user');
const model = require('../models/connection');
const flash = require('connect-flash');
const RSVP = require('../models/rsvp');

exports.new = (req,res)=>{
    return res.render('./user/new');
};

exports.createAccount = (req, res, next)=>{

        let user = new User(req.body);
        if(user.email)
            user.email = user.email.toLowerCase();
        user.save()
        .then(()=>res.redirect('/user/login'))
        .catch(err=>{
         if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/user/new');
        }

            if(err.code === 11000){
                req.flash('error', 'Email address already in use');
                return res.redirect('/user/new');
        }

            next(err);
        }
         
        )
};

exports.login = (req,res)=>{
    return res.render('./user/login');
};

exports.loginAttempt = (req, res, next)=>{
    let email = req.body.email;
    if(email)
        email = email.toLowerCase();

    let password = req.body.password;

    //get the user that matches the email
    User.findOne({email: email})
    .then(user=>{
        if(user){
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id;
                    req.flash('success', 'You have succesfully logged in');
                    res.redirect('/user/profile');
                }else{
                    //console.log('Password is incorrect');
                    req.flash('error', 'Password is incorrect')
                    res.redirect('/user/login');
                }
            });
        }else{
            //console.log('email address does not exist');
            req.flash('error', 'Email is incorrect')
            res.redirect('/user/login')
        }
    })
    .catch(err=>next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    
    Promise.all([User.findById(id), model.find({hostname: id}), RSVP.find({user: id}).populate('connection')])

    .then(results=>{
        const [user, connections, rsvps] = results;
        console.log(rsvps);
        res.render('user/profile', {user, connections, rsvps}); 

    })
    .catch(err=>next(err));
    
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};