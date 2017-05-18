import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

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

class SearchedFood extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedFoods: this.props.searchedFoods,
      selected: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('CLICKED');
  }

  handleRowSelection(selectedRow) {
    console.log(selectedRow);
    if (Array.isArray(selectedRow)) {
      this.setState({
        selected: selectedRow,
      });
    }
  }

  handleItemSelection() {
    console.log('I WAS CLICKED')
    console.log(this.state.searchedFoods[this.state.selected]);
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
              actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
              titleStyle={styles.titleStyle}
              titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              onClick={() => this.handleClick(index)}
            >
              <img src={item.image} />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default SearchedFood;
