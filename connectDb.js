const { MongoClient } = require("mongodb");
require("dotenv").config();

module.exports = new MongoClient(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:27017/radianceBackend`
).db("radianceBackend");
