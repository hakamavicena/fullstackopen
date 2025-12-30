import { useState, useEffect } from "react";
import personService from "./services";
import Notification from "./components/notification";

function ShowPhoneBook(props) {
  return (
    <div>
      <p>
        {props.person.name} {props.person.number}
      </p>
      <button onClick={props.onHandle}>{props.text}</button>
    </div>
  );
}

function SearchBar(props) {
  return (
    <form>
      <div>
        filter shown with{" "}
        <input
          type="text"
          value={props.newFilter}
          onChange={props.handleNewFilter}
        />
      </div>
    </form>
  );
}

function AddNewNumber({
  newName,
  handleNewName,
  newNumber,
  handleNewNumber,
  addName,
}) {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>

      <div>
        <button type="submit" onClick={addName}>
          add
        </button>
      </div>
    </form>
  );
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: "" });
    }, 5000);
  };

  useEffect(() => {
    personService.getAll().then((init) => {
      setPersons(init);
    });
  }, []);

  const generateId = () => {
    if (persons.length == 0) return "1";
    const maxID = Math.max(...persons.map((p) => Number(p.id)));
    return String(maxID + 1);
  };

  const addName = (event) => {
    event.preventDefault();

    const found = persons.find(
      (person) => person.name.toLowerCase() === newName
    );

    if (found) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = { ...found, number: newNumber };
        personService
          .update(found.id, changedPerson)
          .then((updated) => {
            setPersons(persons.map((p) => (p.id !== found.id ? p : updated)));
            showNotification(`Updated ${updated.name}'s number`);
            setNewName("");
            setNewNumber("");
          })
          .catch(() => {
            showNotification(
              `Information of ${newName} has already been removed from server`,
              "error"
            );
            setPersons(persons.filter((person) => person.id !== found.id));
          });
      }
    } else {
      const newObj = {
        name: newName,
        number: newNumber,
        id: generateId(),
      };
      personService.create(newObj).then((created) => {
        setPersons(persons.concat(created));
        showNotification(`Added ${created.name}'s number`);
        setNewName("");
        setNewNumber("");
      });
    }
  };
  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name}?`)) {
      personService
        .deleteOne(id)
        .then(() => {
          setPersons(persons.filter((n) => n.id !== id));
          showNotification(`Deleted ${name}`);
        })
        .catch(() => {
          showNotification(
            `Information of ${name} was already removed`,
            "error"
          );
          setPersons(persons.filter((n) => n.id !== id));
        });
    }
  };

  const personsToShowed =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  console.log(persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <SearchBar newFilter={newFilter} handleNewFilter={handleNewFilter} />

      <h2>add a new</h2>
      <AddNewNumber
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
        addName={addName}
      />

      <h2>Numbers</h2>
      {personsToShowed.map((person) => (
        <ShowPhoneBook
          key={person.id}
          person={person}
          text="delete"
          onHandle={() => handleDelete(person.id, person.name)}
        />
      ))}
    </div>
  );
};

export default App;
