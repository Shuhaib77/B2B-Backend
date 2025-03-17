import Cart from "../models/cartSchema";
import Products from "../models/Products";
import User from "../models/User"



export const addToCartService=async(userId:string,productId:string)=>{
    const user=await User.findById(userId);
    if(!user) throw new Error("user not found")

    const product=await Products.findById(productId);
    if(!product) throw new Error("product not found");

    let itemCart= await Cart.findOne({userId:userId,productId:productId});
    if(itemCart){
        itemCart.quantity++
        await itemCart.save()
        return "product quantity increment "
    }else{
        itemCart=await Cart.create({
            userId,
            productId,
            quantity:1
        });

        user.cart?.push(itemCart._id)
        await user.save()
        return 'product add to cart successfully'
    }

}


export const viewCartService=async (userId:string)=>{
    const user=await User.findById(userId)
        .populate({
        path:"cart",
        populate:{path:"productId"}
    })
    if(!user) throw new Error("user not found ");

    if(!user.cart|| user.cart.length===0){
        return "your cart is empty "
    }

    return user
}


export const incrementQuantityService=async (userId:string,productId:string)=>{

    const user=await User.findById(userId);
    if(!user) throw new Error("user not found")

    const product=await Products.findById(productId);
    if(!product) throw new Error("product not found");

    const cartItem=await Cart.findOne({userId:userId,productId:productId})
    if(!cartItem) {
        throw new Error("cart not found ")
    }

    cartItem.quantity++;
    await cartItem.save()
    return "quantity incremented"
}

export const decrementQuantityService=async (userId:string,productId:string)=>{

    const user=await User.findById(userId);
    if(!user) throw new Error("user not found")

    const product=await Products.findById(productId);
    if(!product) throw new Error("product not found");

    const cartItem=await Cart.findOne({userId:userId,productId:productId})
    if(!cartItem) {
        throw new Error("cart not found ")
    }


    if(cartItem.quantity>1){
      cartItem.quantity--;
      await cartItem.save()
      return "quantity decremented"
    }
}


export const removeCartService=async(userId:string,productId:string)=>{
    const user=await User.findById(userId);
    if(!user) throw new Error("user not found")

    const product=await Products.findById(productId);
    if(!product) throw new Error("product not found");

    const cartItem = await Cart.findOneAndDelete({ userId, productId });
    if (!cartItem) {
        throw new Error("Product not found in user cart");
    }

    const userCartIndex = user.cart?.findIndex(
        (item :any) => item && item.equals(cartItem._id)
    );

    if(userCartIndex !== -1 && userCartIndex !== undefined){
        user.cart?.splice(userCartIndex,1)
        await user.save()
    }
    return  'cart removed success fully'
}

