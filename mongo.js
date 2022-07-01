const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argumentL node mongo.js <password>')
  process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

//const url = `mongodb+srv://rasdani:${password}@cluster0.9pr8gg4.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb+srv://rasdani:${password}@cluster0.9pr8gg4.mongodb.net/noteApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String, 
  number: String,
})


const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected')
    })


  Person
    .find({})
    .then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
    console.log('connection closed')
    })
} else {
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected')

      const person = new Person({
        name: name,
        number: number,
      })

      return person.save()
    })
      .then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
      })
      .catch((err) => console.log(err))
}

//mongoose
  //.connect(url)
  //.then((result) => {
    //console.log('connected')

    //const note= new Note({
      //content: 'NOT IMPORTANT',
      //date: new Date(),
      //important:  false,
    //})

    //return note.save()

  //})
  //.then(() => {
    //console.log('note saved!')
    //return mongoose.connection.close()
  //})
  //.catch((err) => console.log(err))


//Note.find({ important: false}).then(result => {
  //result.forEach(note => {
    //console.log(note)
  //})
  //mongoose.connection.close()
  //console.log('connection closed')
//})
