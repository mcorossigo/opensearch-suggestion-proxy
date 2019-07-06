const express = require('express')
const searchEngines = require('./modules.js')

const app = express()
const port = 3000

const NUMBER_OF_SUGGESTIONS = 5

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/provider/:providerID', function (req, res) {
    // console.log(req);

    let provider = req.params.providerID

    if (searchEngines[provider]) {

        if (req.query && req.query.q) {
            let query = req.query.q
            let providerObject = searchEngines[provider]

            let url = providerObject.getSuggestion(query, {}, (parsedData) => {
                res.send(parsedData)
            })

        } else {
            res.status(404).send("Sorry can't find that!")
        }
    } else {
        res.status(404).send("Sorry can't find that!")
    }

})

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
