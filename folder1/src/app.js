import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './router/views.router.js';
import sessionsRouter from './router/sessions.router.js';
import passport from 'passport';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { Messages, Products } from './DAO/index.js';
import initializeStrategies from './config/passport.config.js';
import mongoose from 'mongoose';
import config from './config/config.js';

//Variables
const app = express();
const PORT = config.app.PORT;
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

/* import setPersistance from '../DAO/index.js';
const container = setPersistance('filesystem'); // " mongo " || " filesystem "

export const APIproducts = container.products;
export const APIcarts = container.carts;
*/

//Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.URL,
        ttl: 30
    }),
    secret: config.mongo.SECRET,
    resave: false,
    saveUninitialized: false
    // cookie : {maxAge : 30000}
}));

//Passport
initializeStrategies();
app.use(passport.initialize())
app.use(passport.session())

//Motor de plantillas
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');
app.use(express.static(`${__dirname}/public`));

//Config.
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Socket.io config.
io.on('connection', async socket => {
    socket.emit('loadProducts', await Products.getAll());
    socket.emit('loadMessages', await Messages.getAll());
    socket.on('addProduct', async product => {
        await Products.saveProduct(product);
        io.emit('loadProducts', await Products.getAll());
    })
    socket.on('sendMessage', async message => {
        await Messages.save(message);
        io.emit('loadMessages', await Messages.getAll());
    });
}); 

//Routers
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

//Listen
const server = app.listen(PORT, () => console.log(`Connected on: http://localhost:${PORT}`));