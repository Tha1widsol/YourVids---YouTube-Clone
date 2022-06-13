import React,{useState} from 'react'
import axios from 'axios'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(){
    const requestOptions = { 
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      }
  }

    fetch('api/register', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      }

    })
    .then(response => {
      console.log('User created')
    })
  }

  return (
    <div style = {{textAlign: 'center'}}>
      <h1><u>Register</u></h1>
      <form>
        <label><p>Username:</p></label>
        <input placeholder = 'Username...' value = {username} onChange = {e => setUsername(e.target.value)}/>

        <label><p>Password:</p></label>
        <input type = 'password' value = {password} onChange = {e => setPassword(e.target.value)} placeholder = 'Password...'/>

        <label><p>Confirm password:</p></label>
        <input type = 'password' value = {confirmPassword} onChange = {e => setConfirmPassword(e.target.value)} placeholder = 'Confirm Password...'/>
      </form>
    <button type = 'submit' onClick = {handleSubmit}>Submit</button>
      

    </div>
  )
}
