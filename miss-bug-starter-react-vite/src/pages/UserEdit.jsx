import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { userService } from "../services/user.service.js"

export function UserEdit() {

    const [userToEdit, setUserToEdit] = useState(userService.getEmptyUser())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.userId) loadUser()
    }, [])

    async function loadUser() {
        try {
            const userToEdit = await userService.getById(params.userId)
            setUserToEdit(userToEdit)
        } catch (err) {
            console.log('err:', err)
        }
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }
        setUserToEdit(prevUserToEdit => ({ ...prevUserToEdit, [field]: value }))
    }

    async function onSaveUser(ev) {
        ev.preventDefault()
        try {
            userService.save(userToEdit)
            navigate('/user')
        } catch (err) {
            console.log('err:', err)
        }
    }
    const { username, fullname } = userToEdit

    return (
        <section className="user-edit">
            <form className="form-edit" onSubmit={onSaveUser} >
                <h1>Edit</h1>
                <label htmlFor="username">Username:</label>
                <input onChange={handleChange} value={username} type="text" name="username" id="username" />

                <label htmlFor="fullname">Fullname:</label>
                <input onChange={handleChange} value={fullname} type="text" name="fullname" id="fullname" />

                <button>Save</button>
            </form>
        </section>
    )
}