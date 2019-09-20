import React from 'react'
import { Modal } from 'antd';

const CommonModal = (props) => {
    const { visible, title, okText = "确定", cancleText = "取消", width = '50%', onOk, onCancel, wrapClassName, centered } = props;
    return (
        <Modal
            visible={ visible }
            title={ title }
            okText={ okText }
            cancelText={ cancleText }
            width={ width }
            onOk={ onOk }
            onCancel={ onCancel }
            destroyOnClose="true"
            wrapClassName={ wrapClassName }
            centered={ centered }
        >
            { props.children }
        </Modal>
    );
};

export default CommonModal;
