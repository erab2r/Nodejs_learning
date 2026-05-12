import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";

export const productController =(req: IncomingMessage,
    res:ServerResponse) =>{
        const url = req.url;
        const method = req.method;
        //products => /products/1   =>['','products','1']
        const urlParts = url?.split("/");
        // console.log(urlParts);
        const id = 
            urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
        // console.log("This is the actual id : ",id);

        //get all products
        if(url === "/products" && method === "GET"){
            // const products = [
            //     {
            //         id : 1,
            //         name: "Product-1",
            //     }
            // ]
            const products = readProduct();
            res.writeHead(200,{"content-type" : "application/json"})
            res.end(JSON.stringify({message: "Products retrived succeefully",
                data : products
            }));
        }else if(method === "GET" && id !== null){// get single product
            const products = readProduct();
            const product = products.find((p : IProduct)=> p.id === id)
            //console.log(product);
            res.writeHead(200,{"content-type" : "application/json"})
            res.end(JSON.stringify({message: "Product retrived succeefully",
                data : product,
            }));
        }

}