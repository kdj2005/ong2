const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config();

const dbconnection=async()=>{
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ong';
    await mongoose.connect(uri);
    console.log("Connexion à la base de données réussie");
}

module.exports=dbconnection