import React from "react"
import { Popover, Icon } from "antd"
import "./commonQuestionTip.less"
const CommonQuestionTip = props => {
    const { title, content, type = "hover" } = props
    return (
        <Popover
            arrowPointAtCenter
            placement="topLeft"
            title={ title }
            content={ content }
            trigger={ type }
            getPopupContainer={ () => document.querySelector('.common-question-tool') }
        >
            <Icon className="tip-icon" type="question-circle-o" />
        </Popover>
    )
}

export default CommonQuestionTip
