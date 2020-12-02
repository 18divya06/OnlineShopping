const express= require('express');
const router= express.Router();
const Product= require('../models/index');
const mongoose = require('mongoose');
const isAuth= require('../middleware/isAuth');
const io= require('../socket');
router.get('/', (req,res) => {
    Product.find().exec().then(docs=>{
       // console.log(docs);
        res.status(200).json({doc: docs});
        return docs;
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    /*res.status(200).json({
        message: 'index GET req'});*/
});

router.post('/', isAuth.verifyToken,(req,res) => {
   // console.log('req:',req.body);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    });
    product.save().then(result =>{
        console.log(result);
        io.getSocket().emit('createEventHandle',{ product: result});
        res.status(200).json({
            message: 'Product created',
            createdProduct: result
        });
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:productId', (req,res) => {
   const id= req.params.productId;
   Product.findById(id).exec().then(doc =>{
       console.log(doc);
       res.status(200).json(doc);
   }).catch(err => {
       console.log(err);
       res.status(500).json({
           error: err
       });
    });
  /* res.status(200).json({
    message: 'Id discoved',
    id: id});*/
});

router.patch('/:productId', (req,res) => {
    const id= req.params.productId;
   /* res.status(200).json({
     message: 'Updated Product'
     });*/
     const updateOps = {};
     for(const ops of req.body){
         updateOps[ops.propName] = ops.value;
     }
     Product.update({_id: id},{$set: updateOps}).exec().then(doc =>{
        console.log(doc);
        res.status(200).json(doc);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
     });
 });

 router.delete('/:productId',isAuth.verifyToken, isAuth.isAdminToken,(req,res) => {
  const id= req.params.productId;
     /* res.status(200).json({
     message: 'Deleted Product'
     });*/
     Product.remove({_id: id}).exec().then(result =>{
         res.status(200).json(result);
     }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
 });
module.exports = router