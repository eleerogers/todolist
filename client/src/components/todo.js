import React from "react";
import useHover from "../hooks/useHover";
import { FaRegTrashAlt } from 'react-icons/fa';

function Todo({todo, currList, deleteTodo, handleCheckbox}) {
  const [hover, ref] = useHover();

  return (
    todo.list === currList.value && (
      <form>
        <div className="item-div">
          <div className="item">
            <input
              name="completed"
              type="checkbox"
              onChange={handleCheckbox}
              value={todo._id}
              checked={todo.completed}
              // data-todo_id={todo._id}
              // data-todo_todo={todo.todo}
              // data-todo_list={todo.list}
              // data-todo_completed={todo.completed}
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
