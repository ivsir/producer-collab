import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

// mongoose.connect(
//   process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prodcollabDB',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prodcollabDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
  }
);

const dbConnection = mongoose.connection;

export default dbConnection;

