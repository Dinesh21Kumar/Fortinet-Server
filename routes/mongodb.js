var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var Promise = require('promise');


// this function will create a mongoDB connection at IP=localhost, PORT= 27017
function connection() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("connection to mongo is successuful");
                resolve(db);
            }
        });
    });

}

//this function will return all the restaurants joined with their corresponding addresses.
function find(conn) {
    var dbo = conn.db("fortinet");
    return new Promise(function (resolve, reject) {
        dbo.collection("restaurants").aggregate([{
                $lookup: {
                    from: "addresses",
                    localField: "Restaurant ID", // field in the orders collection
                    foreignField: "Restaurant ID", // field in the items collection
                    as: "address"
                }
            }])
            .toArray(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    conn.close();
                    resolve(result);
                }
            });
    });
}

//categories restaurants by cuisines
function aggregate(conn) {
    var dbo = conn.db("fortinet");
    return new Promise(function (resolve, reject) {
        dbo.collection("restaurants").aggregate([{
                $group: {
                    _id: "$Cuisines",
                    count: {
                        $sum: 1
                    }
                }
            }])
            .toArray(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    conn.close();
                    resolve(result);
                }
            });
    });
}

//export your functions to outside
module.exports = {
    connection: connection,
    find: find,
    aggregate: aggregate
}