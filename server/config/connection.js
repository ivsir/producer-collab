// import mongoose from 'mongoose';

// const uri = "mongodb+srv://ivsir:Ulang1411!@producer-collab.dyoeqvd.mongodb.net/?retryWrites=true&w=majority&appName=producer-collab";
// // const uri = "mongodb://ivsir:Ulang1411!@docdb-2024-05-25-21-57-11.cluster-cpmy6ykiy74g.us-west-2.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
// mongoose.set('strictQuery', false);

// // mongoose.connect(
// //   process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prodcollabDB',
// //   {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //     ssl: true      
// //   }
// // );

// mongoose.connect(
//   process.env.MONGODB_URI || uri,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// );

// const dbConnection = mongoose.connection;

// export default dbConnection;

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