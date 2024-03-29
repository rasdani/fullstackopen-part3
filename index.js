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
morgan.token('response', (response) => {
  return JSON.stringify(response.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :response'))

//const app = http.createServer((request, response) => {
  //response.writeHead(200, { 'Content-Type': 'application/json' })
  //response.end(JSON.stringify(persons))
//})

app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({}).then(count => {
    response.send(`Phonebook has info for ${count} people <p>${date}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  //const person = persons.find(person => person.id === id)

  //if (person) {
    //response.json(person)
  //} else {
    //response.status(404).end()
  //}
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    //.catch(error => {
      //console.log(error)
      //response.status(400).send({ error: 'malformatted id'})
    //})
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  //persons = persons.filter(person => person.id !== id)

  //response.status(204).end()
  //Person.findByIdAndRemove(mongoose.Types.ObjectId(request.params.id))
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

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
      //Person.find({name: body.name}).then(persons => {
        //console.log(response.json(persons))
        ////response.json(persons)
        //console.log(persons)
      //})

    Person.findOne({ name: body.name }).then(persons => {
    //console.log(body.name)
    //console.log(persons)
    //console.log(persons == true)
    //truthiness behaving weirdly
      if (persons !== null) {
        return response.status(400).json({
          error: `${body.name} already in phonebook, use PUT to update number` })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })

        person.save().then(savedPerson => {
          response.json(savedPerson)
        })
          .catch(error => next(error))
      }
    })
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('ERROR HANDLER', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('VALIDATION ERROR', error.message)
    return response.status(400).json({ error: error.message })
    //throw new Error('TEST ERROR')
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
