import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jwt, setJwt] = useState(null);
  const [foods, setFoods] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [newFoodMessage, setNewFoodMessage] = useState(null);

  /*
    Since we’re working from the root of our React app, 
    we can send a request when the app loads and keep the resulting CSRF token in app state. 
    It can then be set as a default header on POST request made by axios. 
    This may or may not be suitable for your particular application.

    We could also set it as a header in individual outgoing requests. 
    This setup might not be ideal for your own app but should give you an idea of how you can make it happen.
  */
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      axios.defaults.headers.post['X-CSRF-Token'] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  const getJwt = async () => {
    const { data } = await axios.get("/api/jwt");
    setJwt(data.token);
  };

  const getFoods = async () => {
    try {
      const { data } = await axios.get("/api/foods");
      setFoods(data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const createFood = async () => {
    try {
      const { data } = await axios.post('/api/foods');
      setNewFoodMessage(data.message);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  return (
    <>
      <section style={{ marginBottom: '10px' }}>
        <button onClick={() => getJwt()}>Get JWT</button>
        {jwt && (
          <pre>
            <code>{jwt}</code>
          </pre>
        )}
      </section>
      <section>
        <button onClick={() => getFoods()}>
          Get Foods
        </button>
        <ul>
          {foods.map((food, i) => (
            <li key={i}>{food.description}</li>
          ))}
        </ul>
        {fetchError && (
          <p style={{ color: 'red' }}>{fetchError}</p>
        )}
      </section>
      <section>
        <button onClick={() => createFood()}>
          Create New Food
        </button>
        {newFoodMessage && <p>{newFoodMessage}</p>}
      </section>
    </>
  );
}
export default App;