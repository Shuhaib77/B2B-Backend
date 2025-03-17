import express from 'express'
import uploadImages from '../middeleware/uploadIMG'
import { addProducts, deleteProduct, getProduct, getProductById, importCSVController, listedByGetProduct, updateProduct } from '../controller/productController'
import { multerUpload } from '../middeleware/csvImageUploader'
import { addToCart, decrementQuantity, incrementQuantity, removeCart, viewCart } from '../controller/cartControll'

const router=express.Router()

router.post("/products/:listedBy",uploadImages,addProducts)
router.put("/products/:productId",uploadImages,updateProduct)
router.get("/products",getProduct)
router.get("/products/:productId",getProductById);
router.delete("/products/:productId",deleteProduct);
router.post("/import-csv",multerUpload,importCSVController)
router.get("/products-listedBy/:listedBy",listedByGetProduct)


//cart route

router.post("/:userId/cart/:productId",addToCart)
router.get("/cart/:userId",viewCart)
router.put("/:userId/cart/:productId/increment",incrementQuantity)
router.put("/:userId/:cart/:productId/decrement",decrementQuantity)
router.delete("/:userId/cart/:productId",removeCart)

export default router           