import ContenedorMongo from "./ContenedorMongo.js";
import productsModel from '../../models/Product.js';

export default class ContenedorProductsMongo extends ContenedorMongo {

    async saveProduct(product) {
        if (product.id) {
            delete product.id;
        };
        let newProd = await productsModel.create(product);
        return newProd;
    };

    async updateProduct(product, productId) {
        let updatedProduct = productsModel.updateOne({ _id: productId}, product);
        if(product) return updatedProduct
        else {throw new Error('INVALID PRODUCT')};  
    };
};