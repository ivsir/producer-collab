import mongoose from 'mongoose';

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prodcollabDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set('strictQuery', false);


const dbConnection = mongoose.connection;

export default dbConnection;
