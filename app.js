const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "uploads")));

env.config();
// mongobb connection
const mongooseOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
// mongoose.connect(`mongodb+srv://01116748280m:01116748280m@cluster0.raph6.mongodb.net/resturant?retryWrites=true&w=majority`, mongooseOption, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("mongoose connected")
//     }
// })

mongoose.connect(process.env.MONGODB_URI, mongooseOption, (err) => {
  if (err) console.log(err);
  else console.log("mongoose connected");
});

// import routes
const authRouter = require("./routes/auth");

const productsRouter = require("./routes/products");

const categoriesRouter = require("./routes/category");

const orderRouter = require("./routes/order");

const purchasesRouter = require("./routes/purchases");

const userRouter = require("./routes/user");

app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1> <h3>Hey there</h3>");
});
// using routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/", authRouter);

app.use("/api/products/", productsRouter);

app.use("/api/categories/", categoriesRouter);

app.use("/api/orders/", orderRouter);

app.use("/api/purchases/", purchasesRouter);

app.use("/api/users/", userRouter);

app.listen(port, () => console.log("server is running"));

module.exports = app;
