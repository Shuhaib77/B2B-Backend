import { Server } from "socket.io";
import app from "./app";
import http from 'http'
import Products from "./models/Products";
const port =5001

const server=http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });
  
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

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

