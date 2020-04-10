import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import 'bulma/css/bulma.css';
import './App.css';
import Modal from "./components/modal";
import useForm from "./hooks/useForm";
// import useDropdown from "./hooks/useDropdown";
import useModal from "./hooks/useModal";
import Select from "react-select";
// import { FontAwesomeIcon } from 'react-fontawesome'
// import { faCoffee } from 'free-solid-svg-icons'
import Todo from './components/todo';

function App() {
  const [day, setDay] = useState("");
  const { 
    values: newTodoValues,
    handleChange: newTodoHandleChange,
    handleSubmit: newTodoHandleSubmit,
    reset
  } = useForm(addTodo);
  const [todos, setTodos] = useState([]);
  const listOptions = [{value: "Home", label: "Home"}, {value: "Work", label: "Work"}]
  const [listNames, setListNames] = useState(listOptions);
  const {isShowing, toggle} = useModal();
  const [currList, setCurrList] = useState({value: "Home", label: "Home"});
  // const [list, ListDropdown] = useDropdown("Lists", listNames, currList, setCurrList)
  const inputRef = useRef(null);
  
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

  useEffect(() => {
    async function getItems() {
      try {
        const {data} = await axios('/api/todo');
        setTodos(data);
        addListNames(data);
      } catch (err) {
        console.error(err);
      }
    }
    function addListNames(data) {
      const listNameVals = listNames.map(list => list.value)
      data.forEach(item => {
        if (listNameVals.indexOf(item.list) === -1) {
          setListNames([...listNames, {value: item.list, label: item.list}]);
        }
      })
    }
    getItems();
  }, [listNames]);

  async function addTodo(event) {
    try {
      const allValues = {
        ...newTodoValues,
        list: event.target.dataset.list,
        completed: false
      }
      const {data} = await axios.post('/api/todo', allValues)
      setTodos(data);
      reset();
    } catch(err) {
      console.error(err);
    }
  }

  async function deleteTodo(todo) {
    try {
      const {data} = await axios.post('/api/deleteTodo', todo)
      setTodos(data);
    } catch(err) {
      console.error(err);
    }
  }

  function handleListChange(selectedOption) {
    setCurrList(selectedOption);
    inputRef.current.focus();
  }

  async function handleCheckbox(event) {
    try {
      const _id = event.target.value;
      const completed = !todos.find(todo => todo._id + "" === _id).completed;
      const allValues = {
        _id,
        completed
      }
      const {data} = await axios.put('/api/todo', allValues)
      setTodos(data);
    } catch(err) {
      console.error(err);
    }
  }
  
  return (
    <div className="App">
      <div className="box" id="heading">
        <h1>{currList.value}</h1>
        <h1>{day}</h1>
      </div>
      <div className="box">
        {todos.map((todo, i) => {
          return <Todo 
            key={`${todo.todo}+${i}`} 
            todo={todo} 
            currList={currList} 
            setTodos={setTodos}
            deleteTodo={deleteTodo}
            handleCheckbox={handleCheckbox}
          />
        })}
        <form className="item" onSubmit={newTodoHandleSubmit} data-list={currList.value}>
          <input
            type="text"
            placeholder='Add new "to do"'
            name="todo"
            value={newTodoValues.todo || ""}
            onChange={newTodoHandleChange}
            autoComplete="off"
            data-list={currList.value}
            ref={inputRef}
          />
          <button type="submit">
            +
          </button>
        </form>
      </div>
      <div className="box">
        <Select 
          value={currList} 
          options={listNames} 
          onChange={handleListChange} 
          isSearchable={false}
        />
        {/* <ListDropdown /> */}
        <button onClick={toggle}>Add list</button>
      </div>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        setListNames={setListNames}
        setCurrList={setCurrList}
        inputRef={inputRef}
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
