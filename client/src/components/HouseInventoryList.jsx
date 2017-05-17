import React from 'react';
import HouseInventoryListItem from './HouseInventoryListItem.jsx';
import { GridList, GridTile } from 'material-ui/GridList';

const styles = {
  pad: {
    margin: '5%',
  },
}

var HouseInventoryList = (props) => {
  return (
    <div className="row">
      {props.items.map((item) =>
        <HouseInventoryListItem
        item={item}
        userId={props.userId}
        key={item.id}
        submitItem={props.submitItem}
        />
      )}
    </div>
  );
};

export default HouseInventoryList;
