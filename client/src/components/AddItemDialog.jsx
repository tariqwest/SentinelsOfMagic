import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import AddItemForm from './AddItemForm.jsx';

const styles = {
  width: '80%',
  margin: '0 auto 30%',
  maxWidth: 'none',
  textAlign: 'center',
};

class AddItemDialog extends React.Component {
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
        <RaisedButton label="Add Item by Search" secondary={true} onTouchTap={this.handleOpen} />
        <Dialog
          title="Add Item by Search"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={styles}
        >
          <AddItemForm
            houseId={this.props.houseId}
            submitItem={this.props.submitItem}
            handleClose={this.handleClose}
          />
        </Dialog>
      </div>
    );
  }
}

export default AddItemDialog;
