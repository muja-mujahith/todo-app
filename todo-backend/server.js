// use express js framework
const express = require('express')
const mongoose  = require('mongoose')

const cors = require('cors')

//create an instance of express
const app = express()

// express middlewre  
app.use(express.json())  // decode the json data

// use mongoose
app.mongoose = require('mongoose')


// cors middleware
app.use(cors())

// define a route
// app.get('/',(req,res)=>{       // here / means it indicate the localhost:3000 
//     res.send('hello world')
// })

// sample in memory for todo items
// let todos = []                        // when our server stop our data also delete to avoid it
                                      // we neeed to create a database mongod


// ---------------------------------------------------------------------------------------------

// connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("db connected")
}).catch((err) =>{
    console.log(err)
})


// cerating schema
const todoSchema = new mongoose.Schema({
    title : {
        require: true,
        type: String
    },
    description : String
})

// creating model
const todoModel = mongoose.model('Todo', todoSchema)  // here todo will create as todos in mongodb


//-----------------------------------------------------------------------------------------


// creatae a new todo item
app.post('/todos', async(req, res)=>{
    const {title, description} = req.body        // postman konw we send  a post  data but node js
//     const newTodo = {                            // does not know we send a json data
//         id : todos.length + 1,
//         title,
//         description                              // know we create our datbse using that model we send our datas
//     };
//     todos.push(newTodo)
//     console.log(todos)
//     res.status(201).json(newTodo)
      
try{
     
     const newTodo =  new todoModel({title, description})
     await newTodo.save()
     res.status(201).json(newTodo)
}catch(error){
    console.log(error)
    res.status(500).json({message : error.message})

}

})


// get all items 
app.get('/todos', async (req, res)=>{
    try{
     const todos =  await todoModel.find()
     res.json(todos)
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
   
})



// update the todo item
app.put("/todos/:id", async(req, res)=>{
    try{
        const {title, description} = req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        { title, description},
        {new: true}
    )
    if(!updatedTodo){
        return res.status(404).json({message : "todo not found"})
    }
    res.json(updatedTodo)
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
    
})


//delete a todo item
app.delete("/todos/:id", async(req,res)=>{
    try{
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
})
    


//------------------------------------------------------------------------------------------------------

// start the server
const PORT = 8000;
app.listen(PORT, ()=>{
    console.log(`server is listening to ${PORT}`)
})