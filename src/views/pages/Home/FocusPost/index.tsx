import PostContent from "./components/PostContent/index"
export default function FocusPost({socket}) {
    return (
        <div className=''>
            <PostContent socket={socket}></PostContent>
        </div>
    )
}