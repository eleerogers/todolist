import React from "react";

const useDropdown = (label, options, state, setState) => {
  const Dropdownmaker = () => (
    <label htmlFor={label}>
      <h2>{label}</h2>
        <select
          id={label}
          value={state}
          onChange={e=>setState(e.target.value)}
          onBlur={e=>setState(e.target.value)}
          disabled={!options.length}
        >
          {options.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
    </label>
  );

  return [state, Dropdownmaker, setState]
}

export default useDropdown;