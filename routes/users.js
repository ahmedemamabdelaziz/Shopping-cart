var express = require('express');
var router = express.Router();


const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport') ;
const Order = require ('../models/Order') ;


const csrf = require('csurf') ;


router.use(csrf()) ;

/* GET users listing. */
router.get('/signup',isNotSignin , function (req, res, next) {
  var massagesError = req.flash('signupError')
  res.render('user/signup'  , { massages : massagesError , token : req.csrfToken()}) ;
});



router.post('/signup' , [
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage('please enter pssword more than 5 char'),
  check('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('password and confirm-password not matched')
    }
    return true;
  })

] , (req , res ,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   

   var validationMassages = [] ;
   for(var i=0 ; i<errors.errors.length ; i++){
     validationMassages.push(errors.errors[i].msg)
   }

   req.flash('signupError' , validationMassages) ;
   res.redirect('signup')

    return;
  }
  next() ;
} , passport.authenticate('local-signup', {
    session : false ,
    successRedirect : 'signin' ,
    failureRedirect : 'signup' ,
    failureMessage : true
}))


router.get('/profile' , isSignin ,(req , res ,next)=>{
  if(req.user.cart){
    totalProducts = req.user.cart.totalquantity
  }else{
    totalProducts = 0
  } 

  Order.find({user : req.user._id} , (err , resualt)=>{
    if(err){
      console.log(err)
    }

    console.log(resualt) ;


    var massagesError = req.flash('profileError') ;

    var hasMassagesError =  false ;
    if(massagesError.length > 0){
      hasMassagesError =  true ;
    }

    
    res.render('user/profile', {checkuser : true ,
       checkProfile : true ,
       totalProducts : totalProducts ,
       userOrder : resualt ,
       token : req.csrfToken() ,
       massages : massagesError ,
       hasMassagesError : hasMassagesError ,
       user : req.user ,
      
      })
  })

  
  
})


router.get('/signin' , isNotSignin , (req , res ,next)=>{
  var massagesError = req.flash('signinError') ;
  res.render('user/signin' , {massages : massagesError , token : req.csrfToken()}) ;
})

router.post('/signin'  ,[
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage('please enter pssword more than 5 char'),

] ,(req , res , next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   

   var validationMassages = [] ;
   for(var i=0 ; i<errors.errors.length ; i++){
     validationMassages.push(errors.errors[i].msg)
   }

   req.flash('signinError' , validationMassages) ;
   res.redirect('signin')

    return;
  }

  next();


} , passport.authenticate('local-signin' , {
  successRedirect : 'profile' ,
  failureRedirect : 'signin' ,
  failureFlash : true ,
}))


router.post('/updateuser' ,  [
  check('username').not().isEmpty().withMessage('please enter your username'),
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter valid email'),
  check('contact').not().isEmpty().withMessage('please enter your contact'),
  check('address').not().isEmpty().withMessage('please enter your adress'),
  
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage('please enter pssword more than 5 char'),
  check('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('password and confirm-password not matched')
    }
    return true;
  })

] ,  (req , res , next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   

   var validationMassages = [] ;
   for(var i=0 ; i<errors.errors.length ; i++){
     validationMassages.push(errors.errors[i].msg)
   }

   req.flash('profileError' , validationMassages) ;
   console.log(validationMassages)
   res.redirect('profile')

    return;
  }else{
    console.log('user updated')
    const updatedUser = {
      userName : req.body.username ,
      email : req.body.email ,
      contact : req.body.contact ,
      address : req.body.address ,
      password : new User().hashPassword(req.body.password)
    }

    User.updateOne({_id : req.user._id} , {$set : updatedUser} , (err , doc)=>{
      if(err){
        console.log(err)
      }else{
        console.log(doc);
        res.redirect('profile')
      }
    })
    
  }
})

router.get('/logout' , isSignin ,  (req , res ,next)=>{
  req.logOut() ;
  res.redirect('/') 
  
})


function isSignin(req , res ,  next){
  if(! req.isAuthenticated()){
    res.redirect('signin')
    return ;
  }
  next();
}

function isNotSignin (req , res ,next){
  if(req.isAuthenticated()){
    res.redirect('/')
    return ;
  }

  next();

}







module.exports = router;   

