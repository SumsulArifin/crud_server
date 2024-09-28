const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.options('*', cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.l4mxaqe.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("users");

    //Users API Start
    app.get("/users", async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        const quary = { _id: new ObjectId(id) }
        const result = await userCollection.findOne(quary);
        res.send(result);
    })

    app.post("/users", async (req, res) => {

        const newUsers = req.body;
        const result = await userCollection.insertOne(newUsers);
        console.log(result);
        res.send(result);
    })

    app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const quary = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(quary);
        res.send(result);
    })
    app.patch("/users", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email }
        const updatedDoc = {
            $set: {
                lastLoggedAt: user.lastLoggedAt

            }
        }
        const result = await userCollection.updateOne(filter, updatedDoc)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Coffee making server is running')
})

app.listen(port, () => {
    console.log(`Port runing on ${port}`);

})