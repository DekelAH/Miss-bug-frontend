import { useEffect, useState } from "react";
import { userService } from "../services/user.service.js";

export function LoginSignup({ onSignup, onLogin }) {

    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [isSignup, setIsSignup] = useState(false)

    function clearState() {
        setCredentials(userService.getEmptyUser())
        setIsSignup(false)
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        if (isSignup) {
            if (!credentials.username || !credentials.password || !credentials.fullname) return
            await onSignup(credentials)
        } else {
            if (!credentials.username) return
            await onLogin(credentials)
        }
        clearState()
    }

    function toggleSignup() {
        setIsSignup(!isSignup)
    }

    return (
        <>
            <button className="btn-link" onClick={toggleSignup}>
                {!isSignup ? 'Login' : 'Signup'}
            </button>
            <div className="login-signup-container">
                {!isSignup &&
                    <form className="login-form" onSubmit={onSubmitForm}>
                        <h1>Login</h1>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="Enter username" onChange={handleChange} value={credentials.username} required />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="Enter password" onChange={handleChange} value={credentials.password} required />
                        <button>Submit</button>
                    </form>
                }
                {isSignup &&
                    <form className="login-form" onSubmit={onSubmitForm}>
                        <h1>Signup</h1>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="Enter username" onChange={handleChange} value={credentials.username} required />
                        <label htmlFor="fullname">Fullname</label>
                        <input type="text" name="fullname" placeholder="Enter fullname" onChange={handleChange} value={credentials.fullname} required />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder="Enter password" onChange={handleChange} value={credentials.password} required />
                        <button>Submit</button>
                    </form>
                }
            </div>
        </>
    )
}