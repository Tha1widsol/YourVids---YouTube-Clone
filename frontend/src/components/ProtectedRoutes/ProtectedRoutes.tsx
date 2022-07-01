import {Outlet,Navigate} from 'react-router'
import {useAppSelector} from '../../app/hooks'
import LoginPage from '../LoginPage/LoginPage'

const User = () => {
    return useAppSelector(state => state.user)
}

export const CheckAuth = ({checkAuth = true}) => {
    if (checkAuth) return User().isLoggedIn ? <Outlet/> : <LoginPage/>
    return User().isLoggedIn ? <Navigate to = '/'/> : <Outlet/> 
} 



