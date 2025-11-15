
import { Link } from 'react-router-dom'
import { UserPreview } from './UserPreview'

export function UserList({ users, onRemoveUser, onEditUser }) {
    return (
        <ul className="bug-list">
            {users.map((user) => (
                <li className="bug-preview" key={user._id}>
                    <UserPreview user={user} />
                    <div>
                        <button
                            onClick={() => {
                                onRemoveUser(user._id)
                            }}
                        >
                            x
                        </button>
                        <button
                            onClick={() => {
                                onEditUser(user)
                            }}
                        >
                            Edit
                        </button>
                    </div>
                    <Link to={`/user/${user._id}`}>Details</Link>
                </li>
            ))}
        </ul>
    )
}
