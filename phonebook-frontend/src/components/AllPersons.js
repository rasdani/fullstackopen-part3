import Person from './Person'

const AllPersons = ({ persons , handleDelete}) => {
  return (
    persons.map(person => <Person key={person.id} person={person} handleDelete={handleDelete} />)
  )
}

export default AllPersons
