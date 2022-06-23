const res = require('express/lib/response');
const model = require('../models/connection');
const utilities = require('../models/utilities');
const RSVP = require('../models/rsvp');


exports.connections = (req,res, next)=>{
    model.find()
    .then(connections=>{
        let categories = utilities.getCAT(connections);
        res.render('./connection/connections', {connections, categories});
    })
    .catch(err=>next(err));
    };


exports.connection = (req,res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }
    
    Promise.all([RSVP.count({connection:id, value: 'Yes'}), model.findById(id).populate('hostname', 'firstName')])
    .then(results=>{
        if (results){
            const [rsvps,connection] = results;
            return res.render('./connection/connection', {connection, rsvps});
        }else {
            let err = new Error('Cannot find a connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
        };

exports.newConnection = (req,res)=>{
    res.render('./connection/newConnection');
    };

exports.create = (req,res)=>{
    console.log(req.body);
    let NBAD = new model(req.body);
   NBAD.hostname = req.session.user;
   NBAD.save()
   .then((NBAD) =>{
        res.redirect('./connections');
   })
   .catch(err=>{
       if(err.name === 'ValidationError'){
           err.status(400);    
       }
       next(err);
   })
     };
    
exports.edit = (req,res, next)=>{
    let id = req.params.id;
    
    model.findById(id)
    .then(connection=>{
        return res.render('./connection/edit', {connection});  
    })
    .catch(err=>next(err));
        };

exports.newConnection = (req,res)=>{
    res.render('./connection/newConnection');
}

exports.update = (req,res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        res.redirect('/connections/' +id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
            next(err);
    });    
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;


    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), RSVP.deleteMany({connection: id})])
    .then(connection=>{
        res.redirect('/connections');
    })
    .catch(err=>next(err));
}

//

exports.rsvp = (req, res, next)=>{
    let rsvpValue = req.body.RSVP;
    let id = req.params.id;
    let activeUser = req.session.user;
    
    let rsvp = {
        user: activeUser,
        connection: id,
        value: rsvpValue
    };

    RSVP.findOneAndUpdate({user: activeUser,connection: id}, rsvp, {upsert: true, new: true, rawResult: true})
    .then(result=>{
        console.log(result);
            if(result.lastErrorObject.updatedExisting){
                req.flash('success', 'You have updated your reservation');
            }else{
                req.flash('success', 'You have created a new reservation');
            }
            res.redirect('/connections/' +id);
            
            })
            .catch(err=>{
                if(err.name === 'ValidationError')
                    err.status = 400;
                    next(err);
            });  
} 