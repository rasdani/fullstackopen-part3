import AllPersons from './AllPersons'

const Search = (props) => {
  const persons = [...props.persons]
  const matches = persons
                    .filter(person => person.name
                                              .toLowerCase()
                                              .includes(props
                                              .searchName
                                              .toLowerCase()))
  const handleDelete = props.handleDelete
  return (
    <AllPersons persons={matches} handleDelete={handleDelete} />
  )
}

export default Search
