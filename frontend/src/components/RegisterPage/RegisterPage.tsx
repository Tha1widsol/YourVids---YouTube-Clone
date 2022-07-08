import React,{useState} from 'react'
import {useAppDispatch} from '../../app/hooks'
import {login} from '../../features/Auth/auth'
import Errors from '../Messages/Errors'
import axios from 'axios'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Array<string>>([])
  const dispatch = useAppDispatch()

  const validateForm = () => {
    let isValid = true
    const errorMsgs: Array<string> = []

    if (username === '' || password === '' || confirmPassword === ''){
      errorMsgs.push('Fields are required')
      isValid = false
    }

    if (password !== confirmPassword){
      errorMsgs.push("Passwords don't match")
      isValid = false
    }

    if (!isValid) setErrors(errorMsgs)
    return isValid
  }

  function handleSubmit(e: React.SyntheticEvent){
    e.preventDefault()

    if (!validateForm()) return

    const requestOptions = { 
      headers:{'Content-Type':'application/json', 'Accept':'application/json'}
    }

    axios.post('api/register', JSON.stringify({username: username, password: password}), requestOptions)
    .then(response => {
      if (response.data.message === 'success'){
          dispatch(login())
          window.location.reload()
        }
      })

    .catch(() => {
      setErrors(['Username already exists'])
    })
     
  }

  return (
    <div style = {{textAlign: 'center'}}>
      <h1><u>Register</u></h1>
      <Errors errors = {errors} />
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
