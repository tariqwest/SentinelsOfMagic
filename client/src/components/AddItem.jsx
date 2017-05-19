import React from 'react';
import AddItemDialog from './AddItemDialog.jsx';
import AddItemByBarcodeDialog from './AddItemByBarcodeDialog.jsx';

const AddItem = (props) => {
  return (
    <div>
      <div className="add-item">
        <AddItemByBarcodeDialog houseId={props.houseId} submitItem={props.submitItem} />
      </div>
      <div className="add-item">
        <AddItemDialog houseId={props.houseId} submitItem={props.submitItem} />
      </div>
    </div>
  );
};

export default AddItem;
