import passport from "passport";
import local from 'passport-local';
import { userService } from "../DAO/index.js";
import { validatePwd } from "../utils.js";
import GithubStrategy from 'passport-github2';
import config from "./config.js";

const LocalStrategy = local.Strategy;
const initializeStrategies = () => { //MIDDLEWARE => USA "DONE()" COMO "NEXT()"
    passport.use('login', new LocalStrategy( {usernameField: 'email'}, async (email, password, done) => {
        if(!email||!password) return done(null, false, {message: 'valores incompletos'}); //(error, usuario, opciones{mensaje de porqué falló})
        const user = await userService.getBy({email}); //Busco el user solo por el email. ¡¡¡DEBE SER UNICO!!!
        if(!user) return done(null, false, {message: 'credenciales inválidas'});
        const isValidPwd = await validatePwd(password, user.password); //Compara el password que se le envía, con el password encriptado del usuario en Mongo.
        if (!isValidPwd) return done(null, false, {message: 'Contraseña inválida'});
        //SI LLEGAMOS ACA, ES PORQUE SE LOGEO CORRECTAMENTE
        return done(null, user);
    }));

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.a7ffae395119fcfe',
        clientSecret: config.passport.GITHUB_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {

            //¿Y cómo funciona?
            console.log(profile);
            const { name, email } = profile._json;
            const user = await userService.getBy({ email });
            if (!user) {
                //A diferencia del login, si no existe el usuario, NO ME QUEJO, LO CREO
                const newUser = {
                    first_name: name,
                    email,
                    password: ''
                }
                const result = await userService.save(newUser);
                return done(null, result);
            }
            done(null, user);

        } catch (error) {
            done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const result = await userService.getBy({_id: id});
        done(null, result);
    });
}

export default initializeStrategies;