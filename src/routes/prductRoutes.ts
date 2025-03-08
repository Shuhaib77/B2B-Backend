import express from 'express'
import uploadImages from '../middeleware/uploadIMG'
import { addProducts, deleteProduct, getProduct, getProductById, updateProduct } from '../controller/productController'

const router=express.Router()

router.post("/products",uploadImages,addProducts)
router.put("/products/:productId",uploadImages,updateProduct)
router.get("/products",getProduct)
router.get("/products/:productId",getProductById);
router.delete("/products/:productId",deleteProduct);

export default router           