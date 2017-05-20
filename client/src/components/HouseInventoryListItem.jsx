import React from 'react';
import axios from 'axios';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import FlatButton from 'material-ui/FlatButton';

class HouseInventoryListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.item.id,
      name: this.props.item.name,
      price: this.props.item.price,
      imgSrc: this.props.item.image,
      needToRestock: this.props.item.needtorestock,
      username: this.props.item.username,
      userId: this.props.userId,
      itemUserId: this.props.item.userid,
      colorStyle: {
        stock: 'green',
        restock: 'red',
        otherClaim: 'orange',
        userClaim: 'blue',
      },
      colorState: 'green',
    };
  }

  clickRestock(event) {
    this.setState({
      colorState: this.state.colorStyle.restock,
    });
    axios.post('/restock', { itemId: this.state.id })
    .then(res => {
      console.log('Successful POST request to /restock');
      this.setState({
        needToRestock: true,
      });
    })
    .catch(err => console.log('Bad POST request to /restock: ', err));
  }

  clickClaim(event) {
    axios.post('/claim', { itemId: this.state.id, userId: this.state.userId })
    .then(res => {
      console.log('Successful POST request to /claim');
      this.setState({
        username: res.data.username,
        itemUserId: this.state.userId,
      });
    })
    .catch(err => console.log('Bad POST request to /claim: ', err));
  }

  clickDelete() {
    axios.post('/delete', { itemId: this.state.id })
    .then(() => {
      console.log('Successful POST request to /delete');
      this.props.submitItem();
    })
    .catch(() => console.log('Bad POST request to /delete'));
  }

  clickUnclaim() {
    axios.post('/unclaim', { itemId: this.state.id })
    .then(() => {
      console.log('Successful POST request to /unclaim');
      this.setState({
        username: null,
      });
    })
    .catch(() => console.log('Bad POST request to /unclaim'));
  }

  clickUndo() {
    this.setState({
      colorState: this.state.colorStyle.stock,
    });
    axios.post('/undo', { itemId: this.state.id })
    .then(() => {
      console.log('Successful POST request to /unclaim');
      this.setState({
        needToRestock: false,
      });
    })
    .catch(() => console.log('Bad POST request to /unclaim'));
  }

  render() {
    if (!this.state.needToRestock) {
      return (
          <div className="green item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>In Stock</h6>
            </div>
            <div>
              <FlatButton label="Restock" onClick={this.clickRestock.bind(this)} />
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
          </div>
      );
    } else if (this.state.needToRestock && this.state.username === null) {
      return (
          <div className="red item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} width="250" className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>Out of Stock | Unclaimed</h6>
            </div>
            <div>
              <FlatButton label="Claim" onClick={this.clickClaim.bind(this)} />
              <FlatButton label="Undo" onClick={this.clickUndo.bind(this)} />
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
          </div>
      );
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) !== Number(this.state.itemUserId)) {
      return (
          <div className="orange item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>{`Out of Stock | Claimed by ${this.state.username}`}</h6>
            </div>

            <div>
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
          </div>
      );
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) === Number(this.state.itemUserId)) {
      return (
          <div className="blue item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>{`Out of Stock | Claimed by You, ${this.state.username}`}</h6>
            </div>
            <div>
              <FlatButton label="Unclaim" onClick={this.clickUnclaim.bind(this)} />
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
          </div>
      );
    }
  }
}

export default HouseInventoryListItem;
