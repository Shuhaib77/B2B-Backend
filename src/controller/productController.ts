import { NextFunction, Response } from "express";
import { addProductsService, deleteProductService, getProductByIdService, getProductService, updateProductService } from "../service/productService";

export const addProducts=async(req:any,res:Response,next:NextFunction): Promise<void>=>{
  
    const {name,description,price,category,stockQuantity,listedBy,listedByRole,wholesalePrice,minOrderQuantity,}=req.body

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







