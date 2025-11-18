import { useEffect, useRef, useState } from "react"
import { utilService } from "../services/util.service"
import { bugService } from "../services/bug.service"


export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilterBy, 300)).current

    useEffect(() => {

        if (filterBy) {
            setFilterByToEdit(filterBy)
        }
    }, [])

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

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

        if (field === 'label') {
            value = value ? [value] : []
            setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: value }))
            return
        }

        if (field === 'sortDir') {
            value = +value
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handleClearFilter(ev) {
        ev.preventDefault()
        setFilterByToEdit(bugService.getDefaultFilter())
    }

    const allLabels = ['critical', 'need-CR', 'harmless', 'basic-injury']
    const { txt, severity, labels = [], sortBy, sortDir } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Bugs Filter</h2>
            <form>
                <div>
                    <label htmlFor="txt">Title:</label>
                    <input type="text"
                        id="txt"
                        name="txt"
                        placeholder="By title"
                        value={txt || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="severity">Minimum Severity:</label>
                    <input type="number"
                        id="severity"
                        name="severity"
                        placeholder="By severity"
                        value={severity || ''}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="label">Label: </label>
                    <select
                        id="label"
                        name="label"
                        value={labels[0] || ''}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        {allLabels.map(label => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="sortBy">Sort By: </label>
                    <select name="sortBy" id="sortBy" value={sortBy || ''} onChange={handleChange}>
                        <option value="">None</option>
                        <option value="title">Title</option>
                        <option value="severity">Severity</option>
                        <option value="createdAt">Created At</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sortDir">Order: </label>
                    <select name="sortDir" id="sortDir" value={sortDir || 1} onChange={handleChange}>
                        <option value="1">Asc</option>
                        <option value="-1">Desc</option>
                    </select>
                </div>

                <button type="button" onClick={handleClearFilter}>Clear Filter</button>

            </form>

        </section>
    )
}