import { Server } from "socket.io";
import app from "./app";
const port =5000
import http from 'http'
import Products from "./models/Products";


const server=http.createServer(app)

const io=new Server(server,{cors:{origin:"*"}});

io.on("connection",(socket)=>{
    console.log("client connected");

    socket.on("requestStock",async(productId:string)=>{
        console.log(`Stock request received for product ID: ${productId}`);
        const product=await Products.findById(productId)
        if(product){
            io.emit('stockUpdate',{productId,stock:product.stockQuantity});
        }
    });

    socket.on("disconnect",()=>{
        console.log("Clint Disconnected");
        
    })
    
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});