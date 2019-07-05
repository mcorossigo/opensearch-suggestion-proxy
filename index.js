const express = require('express')
const searchEngines = require('./modules.js')

// import searchEngines from './modules.js'

console.log(searchEngines);


const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
