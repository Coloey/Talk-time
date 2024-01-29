import * as React from 'react'
//import '../Common/style.css'
import { Button } from 'antd'
import {
    RichUtils
} from 'draft-js'
import { inlineTypes } from '../config'

export default function InlineTypesControl({ editorState, onInlineTypeChange }) {

    // 点击按钮
    const clickBtn = (e, style) => {
        // 阻止点击按钮后editor失去了焦点，而且按钮的事件必须是onMouseDown，onClick调用该方法editor还是会失去焦点
        e.preventDefault()
        const newEditState = RichUtils.toggleInlineStyle(
            editorState,
            style
        )
        onInlineTypeChange(newEditState)
    }

    const currentStyle = editorState.getCurrentInlineStyle()

    return (
        <div style={{ display: 'inline-block', margin: '15px 0' }}>
            {
                inlineTypes.map(inlineType =>
                    <Button
                        key={inlineType.style}
                        onMouseDown={(e) => clickBtn(e, inlineType.style)}
                        className={currentStyle.has(inlineType.style) ? 'activeButton' : ''}
                        style={{ marginRight: 8 }}
                    >
                        {inlineType.label}
                    </Button>
                )
            }
        </div>
    )
}