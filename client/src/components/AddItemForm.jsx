import React from 'react';
import axios from 'axios';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import AddItemSelect from './AddItemSelect.jsx';

class AddItemForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      notes: null,
      houseId: this.props.houseId,
      errorName: '',
      errorText: '',
      searchedFood: [],
      showList: false,
    };
  }

  getFoodItems() {
    axios.get('/spoonacular', { params: { searchFood: this.state.name } })
    .then(res => {
      console.log('Successful GET request to /spoonacular', res.data);
      this.setState({
        searchedFood: res.data,
        showList: true,
      });
    })
    .catch(err => {
      console.log('Bad GET request to /spoonacular', err);
    });
  }

  clickSubmit() {
    this.getFoodItems();
  }

  saveName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  render() {
    if (!this.state.showList) {
      return (
        <form>
          <div className="field-line">
            <TextField
              floatingLabelText="Item Name"
              type="text"
              value={this.state.name}
              onChange={this.saveName.bind(this)}
              errorText={this.state.errorName}
            />
          </div>
          <div className="button-line">
            <RaisedButton primary label="Search" onClick={this.clickSubmit.bind(this)} />
          </div>
        </form>
        );
    } else {
      return <AddItemSelect searchedFoods={this.state.searchedFood} houseId={this.props.houseId} submitItem={this.props.submitItem} handleClose={this.props.handleClose} />;
    }
  }
}

export default AddItemForm;
