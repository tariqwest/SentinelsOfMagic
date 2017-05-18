import React from 'react';
import AddItemByBarcodeForm from './AddItemByBarcodeForm.jsx';
import RaisedButton from 'material-ui/RaisedButton';

class AddItemByBarcode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  clickAddItem(event) {
    this.setState({
      open: true
    });
  }

  toggleForm(bool) {
    this.setState({
      open: bool
    });
  }

  render() {
    if (this.state.open) {
      return (
        <div>
          <AddItemByBarcodeForm houseId={this.props.houseId} toggleForm={this.toggleForm.bind(this)} submitItem={this.props.submitItem} open={this.state.open}/>
        </div>
      );
    } else {
      return (
        <div className="add-item">
          <RaisedButton secondary={true} label="Add item by barcode" onClick={this.clickAddItem.bind(this)}></RaisedButton>
        </div>
      );
    }
  }
}

export default AddItemByBarcode;
