import React from 'react';
import ReactDOM from 'react-dom';
import useForm from "../hooks/useForm";

function Modal({ isShowing, hide, setListNames, setCurrList, inputRef }) {
  const { values, handleChange, handleSubmit } = useForm(addList);

  function addList() {
    const newList = values.newList;
    setListNames(currNames => [...currNames, newList]);
    setCurrList(newList);
    hide();
    inputRef.current.focus();
  }

  return isShowing && ReactDOM.createPortal(
    <React.Fragment>
      <div className="modal-overlay"/>
      <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
        <div className="modal">
          <div className="modal-header">
            <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form className="item" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='Add new list name'
              name="newList"
              value={values.newList || ""}
              onChange={handleChange}
              autoComplete="off"
            />
            <button>
              +
            </button>
        </form>
        </div>
      </div>
    </React.Fragment>, document.body
  );
} 

export default Modal;
