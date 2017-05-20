import React from 'react';
import axios from 'axios';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

const styles = {
  cards: {
    maxHeight: '100%',
  },
  img: {
    minHeight: '100%',
    width: '100%',
  },
  paper: {
    maxWidth: '15em',
    height: 'auto',
    margin: 20,
    textAlign: 'center',
  },
  anchor: {
    textDecoration: 'none',
    fontSize: '.8em',
  },
};

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
        <div style={styles.paper}>
          <div className="green item_outer">
              <IconMenu
                iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Restock" onClick={this.clickRestock.bind(this)} />
                <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
              </IconMenu>
            <div className="item_inner">
              <img src={this.state.imgSrc} width="250" className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
            </div>
          </div>
        </div>
      );
    } else if (this.state.needToRestock && this.state.username === null) {
      return (
        <div style={styles.paper}>
          <div className="red item_outer">
              <IconMenu
                iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Claim" onClick={this.clickClaim.bind(this)} />
                <MenuItem primaryText="Undo" onClick={this.clickUndo.bind(this)} />
                <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
              </IconMenu>
            <div className="item_inner">
              <img src={this.state.imgSrc} width="250" className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
            </div>
          </div>
        </div>
      );
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) !== Number(this.state.itemUserId)) {
      return (
        <div style={styles.paper}>
          <div className="orange item_outer">
              <IconMenu
                iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Learn More" />
                <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
              </IconMenu>
            <div className="item_inner">
              <img src={this.state.imgSrc} width="250" className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>{`Claimed by ${this.state.username}`}</h6>
            </div>
          </div>
        </div>
      );
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) === Number(this.state.itemUserId)) {
      return (
        <div style={styles.paper}>
          <div className="blue item_outer">
              <IconMenu
                iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Unclaim" onClick={this.clickUnclaim.bind(this)} />
                <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
              </IconMenu>
            <div className="item_inner">
              <img src={this.state.imgSrc} width="250" className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>{`Claimed by You, ${this.state.username}`}</h6>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default HouseInventoryListItem;
