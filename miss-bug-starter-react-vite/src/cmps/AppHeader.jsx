import { useState, useEffect } from 'react'
import { UserMsg } from './UserMsg'
import { NavLink, useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service.js'
import { LoginSignup } from '../pages/LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { ImProfile } from "react-icons/im";

export function AppHeader() {

    const navigate = useNavigate()

    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        // Update loggedinUser state when component mounts or after navigation
        setLoggedinUser(userService.getLoggedinUser())
    }, [])

    async function onLogin(credentials) {
        console.log(credentials)
        try {
            const user = await userService.login(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome back ${user.fullname}`)
            navigate('/')
        } catch (err) {
            console.log('Cannot login:', err)
            showErrorMsg(`Cannot login`)
        }
    }

    async function onSignup(credentials) {
        console.log(credentials)
        try {
            const user = await userService.signup(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome ${user.fullname}`)
            navigate('/')
        } catch (err) {
            console.log('Cannot signup:', err)
            showErrorMsg(`Cannot signup`)
        }
    }

    async function onLogout() {
        console.log('logout')
        try {
            await userService.logout()
            setLoggedinUser(null)
            showSuccessMsg('Logged out successfully')
            navigate('/')
        } catch (err) {
            console.log('Cannot logout:', err)
            showErrorMsg('Cannot logout')
        }
    }

    return (
        <header className='app-header container'>
            <div className='header-container'>
                <h1>Bugs are Forever</h1>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink> |
                    <NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink> |
                    {loggedinUser?.isAdmin &&
                        <NavLink to="/user">Users</NavLink>
                    }
                </nav>
                {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

                {loggedinUser && <div className="user-preview">
                    <div className='user-details'>
                        <h3>Hello {loggedinUser.fullname}</h3>
                        <button onClick={() => navigate(`/user/${loggedinUser._id}`)}><ImProfile size={22} /></button>
                    </div>
                    <button onClick={onLogout}>Logout</button>
                </div>}
            </div>
            <UserMsg />
        </header>
    )
}