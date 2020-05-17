var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order') ;


const stripe = require('stripe')('sk_test_JjUgugHcOxWAbVVjcB5hwIjN00BHAya1o9');

/* GET home page. */
router.get('/', function (req, res, next) {

  const successMas = req.flash('success')[0];

  var totalProducts = null;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      totalProducts = req.user.cart.totalquantity;
    } else {
      totalProducts = 0;
    }

  }


  Product.find({}, (error, doc) => {
    if (error) {
      console.log(error)
    }
    var productGrid = [];
    var colGrid = 3;

    for (var i = 0; i < doc.length; i += colGrid) {
      productGrid.push(doc.slice(i, i + colGrid))
    }
    res.render('index', {
      title: 'Shopping-cart'
      , products: productGrid,
      checkuser: req.isAuthenticated(),
      totalProducts: totalProducts ,
      successMas : successMas ,
    });
  })

})

router.get('/addTocart/:id/:price/:name', (req, res, next) => {



  req.session.hasCart = true ;
  const cartID = req.user._id;
  const newproductPrice = parseInt(req.params.price, 10)

  const newProduct = {
    _id: req.params.id,
    price: newproductPrice,
    name: req.params.name,
    quantity: 1,
  }

  Cart.findById(cartID, (error, cart) => {
    if (error) {
      console.log(error)
    }

    if (!cart) {

      const newCart = new Cart({
        _id: cartID,
        totalquantity: 1,
        totalPrice: newproductPrice,
        selectedProduct: [newProduct],
        createAt : Date.now() ,
       
      })


      newCart.save((error, doc) => {
        if (error) {
          console.log(error)
        }
        console.log(doc)
      })

    }
    if (cart) {
      var indexOfProduct = -1;
      for (var i = 0; i < cart.selectedProduct.length; i++) {
        if (req.params.id === cart.selectedProduct[i]._id) {
          indexOfProduct = i;
          break;
        }
      }
      if (indexOfProduct >= 0) {
        cart.selectedProduct[indexOfProduct].quantity = cart.selectedProduct[indexOfProduct].quantity + 1;
        cart.selectedProduct[indexOfProduct].price = cart.selectedProduct[indexOfProduct].price + newproductPrice;
        cart.totalquantity = cart.totalquantity + 1;
        cart.totalPrice = cart.totalPrice + newproductPrice;
        cart.createAt = Date.now() ;
        Cart.updateOne({ _id: cartID }, { $set: cart }, (error, doc) => {
          if (error) {
            console.log(error)
          }
          console.log(doc)
          console.log(cart)
        })
      } else {
        cart.totalquantity = cart.totalquantity + 1;
        cart.totalPrice = cart.totalPrice + newproductPrice;
        cart.selectedProduct.push(newProduct)
        cart.createAt = Date.now();

        Cart.updateOne({ _id: cartID }, { $set: cart }, (error, doc) => {
          if (error) {
            console.log(error)
          }
          console.log(doc)
          console.log(cart)
        })
      }
    }
  })
  res.redirect('/')
})


router.get('/shopping-cart' , (req , res , next)=>{
  if(!req.isAuthenticated()){
     res.redirect('/users/signin')
     return ;
  }

  console.log(req.session.hasCart)

  if(!req.user.cart){
    res.render('shoppingcart' , {checkuser :true , hasCart : req.session.hasCart , totalProducts : 0 }) ;
    req.session.hasCart = false ;
    return ;
  }

  const userCart = req.user.cart ;

  const totalProducts = req.user.cart.totalquantity

  res.render('shoppingcart' , {userCart : userCart , checkuser :true , totalProducts : totalProducts   })
})

router.get('/increaseProduct/:index' , (req , res , next)=>{

  if(req.user.cart){
    const index = req.params.index ;
    const userCart = req.user.cart ;
    const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity
  
    userCart.selectedProduct[index].quantity = userCart.selectedProduct[index].quantity + 1 ;
    userCart.selectedProduct[index].price = userCart.selectedProduct[index].price + productPrice ; 
  
    userCart.totalquantity = userCart.totalquantity + 1 ;
    userCart.totalPrice = userCart.totalPrice + productPrice ;
    userCart.createAt = Date.now()
    console.log(userCart)
  
    Cart.updateOne({_id : userCart._id } , {$set : userCart} , (err , doc) =>{
      if(err){
        console.log(err)
      }
       
      console.log(doc)
      res.redirect('/shopping-cart')
    })
    

  }else{
    res.redirect('shopping-cart');
  }
 
 
})


