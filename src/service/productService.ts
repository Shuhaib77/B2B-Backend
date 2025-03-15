import mongoose, { ObjectId } from "mongoose";
import Products, { IProduct } from "../models/Products";
import { parseCSV } from "../utils/csvParser";


export const addProductsService=async(
    name:String,description:String,price:Number,category:String,stockQuantity:Number,images:String[],listedBy:ObjectId,listedByRole:String,wholesalePrice:Number,minOrderQuantity:Number
)=>{
    
  const newProduct= new Products({
        name,
        description,
        price,
        category,
        stockQuantity,
        listedBy,
        listedByRole,
        images,
        wholesalePrice,
        minOrderQuantity,
      })

      await newProduct.save()

      return newProduct
}


export const updateProductService=async (
    productId:string,name:string,description:string,price:number,category:string,stockQuantity:number,images:string[],listedBy:ObjectId,listedByRole:"seller" | "wholesaler",wholesalePrice:number,minOrderQuantity:number
)=>{
  const product=await Products.findById(productId)
  if(!product){
    throw new Error('product not found')
  }

  if(name)product.name=name;
  if(description)product.description=description;
  if(price)product.price=price;
  if(category)product.category=category;
  if(stockQuantity)product.stockQuantity=stockQuantity;
  if(images)product.images=images;
  if(listedBy)product.listedBy=listedBy;
  if(listedByRole)product.listedByRole=listedByRole;
  if(minOrderQuantity)product.minOrderQuantity=minOrderQuantity;
  
  await product.save();

  return product

}



export const getProductService=async()=>{
    const products=await Products.find({ isDeleted: false })
    if(!products){
        throw new Error("error to fetch data")
    }

    return products
}



export const getProductByIdService=async(productId:string)=>{

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID format");
    }

    const product = await Products.findById(productId);

    console.log(product, "Fetched product");

    // Check if the product exists and is not deleted
    if (!product || product.isDeleted) {
        throw new Error("Product not found or deleted");
    }

    return product;
}



export const deleteProductService=async(productId:string)=>{
    const product =await Products.findById(productId);
    if(!product){
        throw new Error('product not found')
    }

    product.isDeleted=true;
    await product.save()

    return "product deleted success fully";
}



export const importCSVService = async (filePath: string) => {
    try {
      const products = await parseCSV(filePath);

      await Products.insertMany(products);
  
      return { success: true, message: `${products.length} products imported successfully.` };
    } catch (error) {
      throw new Error(`Error importing CSV: ${error}`);
    }
  };



  export const getLiveStock=async (productId:string):Promise<IProduct| null> =>{
    return await Products.findById(productId)
  }


  export const updateStock = async (productId: string, quantity: number): Promise<IProduct | null> => {
    const product = await Products.findById(productId);
    if (!product) return null;
  
    if (product.stockQuantity < quantity) throw new Error("Insufficient stock");
  
    product.stockQuantity -= quantity;
    await product.save();
    return product;
  };


  export const listedByGetProductService=async(listedBy:string)=>{
    const products=await Products.find({isDeleted:false,listedBy:listedBy})

    if(!products) throw new Error('products not found')

      return products;
      
  }