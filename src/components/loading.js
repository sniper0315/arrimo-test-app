import React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = ({ height }) => {
    return (
        <div style={{ width: '100%', height: height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
        </div>
    );
};

export default Loading;
