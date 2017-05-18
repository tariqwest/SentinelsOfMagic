import React from 'react';
import AddItemByBarcodeForm from './AddItemByBarcodeForm.jsx';
import RaisedButton from 'material-ui/RaisedButton';

class AddItemByBarcode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false
    };
  }

  clickAddItem(event) {
    this.setState({
      showForm: true
    });
  }

  toggleForm(bool) {
    this.setState({
      showForm: bool
    });
  }

  render() {
    if (this.state.showForm) {
      return (
        <div>
          <AddItemByBarcodeForm houseId={this.props.houseId} toggleForm={this.toggleForm.bind(this)} submitItem={this.props.submitItem}/>
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
