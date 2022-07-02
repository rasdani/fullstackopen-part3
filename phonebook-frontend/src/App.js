import { useState, useEffect } from 'react'
//import Person from './components/Person'
//import AllPersons from './components/AllPersons'
import Search from './components/Search'
import Notification from './components/Notification'
import personsService from './services/persons'
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('succesful')

  useEffect(() => {
    personsService
      .getAll()
      .then(recievedPersons => {
        setPersons(recievedPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
  }
  const handleDelete = (event, person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .delete_(person.id)
        .then(returnedID => {
          setPersons(persons.filter(person => person.id !== returnedID))
        })
    }
  }
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = persons
                        .filter(person => person.name === newName)
                        .map(person => person.id)
        const personObject = {
          //id: persons.length + 1,
          name: newName,
          number: newNumber
        }
        personsService
          .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons
                        .map(person => 
                          person.id != id 
                          ? person : returnedPerson))
            console.log(returnedPerson)
            setNotificationMessage(`Changed number for ${newName}`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error)
            setNotificationType('error')
            setNotificationMessage(error.response.data.error)
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType('succesful')
            }, 5000)
          })
      }
    }
    else {
      const personObject = {
        //id: persons.length + 1,
        name: newName,
        number: newNumber
      }
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          console.log(returnedPerson)
          setNotificationMessage(`Added ${newName}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotificationType('error')
          console.log(error)
          setNotificationMessage(error.response.data.error)
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('succesful')
          }, 5000)
        })

    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} type={notificationType} />
        <div>
          filter shown with <input value={searchName} onChange={handleSearchChange} />
        </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        <div>
          <Search persons={persons} searchName={searchName} handleDelete={handleDelete} />
        </div>
    </div>
  )
}

export default App;
