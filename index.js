const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
// const admin = require("firebase-admin");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yohkm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('parlour-website');
        const servicesCollection = database.collection('services');
        const bookingCollection = database.collection('bookings');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        });

        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.json(bookings);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            res.json(result)
        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;

            const query = { email: email }

            const cursor = bookingCollection.find(query);
            const bookings = await cursor.toArray();
            res.json(bookings);
        });

        /* app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;

            const query = { email: email, date: date }

            const cursor = appointmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result)
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        }) */
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctors portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})