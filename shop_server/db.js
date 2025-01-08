require('dotenv').config();
const databaseUrl = process.env.MONGO_URI;
const {MongoClient} = require('mongodb')

let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(databaseUrl)
            .then(client=>{
                dbConnection = client.db()
                return cb()
            })
            .catch(err=>{
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}