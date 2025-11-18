import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { bugService } from "../services/bug.service.js"

export function BugEdit() {

    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.bugId) loadBug()
    }, [])

    async function loadBug() {
        try {
            const bugToEdit = await bugService.getById(params.bugId)
            setBugToEdit(bugToEdit)
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
        setBugToEdit(prevBugToEdit => ({ ...prevBugToEdit, [field]: value }))
    }

    async function onSaveBug(ev) {
        ev.preventDefault()
        try {
            bugService.save(bugToEdit)
            navigate('/bug')
        } catch (err) {
            console.log('err:', err)
        }
    }
    const { title, severity, description } = bugToEdit

    return (
        <section className="bug-edit">
            <form className="form-edit" onSubmit={onSaveBug} >
                <h1>Edit</h1>
                <label htmlFor="title">Title:</label>
                <input onChange={handleChange} value={title} type="text" name="title" id="title" />

                <label htmlFor="severity">Severity:</label>
                <input onChange={handleChange} value={severity} type="number" name="severity" id="severity" />

                <label htmlFor="description">Description:</label>
                <textarea onChange={handleChange} rows={5} cols={5} value={description} name="description" id="description"></textarea>

                <button>Save</button>
            </form>
        </section>
    )
}