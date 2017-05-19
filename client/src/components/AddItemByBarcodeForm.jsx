import React from 'react';
import axios from 'axios';
import { Get, Post } from 'react-axios'
import { NavLink, Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Quagga from 'quagga';

const styles = {
  image: {
    width: 200,
    height: 200
  },
  fileinput: {
    display: 'none'
  }
}

class AddItemByBarcodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: '',
      image: '',
      url: '',
      houseId: this.props.houseId,
      errorName: '',
      errorText: '',
      decodedBarcode: '',
      errorDecodedBarcode: '',
      productStatus: null,
    };
    this.decodeBarcode = this.decodeBarcode.bind(this);
    this.getProductByBarcode = this.getProductByBarcode.bind(this);
  }

  postItem(obj) {

    axios.post('/add', obj)
      .then(res => {
        console.log('Successful POST request to /add');
        this.props.submitItem();
        this.props.handleClose();
      })
      .catch((err) => {
        console.log('Bad POST request to /add: ', err.response.data);
        this.setState({
          errorName: err.response.data.name,
          errorNotes: err.response.data.notes
        });
      });
  }

  clickSubmit(event) {
    this.postItem(this.state);
  }

  saveName(event) {
    this.setState({
      name: event.target.value
    });
  }

  saveNotes(event) {
    this.setState({
      notes: event.target.value
    });
  }

  decodeBarcode(e){
    console.log(e.currentTarget.files[0].name);
    var barcodeImage = e.currentTarget.files[0];
    var decodeResult = function(result) {
        if(result.codeResult) {
          console.log("result", result.codeResult.code);
          this.setState({decodedBarcode: result.codeResult.code});
          this.getProductByBarcode(result.codeResult.code);
        } else {
          console.log("not detected");
        }
      };
    Quagga.decodeSingle({
      src: URL.createObjectURL(barcodeImage),
      numOfWorkers: 2,  // Needs to be 0 when used within node
      inputStream: {
          size: 800  // restrict input-size to be 800px in width (long-side)
      },
      decoder: {
          readers: ["ean_reader"] // List of active readers
      },
      patchSize: 'medium',
      locate: true
      }, decodeResult.bind(this));
  }

  getProductByBarcode(barcode){
    this.setState({product: 'loading'});
    axios.post('/find-product', { barcode: barcode })
    .then(res => {
      console.log(res);
      if (res.data === 'NO RESULTS'){
        // error handling for no UPC results
        console.log('NO RESULTS')
      } else {
        this.setState({
        name: res.data.title,
        price: res.data.price,
        image: res.data.image,
        url: res.data.url,
        productStatus: 'found'
      })
      }
      ;
    })
    .catch(err => {
      throw err;
    });
  }

  componentDidMount(){

  }

  render() {

    const content = ()=>{
        if(this.state.productStatus === 'loading'){
          return (
            <CircularProgress size={80} thickness={5} />
          );
        }else if(this.state.productStatus === 'found'){
          return (
            <div>
              <img style={styles.image} src={this.state.image} />
              <div>{this.state.name}</div>
              <div>{this.state.price}</div>
            </div>
          );
        }else{
          return (
            <div>
              <div className="field-line">
                <RaisedButton
                   containerElement='label' // <-- Just add me!
                   label='Upload Image'>
                  <input
                    type="file"
                    style={styles.fileinput}
                    onChange={this.decodeBarcode}
                  />
                </RaisedButton>
              </div>
              <div className="field-line">
                <TextField
                  floatingLabelText="UPC Code"
                  type="text"
                  value={this.state.decodedBarcode}
                  errorText={this.state.errorDecodedBarcode}
                />
              </div>
            </div>
          );
        }

    }

    return(
      <form>
      {content()}
        <div className="button-line">
          <RaisedButton primary={true} label="Submit" onClick={this.clickSubmit.bind(this)}></RaisedButton>
        </div>
      </form>
    )
  }
}

export default AddItemByBarcodeForm;
