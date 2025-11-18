import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { UserList } from '../cmps/UserList.jsx'
import { useNavigate } from 'react-router'



export function UserIndex() {
    const [users, setUsers] = useState([])
    const loggedinUser = userService.getLoggedinUser()
    const navigate = useNavigate()

    useEffect(() => {

        loadUsers()

    }, [])

    async function loadUsers() {
        try {
            const users = await userService.query()
            setUsers(users)
        } catch (err) {
            console.log('Error: ' + err)
        }
    }

    async function onRemoveUser(userId) {
        try {
            await userService.remove(userId)
            console.log('Deleted Succesfully!')
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
            showSuccessMsg('User removed')
        } catch (err) {
            console.log('Error from onRemoveUser ->', err)
            showErrorMsg('Cannot remove user')
        }
    }

    async function onEditUser(user) {
        // const fullname = prompt('User fullname?')
        // const username = prompt('User username?')
        // const password = prompt('password?')
        // const score = +prompt('user score?')
        // const userToSave = { ...user, fullname, username, password, score }
        // try {

        //     const savedUser = await userService.save(userToSave)
        //     console.log('Updated User:', savedUser)
        //     setUsers(prevUsers => prevUsers.map((currUser) =>
        //         currUser._id === savedUser._id ? savedUser : currUser
        //     ))
        //     showSuccessMsg('User updated')
        // } catch (err) {
        //     console.log('Error from onEditUser ->', err)
        //     showErrorMsg('Cannot update User')
        // }
        navigate(`/user/edit/${user._id}`)
    }

    return (
        <>
            {loggedinUser?.isAdmin &&
                < section >
                    <h3>Users App</h3>
                    <main>
                        <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
                    </main>
                </section >
            }
        </>
    )
}
