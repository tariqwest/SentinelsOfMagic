import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AddItemByBarcodeForm from './AddItemByBarcodeForm.jsx';

const styles = {
  width: '80%',
  margin: '-5% auto 30%',
  maxWidth: 'none',
  textAlign: 'center',
};

class DialogExampleSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({
      open: true,
    });
  };

  handleClose() {
    this.setState({
      open: false,
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <RaisedButton label="Add Item by Barcode" secondary={true} onTouchTap={this.handleOpen} />
        <Dialog
          title="Add Item By Barcode"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={styles}
        >
          <AddItemByBarcodeForm houseId={this.props.houseId} submitItem={this.props.submitItem} handleClose={this.handleClose} />
        </Dialog>
      </div>
    );
  }
}

export default DialogExampleSimple;
