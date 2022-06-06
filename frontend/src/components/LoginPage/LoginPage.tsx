import React from 'react'

export default function LoginPage() {
  return (
    <div style = {{textAlign: 'center'}}>
       <h1><u>Login</u></h1>
      <form>
        <label><p>Username:</p></label>
        <input placeholder = 'Username...'/>

        <label><p>Password:</p></label>
        <input type = 'password' placeholder = 'Password...'/>

      </form>
      <button>Submit</button>
    </div>
  )
}
