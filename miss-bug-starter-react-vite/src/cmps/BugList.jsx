import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const loggedinUser = userService.getLoggedinUser()

    function isUserAllowed(bug) {
        if (!loggedinUser) return false
        return loggedinUser._id === bug.creator._id || loggedinUser.isAdmin
    }

    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    {isUserAllowed(bug) && (
                        <div className="bug-actions">
                            <button onClick={() => onRemoveBug(bug._id)}>
                                x
                            </button>
                            <button onClick={() => onEditBug(bug)}>
                                Edit
                            </button>
                        </div>
                    )}
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                </li>
            ))}
        </ul>
    )
}