

export function UserPreview({ user }) {

    return <article >
        <h1>{user.username}</h1>
        <h1>{user.score}</h1>
    </article>
}