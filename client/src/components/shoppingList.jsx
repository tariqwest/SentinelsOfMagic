import axios from 'axios';
import auth from '../lib/clientAuth.js';
import RaisedButton from 'material-ui/RaisedButton';
import Nav from './Nav.jsx';
import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn } from 'material-ui/Table';


class ShoppingList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shoppingListItems: [],
      page: 'shop',
      selected: [],
    };

    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  componentWillMount() {
    auth(this.props.history);
    axios.get('/api/shop')
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          console.log(res.data.error);
        } else {
          this.setState({
            shoppingListItems: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  submitShopping() {
    const submissionItems = this.state.selected.map((index) => {
      return this.state.shoppingListItems[index];
    });

    axios.post('/api/shop', {
      data: submissionItems,
    })
    .then((res) => {
      this.setState({
        shoppingListItems: res.data,
        selected: [],
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleRowSelection(selectedRows) {
    console.log(selectedRows);
    if (Array.isArray(selectedRows)) {
      this.setState({
        selected: selectedRows,
      });
    } else if (selectedRows === 'all') {
      this.setState({
        selected: this.state.shoppingListItems.map((item, index) => index),
      });
    }
  }

  isSelected(index) {
    // Kind of ugly but not problematic at any reasonable number of selections
    return this.state.selected.includes(index);
  }


  render() {
    return (
      <div>
        <Nav page={this.state.page} />
        <RaisedButton
          secondary={this.state.selected.length > 0}
          disabled={this.state.selected.length === 0}
          label={'Mark as Purchased'}
          onTouchTap={this.submitShopping.bind(this)}
        />
        <Table
          multiSelectable
          enableSelectAll
          onRowSelection={this.handleRowSelection}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Select All</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody stripedRows>
            {this.state.shoppingListItems.map((item, index) => {
              return (
                <TableRow
                  key={index}
                  selected={this.isSelected(index)}
                >
                  <TableRowColumn>{item.itemname}</TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ShoppingList;
