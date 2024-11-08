const { initializeDatabase } = require("./db/db.connect");
const ProductsList = require("./Models/products.Models");

const WishListProducts = require("./Models/wishList.Models");

const CartProducts = require("./Models/AddToCart.Models");

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
      productInfo: product._id,
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
    const wishlistProducts = await WishListProducts.find().populate(
      "productInfo"
    );
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
async function deleteWishlistProduct(productId) {
  try {
    const deletedProduct = await WishListProducts.findOneAndDelete({
      productInfo: productId,
    });
    return deletedProduct;
  } catch (error) {
    console.log("Failed to delete from database.", error);
  }
}

app.delete("/product/delete/:productId", async (req, res) => {
  console.log("Attempting to delete product:", req.params.productId);
  try {
    const productDelete = await deleteWishlistProduct(req.params.productId);
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

//***************** Add products to Cart *****************
async function addProductsToCart(product) {
  try {
    const newCartProduct = new CartProducts({
      productInfo: product._id,
      productQuantity: product.productQuantity,
      productSize: product.productSize,
    });
    const savedCartProduct = await newCartProduct.save();
    return savedCartProduct;
  } catch (error) {
    console.log("Problem in adding product to wishlist", error);
  }
}

app.post("/products/add/cart", async (req, res) => {
  try {
    const cartProduct = await addProductsToCart(req.body);
    if (cartProduct) {
      res.status(201).json({
        message: "New product added to cart successfully.",
        products: cartProduct,
      });
    } else {
      res.status(404).json({ error: "Error in adding new product to cart." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add product to cart.", error });
  }
});

//***************** Get Carts products  *****************
async function getCartProducts() {
  try {
    const cartProducts = await CartProducts.find().populate("productInfo");
    return cartProducts;
  } catch (error) {
    console.log("Problem in getting product from cart", error);
  }
}

app.get("/cart/get/products", async (req, res) => {
  try {
    const cartProduct = await getCartProducts();
    if (cartProduct) {
      res.status(201).json({
        message: "successfully getting cart products.",
        products: cartProduct,
      });
    } else {
      res.status(404).json({ error: "Error in getting cart product." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed in getting cart products.", error });
  }
});

//***************** Delete Cart products  *****************
async function deleteCartProduct(productId) {
  try {
    const deletedProduct = await CartProducts.findOneAndDelete(
      {
        productInfo: productId,
      },
      { new: true }
    );
    return deletedProduct;
  } catch (error) {
    console.log("Failed to delete from cart.", error);
  }
}

app.delete("/product/cart/delete/:productId", async (req, res) => {
  console.log("Attempting to delete product:", req.params.productId); 

  try {
    const productDelete = await deleteCartProduct(req.params.productId);
    if (productDelete) {
      res
        .status(200)
        .json({ message: "Successfully deleted product from cart." });
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

//******************** Update Cart Product ********************
async function updateCartProduct(productName, updatedValue) {
  try {
    const updatedData = await CartProducts.findOneAndUpdate(
      { productName: productName },
      { quantity: updatedValue },
      { new: true }
    );
    return updatedData;
  } catch (error) {
    console.log("Failed to updated cart data.", error);
  }
}

app.post(
  "/cart/product/update/:productName/:updatedValue",
  async (req, res) => {
    try {
      const { productName, updatedValue } = req.params;
      const updatedProduct = await updateCartProduct(productName, updatedValue);
      if (updatedProduct) {
        res.status(200).json({
          message: "Successfully updated product.",
          products: updatedProduct,
        });
      } else {
        res.status(404).json({ error: "Cannot update Product." });
      }
    } catch (error) {
      console.log("Error in updating cart product.", error);
      res.status(500).json({ error: "Failed to update.", error });
    }
  }
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on PORT:-", PORT);
});
