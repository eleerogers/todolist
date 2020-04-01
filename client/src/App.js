import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import 'bulma/css/bulma.css';
import './App.css';
import Modal from "./components/modal";
import useForm from "./hooks/useForm";
import useDropdown from "./hooks/useDropdown";
import useModal from "./hooks/useModal";
import Select from "react-select";

function App() {
  const [day, setDay] = useState("");
  const { values, handleChange, handleSubmit } = useForm(addTodo);
  const [todos, setTodos] = useState([]);
  const listOptions = [{value: "Home", label: "Home"}, {value: "Work", label: "Work"}]
  const [listNames, setListNames] = useState(listOptions);
  const {isShowing, toggle} = useModal();
  const [currList, setCurrList] = useState({value: "Home", label: "Home"});
  // const [list, ListDropdown] = useDropdown("Lists", listNames, currList, setCurrList)
  
  useEffect(() => {
    async function getDay() {
      try {
        const {data} = await axios('/api/day');
        setDay(data);
      } catch (err) {
        console.error(err);
      }
    }
    getDay();
  }, [day]);

  async function addTodo() {
    console.log(values);
    try {
      const {data} = await axios.post('/api/todo', values)
      setTodos(data);
    } catch(err) {
      console.error(err);
    }
  }

  function handleListChange(selectedOption) {
    setCurrList(selectedOption);
  }
  
  
  return (
    <div className="App">
      <div className="box" id="heading">
        <h1>{currList.value}</h1>
        <h1>{day}</h1>
      </div>
      <div className="box">
        {todos.map((todo, i) => {
          return todo.list === currList.value && (
          <div key={`${todo.todo}+${i}`} className="item">
            <input type="checkbox" />
            <p>{todo.todo}</p>
          </div>)
        })}
        <form className="item" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='Add new "to do"'
            name="todo"
            value={values.todo || ""}
            onChange={handleChange}
            autoComplete="off"
            data-list={currList.value}
          />
          <button>
            +
          </button>
        </form>
      </div>
      <div className="box">
        <Select value={currList} options={listNames} onChange={handleListChange}/>
        {/* <ListDropdown /> */}
        <button onClick={toggle}>Add list</button>
      </div>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        setListNames={setListNames}
        setCurrList={setCurrList}
      />
    </div>
  );
}

export default App;


// using useCallback - add useCallback to imports
  // const dayColor = useCallback(() => {
  //   if (day === "Saturday" || day === "Sunday") {
  //     setH1Class("weekend");
  //   } else {
  //     setH1Class("weekday");
  //   }
  // }, [day])
  
  // const getDay = useCallback(async () => {
  //   try {
  //     const response = await axios('/api/day');
  //     const {data} = response;
  //     setDay(data);
  //     dayColor();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [dayColor])

  // useEffect(() => {
  //   getDay();
  // }, [getDay])
