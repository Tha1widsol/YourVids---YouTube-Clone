import React from 'react';
import Navbar from './components/Navbar/Navbar';
import PagesRoutes from './components/PagesRoutes/PagesRoutes';
import axios from 'axios'

function App() {
  axios.get('api/hello').then(response => {
    console.log(response.data)
  })

  return (
    <div style = {{width: '95%', margin: '0 auto'}}>
      <Navbar/>
      <PagesRoutes/>
    </div>
  );
}

export default App;
