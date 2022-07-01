import React from 'react'
import {Routes,Route} from 'react-router-dom'
import HomePage from '../HomePage/HomePage'
import RegisterPage from '../RegisterPage/RegisterPage'
import LoginPage from '../LoginPage/LoginPage'
import {CheckAuth} from '../ProtectedRoutes/ProtectedRoutes'

export default function PagesRoutes() {
  return (
    <div>
        <Routes>
            <Route path = '/' element = {<HomePage/>}/>
            <Route path = '/home' element = {<HomePage/>}/>
            <Route element = {<CheckAuth checkAuth = {false}/>}>
                <Route path = '/register' element = {<RegisterPage/>}/>
                <Route path = '/login' element = {<LoginPage/>}/>
            </Route>

        </Routes>
    </div>
  )
}
