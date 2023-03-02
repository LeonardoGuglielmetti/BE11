import { Router } from "express";
import { userService } from "../DAO/index.js";
import passport from "passport";
import { createHash } from "../utils.js";

const router = Router();

router.post('/register', async (req, res) => { // AL TENER UN POST EN LA RUTA REGISTER HACEMOS LO SIGUIENTE
    const {first_name, last_name, email, password} = req.body;
    if(!first_name || !email || !password) return res.status(400).send({status: "ERROR", message: "Incomplete values"});
    const exists = await userService.getBy({email});
    if (exists) return res.status(400).send({status: "ERROR", message: "User already exists"});
    const hashedPwd = await createHash(password);
    const result = await userService.save({
        first_name,
        last_name,
        email,
        password: hashedPwd
    });
    res.send({status: "success", payload: result});
});

router.post('/', passport.authenticate('login', {failureRedirect: '/api/sessions/loginFail', failureMessage: true}), async(req, res) => {
    /*  REPLACED WITH PASSPORT AUTHENTICATE
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).send({status: "ERROR", message: "Incomplete values"});
    const user = await userService.getBy({email, password});
    if (!user) return res.status(400).send({status: "ERROR", message: "Wrong Email or Password"}); 
    */
   const user = req.user;
    req.session.user = {
        id: user._id,
        username: user.first_name,
        email: user.email,
        role: user.role
    };
    console.log(req.session.user);
    res.send({status: "success", message: "Logged!"});
});

router.get('/loginFail', (req, res) => {
    // console.log(req.session.messages.length);
    if(req.session.messages.length> 4) return res.status(400).send({status: "Error", message: "BLOQUEA LOS INTENTOS YA. DEMASIADOS INTENTOS."})
    res.status(400).send({status: "Error", message: "Error de AUTENTIFICACION"})
});

router.get('/github', passport.authenticate('github'), (req,res)=> {});

router.get('/githubcallback', passport.authenticate('github'), (req,res)=>{
    const user = req.user;
    req.session.user = {
        id: user._id,
        email:user.email,
        role:user.role
    };
    res.send({status:"success", message:"Logueado Pero con github:)"});
});

export default router;