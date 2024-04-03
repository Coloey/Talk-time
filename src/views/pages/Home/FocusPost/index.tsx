import PostContent from "./components/PostContent/index"
export default function FocusPost({ socket }) {
    return (
        <div>
            <PostContent socket={socket}></PostContent>
        </div>
    )
}