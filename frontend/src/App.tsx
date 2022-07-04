import React,{useEffect} from 'react';
import Navbar from './components/Navbar/Navbar';
import PagesRoutes from './components/PagesRoutes/PagesRoutes';
import {useAppDispatch} from './app/hooks';
import {fetchUser, logout} from './features/Auth/auth';
import axios from 'axios'

function App() {
const dispatch = useAppDispatch()

useEffect(() => {
  axios.get('/api/checkAuth')
  .then(response => {
    if (response.data.isAuth) dispatch(fetchUser())
    else dispatch(logout())
  })
},[dispatch]) 

  return (
    <div style = {{width: '95%', margin: '0 auto'}}>
      <Navbar/>
      <PagesRoutes/>
    </div>
  );
}

export default App;
