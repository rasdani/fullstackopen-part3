//const http = require('http')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//const app = http.createServer((request, response) => {
  //response.writeHead(200, { 'Content-Type': 'application/json' })
  //response.end(JSON.stringify(persons))
//})

app.get('/api/persons', (request, response) => {
  console.log('API called')
  //response.send('<h1>Hello world</h1>') 
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  const person = request.body
  person.id = Math.floor(Math.random() * 1000)
  persons = persons.concat(person)

  response.json(person)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
