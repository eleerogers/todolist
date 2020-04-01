import { useState } from 'react';

const useForm = (callback) => {

  const [values, setValues] = useState({});

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
      callback();
      setValues({});
  };

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value,
      list: event.target.dataset.list
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
  }
};

export default useForm;
