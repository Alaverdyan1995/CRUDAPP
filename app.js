//Imports

const express = require('express')
const app = express()
const port = 8080

//Static files

app.use(express.static('app'))
app.use('/css', express.static(__dirname + 'app/css'))
app.use('/img', express.static(__dirname + 'app/img'))
app.use('/js', express.static(__dirname + 'app/js'))

app.get('', (requast, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

app.get('', (requast, response) => {
    response.sendFile(__dirname + '/views/info.html')
})

//Listen to port

app.listen(port, () => {
    console.info(`Listening on port ${port}`)
})
