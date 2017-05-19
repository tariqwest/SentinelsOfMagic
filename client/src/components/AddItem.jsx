import React from 'react';
import AddItemForm from './AddItemForm.jsx';
import AddItemDialog from './AddItemDialog.jsx';
import BarcodeSearchDialog from './BarcodeSearchDialog.jsx';

class AddItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
   return (
        <div>
        <div className="add-item">
          <BarcodeSearchDialog  houseId={this.props.houseId} submitItem={this.props.submitItem} />
        </div>
        <div className="add-item">
          <AddItemDialog  houseId={this.props.houseId} submitItem={this.props.submitItem} />
        </div>
        </div>
      );
  }
}

export default AddItem;
