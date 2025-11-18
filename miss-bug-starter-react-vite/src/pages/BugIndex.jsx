import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { useNavigate } from 'react-router'
import { userService } from '../services/user.service.js'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const loggedinUser = userService.getLoggedinUser()
    const navigate = useNavigate()


    useEffect(() => {

        loadBugs()

    }, [filterBy])

    async function loadBugs() {
        try {
            const bugs = await bugService.query(filterBy)
            setBugs(bugs)
        } catch (err) {
            console.log('Error: ' + err)
        }
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?'),
        }
        try {
            console.log('Added Bug', bug)
            const savedBug = await bugService.save(bug)
            setBugs(prevBugs => [...prevBugs, savedBug])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onDownloadPdf() {

        bugService.downloadBugReportPDF()
    }

    async function onEditBug(bug) {

        navigate(`/bug/edit/${bug._id}`)
    }

    function onSetFilterBy(filterBy) {

        setFilterBy({ ...bugService.getDefaultFilter(), ...filterBy })
    }

    return (
        <section >
            <h3>Bugs App</h3>
            <main>
                <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                {loggedinUser?.isAdmin &&
                    <button onClick={onDownloadPdf}>Bugs Report 📄</button>
                }                
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </section>
    )
}
