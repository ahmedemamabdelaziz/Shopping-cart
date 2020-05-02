const Product = require('../models/Product') ;

const mongoose = require('mongoose') ;




mongoose.connect('mongodb://localhost/Shopping-cart' ,{useNewUrlParser : true} ,(error)=>{
  if(error){
    console.log(error)
  }else{
    console.log('Connecting to DB .....')
  }
})


const products = [  new Product({

    imagePath: '/images/Huawei Y9 2019 Dual SIM - 64GB, 4GB RAM, 4G LTE, Arabic Blue.jpg' ,

    productName: 'Huawei Y9' ,

    information: {
        storageCapacity: 64 ,
        numberOfSIM: 'Dual SIM' , 
        cameraResolution: 16 , 
        displaySize : 6.5 ,

    } ,

    price: 220 ,
}),


new Product({

    imagePath: '/images/Apple iPhone X with FaceTime - 64GB, 4G LTE, Space Grey.jpg' ,

    productName: 'Apple iPhone X' ,

    information: {
        storageCapacity: 64 ,
        numberOfSIM: 'Dual SIM' , 
        cameraResolution: 12 , 
        displaySize : 5.5 ,

    } ,

    price: 200 ,
}),

new Product({

    imagePath: '/images/Oppo A3S Dual SIM - 16GB, 2GB RAM, 4G LTE, Purple.jpg' ,

    productName: 'Oppo A3S' ,

    information: {
        storageCapacity: 64 ,
        numberOfSIM: 'Dual SIM' , 
        cameraResolution: 20 , 
        displaySize : 5.5 ,

    } ,

    price: 230 ,
}),

new Product({

    imagePath: '/images/Samsung Galaxy Note 9 Dual SIM - 128GB, 6GB RAM, 4G LTE, Midnight Black.jpg' ,

    productName: 'Samsung Galaxy Note 9' ,

    information: {
        storageCapacity: 128 ,
        numberOfSIM: 'Dual SIM' , 
        cameraResolution: 12 , 
        displaySize : 6.4 ,

    } ,

    price: 250 ,
}),

new Product({

    imagePath: '/images/Sony Xperia XZ1 Dual Sim - 64 GB, 4GB RAM, 4G LTE, Moonlight Blue.jpg' ,

    productName: 'Sony Xperia XZ1' ,

    information: {
        storageCapacity: 64 ,
        numberOfSIM: 'Dual SIM' , 
        cameraResolution: 19 , 
        displaySize : 5.2 ,

    } ,

    price: 180 ,
}),

new Product({

    imagePath: '/images/HTC Desire 10 Pro Dual Sim - 64GB, 4GB RAM, 4G LTE, Polar White.jpg' ,

    productName: 'HTC Desire 10' ,

    information: {
        storageCapacity: 16 ,
        numberOfSIM: 'Dual SIM' , 
        cameraResolution: 13 , 
        displaySize : 6.2 ,

    } ,

    price: 170 ,
}),
    
] 

var done = 0 ;

for( var i = 0 ; i < products.length ; i++){
    products[i].save((error , doc)=>{
        if(error){
            console.log(error)
        }
        console.log(doc)
        done ++
        if(done === products.length) { 
            mongoose.disconnect();
        }
    })
}


