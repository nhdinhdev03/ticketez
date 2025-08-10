import React, {useState} from "react";
import { Card, Button, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ProductCard = props => {
    const [imageUrl, setImageUrl] = useState(null);
  return (
    <>
      <Card style={{ width: "inherit" }}>
      <Avatar size={55} 
                        src={imageUrl || 'https://i.imgur.com/O5066mS.gif'}  

      >
      </Avatar>

          <Typography>Diễn viên</Typography>     
      </Card>
    </>
  );
};

export default ProductCard;
