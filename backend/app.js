const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();

const isLoggedin = require("./middlewares/isLoggedin");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const productsModel = require("./models/product-model");
const userModel = require("./models/user-model");
const { model } = require("mongoose");

require("dotenv").config();


app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", router);

router.get("/shop", async function (req, res) {
    try {
        
        const product = await productsModel.find();
        res.send({ status: "ok", product: product });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving products");
    }
});

router.post("/addtoCart/:productid", isLoggedin, async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email }); 
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!user.cart.includes(req.params.productid)) {
            user.cart.push(req.params.productid);
            await user.save();
        }

        res.send("Product added to cart");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding to cart");
    }
});

router.get("/addtoCart", isLoggedin, async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email}).populate("cart");

        res.send({ status: "ok", user: user});
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users");
        
    }
})





app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
