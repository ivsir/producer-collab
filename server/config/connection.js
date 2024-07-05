const mongoose = require('mongoose');

let cachedDbConnection = null;

async function connectToDatabase() {
  if (cachedDbConnection) {
    return cachedDbConnection;
  }

  const uri = process.env.MONGODB_URI

  mongoose.set('strictQuery', false);

  const dbConnection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  cachedDbConnection = dbConnection;

  return dbConnection;
}

module.exports = connectToDatabase;
