import { useState, useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { FaRegEdit } from "react-icons/fa";

export function UserDetails() {

    const loggedinUser = userService.getLoggedinUser()
    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])
    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadUserBugs()
    }, [userId])

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            setUser(user)
        } catch (err) {
            console.error('Cannot load user:', err)
            showErrorMsg('Cannot load user')
        }
    }

    async function loadUserBugs() {
        try {
            const bugs = await bugService.query()
            const filteredBugs = bugs.filter(bug => bug.creator._id === userId)
            setUserBugs(filteredBugs)
        } catch (err) {
            console.error('Cannot load bugs:', err)
            showErrorMsg('Cannot load bugs')
        }
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            setUserBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
            showSuccessMsg('Bug removed successfully')
        } catch (err) {
            console.error('Cannot remove bug:', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    function onEditBug(bug) {
        navigate(`/bug/edit/${bug._id}`)
    }

    function onEditUser(user) {
        navigate(`/user/edit/${user._id}`)
    }

    if (!user) return <div className="loading">Loading...</div>

    return (
        <div className="user-section main-layout">
            <div className='user-info'>
                <button onClick={() => onEditUser(user)}><FaRegEdit size={20} /></button>
                <h1>{user.fullname}</h1>
                <h3>@{user.username}</h3>
                <p>Score: {user.score}</p>
            </div>
            <div className='bugs-info'>
                <h2>Bugs created by {user.fullname}</h2>
                {userBugs.length > 0 ? (
                    <BugList
                        bugs={userBugs}
                        onRemoveBug={onRemoveBug}
                        onEditBug={onEditBug}
                    />
                ) : (
                    <p>No bugs found for this user.</p>
                )}
                <Link to={loggedinUser?.isAdmin ? "/user" : "/bug"}>Back to List</Link>
            </div>
        </div>
    )
}