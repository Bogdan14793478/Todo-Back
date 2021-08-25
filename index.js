const express = require("express")
const mongoose = require("mongoose")

const app = express()

const PORT = process.env.PORT || 6000

app.use(express.json({extended: true}))

app.use("/api/auth", require('./routes/auth.route'))
app.use("/api/todo", require('./routes/todo.route'))

async function start() {
    try{
        await mongoose.connect('mongodb+srv://root:root@cluster0.lqbn2.mongodb.net/todo?retryWrites=true&w=majority', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })

        app.listen(PORT, ()=> {
            console.log(`Server started on port ${PORT}`)
        })
    } catch(err) {
        console.log(err)
    }
}
start()