import express from 'express'
import uploadImages from '../middeleware/uploadIMG'
import { addProducts, deleteProduct, getProduct, getProductById, importCSVController, listedByGetProduct, updateProduct } from '../controller/productController'
import { multerUpload } from '../middeleware/csvImageUploader'

const router=express.Router()

router.post("/products/:listedBy",uploadImages,addProducts)
router.put("/products/:productId",uploadImages,updateProduct)
router.get("/products",getProduct)
router.get("/products/:productId",getProductById);
router.delete("/products/:productId",deleteProduct);
router.post("/import-csv",multerUpload,importCSVController)
router.get("/products-listedBy/:listedBy",listedByGetProduct)

export default router           