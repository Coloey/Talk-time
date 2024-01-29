import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import InlineTypesControl from './InlineTypesControl/index';
import BlockTypesControl from './BlockTypeControl/index';
import FontSizeControl from './FontSizeControl/index';
import ImageControl from './ImageControl/index';
import { Flex } from '../../../../node_modules/antd/es/index';
export default function MyEditor({ imageUploadConfig }) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    // const [dymanicCssList, setDy]
    const editorRef = useRef(null);
    //editor获得焦点
    const onEditorFocus = () => {
        const editor = editorRef.current
        editor.focus()
    }
    const handleEditorChange = (newEditorState) => {
        setEditorState(newEditorState)
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
    // const onInlineTypeChange = (style) => {
    //     handleEditorChange(RichUtils.toggleInlineStyle(editorState, style))
    // }
    // const handleBlockType = (blockType) => {
    //     handleEditorChange(RichUtils.toggleBlockType(editorState, blockType))
    // }
    const handleSave = () => {
        const contentState = editorState.getCurrentContent()
        const rawContent = JSON.stringify(convertToRaw(contentState));
        console.log(rawContent)
    }
    const handleLoad = () => {
        const rawContent = '{"blocks":[{"key":"1gs7c","text":"Hello, Draft.js!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
        const contentState = convertFromRaw(JSON.parse(rawContent))
        handleEditorChange(EditorState.createWithContent(contentState))
    }
    const onAddImage = editorState => {
        handleEditorChange(editorState)
        setTimeout(() => onEditorFocus(), 0)
    }
    return (
        <>
            <div style={{ border: '1px solid #fff', minHeight: '200px', lineHeight: 1.5, width: '60vw', marginLeft: '20vw', marginTop: '80px' }}>
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

                    <ImageControl
                        editorState={editorState}
                        onAddImage={handleEditorChange}
                        imageUploadConfig={imageUploadConfig}
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

            }}>
                <button style={{ backgroundColor: '#8F6FFE', color: '#fff', marginRight: '20px', zIndex: 1, outline: 'none' }} onClick={handleSave}>Save</button>
                <button onClick={handleLoad}>Cancle</button>
            </div>
        </>
    )
}

// ReactDOM.render(<MyEditor />, document.getElementById('container'));