const { initializeDatabase } = require("./db/db.connect");
const ProductsList = require("./Models/products.Models");

initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//****** get all products ******
async function getAllProducts() {
  try {
    const allProducts = await ProductsList.find();
    return allProducts;
  } catch (error) {
    console.log("Failed to get products from databse.", error);
    throw error;
  }
}

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    if (products.length != 0) {
      res.status(200).json({ message: "Getting all data.", products });
    } else {
      res.status(404).json({ error: "Failed to fetch product data." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in fetching products data." });
    console.log("Error in fetching products data.", error);
    throw error;
  }
});

// ********** to add product **********
async function addProducts(product) {
  try {
    const newProduct = new ProductsList(product);
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    console.log("Error in adding new product.", error);
    throw error;
  }
}

app.post("/products/add", async (req, res) => {
  try {
    const product = await addProducts(req.body);
    if (product) {
      res
        .status(201)
        .json({ message: "New product added successfully.", product });
    } else {
      res.status(404).json({ error: "Error in adding new product." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add product in the database.", error });
  }
});

//********* to get product by id *********
async function getProductById(productId) {
  try {
    const foundProduct = await ProductsList.findById(productId);
    return foundProduct;
  } catch (error) {
    console.log("Failed connecting to database.", error);
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const filteredProduct = await getProductById(req.params.productId);
    if (filteredProduct) {
      res.status(200).json({
        message: "Successfully found product:",
        products: filteredProduct,
      });
    } else {
      res.status(404).json({ error: "Failed to fetch product by id." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in fetching product by id.", error });
  }
});

// to get product by categoty
async function productsByCategory(productCategory) {
  try {
    const allProductsByCategory = await ProductsList.find({
      category: productCategory,
    });
    return allProductsByCategory;
  } catch (error) {
    console.log("Failed connecting to database.", error);
  }
}

app.get("/products/category/:productCategory", async (req, res) => {
  try {
    const products = await productsByCategory(req.params.productCategory);
    if (products.length != 0) {
      res
        .status(200)
        .json({ message: "Found data successfully.", products: products });
    } else {
      res.status(404).json({ error: "Error in fetching data." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data.", error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT:-", PORT);
});
