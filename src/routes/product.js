const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadFile");

// Router.get("/greetings", async (request, response) => {
// try {
//     response.status(200).send("Hello World!");
// } catch (error) {
//     console.log(error)
// }
// });

Router.get("/greetings", productController.showGreetings);
// Path Create
// Path Read
// Path Update
// Path Delete
Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  productController.getAllProduct
);
Router.get("/:id", productController.getProductById);
Router.post(
  "/",
  uploadMiddleware.uploadProduct,
  productController.createProduct
);
Router.patch("/:id", productController.updateProduct);
Router.delete("/:id", productController.deleteProduct);

module.exports = Router;
