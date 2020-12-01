const express= require('express');
const router= express.Router();
const User= require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

router.post('/signup',(req, res)=>{
    User.find({email: req.body.email}).exec().then(user =>{
        if(user.length >=1){
            return res.status(409).json({
                message: 'Email Already Exists!! Try Signing in'
            });
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    res.status(500).json({
                        error: err
                    });
                }else{
                    const user= new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        username: req.body.username,
                        isadmin: req.body.isadmin
                    });
                    user.save().then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message: 'user created',
                            
                        });
                    }) 
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        }
    }); 
});

router.post('/login',(req, res)=>{
    User.find({email: req.body.email}).exec().then(user=>{
        if(user.length <1){
            return res.status(401).json({
                message: 'User Doesn\'t exist !! try singup first'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            if(err){
                return res.status(401).json({
                    message: 'Password Doesn\'t match try again'
                });
            }
            if(result){
                const token= jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_Key,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth Succcessful',
                    token: token,
                    isadmin: user[0].isadmin,
                    userId: user[0]._id
                });
            }
            return res.status(401).json({
                message: 'Auth Failed'
            });
        });
    })
    .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
    );
});

router.delete('/:userId', (req, res)=>{
    const id= req.params.userId;
    /* res.status(200).json({
    message: 'Deleted Product'
    });*/
   User.remove({_id: id}).exec().then(result =>{
        res.status(200).json({
            message: 'Deleted Product'
        });
    }).catch(err => {
       console.log(err);
       res.status(500).json({
           error: err
       });
   });
});
module.exports = router