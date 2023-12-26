import './style.styl'
import { Comment, Icon, Tooltip, Avatar } from 'antd'
//import Icon from '@ant-design/icons';
import { useState } from 'react'
import moment from 'moment'
export default function MyComment({ show }) {
    const [state, setState] = useState({
        likes: 0,
        dislikes: 0,
        action: null
    })
    const like = () => {
        setState({
            likes: 1,
            dislikes: 0,
            action: 'liked'
        })
    }
    const dislike = () => {
        setState({
            likes: 0,
            dislikes: 1,
            action: 'disliked'
        })
    }
    const actions = [
        <span key="comment-basic-like">
            {/* <Tooltip title='Like'> */}
            <Icon
                type='like'
                theme={state.action === 'liked' ? 'filled' : 'outlined'}
                onClick={like}
            ></Icon>
            {/* </Tooltip> */}
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{state.likes}</span>
        </span>,
        <span key='key="comment-basic-like"'>
            {/* <Tooltip title='Dislike'> */}
            <Icon
                type='dislike'
                theme={state.action === 'disliked' ? 'filled' : 'outlined'}
                onClick={dislike}
            >
            </Icon>
            {/* </Tooltip> */}
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{state.dislikes}</span>
        </span>,
        <span key='comment-basic-reply-to'>Reply to</span>
    ]
    return (
        // <div className={!show ? 'hidden' : ''}>comment</div>
        <Comment
            className={!show ? 'hidden' : ''}
            actions={actions}
            author={<a>Han Solo</a>}
            avatar={
                <Avatar
                    size={64}
                    alt="Han Solo"
                />
            }
            content={
                <p>
                    We supply a series of design principles, practical patterns and high quality design
                    resources (Sketch and Axure), to help people create their product prototypes beautifully
                    and efficiently.
                </p>
            }
            datetime={
                <span>{moment().fromNow()}</span>
            }
        ></Comment>
    )
}