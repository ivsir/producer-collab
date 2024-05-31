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

// const mongoose = require('mongoose');

// let cachedDbConnection = null;

// async function connectToDatabase() {
//   if (cachedDbConnection) {
//     return cachedDbConnection;
//   }

//   const uri = "mongodb+srv://ivsir:Ulang1411!@producer-collab.dyoeqvd.mongodb.net/?retryWrites=true&w=majority&appName=producer-collab";

//   mongoose.set('strictQuery', false);

//   const dbConnection = await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

//   cachedDbConnection = dbConnection;

//   return dbConnection;
// }

// module.exports = connectToDatabase;
