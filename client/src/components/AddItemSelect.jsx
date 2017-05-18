import React, { Component } from 'react';
import axios from 'axios';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

class AddItemSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'hello world',
      notes: 'hello world',
      searchedFoods: this.props.searchedFoods,
      houseId: this.props.houseId,
      selected: [],
      errorName: '',
      errorText: '',
    };
    this.handleSelection = this.handleSelection.bind(this);
  }

  postItem(obj) {
    axios.post('/add', obj)
    .then(res => {
      console.log('Successful POST request to /add');
      this.props.submitItem();
      this.props.handleClose();
    })
    .catch(err => {
      console.log('Bad POST request to /add: ', err.response.data);
      this.setState({
        errorName: err.response.data.name,
        errorNotes: err.response.data.notes,
      });
    })
  }

  handleSelection(index) {
    console.log(this.state.searchedFoods[index]);
    this.postItem(this.state);
  }

  render() {
    return (
      <div style={styles.root}>
        <GridList style={styles.gridList} cols={1} cellHeight={300}>
          {this.props.searchedFoods.map((item, index) => (
            <GridTile
              key={index}
              title={item.title}
              className="ripple"
              titleStyle={styles.titleStyle}
              titleBackground="linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.75) 70%,rgba(0,0,0,0.7) 100%)"
              onClick={() => this.handleSelection(index)}
            >
              <img src={item.image} />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default AddItemSelect;
