const express = require("express");
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); // Add this line

const app = express();
dotenv.config();

const globalCorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(globalCorsOptions));
app.options("*", cors(globalCorsOptions));
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1/product", require("./routes/productRoute"));
app.use("/api/v1/category", require("./routes/categoryRoute"));
app.use("/api/v1/subcategory", require("./routes/subCategoryRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));

const port = process.env.PORT || 5100;

// Conditionally listen
mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("MYSQL DB Connected");

    // listen
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.status(200).send("Green Shop is working");
});
