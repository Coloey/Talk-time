import * as React from 'react'
//import { IProp } from './type'
import { Button, Dropdown, Input, Menu, Popover, Upload } from 'antd'
import {
    EditorState,
    Entity,
    RichUtils,
    Modifier,
    AtomicBlockUtils
} from 'draft-js'
import {
    toggleCustomInlineStyle,
    getSelectionCustomInlineStyle
} from 'draftjs-utils'
import ImageUpload from '../Common/ImageUpload'


export default class ImageControl extends React.Component<IProp> {
    state = {
        visible: false,
        url: '',
        fileList: [],
        width: 'auto',
        height: 'auto',
        numWidth: 'auto',
        numHeight: 'auto'
    }

    //

    // 控件显示与隐藏
    handleVisibleChange = visible => {
        this.setState({
            visible
        })
    }

    // 图片url地址改变
    onUrlChange = e => {
        this.setState({ url: e.target.value })
    }

    // 图片宽度改变
    onWidthChange = e => {
        const width: string = e.target.value
        if (width.length && width !== 'auto') {
            this.setState({ width: `${width}px`, numWidth: width })
        } else {
            this.setState({ width: 'auto', numWidth: width })
        }
    }

    // 图片高度改变
    onHeightChange = e => {
        const height: string = e.target.value
        if (height.length && height !== 'auto') {
            this.setState({ height: `${height}px`, numHeight: height })
        } else {
            this.setState({ height: 'auto', numHeight: height })
        }
    }

    // 点击取消按钮
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    // 点击确定按钮
    handleOk = e => {
        e.preventDefault()
        const { editorState } = this.props
        const { url, width, height } = this.state
        console.log(url)
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
            'IMAGE',
            'IMMUTABLE',
            {
                src: url,
                width,
                height
            }
        )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity
        })

        const newNewEditorState = AtomicBlockUtils.insertAtomicBlock(
            newEditorState,
            entityKey,
            ' '
        )
        this.props.onAddImage(newNewEditorState)

        this.setState({
            visible: false,
            url: '',
            fileList: [],
            width: 'auto',
            height: 'auto',
            numWidth: 'auto',
            numHeight: 'auto'
        })
    }

    // 上传图片改变
    onImageUploadChange = fileList => {
        let url = fileList[0].response
            ? `${this.props.imageUploadConfig.cdnUrl}/${fileList[0].response.hash}`
            : fileList[0].url
        console.log(fileList, url)
        //url = 'data:image/jpeg;base64,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'
        this.setState({ url, fileList })
    }


    // 渲染图片上传视图
    renderAddImage = () => {
        return (
            <div style={{ width: 450 }}>
                {this.props.imageUploadConfig ? (
                    <div style={{ height: 117 }}>
                        <ImageUpload
                            value={this.state.fileList}
                            limitNum={1}
                            onChange={this.onImageUploadChange}
                            imageUploadConfig={this.props.imageUploadConfig}
                        />
                    </div>
                ) : (
                    ''
                )}
                <Input
                    key="linkUrl"
                    // addonBefore={<Icon type="link" />}
                    placeholder="链接地址"
                    value={this.state.url}
                    onChange={this.onUrlChange}
                    style={{ marginBottom: 12 }}
                />
                <Input
                    style={{ width: 120, marginRight: 8 }}
                    ref="width"
                    addonBefore='widh'
                    placeholder="auto"
                    value={this.state.numWidth}
                    onChange={this.onWidthChange}
                />
                <Input
                    style={{ width: 120 }}
                    ref="height"
                    addonBefore='height'
                    placeholder="auto"
                    value={this.state.numHeight}
                    onChange={this.onHeightChange}
                />
                <Button
                    onMouseDown={this.handleCancel}
                    style={{ marginLeft: 25, marginRight: 8 }}
                >
                    取消
                </Button>
                <Button onMouseDown={this.handleOk} type="primary">
                    确定
                </Button>
            </div>
        )
    }

    render() {
        return (
            <div style={{ display: 'inline-block' }}>
                <Popover
                    content={this.renderAddImage()}
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    <Button style={{ marginLeft: 8 }}>添加图片</Button>
                </Popover>
            </div>
        )
    }
}//