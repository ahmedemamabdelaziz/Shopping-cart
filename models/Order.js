const mongoose = require('mongoose') ;
const schema = mongoose.Schema ;

const orderSchems = mongoose.Schema({

    user : {
        type : schema.Types.ObjectId  ,
        ref :  'User' ,
        required : true ,
    } ,

    cart : {
        type : Object ,
        required : true ,
    }  ,

    address : {
        type : String ,
        required : true ,
    } ,

    name : {
        type : String ,
        required : true ,
    } ,

    contact : {
        type : String ,
        required : true ,
    } ,

    paymentId : {
        type : String ,
        required : true ,
    } ,

    orderPrice : {
        type : String ,
        required : true , 
    }

}) ;

module.exports = mongoose.model('Order' , orderSchems) ;