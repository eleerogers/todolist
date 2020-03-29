import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    getPasswords();
  }, [])

  const getPasswords = async () => {
    // Get the passwords and store them in state
    try {
      const {data} = await axios('/api/passwords');
      setPasswords(data);
    } catch (err) {
      console.error(err);
    }
  }
    

  return (
    <div className="App">
      {/* Render the passwords if we have them */}
      {passwords.length ? (
        <div>
          <h1>5 Passwords.</h1>
          <ul className="passwords">
            {/*
              Generally it's bad to use "index" as a key.
              It's ok for this example because there will always
              be the same number of passwords, and they never
              change positions in the array.
            */}
            {passwords.map((password, index) =>
              <li key={index}>
                {password}
              </li>
            )}
          </ul>
          <button
            className="more"
            onClick={getPasswords}>
            Get More
          </button>
        </div>
      ) : (
        // Render a helpful message otherwise
        <div>
          <h1>No passwords :(</h1>
          <button
            className="more"
            onClick={getPasswords}>
            Try Again?
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
