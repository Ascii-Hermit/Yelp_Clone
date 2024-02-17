require("dotenv").config();
const express = require("express");
const db = require("./db/index.js");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const port = process.env.PORT || 3005; //precaution

//middleware
app.use(cors())
app.use(express.json())

//get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const results = await db.query("SELEct * FROM restaurants;");
        
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurant: results.rows ,
            }
    });
        
    }
    catch (err) {
        console.log(err);
    }
});

//get a single restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        const results = await db.query("select * from restaurants where id = $1;",[req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    }
    catch (err) {
        console.log(err);
    }
});

//create a restaurant
app.post("/api/v1/restaurants/", async(req, res) => {
    try {
        const results = await db.query("insert into restaurants(name,location,price_range) values ($1,$2,$3);", [req.body.name, req.body.location, req.body.price_range]);
        
        res.status(201).json({
            status: "success",
            data: {
                restaurant:results.rows[0],
            },
        })
        
    } catch (err) {
        console.log(err)
    }
});

//update restaurant
app.put("/api/v1/restaurants/:id", async(req, res) => {
    try {
        const results = await db.query("update restaurants set name = $1, location = $2, price_range = $3 where id = $4 returning *;", [req.body.name, req.body.location, req.body.price_range, req.params.id])
        console.log(results);
        res.status(200).json({
            status: "success",
            data: {
                restaurant:results.rows[0],
            },
        })
        
    }
    catch (err) {
        console.log(err);
    }
})

//delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const results = await db.query("delete from restaurants where id = $1;",[req.params.id])
        res.status(204).json({
            status:"success"
        })
    }
    catch (err) {
        console.log(err);
    }    
})


app.listen(port, () => {
    console.log(`server is up and running on port ${port}`);
});