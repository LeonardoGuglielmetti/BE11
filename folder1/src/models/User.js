import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    }
});

const userModel = new mongoose.model('Users', usersSchema);

export default userModel;