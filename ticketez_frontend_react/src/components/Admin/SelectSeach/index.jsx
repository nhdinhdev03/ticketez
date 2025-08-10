import React from 'react';
import { Select } from 'antd';

const MySelect = (props) => (
    <Select
        showSearch
        style={{
            width: 200,
        }}
        placeholder={props.placeholder || 'Search to Select'}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        options={props.options || []}
    />
);

export default MySelect;
