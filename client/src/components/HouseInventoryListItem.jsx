import React from 'react';
import axios from 'axios';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
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
      width: '',
      height: '',
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillMount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  clickRestock() {
    this.setState({
      colorState: this.state.colorStyle.restock,
    });
    axios.post('/restock', { itemId: this.state.id })
    .then(() => {
      console.log('Successful POST request to /restock');
      this.setState({
        needToRestock: true,
      });
    })
    .catch(err => console.log('Bad POST request to /restock: ', err));
  }

  clickClaim() {
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

    const checkInStock = !this.state.needToRestock;
    const checkNeedToRestock = this.state.needToRestock && this.state.username === null;
    const checkClaimedByOther = this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) !== Number(this.state.itemUserId);
    const checkClaimedByUser = this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) === Number(this.state.itemUserId);

    const InStockButtons = () => (
      <div>
        <FlatButton label="Restock" className="button-depth" onClick={this.clickRestock.bind(this)} />
        <FlatButton label="Delete" className="button-depth" onClick={this.clickDelete.bind(this)} />
      </div>
    );

    const InStockIcon = () => (
      <IconMenu
        iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem primaryText="Restock" onClick={this.clickRestock.bind(this)} />
        <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
      </IconMenu>
    );

    const NeedToRestockButtons = () => (
      <div>
        <FlatButton label="Claim" className="button-depth" onClick={this.clickClaim.bind(this)} />
        <FlatButton label="Undo" className="button-depth" onClick={this.clickUndo.bind(this)} />
        <FlatButton label="Delete" className="button-depth" onClick={this.clickDelete.bind(this)} />
      </div>
    );

    const NeedToRestockIcon = () => (
      <div>
        <IconMenu
          iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
        <MenuItem primaryText="Claim" onClick={this.clickClaim.bind(this)} />
        <MenuItem primaryText="Undo" onClick={this.clickUndo.bind(this)} />
        <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
        </IconMenu>
      </div>
    );

    const ClaimedByOtherButtons = () => (
      <div>
        <FlatButton label="Delete" className="button-depth" onClick={this.clickDelete.bind(this)} />
      </div>
    );

    const ClaimedByOtherIcon = () => (
      <div>
        <IconMenu
          iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <MenuItem primaryText="Learn More" />
          <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
        </IconMenu>
      </div>
    );

    const ClaimedByUserButtons = () => (
      <div>
        <FlatButton label="Unclaim" className="button-depth" onClick={this.clickUnclaim.bind(this)} />
        <FlatButton label="Delete" className="button-depth" onClick={this.clickDelete.bind(this)} />
      </div>
    );

    const ClaimedByUserIcon = () => (
      <div>
        <IconMenu
          iconButtonElement={<IconButton><MoreHorizIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <MenuItem primaryText="Unclaim" onClick={this.clickUnclaim.bind(this)} />
          <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
        </IconMenu>
      </div>
    );

    let buttons = null;

    if (this.state.height > 736 && checkInStock) {
      buttons = <InStockButtons />;
    } else if (this.state.height <= 736 && checkInStock) {
      buttons = <InStockIcon />;
    } else if (this.state.height > 736 && checkNeedToRestock) {
      buttons = <NeedToRestockButtons />;
    } else if (this.state.height <= 736 && checkNeedToRestock) {
      buttons = <NeedToRestockIcon />;
    } else if (this.state.height > 736 && checkClaimedByOther) {
      buttons = <ClaimedByOtherButtons />;
    } else if (this.state.height <= 736 && checkClaimedByOther) {
      buttons = <ClaimedByOtherIcon />;
    } else if (this.state.height > 736 && checkClaimedByUser) {
      buttons = <ClaimedByUserButtons />;
    } else if (this.state.height <= 736 && checkClaimedByUser) {
      buttons = <ClaimedByUserIcon />;
    }

    if (checkInStock) {
      return (
          <div className="green item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>In Stock</h6>
<<<<<<< HEAD
            </div>
              {buttons}
=======
            </div>
            <div>
              <FlatButton label="Restock" onClick={this.clickRestock.bind(this)} />
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
>>>>>>> 7e5954cc3837a99fd90005612d02adf27fdd5da1
          </div>
      );
    } else if (checkNeedToRestock) {
      return (
          <div className="red item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} width="250" className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>Out of Stock | Unclaimed</h6>
<<<<<<< HEAD
            </div>
              {buttons}
=======
            </div>
            <div>
              <FlatButton label="Claim" onClick={this.clickClaim.bind(this)} />
              <FlatButton label="Undo" onClick={this.clickUndo.bind(this)} />
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
>>>>>>> 7e5954cc3837a99fd90005612d02adf27fdd5da1
          </div>
      );
    } else if (checkClaimedByOther) {
      return (
          <div className="orange item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>{`Out of Stock | Claimed by ${this.state.username}`}</h6>
            </div>
<<<<<<< HEAD
            <div>
              {buttons}
=======

            <div>
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
>>>>>>> 7e5954cc3837a99fd90005612d02adf27fdd5da1
            </div>
          </div>
      );
    } else if (checkClaimedByUser) {
      return (
          <div className="blue item_outer">
            <div className="item_inner">
              <img src={this.state.imgSrc} className="z-depth-3" alt="food" />
              <h3>{this.state.name}</h3>
              <h4>{this.state.price}</h4>
              <h6>{`Out of Stock | Claimed by You, ${this.state.username}`}</h6>
<<<<<<< HEAD
            </div>
            {buttons}
=======
            </div>
            <div>
              <FlatButton label="Unclaim" onClick={this.clickUnclaim.bind(this)} />
              <FlatButton label="Delete" onClick={this.clickDelete.bind(this)} />
            </div>
>>>>>>> 7e5954cc3837a99fd90005612d02adf27fdd5da1
          </div>
      );
    }
  }
}

export default HouseInventoryListItem;
