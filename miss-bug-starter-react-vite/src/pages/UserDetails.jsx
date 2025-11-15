
import { useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/user.service.js'


export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            setUser(user)
        } catch (err) {
            showErrorMsg('Cannot load user')

        }
    }

    if (!user) return <h1>loadings....</h1>
    console.log(user)
    return <div className="bug-details main-layout">
        <h4>{user.fullname}</h4>
        <h1>{user.username}</h1>
        <h1>{user.score}</h1>
        <Link to="/user">Back to List</Link>
    </div>

}

