import React from 'react';
import axios from 'axios';

import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import SearchedFood from './SearchedFood.jsx';

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
      console.log('Bad GET request to /spoonacular: ', err.response);
    });
  }

  postItem(obj) {
    axios.post('/add', obj)
      .then(res => {
        console.log('Successful POST request to /add');
        this.props.submitItem();
        this.props.toggleForm(false);
      })
      .catch(err => {
        console.log('Bad POST request to /add: ', err.response.data);
        this.setState({
          errorName: err.response.data.name,
          errorNotes: err.response.data.notes,
        });
      });
  }

  clickSubmit() {
    this.getFoodItems();
    // this.postItem(this.state);
  }

  clickCancel() {
    this.props.toggleForm(false);
  }

  saveName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  saveNotes(event) {
    this.setState({
      notes: event.target.value,
    });
  }

  render() {
    if (!this.state.showList) {
      return (
          <Card className="container">
            <form>
              <h4 className="card-heading">Add New Inventory Item</h4>
              <div className="field-line">
                <TextField
                  floatingLabelText="Item Name"
                  type="text"
                  value={this.state.name}
                  onChange={this.saveName.bind(this)}
                  errorText={this.state.errorName}
                >
                </TextField>
              </div>
              <div className="button-line">
                <RaisedButton primary label="Submit" onClick={this.clickSubmit.bind(this)} />
                <RaisedButton primary label="Cancel" onClick={this.clickCancel.bind(this)} />
              </div>
            </form>
          </Card>
        );
    } else {
      return (
          <Card className="container">
            <SearchedFood searchedFood={this.state.searchedFood} />
          </Card>
        );
    }
  }
}

export default AddItemForm;
