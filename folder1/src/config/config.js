import dotenv from 'dotenv';

dotenv.config();

export default {
    app: {
        PORT: process.env.PORT || 8080
    },
    mongo: {
        URL: process.env.MONGO_URL,
        SECRET: process.env.MONGO_SECRET
    },
    passport: {
        GITHUB_SECRET: process.env.GITHUB_CLIENT_SECRET
    }
}