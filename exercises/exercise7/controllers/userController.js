const model = require('../models/users');
const flash = require('connect-flash');

exports.signUp = (req, res)=>{
    res.render('./user/new');
};

exports.login = (req, res)=>{
    res.render('./user/login');
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    model.findById(id)
    .then(user=>{
        console.log(user)
        res.render('./user/profile', {user})})
    
    .catch(err=>next(err));
};

exports.logout = (req, res)=>{
   req.session.destroy(err=>{
       if(err)
            return err
        else
            res.redirect('/');
   }); 
};

//* create a new user
exports.createNewUser = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(()=>res.redirect('/users/login'))
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }

        if(err.code === 11000){
            req.flash('error', 'Email address already in use');
            return res.redirect('/users/new');
        }
        next(err);
       
    });       
};

//* process login request
exports.processLogin = (req,res,next)=>{
    // authenticate login request
    let email = req.body.email;
    let password = req.body.password;
    //get the user that matches the email
    model.findOne({email: email})
    .then(user=>{
        if(user) {
            // user found in db
            user.comparePassword(password)
            .then(result=>{
                // if credentials match, redirect to profile page
                if(result){
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in!');
                    res.redirect('/users/profile');
                }else{
                    console.log('Wrong password');
                    res.redirect('/users/login');
                }
            })
            .catch(err=>next(err));
        }else{
            console.log('Wrong email address');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
};

