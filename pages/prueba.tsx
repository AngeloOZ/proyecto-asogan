import { useState, useEffect } from 'react';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/sse');

    eventSource.addEventListener('message', (event) => {
      setEvents((prevEvents) => [...prevEvents, event.data]);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Eventos recibidos:</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
