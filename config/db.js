const mongoose=require('mongoose')

async function connectDB() {
    try {
        const uri = "mongodb+srv://waseemabbas654311_db_user:dWgjgO7PsynUyYre@cluster0.uuc09sq.mongodb.net/?retryWrites=true&w=majority";
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error('Error while connecting to the database:', error);
        // It's good practice to throw the error so it can be handled by the caller
        throw error;
    }
}

// finally if everything is successful then export the module
module.exports=connectDB;