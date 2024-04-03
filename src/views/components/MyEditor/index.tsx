import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';
import InlineTypesControl from './InlineTypesControl/index';
import BlockTypesControl from './BlockTypeControl/index';
import FontSizeControl from './FontSizeControl/index';
import { storePostContent } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '../../../types/app';
import moment from 'moment';
import { message } from 'antd';
export default function MyEditor({ imageUploadConfig, socket }) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    // const [dymanicCssList, setDy]
    const editorRef = useRef(null);
    const navigate = useNavigate();
    // const [title, setTitle, getTitle] = useGetState();
    //editor获得焦点
    const onEditorFocus = () => {
        const editor = editorRef.current
        editor.focus()
    }
    const handleEditorChange = (newEditorState) => {
        setEditorState(newEditorState)
        //console.log(newEditorState, 'newEditorState');
        //onEditorFocus()
    }
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            handleEditorChange(newState)
            return 'handled'
        }
        return 'not-handled'
    }

    const handleSave = async () => {
        const contentState = editorState.getCurrentContent()
        let content = stateToHTML(contentState)
        let contentArray = content.split('\n')
        let title;
        // console.log(contentArray.slice(1).join(''), 'contentArray')
        if (contentArray.length > 0) {
            title = contentArray[0]
            if (contentArray.length >= 2) {
                content = contentArray.slice(1).join('')
            }
        } else {
            title = content;
        }
        const user_id = JSON.parse(localStorage.getItem('userInfo'))?.user_id;
        const res = await storePostContent({
            content: content,
            updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            user_id,
            title: title,
            name: localStorage.getItem('userName'),
            likes: 0,
            commentCount: 0,
            haveLiked: 0
        })
        //console.log(res.data, 'storePostContent')
        if (res.data.status === 0) {
            navigate(RouteIndex.COMMUNITY)
        }
        socket.emit('sendPost',
            {
                user_id,
                title,
                content,
                created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
        )
    }
    const handleLoad = () => {
        const rawContent = '{"blocks":[{"key":"1gs7c","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
        const contentState = convertFromRaw(JSON.parse(rawContent))
        handleEditorChange(EditorState.createWithContent(contentState))
    }
    const onAddImage = editorState => {
        handleEditorChange(editorState)
        setTimeout(() => onEditorFocus(), 0)
    }
    return (
        <>
            <div style={{ border: '1px solid #fff', minHeight: '200px', lineHeight: 1.5, width: '60vw', marginLeft: '20vw' }}>
                <div
                    style={{
                        padding: '0 15px',
                        backgroundColor: 'white',
                        borderBottom: '1px solid #ccc',
                    }}
                >
                    <InlineTypesControl
                        editorState={editorState}
                        onInlineTypeChange={handleEditorChange}
                    />
                    <BlockTypesControl
                        editorState={editorState}
                        onBlockTypeChange={handleEditorChange}
                    />
                </div>
                <div
                    style={{
                        padding: 15,
                        backgroundColor: 'white',
                        height: 500,
                        overflowY: 'scroll',
                        borderLeft: '1px solid #ccc'
                    }}
                    onClick={onEditorFocus}
                >
                    <Editor
                        ref={editorRef}
                        editorState={editorState}
                        onChange={handleEditorChange}
                        handleKeyCommand={handleKeyCommand}
                    //customStyleMap={getCustomStyleMap()}
                    // @ts-ignore
                    // blockRendererFn={mediaBlockRenderer}
                    // blockStyleFn={myBlockStyleFn}
                    />
                </div>
            </div >
            <div style={{
                position: 'fixed',
                bottom: 0,
                height: '60px',
                width: '100%',
                background: '#F8F8FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,

            }}>
                <button style={{ backgroundColor: '#8F6FFE', color: '#fff', marginRight: '20px', zIndex: 1, outline: 'none' }} onClick={handleSave}>Save</button>
                <button onClick={handleLoad}>Cancle</button>
            </div>
        </>
    )
}

// ReactDOM.render(<MyEditor />, document.getElementById('container'));