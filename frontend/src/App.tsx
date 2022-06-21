import React,{useEffect} from 'react';
import Navbar from './components/Navbar/Navbar';
import PagesRoutes from './components/PagesRoutes/PagesRoutes';
import {useAppDispatch} from './app/hooks';
import {fetchUser} from './features/Auth/auth';

function App() {
const dispatch = useAppDispatch()

useEffect(() => {
  dispatch(fetchUser())
},[dispatch])

  return (
    <div style = {{width: '95%', margin: '0 auto'}}>
      <Navbar/>
      <PagesRoutes/>
    </div>
  );
}

export default App;
