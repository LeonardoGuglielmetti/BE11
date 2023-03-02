/* import ContenedorCartsFS from "./FileSystem/ContenedorCartsFS.js";
import ContenedorProductsFS from "./FileSystem/ContenedorProductsFS.js";

import ContenedorCartsMongo from "./MongoDB/ContenedorCartsMongo.js";
import ContenedorProductsMongo from "./MongoDB/ContenedorProductsMongo.js";

export default function setPersistance(pers) {
    switch (pers) {
        case 'mongo' :
            console.log('CONNECTED TO MONGO DB');
            return {
                products: new ContenedorProductsMongo,
                carts: new ContenedorCartsMongo
            };
        case 'filesystem' : 
            console.log('CONNECTED TO FILESYSTEM');
            return {
                products: new ContenedorProductsFS('./DAO/FileSystem/products.json'),
                carts: new ContenedorCartsFS('./DAO/FileSystem/carrito.json')
            };
        default: 
            return false
    };
}; */

import mongoose from "mongoose";
import config from "../config/config.js";

const persistance = "MONGO";

export let userService;
export let Products;
export let Messages;


switch(persistance){
    case "MONGO": 
        mongoose.set('strictQuery', false);
        const connection = mongoose.connect(config.mongo.URL)
        const {default: MongoUser} = await import('./MongoDB/ContenedorUsuarios.js')
        const {default: MongoProducts} = await import('./MongoDB/ContenedorProductsMongo.js');
        const {default: MongoMessages} = await import ('./MongoDB/ContenedorMessagesMongo.js');
        userService = new MongoUser();
        Products = new MongoProducts();
        Messages = new MongoMessages()
        break;
    case "FILESYSTEM": 
        const {default: FSUser} = await import('./FileSystem/ContenedorUsuarios.js')
        userService = new FSUser();
        // const {default: FSProducts} = await import('./FileSystem/ContenedorProductsFS.js')
        // const {default: FSCarts} = await import ('./FileSystem/ContenedorCartsFS.js')
        break;
};