import React from 'react';
import { Tabs } from 'antd';

const MyTabs = ({ defaultActiveKey, items, onChange }) => (
  <Tabs defaultActiveKey={defaultActiveKey} onChange={onChange}>
    {items.map((item) => (
      <Tabs.TabPane key={item.key} tab={item.label}>
        {item.children}
      </Tabs.TabPane>
    ))}
  </Tabs>
);

export default MyTabs