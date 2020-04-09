import { useState } from 'react';

const useForm = (callback) => {

  const [values, setValues] = useState({});

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
      callback(event);
  };

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const reset = () => {
    setValues({});
  }

  return {
    handleChange,
    handleSubmit,
    values,
    reset
  }
};

export default useForm;
