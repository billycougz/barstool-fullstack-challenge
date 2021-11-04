import { MongoClient } from "mongodb";

let dbConnection;

export const connectToDb = function (callback) {
  MongoClient.connect(process.env.DB_URI, {
    maxPoolSize: 50,
    connectTimeoutMS: 2500,
  })
    .catch((err) => {
      console.error(err.stack);
      process.exit(1);
    })
    .then(async (client) => {
      dbConnection = client.db(process.env.DB_NS);
      console.log("Successfully connected to MongoDB");
      return callback();
    });
};

export const getDb = function () {
  return dbConnection;
};
