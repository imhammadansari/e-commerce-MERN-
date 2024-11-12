const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/backendproject");

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }], 
    isAdmin: Boolean,
    orders: [{
        products: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }],
        
    }],
    
    contact: Number,
    picture: String,
});

module.exports = mongoose.model("user", userSchema);

