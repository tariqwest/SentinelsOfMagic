import React from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Quagga from 'quagga';


class AddItemByBarcodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = null;
    this.state = {
      name: '',
      notes: '',
      houseId: this.props.houseId,
      errorName: '',
      errorText: '',
      decodedBarcode: '' 
    };
    this.decodeBarcode = this.decodeBarcode.bind(this);
  }

  postItem(obj) {
    axios.post('/add', obj)
      .then(res => {
        console.log('Successful POST request to /add');
        this.props.submitItem();
        this.props.toggleForm(false);
      })
      .catch(err => {
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

  clickCancel(event) {
    this.props.toggleForm(false);
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
    var cb = function(result) {
        if(result.codeResult) {
          console.log("result", result.codeResult.code);
          this.setState({decodedBarcode: result.codeResult.code});
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
      }, cb.bind(this));
  }

  componentDidMount(){
    Quagga.init({
    inputStream : {
      name : "Static",
      type : "ImageStream",
      target: this.fileUpload //document.querySelector('#yourElement') Or '#yourElement' (optional)
    },
    decoder : {
      readers : ["code_128_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });
  }

  render() {
    return (
      <Card className="container">
        <form>
          <h4 className="card-heading">Add Item by UPC</h4>
          <div className="field-line">
            <RaisedButton
               containerElement='label' // <-- Just add me!
               label=''>
              <input 
                type="file"
                onChange={this.decodeBarcode}
                ref={(ref) => this.fileUpload = ref}
              />
            </RaisedButton>
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="UPC Code"
              type="text"
              value={this.state.decodedBarcode}
              errorText={this.state.errorNotes}>
            </TextField>
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="Notes"
              type="text"
              value={this.state.notes}
              onChange={this.saveNotes.bind(this)}
              errorText={this.state.errorNotes}>
            </TextField>
          </div>
          <div className="button-line">
            <RaisedButton primary={true} label="Submit" onClick={this.clickSubmit.bind(this)}></RaisedButton>
            <RaisedButton primary={true} label="Cancel" onClick={this.clickCancel.bind(this)}></RaisedButton>
          </div>
        </form>
      </Card>
    );
  }
}

export default AddItemByBarcodeForm;
