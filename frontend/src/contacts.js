import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";

const Contacts = () => {
  let [contacts, setContacts] = useState([]);

  // Clears textfield after input
  const initialValues = {
    first_name: "",
    last_name: "",
    age: "",
    search: "",
  };
  const [input, setInput] = useState(initialValues);

  // Fetches all rows from the database
  useEffect(() => {
    fetch(`/contacts`)
      .then((response) => response.json())
      .then((data) => setContacts(data));
  }, []);

  // Allows user to write into the input area
  function handleInputChange(e) {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  }

  // Creates new item from input and inserts it into the database
  function handleSubmit(e) {
    e.preventDefault();
    const newItem = {
      first_name: input.first_name,
      last_name: input.last_name,
      age: input.age,
    };
    setContacts([...contacts, newItem]);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    };
    fetch("/contacts/", options).then((res) => console.log(res));
    setInput(initialValues);
  }

  // Creates updated item from user input
  function handleEdit(e) {
    const index = contacts.indexOf(e);
    let editedFirstName = window.prompt("First name:");
    let editedLastName = window.prompt("Last name:");
    let editedAge = window.prompt("Age:");
    let editedItem = {
      id: e.id,
      first_name: editedFirstName,
      last_name: editedLastName,
      age: editedAge,
    };
    // Posts updated item to database
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedItem),
    };
    // Delete outdated version of the item
    fetch(`/contacts/` + e.id, {
      method: "delete",
    })
      .then((res) => res.text())
      .then((res) => console.log(res))
      .then(() => {
        // Update visible list
        fetch("/contacts/", options)
          .then((res) => console.log(res))
          .then(() => {
            if (index !== -1) {
              contacts[index] = editedItem;
              setContacts([...contacts]);
            }
          });
      });
  }

  // Removes item from the database and visible list
  function handleDelete(e) {
    fetch(`/contacts/` + e.id, {
      method: "delete",
    })
      .then((res) => res.text())
      .then((res) => console.log(res))
      .then(() => setContacts(contacts.filter((el) => el.id !== e.id)));
  }

  //Searches from list by first name
  function handleSearch(e) {
    e.preventDefault();
    //Creates a copy from the current list
    var listCopy = [...contacts];
    //Finds elements that match the input string
    var searchedName = input.search;
    var result = listCopy.filter(function (el) {
      return el.first_name.toLowerCase() === searchedName.toLowerCase();
    });
    //Updates list to show only elements with corresponding tag
    setContacts([...result]);
    setInput(initialValues);
  }

  //Sorts list by name or age
  function handleSort(e) {
    e.preventDefault();
    let sortedList = "";
    var select = document.getElementById("sort");
    var value = select.options[select.selectedIndex].value;
    if (value === "first_alpha") {
      sortedList = contacts.sort((a, b) => {
        let fa = a.first_name.toLowerCase(),
          fb = b.first_name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    } else if (value === "last_alpha") {
      sortedList = contacts.sort((a, b) => {
        let fa = a.last_name.toLowerCase(),
          fb = b.last_name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    } else {
      sortedList = contacts.sort((a, b) => {
        return a.age - b.age;
      });
    }
    setContacts([...sortedList]);
  }

  return (
    <div className="container">
      <h4>Add new contact</h4>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            id="form"
            name="first_name"
            value={input.first_name}
            onChange={handleInputChange}
            placeholder="First name"
          />
          <input
            id="form"
            name="last_name"
            value={input.last_name}
            onChange={handleInputChange}
            placeholder="Last name"
          />
          <input
            id="form"
            name="age"
            value={input.age}
            onChange={handleInputChange}
            placeholder="Age"
          />
          <button id="submit" type="submit">
            Submit
          </button>
        </form>
        <h4>Search and sort</h4>
        <div className="filter">
          <form onSubmit={handleSearch}>
            <input
              id="search"
              name="search"
              value={input.search}
              onChange={handleInputChange}
              placeholder="Search by first name.."
            />
            <button id="submit" type="submit">
              Search
            </button>
          </form>
          <form onSubmit={handleSort}>
            <select id="sort">
              <option value="first_alpha">First name - alphabetical</option>
              <option value="last_alpha">Last name - alphabetical</option>
              <option value="age_asc">Age - ascending</option>
            </select>
            <button id="submit" type="submit">
              Sort
            </button>
          </form>
        </div>
      </div>
      <div className="column" id="bold">
        {"FIRST NAME"}
      </div>
      <div className="column" id="bold">
        {"LAST NAME"}
      </div>
      <div className="column" id="bold">
        {"AGE"}
      </div>
      <div />
      {contacts.map((e) => (
        <div>
          <div className="column">{e.first_name}</div>
          <div className="column">{e.last_name}</div>
          <div className="column">{e.age}</div>
          <button id="edit">
            <FaPen onClick={() => handleEdit(e)} />
          </button>
          <button id="trash">
            <FaTrash onClick={() => handleDelete(e)} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Contacts;
