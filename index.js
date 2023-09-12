// Importing Express
require("dotenv").config()
const cors = require("cors")
const express = require('express')


const fruits = require(`./fruits.json`)


const fs = require(`fs`);


// Creating our server by calling express
const app = express()
// HAS to be above 1024 - everything below is already reserved
const port = process.env.PORT
// process.env.PORT

app.use(cors());


/*Middleware - code that is executed between the request coming in and the response
being sent

app.use((req, res, next)) sets up middleware

e.g. if startingPath is "/fruits" the middleware, it will apply to anything 
that targets anything that starts with this
If the site continuously loads, it's probably missing a next somewhere
*/
app.use(express.json())

// We need two roots: To get all of the fruits, and to get a specific root
app.get('/', (req, res) => {
    res.send("Hello, Fruity!")
})

//Route to return all the fruits
app.get('/fruits', (req, res) => {
    res.send(fruits)
})

//Route to reutrn a specific fruit and all its information
// :<property> represents a dynamic parameter
app.get("/fruits/:name", (req, res) =>{
    let pre_id = req.params.name[0].toUpperCase() + req.params.name.slice(1).toLowerCase()
    
    const fruit = fruits.find(fruit => fruit.name === pre_id)
    console.log(fruit.name)
    if (fruit == undefined){
        res.status(404).send("The fruit doesn't exist.")
    }else{
        res.status(213).send(fruit)
    }
    console.log(pre_id)
    //res.status(213).send(pre_id)//`Return a specific fruit with name ${req.params.name}`)
})


// Add a new piece of fruit to the data
app.post("/fruits", (req, res) =>{
    const check = req.body.name // Variable to handle req.body.name to avoid excessive typing

    //Searching the fruits.json file for a match to the req.body.name (check)
    const found = fruits.find(fruit => fruit.name.toLowerCase() === check.toLowerCase())
    
    /*
    let highest_id = fruits[0].id // Cycles through each entry in the fruits.json
    //file to find the one with the highest unique id
    for (i = 1; i < fruits.length; i++){
        if (fruits[i].id > highest_id){
            highest_id = fruits[i].id
        }
    }*/

    const ids = fruits.map(fruit => fruit.id)
    let maxID = Math.max(...ids);

    if (found != undefined){ // If found is not undefined then it must have found check within the array, so other checks aren't necessary
            res.status(400).send("This fruit already exists!")
            console.log("This fruit already exists!")
        }else{
            fruitBod = check[0].toUpperCase() + check.slice(1).toLowerCase() // This line is just to make sure that the 
            // Added item is in the same format as the rest of the array, i.e. Uppercase, followed by lowercase letters

            req.body.id = maxID + 1;
            req.body.name = fruitBod // Assigns the id of a new fruit to highest_id + 1

            
            fruits.push(req.body) // Adds your new fruit to the array

            // Updates the fruits.json file with your new fruit
            fs.writeFile("fruits.json", JSON.stringify(fruits), function(err){
                if (err) throw err;
                console.log("complete")
            })

            res.status(201).send("Added.")

            // req.body.id = highest_id + 1
         }
    console.log(req.body) // The body contains the data to create the piece of fruit
    //res.send("New fruit created!")
})




// Bind the server to a port
// app.listen(<port>, ()> {})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


/* 
Consider the case of when the fruit is found
    --> Status code/error message
    --> How to deal with capital letters vs. no capitals (set input to all lowercase and upper the first)
Use the name to send the fruit + data back to the client
*/



/*
// Create route - GET route
// [server].[method]("<path>", callback)
app.get('/home', (req, res) => {
// Req = Request; Res = Response
  res.status(200).send('Praise be')
  //res.sendStatus(200) sends the status ONLY - not a message
})


*/
module.exports = app;