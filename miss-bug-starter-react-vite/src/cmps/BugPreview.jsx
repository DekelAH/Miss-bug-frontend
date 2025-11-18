

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Labels: {
            bug.labels.map(label =>
                <span key={label}>{label}, </span>
            )
        }</p>
    </article >
}