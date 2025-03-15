import { NextFunction, Request, Response } from "express";
import { addProductsService, deleteProductService, getLiveStock, getProductByIdService, getProductService, importCSVService, listedByGetProductService, updateProductService, updateStock } from "../service/productService";
import { trycatch } from "../middeleware/tryCatch";

export const addProducts=async(req:any,res:Response,next:NextFunction): Promise<void>=>{
  
    const {listedBy}=req.params;
    const {name,description,price,category,stockQuantity,listedByRole,wholesalePrice,minOrderQuantity,}=req.body

    try {
        if(!name || !description || !price || !category || !stockQuantity || !listedBy || !listedByRole){
        res.status(403).json({message:'validation error on vehicle'})
        return ;
    }

    if (!["seller", "wholesaler"].includes(listedByRole)) {
       res.status(400).json({ message: "Invalid listedByRole. Must be 'seller' or 'wholesaler'" });
       return;
    }

    const images:String[]= req.body.cloudinaryImageUrls || [];

    const result=await addProductsService(name,description,price,category,stockQuantity,images,listedBy,listedByRole,wholesalePrice,minOrderQuantity)
    if(!result){
      res.status(400).json({message:"production creation failed "})
    }

    res.status(201).json({message:'product added successfully'})

    } catch (error) {
        res.status(500).json({message:'internal server error',error})
    }
}



export const updateProduct=async(req:any,res:Response,next:NextFunction) : Promise<void>=>{  
  const {productId}=req.params;
  const {name,description,price,category,stockQuantity,listedBy,listedByRole,wholesalePrice,minOrderQuantity,}=req.body
try {
  const images:string[]= req.body.cloudinaryImageUrls || [];

  const result=await updateProductService(productId,name,description,price,category,stockQuantity,images,listedBy,listedByRole,wholesalePrice,minOrderQuantity);
  if(!result){
     res.status(400).json({message:"failed to update product"});
     return;
  }

     res.status(200).json({message:'product updated successfully'});

} catch (error) {
  console.log(error,"error")
   res.status(500).json({message:"internal server error"});
}

}


export const getProduct=async (req:any,res:Response,next:NextFunction) :Promise<void>=>{
  try {
    const result=await getProductService();
    if(!result){
     res.status(400).json({message:"products not found"});
     return
    }
    res.status(200).json({message:"product fetched success fully",data:result});
  } catch (error) {
   res.status(500).json({message:"internal server error"});
  }
}

export const getProductById=async(req:any,res:Response,next:NextFunction):Promise<void>=>{
  const {productId}=req.params;
  try {
    const result=await getProductByIdService(productId);
    if(!result){
     res.status(400).json({message:"products not found"});
     return
    }
    res.status(200).json({message:"product fetched success fully",data:result});
  } catch (error) {
    console.log("error",error);
  
   res.status(500).json({message:"internal server error"});
  }
}

export const deleteProduct=async (req:any, res:Response,next:NextFunction):Promise<void>=>{
  const {productId}=req.params;
  try {
    const result=await deleteProductService(productId);
    if(!result){
      res.status(400).json({message:"failed to delete product"})
      return;
    }

    res.status(201).json({message:result});

  } catch (error) {
    console.log(error,"error");
    res.status(500).json({message:"internal server error "});
  }
}


export const importCSVController = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    const result = await importCSVService(req.file.path);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const fetchStock=async (req:Request,res:Response)=>{

  try {
    const {productId}=req.params;
    const product= await getLiveStock(productId);
    if(!product) return res.status(404).json({message:"product not found"})

      res.status(200).json({productId,stock:product.stockQuantity});
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
}


export const reduceStock=async (req:Request,res:Response)=>{
  try {
    const {productId}=req.params;
    const {quantity}=req.body;

    if(!quantity|| quantity<0 ) return res.status(400).json({message:"invalid quantity"})

      const updatedProduct=await updateStock(productId,quantity);
      if(!updateProduct) return res.status(404).json({message:"product not found"})

        res.json({message:"stock updated", stock:updatedProduct?.stockQuantity}).status(200)
  } catch (error) {
    res.status(500).json({ message: "internal server error"});
  }
}


export const listedByGetProduct=async(req:Request,res:Response):Promise<void>=>{
  try {
    const {listedBy}=req.params

    if(!listedBy){
      res.status(400).json({message:'missing required field'})
      return 
    }

    const result=await listedByGetProductService(listedBy)

    if(!result){
      res.status(400).json({message:"failed to fetch products"})
    }

    res.status(200).json({message:'product fetched success fully',products:result})

  } catch (error) {
    res.status(500).json({message:'internal server error'})
  }
}






