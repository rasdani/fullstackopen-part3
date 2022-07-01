require('dotenv').config()
//const http = require('http')
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//morgan('default')

//let persons = [
    //{ 
      //"id": 1,
      //"name": "Arto Hellas", 
      //"number": "040-123456"
    //},
    //{ 
      //"id": 2,
      //"name": "Ada Lovelace", 
      //"number": "39-44-5323523"
    //},
    //{ 
      //"id": 3,
      //"name": "Dan Abramov", 
      //"number": "12-43-234345"
    //},
    //{ 
      //"id": 4,
      //"name": "Mary Poppendieck", 
      //"number": "39-23-6423122"
    //}
//]

//const app = http.createServer((request, response) => {
  //response.writeHead(200, { 'Content-Type': 'application/json' })
  //response.end(JSON.stringify(persons))
//})

app.get('/api/persons', (request, response) => {
  console.log('API called')
  //response.send('<h1>Hello world</h1>') 
  //response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  //const id = Number(request.params.id)
  //const person = persons.find(person => person.id === id)

  //if (person) {
    //response.json(person)
  //} else {
    //response.status(404).end()
  //}
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.headers)
  console.log(request.body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  //} else if (persons.map(person => person.name).includes(body.name)) {
    //return response.status(403).json({
      //error: 'name must be unique'
    //})
  } else {
      //const person = request.body
      //person.id = Math.floor(Math.random() * 1000)
      //persons = persons.concat(person)

      //response.json(person)
      const person = new Person({
        name: body.name,
        number: body.number,
      })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  }
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
