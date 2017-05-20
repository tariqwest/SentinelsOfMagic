import React from 'react';
import HouseInventoryListItem from './HouseInventoryListItem.jsx';
import { Row, Col } from 'react-flexbox-grid';

const HouseInventoryList = (props) => {
  return (
    <Row>
      {props.items.map((item) =>
        <Col xs={12} sm={6} md={4}>
        <HouseInventoryListItem
          item={item}
          userId={props.userId}
          key={item.id}
          submitItem={props.submitItem}
        />
        </Col>
      )}
    </Row>
  );
};

export default HouseInventoryList;
