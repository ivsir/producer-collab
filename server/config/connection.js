const mongoose = require('mongoose');

const uri = "mongodb+srv://ivsir:Ulang1411!@producer-collab.dyoeqvd.mongodb.net/?retryWrites=true&w=majority&appName=producer-collab";

mongoose.set('strictQuery', false);

mongoose.connect(
  process.env.MONGODB_URI || uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const dbConnection = mongoose.connection;

module.exports = dbConnection;
