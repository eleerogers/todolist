import React from "react";
import useForm from "../hooks/useForm";
import useHover from "../hooks/useHover";
import axios from 'axios';
import { FaRegTrashAlt } from 'react-icons/fa';

function Todo({todo, currList, setTodos, deleteTodo}) {
  const [hover, ref] = useHover();
  const { 
    values: todoValues,
    handleChange: todoHandleChange,
    handleSubmit: todoHandleSubmit
  } = useForm(handleCheckbox);

  async function handleCheckbox() {
    try {
      const {data} = await axios.put('/api/todo', todoValues)
      console.log(data);
      setTodos(data);
    } catch(err) {
      console.error(err);
    }
  }

  return (
    todo.list === currList.value && (
      <form>
        <div className="item-div">
          <div className="item">
            <input
              name="completed"
              type="checkbox"
              onChange={(e) => {
                todoHandleChange(e);
                todoHandleSubmit(e);
              }}
              value={todoValues.completed || "off"}
            />
            <p>{todo.todo}</p>
          </div>
          <div className="item" ref={ref}>
            <FaRegTrashAlt 
              onClick={() => deleteTodo(todo)} 
              color={hover ? "black" : "grey"} 
              className="justify-end"
            />
          </div>
        </div>
      </form>
    )
  )
}

export default Todo;
