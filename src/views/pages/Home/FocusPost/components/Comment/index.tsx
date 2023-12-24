import './style.styl'
export default function Comment({ show }) {
    return (
        <div className={!show ? 'hidden' : ''}>comment</div>
    )
}