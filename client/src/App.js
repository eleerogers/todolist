import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Modal from "./components/modal";
import useForm from "./hooks/useForm";
import useModal from "./hooks/useModal";
import Todo from './components/todo';
import MySelect from './components/MySelect';

function App() {
  const [day, setDay] = useState("");
  const { 
    values: newTodoValues,
    handleChange: newTodoHandleChange,
    handleSubmit: newTodoHandleSubmit,
    reset
  } = useForm(addTodo);
  const [todos, setTodos] = useState([]);
  const { list } = useParams();
  console.log({list});
  // const listOptions = ["Home", "Work"];
  const [listNames, setListNames] = useState([list]);
  const {isShowing, toggle} = useModal();
  // const [currList, setCurrList] = useState("Home");
  const inputRef = useRef(null);
  const history = useHistory();

  const options = listNames.map((d, i) => ({
    value: d,
    label: d
  }));

  useEffect(() => {
    if (!list) {
      history.push("/Home");
    }
  })
  
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
      } catch (err) {
        console.error(err);
      }
    }
    getItems();
  }, []);

  useEffect(() => {
    const additionalLists = [];
    todos.forEach(item => {
      if (
        listNames.indexOf(item.list) === -1 && 
        additionalLists.indexOf(item.list) === -1
      ) {
        additionalLists.push(item.list);
      }
    })
    if (additionalLists.length > 0) {
      setListNames(lists => [...lists, ...additionalLists]);
    }
  }, [todos, listNames]);

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
    history.push(`/${selectedOption}`);
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
        <h1>{list}</h1>
        <h1>{day}</h1>
      </div>
      <div className="box">
        {todos.map((todo, i) => {
          return <Todo 
            key={`${todo.todo}+${i}`} 
            todo={todo} 
            currList={list} 
            setTodos={setTodos}
            deleteTodo={deleteTodo}
            handleCheckbox={handleCheckbox}
          />
        })}
        <form className="item" onSubmit={newTodoHandleSubmit} data-list={list}>
          <input
            type="text"
            placeholder='Add new "to do"'
            name="todo"
            value={newTodoValues.todo || ""}
            onChange={newTodoHandleChange}
            autoComplete="off"
            data-list={list}
            ref={inputRef}
          />
          <button type="submit">
            +
          </button>
        </form>
      </div>
      <div className="box">
        <div className="list-select-box">
          <p>List Selector:</p>
          <MySelect 
            value={list} 
            options={options} 
            onChange={handleListChange} 
            placeholder="Choose list..."
          />
          <br />
          <button className="newListBtn" onClick={toggle}>Create new list</button>
        </div>
      </div>
      <Modal
        isShowing={isShowing}
        hide={toggle}
        setListNames={setListNames}
        setCurrList={handleListChange}
        inputRef={inputRef}
      />
    </div>
  );
}

export default App;