router.get('/decreaseProduct/:index' , (req , res , next)=>{

  if(req.user.cart){

    const index = req.params.index ;
    const userCart = req.user.cart ;
    const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity
  
    userCart.selectedProduct[index].quantity = userCart.selectedProduct[index].quantity - 1 ;
    userCart.selectedProduct[index].price = userCart.selectedProduct[index].price - productPrice ; 
  
    userCart.totalquantity = userCart.totalquantity - 1 ;
    userCart.totalPrice = userCart.totalPrice - productPrice ;
    userCart.createAt = Date.now();
  
    console.log(userCart)
  
  
    Cart.updateOne({_id : userCart._id } , {$set : userCart} , (err , doc) =>{
      if(err){
        console.log(err)
      }
       
      console.log(doc)
      res.redirect('/shopping-cart')
    })

  }else{
    res.redirect('/shopping-cart') ;
  }


  

})


router.get('/deleteProduct/:index' , (req , res ,next)=>{


  if(req.user.cart){

    const index = req.params.index ;
  const userCart = req.user.cart; 

  console.log(userCart.selectedProduct.length)


  if(userCart.selectedProduct.length <=1){
    Cart.deleteOne({_id : userCart._id} , (err , doc)=>{
      if(err){
        console.log(err)
      }
      console.log(doc)

      res.redirect('/shopping-cart');
    })
  } else{

    userCart.totalPrice = userCart.totalPrice - userCart.selectedProduct[index].price ;
    userCart.totalquantity = userCart.totalquantity - userCart.selectedProduct[index].quantity ;
  
    userCart.selectedProduct.splice(index , 1) ;
    userCart.createAt = Date.now() ;

    console.log(userCart)
  
    Cart.updateOne({_id : userCart._id} , {$set : userCart} , (err , doc)=>{
      if(err){
        console.log(err)
      }
      console.log(doc)
      res.redirect('/shopping-cart')
    })

  }


  }else{
    res.redirect('/shopping-cart')
  }

  

 
})


router.get('/checout' , (req , res , next)=>{




  if(req.user.cart){
    const errorMas = req.flash('error')[0] ;
    console.log(errorMas)
    console.log(req.user)

    if(req.user.userName === undefined || req.user.address === undefined || req.user.contact === undefined ){
      req.flash('profileError' , ['please update your information befor do order']) ;
      res.redirect('users/profile') ;
      return ;
    }
    res.render('checkout' ,{checkuser :true , 
       totalProducts : req.user.cart.totalquantity ,
       totalPrice : req.user.cart.totalPrice ,
       errorMas : errorMas ,
       user : req.user ,
  
        }) 
  }else{
    res.redirect('/shopping-cart')
  }
  
})


router.post('/checkout' , (req , res , next)=>{

  stripe.charges.create(
    {
       amount : req.user.cart.totalPrice * 100 ,
       currency : "usd" ,
       source : req.body.stripeToken ,
       description : "charge for test@example.com"
    },
    function(err, charge) {
      if (err) {

        console.log(err.raw.message)

        req.flash('error' ,err.raw.message) ;

        res.redirect('/checout')
        
      }

      console.log(charge)

      req.flash('success' , 'successfuly bought products !!') ;

      const order = new Order({
        user : req.user._id ,
        cart : req.user.cart ,
        address : req.body.address ,
        name : req.body.name ,
        contact : req.body.contact  , 
        paymentId : charge.id ,
        orderPrice : req.user.cart.totalPrice ,
      }) ;

      order.save((err , resualt)=>{
        if(err){
          console.log(err) ;
        } 
        console.log(resualt) ;

        Cart.deleteOne({_id : req.user.cart._id} , (err , doc)=>{
          if(err){
            console.log(err)
          }
          res.redirect('/') ;
        })
      })
      
    }
  );

})



module.exports = router;

