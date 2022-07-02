const Person = ({ person , handleDelete}) => {
  return (
    <p key={person.id}>
      {person.name} {person.number} 
      <button key={person.id} onClick={event => handleDelete(event, person)}>
        delete
      </button>
    </p>
  )
}

export default Person
