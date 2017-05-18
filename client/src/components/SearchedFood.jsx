import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  propContainer: {
    width: '100%',
    overflow: 'hidden',
    margin: '10px auto 0',
  },
  propToggleHeader: {
    margin: '10px auto 5px',
  },
  button: {
    margin: '2.5%',
  },
};

class SearchedFood extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      height: '300px',
      searchedFoods: this.props.searchedFoods,
      selected: [],
      index: 0,
    };
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.handleIndex = this.handleIndex.bind(this);
  }

  handleRowSelection(selectedRow) {
    console.log(this.state.searchedFoods);
    console.log(selectedRow);
    this.setState({
      selected: selectedRow,
    });
  }

  handleIndex(index) {
    console.log('Index', index);
    this.setState({
      index: index,
    });
  }

  handleItemSelection(item, index) {
    console.log('I WAS CLICKED')
   console.log(item);
    console.log(index);
  }

  isSelected(index) {
    // Kind of ugly but not problematic at any reasonable number of selections
    return this.state.selected.includes(index);
  }

  render() {
    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this.handleRowSelection}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Photo">Photo</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.props.searchedFoods.map((row, index) => (
              <TableRow
                key={index}
                onClick={this.handleIndex.bind(this, index)}
              >
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn><h4>{row.title}</h4></TableRowColumn>
                <TableRowColumn><img src={row.image} alt="food" /></TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            adjustForCheckbox={this.state.showCheckboxes}
          >
            <TableRow>
              <TableRowColumn colSpan="2" style={{ textAlign: 'center' }}>
                <RaisedButton
                  label="Add Item"
                  primary
                  style={styles.button}
                  onClick={this.handleItemSelection.bind(this, this.props.searchedFoods, this.state.selected)}
                />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

export default SearchedFood;
