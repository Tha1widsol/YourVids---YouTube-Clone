import React,{useState, useEffect} from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchUser } from '../../features/Auth/auth';

import axios from 'axios'

export default function LoginPage() {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useAppDispatch()

  function handleSubmit(){
    const requestOptions = { 
      headers:{'Content-Type':'application/json', 'Accept':'application/json'}
    }

  axios.post('api/login',JSON.stringify({username: username, password: password}), requestOptions)
  .then(() => {
    dispatch(fetchUser())
  })
}

  function handleLogout(){
    axios.post('api/logout')
  }

  return (
    <div style = {{textAlign: 'center'}}>
       <h1><u>Login</u></h1>
       <button onClick = {handleLogout}>Logout</button>
      <form>
        <label><p>Username:</p></label>
        <input onChange = {e => setUsername(e.target.value)} value = {username} placeholder = 'Username...'/>

        <label><p>Password:</p></label>
        <input onChange = {e => setPassword(e.target.value)} value = {password} type = 'password' placeholder = 'Password...'/>

      </form>
      <button onClick = {handleSubmit}>Submit</button>
    </div>
  )
}
