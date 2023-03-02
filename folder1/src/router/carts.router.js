import { Router } from "express";
import { APIcarts, APIproducts } from "../app.js";

const cartsRouter = new Router;

cartsRouter.get('/', async (req, res) => {
    let cartsArr = await APIcarts.getAll();
    (cartsArr) ? res.json({carts: cartsArr}) : res.json({error: "There's no carts. Please create one."})
});

cartsRouter.get('/:id', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    cart ? res.json({cart: cart}) : res.json({error: "Can't find this cart ID"});
});

cartsRouter.post('/', async (req, res) => {
    try {
        let newCart = await APIcarts.saveCart(req.body);
        res.json({
            new_cart: newCart
        });
    } catch (error) {
        console.log(error);
    }
});

cartsRouter.delete('/:id', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    try {
        let deleted = await APIcarts.deleteById(Number(req.params.id));
        res.json({
            deleted_cart: cart,
        });
    } catch (error) {
        console.error('Failed to delete');
        console.error(error);
    }
});

cartsRouter.get('/:id/productos', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    if (cart) res.json({ cart_id: cart.id, cart_products: cart.products })
    else throw new Error("Can't find this Cart ID.");
});

cartsRouter.post('/:id/productos', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    try {
        let productToAdd = await APIproducts.getById(req.body.id);
        cart.products.push(productToAdd);
        let response = await APIcarts.updateCart(req.params.id , cart);
        res.json({
            new_cart: cart,
            response
        });
    } catch (error) {
        console.log(error);
    }
});

cartsRouter.delete('/:id/productos/:id_product', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    let product = await APIproducts.getById(req.params.id_product);
    if (cart && product) {
        let response = await APIcarts.deleteCartProduct(cart, product);
        res.json({
            newCart: cart,
            response
        });
    } else {
        throw new Error('No Cart or Product.');
    };
});


export default cartsRouter;