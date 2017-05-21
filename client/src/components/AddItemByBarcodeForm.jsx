import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Quagga from 'quagga';

const styles = {
  image: {
    width: 200,
    height: 200,
  },
  fileinput: {
    display: 'none',
  },
};

class AddItemByBarcodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: '',
      image: '',
      url: '',
      houseId: this.props.houseId,
      decodedBarcode: '',
      decodeBarcodeStatus: true,
      productStatus: null,
    };
    this.decodeBarcode = this.decodeBarcode.bind(this);
    this.getProductByBarcode = this.getProductByBarcode.bind(this);
    this.barcodeEntered = this.barcodeEntered.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  getProductByBarcode(barcode) {
    this.setState({ product: 'loading' });
    axios.post('/find-product', { barcode })
    .then(res => {
      if (res.data === 'NO RESULTS') {
        // error handling for no UPC results
        this.setState({ productStatus: 'not-found' });
        console.log('NO RESULTS');
      } else {
        this.setState({
          name: res.data.title,
          price: res.data.price,
          image: res.data.image,
          url: res.data.url,
          productStatus: 'found',
        });
      }
    })
    .catch(err => {
      throw err;
    });
  }

  decodeBarcode(e) {
    console.log(e.currentTarget.files[0].name);
    const barcodeImage = e.currentTarget.files[0];
    const decodeResult = (result) => {
      if (result.codeResult) {
        console.log('result', result.codeResult.code);
        this.setState({ decodedBarcode: result.codeResult.code });
        this.getProductByBarcode(result.codeResult.code);
      } else {
        this.setState({
          decodeBarcodeStatus: 'not-detected',
          decodedBarcode: '',
        });
      }
    };

    Quagga.decodeSingle({
      src: URL.createObjectURL(barcodeImage),
      numOfWorkers: 2,  // Needs to be 0 when used within node
      inputStream: {
        size: 800,  // restrict input-size to be 800px in width (long-side)
      },
      decoder: {
        readers: ['ean_reader', 'upc_reader'], // List of active readers
      },
      patchSize: 'medium',
      locate: true,
    }, decodeResult.bind(this));
  }

  postItem(obj) {
    axios.post('/add', obj)
      .then(() => {
        console.log('Successful POST request to /add');
        this.props.submitItem();
        this.props.handleClose();
      })
      .catch((err) => {
        console.log('Bad POST request to /add: ', err.response.data);
      });
  }

  clickSubmit() {
    this.postItem(this.state);
  }

  barcodeEntered(event) {
    this.setState({
      decodedBarcode: event.target.value,
    });

    if (event.target.value.length >= 12) {
      this.getProductByBarcode(event.target.value);
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Enter'){
      event.preventDefault();
    }
  }

  render() {
    const error = () => {
      let error = '';
      if (this.state.productStatus === 'not-found') {
        error = 'Sorry, wecouldn\'t find a product matching your barcode.';
      } else if (this.state.decodeBarcodeStatus === 'not-detected') {
        error = 'Sorry, we couldn\'t detect a barcode in this photo.';
      }
      return error;
    };
    const content = () => {
      if (this.state.productStatus === 'loading') {
        return (
          <CircularProgress size={80} thickness={5} />
        );
      } else if (this.state.productStatus === 'found') {
        return (
          <div>
            <img style={styles.image} src={this.state.image} alt="food"/>
            <div>{this.state.name}</div>
            <div>{this.state.price}</div>
            <div className="button-line">
              <RaisedButton primary label="Add Item" onClick={this.clickSubmit.bind(this)} />
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div>{error()}</div>
            <div className="field-line">
              <RaisedButton
                containerElement="label" // <-- Just add me!
                label="Select Image"
              >
                <input
                  type="file"
                  style={styles.fileinput}
                  onChange={this.decodeBarcode}
                />
              </RaisedButton>
            </div>
            <div className="field-line">
              <TextField
                floatingLabelText="UPC Code - 12 or 13 digits"
                type="text"
                value={this.state.decodedBarcode}
                onChange={this.barcodeEntered}
                onKeyDown={this.handleKeyDown}
              />
              <div className="button-line">
                { this.state.productStatus !== 'found' ? '' : <RaisedButton primary label="Add Item" onClick={this.clickSubmit.bind(this)} /> }
              </div>
            </div>
          </div>
        );
      }
    };
    return (
      <form>
        {content()}
      </form>
    );
  }
}

export default AddItemByBarcodeForm;
