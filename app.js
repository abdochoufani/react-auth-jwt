const express = require('express')
const mongoose = require('mongoose')
const app = express()
const keys = require('./config/keys')
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')



app.get('/', (req, res) => res.send('hello world'))

//DB Config using mongoose
mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true })
    .then((db) => {
        console.log('MongoDB Connected to  Database', db)
    })
    .catch(err => console.log(`An error was encountered, details: ${err}`));


app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`))