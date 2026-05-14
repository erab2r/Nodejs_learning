import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

export const productController =async(req: IncomingMessage,
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
        if (url === "/products" && method === "GET") {
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
            const product = products.find((p : IProduct)=> p.id === id);
            if(!product){
                   res.writeHead(200,{"content-type" : "application/json"})
                   res.end(JSON.stringify({message: "Product not found",
                        data : null,
             }));
            }
            //console.log(product);
            res.writeHead(200,{"content-type" : "application/json"})
            res.end(JSON.stringify({message: "Product retrived succeefully",
                data : product,
            }));
        }else if(method === "POST" && url === "/products"){
            //created a product by post method
            const body =await parseBody(req);
            const products = readProduct(); // [{},{},{}]
            const newProduct = {
                id: Date.now(),
                ...body,
                };
            // console.log(newProduct);
            products.push(newProduct); 
            insertProduct(products);
             res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({message: "Product created succeefully",
                data : products,
            }));
        }else if (method === "PUT" && id !== null) {
        // Updated product by PUT method
        const body = await parseBody(req);
        const products = readProduct();

        const index = products.findIndex((p: IProduct) => p.id === id);
        // console.log(index);
        if (index < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(
                JSON.stringify({
                    message: "Product not found!",
                        data: null,
            }),
        );
        }

        // console.log(products[index]);
        products[index] = { id: products[index].id, ...body };

        insertProduct(products);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(
            JSON.stringify({
                message: "Product updated successfully!",
                    data: products[index],
      }),
    );
    }else if(method === "DELETE" && id !== null){
        //delete a product by delete method
        const products = readProduct();
        const index = products.findIndex((p: IProduct) => p.id === id);
                if (index < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(
                JSON.stringify({
                    message: "Product not found!",
                        data: null,
            }),
        );
        }
        products.splice(index,1);
        insertProduct(products);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(
            JSON.stringify({
                message: "Product deleted successfully!",
                    data: null,
      }),
    );
    }

};