import React from 'react';
import { TopBanner, Form, Container, NavBar, Content } from './components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { myFetch } from './functions';

const CreateEditListing = ({ mode }) => {
  const [submittable, setSubmittable] = React.useState(true);
  const [bedrooms, setBedrooms] = React.useState([]);
  const [type, setType] = React.useState('House');
  const [selectedFile, setSelectedFile] = React.useState();
  const [selectedImages, setSelectedImages] = React.useState();
  const [title, setTitle] = React.useState();
  const [city, setCity] = React.useState();
  const [street, setStreet] = React.useState();
  const [price, setPrice] = React.useState();
  const [bathrooms, setBathrooms] = React.useState();

  const { id } = useParams()

  const numCheck = (event) => {
    const regex = /^[0-9]+$/;
    if (regex.test(event.target.value)) {
      setSubmittable(true);
      updateValues(event);
      return true;
    } else {
      setSubmittable(false);
      return false;
    }
  }

  const updateValues = event => {
    if (event.target.id === 'bathrooms') {
      setBathrooms(event.target.value);
    } else if (event.target.id === 'price') {
      setPrice(event.target.value);
    }
  }

  const addBeds = (event) => {
    setBedrooms([]);
    if (numCheck(event)) {
      const numBedrooms = parseInt(event.target.value);
      const newBedrooms = [...bedrooms];
      for (let i = 0; i < numBedrooms; i++) {
        newBedrooms.push('');
      }
      setBedrooms(newBedrooms);
    }
  }

  const setBeds = (event) => {
    bedrooms[parseInt(event.target.getAttribute('idx')) - 1] = event.target.value;
  }

  const imageToString = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });

  async function createListing (event) {
    event.preventDefault();

    let thumbnail;
    if (selectedFile !== undefined) {
      await imageToString(selectedFile).then(data => {
        thumbnail = data;
      });
    } else {
      thumbnail = 'default';
    }

    if (mode === 'new') {
      const body = {
        title: title,
        address: { street: street, city: city },
        price: price,
        thumbnail: thumbnail,
        metadata: {
          bedrooms: bedrooms.length,
          beds: bedrooms,
          type: type,
          bathrooms: bathrooms
        }
      }
      const response = await myFetch('/listings/new', 'POST', body);
      response.error === undefined ? alert('Successfully created your listing') : alert(response.error);
    } else {
      const imageArray = [];
      if (selectedImages !== undefined) {
        for (const i of selectedImages) {
          await imageToString(i).then(data => {
            imageArray.push(data);
          });
        }
      }
      const body = {
        title: title,
        address: { street: street, city: city },
        price: price,
        thumbnail: thumbnail,
        metadata: {
          bedrooms: bedrooms.length,
          beds: bedrooms,
          type: type,
          bathrooms: bathrooms,
          images: imageArray
        }
      }
      const response = await myFetch('/listings/' + id, 'PUT', body);
      response.error === undefined ? alert('Successfully edited your listing') : alert(response.error);
    }
  }

  return (
    <Container>
      { mode === 'new' ? <TopBanner text="New Listing"/> : <TopBanner text="Edit Listing"/> }
      <Content>
        <Form>
          <TextField label="Title" onChange={ e => { setTitle(e.target.value) }} variant="standard" />
          <TextField label="Street" onChange={ e => { setStreet(e.target.value) }} variant="standard" />
          <TextField label="City" onChange={ e => { setCity(e.target.value) }} variant="standard" />
          <InputLabel>Type</InputLabel>
          <Select id="type" defaultValue="house" onChange={ (event) => { setType(event.target.value) } }>
            <MenuItem value='House'>House</MenuItem>
            <MenuItem value='Apartment'>Apartment</MenuItem>
            <MenuItem value='Hotel'>Hotel</MenuItem>
          </Select>
          <TextField label="Number of Bathrooms" id="bathrooms" onChange={numCheck} variant="standard" />
          <TextField label="Price (per night)" id="price" onChange={numCheck} variant="standard" />
          <TextField label="Number of bedrooms" id="bedrooms" onChange={addBeds} variant="standard" />
          { bedrooms.map((bedroom, idx) => {
            idx += 1;
            return (<input type="text" placeholder={'Number of beds in room ' + idx} onChange={setBeds} variant="standard" key={idx} idx={idx}/>);
          })}
          <TextField label="Amenities" id="amenities" variant="standard" />
          <br/><InputLabel>Upload thumbnail:</InputLabel>
          <input id="imageUpload" type="file" onChange={(event) => setSelectedFile(event.target.files[0])}/><p/>
          { mode === 'edit' ? <><InputLabel>Upload additional pics:</InputLabel><input id="imageUpload" type="file" multiple onChange={(event) => setSelectedImages(event.target.files)}/><p/></> : <></>}
          { submittable ? <Button variant="filled" onClick={createListing}>Submit</Button> : <div><Alert severity="error">Invalid input, try again</Alert><Button variant="filled" disabled>Submit</Button></div>}
        </Form>
      </Content>
      <NavBar/>
    </Container>
  )
}

CreateEditListing.propTypes = {
  mode: PropTypes.string
}
export default CreateEditListing;
