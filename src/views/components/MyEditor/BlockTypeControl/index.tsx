import * as React from 'react'
//import { IProp } from './type'
import {
    RichUtils
} from 'draft-js'
import { Button, Menu, Dropdown, Icon } from 'antd'
const MenuItem = Menu.Item
import { blockTypes } from '../config'
//import '../Common/style.css'

export default function BlockTypesControl({ editorState, onBlockTypeChange }) {

    // 点击菜单
    const clickMenu = (e) => {
        const newEditState = RichUtils.toggleBlockType(
            editorState,
            e.key
        )
        //console.log(e.key)
        onBlockTypeChange(newEditState)
    }

    // 得到当前块样式的label
    const getCurrentBlockLabel = () => {
        const selection = editorState.getSelection()
        const blockStyle = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()
        let blockLabel = ''
        //console.log(blockStyle)
        blockTypes.forEach((blockType) => {
            if (blockType.style === blockStyle) {
                blockLabel = blockType.label
                return
            }
        })
        return blockLabel
    }

    // 渲染菜单
    const renderMenu = () => {
        return (
            <Menu onClick={clickMenu}>
                {
                    blockTypes.map(blockType =>
                        <MenuItem key={blockType.style}>{blockType.label}</MenuItem>
                    )
                }
            </Menu>

        )
    }
    return (
        <Dropdown overlay={renderMenu()}>
            <Button>
                {getCurrentBlockLabel()}
            </Button>
        </Dropdown>
    )
}