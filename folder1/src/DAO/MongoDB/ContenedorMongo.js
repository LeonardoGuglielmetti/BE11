import mongoose from "mongoose";
/* 
try {
    await mongoose.connect('mongodb+srv://fran:123@clustersegundaentrega.ltj0b92.mongodb.net/desafio10?retryWrites=true&w=majority');
} catch (error) {
    console.log('Error al conectar con MongoDB');
    console.error(error);
}; */

export default class ContenedorMongo {
/*     constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema)
    }; */

    async getAll(){
        let Arr = await this.collection.find({});
        return Arr;
    };

    async getById(id) {
        let resp = await this.collection.find({ _id: id });
        return resp[0]; // Con el metodo find se crea un Array con el objeto, por lo que hacemos [0] para retornar SOLO el objeto.
    };

    async deleteById(id) {
        try {
            console.log(`Deleted: ${JSON.stringify(await this.getById(id))}`);
            await this.collection.deleteOne({ _id: id });
        } catch (error) {
            console.log(error);
        };
    };
};