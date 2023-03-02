import { Router } from "express";

const viewsRouter = Router();

viewsRouter.get('/', (req, res) => {
    res.render('login');
});
viewsRouter.get('/register', (req, res) => {
    res.render('register');
});
viewsRouter.get('/home', async (req, res) => {
    res.render('home', { user : req.session.user });
});
viewsRouter.get('/logout', (req, res) => {
    res.render('logout', { user : req.session.user });
    req.session.destroy();
    console.log('Session destroyed.');
});

export default viewsRouter;