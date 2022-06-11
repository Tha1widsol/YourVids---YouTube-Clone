import React from 'react'

export default function RegisterPage() {
  return (
    <div style = {{textAlign: 'center'}}>
      <h1><u>Register</u></h1>
      <form>
        <label><p>Username:</p></label>
        <input placeholder = 'Username...'/>

        <label><p>Password:</p></label>
        <input type = 'password' placeholder = 'Password...'/>

        <label><p>Confirm password:</p></label>
        <input type = 'password' placeholder = 'Confirm Password...'/>
      </form>
      <button type = 'submit'>Submit</button>

    </div>
  )
}
