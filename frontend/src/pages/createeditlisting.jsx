import React from 'react';
import { TopBanner, Form, Container, NavBar, Content, MyAlert } from './components';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { myFetch, isNumber } from './functions';

const CreateEditListing = ({ mode }) => {
  const [bedrooms, setBedrooms] = React.useState([]);
  const [type, setType] = React.useState('House');
  const [selectedFile, setSelectedFile] = React.useState();
  const [selectedImages, setSelectedImages] = React.useState();
  const [title, setTitle] = React.useState();
  const [city, setCity] = React.useState();
  const [street, setStreet] = React.useState();
  const [price, setPrice] = React.useState();
  const [bathrooms, setBathrooms] = React.useState();
  const [alert, setAlert] = React.useState();

  const navigate = useNavigate();
  const { id } = useParams()

  const numCheck = (event) => {
    if (isNumber(event.target.value)) {
      setAlert();
      updateValues(event);
      return true;
    } else {
      setAlert({ title: 'Error', text: 'Only numbers can be added to this field', severity: 'error' });
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
    if (!numCheck(event)) {
      setBedrooms([]);
      return;
    }
    const numBedrooms = parseInt(event.target.value);
    const newBedrooms = [];
    for (let i = 0; i < numBedrooms; i++) {
      newBedrooms.push('');
    }
    setBedrooms(newBedrooms);
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
      if (response.error === undefined) {
        setAlert({ title: 'Success', severity: 'success', text: 'Successfully created your listing... redirecting' })
        setTimeout(() => { navigate('/yourlistings') }, 1500);
      } else {
        setAlert({ title: 'Error', severity: 'error', text: response.error })
      }
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
      if (response.error === undefined) {
        setAlert({ title: 'Success', severity: 'success', text: 'Successfully edited your listing... redirecting' })
        setTimeout(() => { navigate('/yourlistings') }, 1500);
      } else {
        setAlert({ title: 'Error', severity: 'error', text: response.error })
      }
    }
  }

  return (
    <Container>
      { mode === 'new' ? <TopBanner text="New Listing"/> : <TopBanner text="Edit Listing"/> }
      <Content direction='column'>
      { alert && <MyAlert title={ alert.title } severity={ alert.severity } text={ alert.text }></MyAlert> }
        <Form>
          <TextField label="Title" onChange={ e => { setTitle(e.target.value) }} variant="standard" />
          <TextField label="Street" onChange={ e => { setStreet(e.target.value) }} variant="standard" />
          <TextField label="City" onChange={ e => { setCity(e.target.value) }} variant="standard" />
          <InputLabel>Type</InputLabel>
          <Select id="type" defaultValue="House" onChange={ (event) => { setType(event.target.value) } }>
            <MenuItem value='House'>House</MenuItem>
            <MenuItem value='Apartment'>Apartment</MenuItem>
            <MenuItem value='Hotel'>Hotel</MenuItem>
          </Select>
          <TextField label="Number of Bathrooms" id="bathrooms" onChange={numCheck} variant="standard" />
          <TextField label="Price (per night)" id="price" onChange={numCheck} variant="standard" />
          <TextField label="Number of bedrooms" id="bedrooms" onChange={addBeds} variant="standard" />
          { bedrooms.map((bedroom, idx) => {
            idx += 1;
            return (<input type="text" placeholder={'Number of beds in room ' + idx} onChange={setBeds} idx={ idx } variant="standard" key={idx} />);
          })}
          <TextField label="Amenities" id="amenities" variant="standard" />
          <br/><InputLabel>Upload thumbnail:</InputLabel>
          <input id="imageUpload" type="file" onChange={(event) => setSelectedFile(event.target.files[0])}/><p/>
          { mode === 'edit' ? <><InputLabel>Upload additional pics:</InputLabel><input id="imageUpload" type="file" multiple onChange={(event) => setSelectedImages(event.target.files)}/><p/></> : <></>}
          { !alert ? <Button variant="filled" onClick={createListing}>Submit</Button> : <Button variant="filled" disabled>Submit</Button> }
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
