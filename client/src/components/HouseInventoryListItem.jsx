import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions } from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { Grid, Row, Col } from 'react-bootstrap';

const styles = {
  cards: {
    maxHeight: '100%',
  },
  img: {
    minHeight:'100%',
    width: '100%',
  },
  paper: {
    maxWidth: '15em',
    height: 'auto',
    margin: 20,
    textAlign: 'center',
  },
}

class HouseInventoryListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.item.id,
      name: this.props.item.name,
      notes: this.props.item.notes,
      price: '$99.99',
      imgSrc: 'https://static01.nyt.com/images/2016/06/28/dining/28COOKING-FRIEDCHICKENGUIDE13/28COOKING-FRIEDCHICKENGUIDE13-superJumbo.jpg',
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

  componentDidMount() {
    if (!this.state.needToRestock) {
      // GREEN
      this.setState({
        colorState: this.state.colorStyle.stock,
      });
    } else if (this.state.needToRestock && this.state.username === null) {
      // RED
      this.setState({
        colorState: this.state.colorStyle.restock,
      });
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) !== Number(this.state.itemUserId)) {
      // ORANGE
      this.setState({
        colorState: this.state.colorStyle.otherClaim,
      });
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) === Number(this.state.itemUserId)) {
      // Blue
      this.setState({
        colorState: this.state.colorStyle.userClaim,
      });
    }
  }

  clickRestock(event) {
    this.setState({
      colorState: this.state.colorStyle.restock,
    });
    axios.post('/restock', { itemId: this.state.id })
    .then(res => {
      console.log('Successful POST request to /restock');
      this.setState({
        needToRestock: true
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
        itemUserId: this.state.userId
      });
    })
    .catch(err => console.log('Bad POST request to /claim: ', err));
  }

  clickDelete(event) {
    axios.post('/delete', { itemId: this.state.id })
    .then(res => {
      console.log('Successful POST request to /delete');
      this.props.submitItem();
    })
    .catch(err => console.log('Bad POST request to /delete'));
  }

  clickUnclaim(event) {
    axios.post('/unclaim', { itemId: this.state.id })
    .then(res => {
      console.log('Successful POST request to /unclaim');
      this.setState({
        username: null
      });
    })
    .catch(err => console.log('Bad POST request to /unclaim'));
  }

  clickUndo(event) {
    this.setState({
      colorState: this.state.colorStyle.stock,
    });
    axios.post('/undo', { itemId: this.state.id })
    .then(res => {
      console.log('Successful POST request to /unclaim');
      this.setState({
        needToRestock: false
      });
    })
    .catch(err => console.log('Bad POST request to /unclaim'));
  }

  render() {
    if (!this.state.needToRestock) {
      return (
        <Card className="green">
          <Row>
            <Col  xs={12} md={6}>
              <img src={this.state.imgSrc} style={styles.img} alt="food"/>
            </Col>
            <Col xs={12} md={4}>
              <h2 className="item-name">{this.state.name}</h2>
              <h4 className="item-notes">{this.state.notes}</h4>
              <h4 className="item-notes">{this.state.price}</h4>
            </Col>
          <Col xs={12} md={2}>
            <CardActions className="iconMenu">
              <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              >
              <MenuItem primaryText="Restock" onClick={this.clickRestock.bind(this)} />
              <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
              </IconMenu>
            </CardActions>
          </Col>
          </Row>
        </Card>
      );
    } else if (this.state.needToRestock && this.state.username === null) {
      return (
        <Card className="red">
          <Row>
            <Col xs={12} md={6}>
              <img src={this.state.imgSrc} style={styles.img} alt="food" />
            </Col>
            <Col xs={12} md={4}>
              <h2 className="item-name">{this.state.name}</h2>
              <h4 className="item-notes">{this.state.notes}</h4>
              <h4 className="item-notes">{this.state.price}</h4>
            </Col>
            <Col xs={12} md={2}>
              <CardActions className="iconMenu">
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                  <MenuItem primaryText="Claim" onClick={this.clickClaim.bind(this)} />
                  <MenuItem primaryText="Undo" onClick={this.clickUndo.bind(this)} />
                  <MenuItem primaryText="Delete" onClick={this.clickDelete.bind(this)} />
                </IconMenu>
              </CardActions>
            </Col>
          </Row>
        </Card>
      );
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) !== Number(this.state.itemUserId)) {
      return (
        <Card className="orange">
          <Row>
            <Col xs={12} md={6}>
              <img src={this.state.imgSrc} style={styles.img} alt="food" />
            </Col>
            <Col xs={12} md={4}>
              <h2 className="item-name">{this.state.name}</h2>
              <h4 className="item-notes">{this.state.notes}</h4>
              <h4 className="item-notes">{this.state.price}</h4>
              <h6>{`Claimed by ${this.state.username}`}</h6>
            </Col>
            <Col xs={12} md={2}>
              <CardActions className="iconMenu">
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                  <MenuItem primaryText="Learn More" />
                </IconMenu>
              </CardActions>
            </Col>
          </Row>
        </Card>
      );
    } else if (this.state.needToRestock && typeof this.state.username === 'string' && Number(this.state.userId) === Number(this.state.itemUserId)) {
      return (
        <Card className="blue">
          <Row>
            <Col xs={12} md={6}>
              <img src={this.state.imgSrc} style={styles.img} alt="food" />
            </Col>
            <Col xs={12} md={4}>
              <h2 className="item-name">{this.state.name}</h2>
              <h4 className="item-notes">{this.state.notes}</h4>
              <h4 className="item-notes">{this.state.price}</h4>
            </Col>
            <Col xs={12} md={2}>
              <CardActions className="iconMenu">
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                  <MenuItem primaryText="Unclaim" onClick={this.clickUnclaim.bind(this)} />
                </IconMenu>
              </CardActions>
            </Col>
          </Row>
        </Card>
      );
    }
  }
}

export default HouseInventoryListItem;
