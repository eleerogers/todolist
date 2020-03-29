import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [day, setDay] = useState("");

  useEffect(() => {
    getDay();
  }, [])

  const getDay = async () => {
    // Get the passwords and store them in state
    try {
      const {data} = await axios('/api/day');
      setDay(data);
    } catch (err) {
      console.error(err);
    }
  }
    

  return (
    <div className="App">
      <h1>Today is {day}</h1>
    </div>
  );
}

export default App;
