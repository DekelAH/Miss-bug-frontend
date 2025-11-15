import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { UserList } from '../cmps/UserList.jsx'


export function UserIndex() {
    const [users, setUsers] = useState([])


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
            setUsers(prevBugs => prevBugs.filter(user => user._id !== userId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove user')
        }
    }

    async function onAddUser() {
        const user = {
            fullname: prompt('User fullname?'),
            username: prompt('User username?'),
            password: prompt('password?'),
            score: +prompt('user score?')
        }
        try {
            console.log('Added User', user)
            const savedUser = await userService.save(user)
            setUsers(prevUsers => [...prevUsers, savedUser])
            showSuccessMsg('User added')
        } catch (err) {
            console.log('Error from onAddUser ->', err)
            showErrorMsg('Cannot add user')
        }
    }

    async function onEditUser(user) {
        const fullname = prompt('User fullname?')
        const username = prompt('User username?')
        const password = prompt('password?')
        const score = +prompt('user score?')
        const userToSave = { ...user, fullname, username, password, score}
        try {

            const savedUser = await userService.save(userToSave)
            console.log('Updated User:', savedUser)
            setUsers(prevUsers => prevUsers.map((currUser) =>
                currUser._id === savedUser._id ? savedUser : currUser
            ))
            showSuccessMsg('User updated')
        } catch (err) {
            console.log('Error from onEditUser ->', err)
            showErrorMsg('Cannot update User')
        }
    }

    return (
        <section >
            <h3>Users App</h3>
            <main>
                <button onClick={onAddUser}>Add User</button>
                <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
            </main>
        </section>
    )
}
