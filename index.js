const { initializeDatabase } = require("./db/db.connect");
const ProductsList = require("./Models/products.Models");

const WishListProducts = require("./Models/wishList.Models");

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

// to get product by category
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

// to get product by rating
async function productsByRating(productRating) {
  try {
    const filteredProducts = await ProductsList.find({ rating: productRating });
    return filteredProducts;
  } catch (error) {
    console.log("Error in Connecting to database.", error);
  }
}
app.get("/products/rating/:productRating", async (req, res) => {
  try {
    const products = await productsByRating(req.params.productRating);
    if (products.length != 0) {
      res.status(200).json({
        message: "Successfully fetched products by rating.",
        products,
      });
    } else {
      res.status(404).json({ error: "Error in fetching products by rating." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get products data.", error });
  }
});

//***************** Add products to wishlist *****************
async function addProductsToWishlist(product) {
  try {
    const newWishlistProduct = new WishListProducts({
      productId: product._id,
      productname: product.name,
      category:product.category,
      quantity:product.quantity,
      productImage: product.productImg,
      price: product.price,
      wishList: true,
    });
    const savedWishlistProduct = await newWishlistProduct.save();
    return savedWishlistProduct;
  } catch (error) {
    console.log("Problem in adding product to wishlist", error);
  }
}

app.post("/products/wishlist", async (req, res) => {
  try {
    const wishlistProduct = await addProductsToWishlist(req.body);
    if (wishlistProduct) {
      res.status(201).json({
        message: "New wishlist product added successfully.",
        products: wishlistProduct,
      });
    } else {
      res.status(404).json({ error: "Error in adding new wishlist product." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add product to wishlist.", error });
  }
});

//***************** Get wishlist products  *****************
async function getWishlistProducts() {
  try {
    const wishlistProducts = await WishListProducts.find();
    return wishlistProducts;
  } catch (error) {
    console.log("Problem in getting product to wishlist", error);
  }
}

app.get("/wishlist/products", async (req, res) => {
  try {
    const wishlistProduct = await getWishlistProducts();
    if (wishlistProduct) {
      res.status(201).json({
        message: "successfully getting wishlist products.",
        products: wishlistProduct,
      });
    } else {
      res.status(404).json({ error: "Error in getting wishlist product." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed in getting wishlist products.", error });
  }
});

//***************** Delete wishlist products  *****************
async function deleteWishlistProduct(name) {
  try {
    const deletedProduct = await WishListProducts.findOneAndDelete({
      productname: name,
    });
    return deletedProduct;
  } catch (error) {
    console.log("Failed to delete from database.", error);
  }
}

app.delete("/product/delete/:name", async (req, res) => {
  console.log("Attempting to delete product:", req.params.name); // Log the product name

  try {
    const productDelete = await deleteWishlistProduct(req.params.name);
    if (productDelete) {
      res.status(200).json({ message: "Successfully deleted product." });
    } else {
      res.status(404).json({ error: "Product not found or already deleted." });
    }
  } catch (error) {
    console.error("Error in deleting product:", error);
    res
      .status(500)
      .json({ error: "Error in deleting product.", details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT:-", PORT);
});
