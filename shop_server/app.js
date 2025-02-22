const express = require('express')
const {getDb,connectToDb} = require('./db.js')
const cors = require("cors")
const {ObjectId} = require("mongodb")

const app = express()
app.use(cors())
app.use(express.json())

let db

connectToDb((err) => {
    if(!err){
        app.listen('4000',()=>{
            console.log("app is listening on port 4000")
        })
        db = getDb()
    }
})

app.get("/products", (req,res) =>{
    let products= []

    db.collection("products")
        .find()
        .forEach(product=> products.push(product))
        .then(()=>{
            res.status(200).json(products)
        })
        .catch(()=>{
            res.status(500).json({error:"Error..."})
        })
})

app.get("/options", (req,res) =>{
    let options= []

    db.collection("options")
        .find()
        .forEach(option=> options.push(option))
        .then(()=>{
            res.status(200).json(options)
        })
        .catch(()=>{
            res.status(500).json({error:"Error..."})
        })
})

app.get("/products/id/:id", (req,res) =>{
    if(ObjectId.isValid(req.params.id)){

        db.collection("products")
            .findOne({_id: new ObjectId(req.params.id)})
            .then(doc=>{
                res.status(200).json(doc)
            })
            .catch(()=>{
                res.status(500).json({error:"not found..."})
        })}
    else{
        res.status(500).json({error:"not found..."})
    }
})

app.get("/users", (req,res) =>{
    let users= []

    db.collection("users")
        .find()
        .forEach(user=> users.push(user))
        .then(()=>{
            res.status(200).json(users)
        })
        .catch(()=>{
            res.status(500).json({error:"Error..."})
        })
})

app.post('/users',(req,res) =>{
    const book = req.body

    db.collection('users')
        .insertOne(book)
        .then(result =>{
            res.status(201).json(result)
        })
        .catch(err=>{
            res.status(500).json({err: "could not create new document"})
        })
})

app.patch("/users/cart/:email", (req,res) =>{
        const updates = req.body
        db.collection('users')
            .updateOne({email: req.params.email},{$set: updates})
            .then(result =>{
                res.status(200).json(result)
            })
            .catch(err=>{
                res.status(500).json({err:'could not update document'})
            })
})

app.get("/users/id/:id", (req,res) =>{
    if(ObjectId.isValid(req.params.id)){

        db.collection("users")
            .findOne({_id: new ObjectId(req.params.id)})
            .then(doc=>{
                res.status(200).json(doc)
            })
            .catch(()=>{
                res.status(500).json({error:"not found..."})
        })}
    else{
        res.status(500).json({error:"not found..."})
    }
})

app.get("/users/email/:email", (req,res) =>{
        db.collection("users")
            .findOne({email: req.params.email})
            .then(doc=>{
                res.status(200).json(doc)
            })
            .catch(()=>{
                res.status(500).json({error:"not found..."})
        })
    }
)

app.patch('/users/addto/:id',(req,res)=>{
    const updates = req.body
    if (ObjectId.isValid(req.params.id)){
        db.collection('users')
            .updateOne({_id: new ObjectId(req.params.id)},{$set: updates})
            .then(result =>{
                res.status(200).json(result)
            })
            .catch(err=>{
                res.status(500).json({err:'could not update document'})
            })
    }else{
        res.status(500).json({error:'could not update document'})
    }
})