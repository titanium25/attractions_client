import * as React from 'react';
import {useState} from 'react';
import {Button, FormHelperText, Typography} from "@mui/material";
import UseGeolocation from "../hooks/useGeolocation";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import AttractionsIcon from '@mui/icons-material/Attractions';
import CloseIcon from '@mui/icons-material/Close';
import {Link} from 'react-router-dom'
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Divider} from "@material-ui/core";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDeEh3fjjN5bIoRfQvfhB9nwaWIFxiACpQ");

// set response language. Defaults to english.
Geocode.setLanguage("en");


const MapMarker = ({text}) => <div className="marker-container"><LocationOnIcon/> {text}</div>

const Dashboard = () => {
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState([])
    const [searchAddress, setSearchAddress] = useState([])
    const [coords, setCoords] = useState([])
    const [source, setSource] = useState({})
    const location = UseGeolocation();

    // Get latitude & longitude from address.
    if (address) {
        Geocode.fromAddress(searchAddress).then(
            (response) => {
                const {lat, lng} = response.results[0].geometry.location;
                coords.lat = lat;
                coords.lng = lng;
            },
            (error) => {
                // console.error(error);
            }
        );
    }


    if(!location.error){
        // Get address from latitude & longitude.
        Geocode.fromLatLng(location?.coordinates.lat, location?.coordinates.lng).then(
            (response) => {
                const getAddress = response.results[0].formatted_address;
                address.key1 = getAddress; //update without rendering
            },
            (error) => {
                // console.error(error);
            }
        );
    }


    function onChange(e) {
        console.log(e.target.value)
        console.log(location)
        console.log({coordinates: {lat: coords.lat, lng: coords.lng}})
        e.target.value === 'GPS'
            ? setSource(location)
            : setSource({coordinates: {lat: coords.lat, lng: coords.lng}})
    }

    function onChangeDef() {
        setSource(location)
    }

    return (
        <div className="centered column">
            <Button
                variant="outlined"
                onClick={() => setShow(!show)}
                disabled={location.error}
                startIcon={location.error ? <LocationOffIcon/> : show ? <CloseIcon/> : <LocationOnIcon/>}
            >
                {show ? "Close" : "Show my location"}
            </Button>
            {
                location.error
                    ? <FormHelperText>{location.error.message}</FormHelperText>
                    : null
            }

            <br/>
            {
                // Check if user location is loaded
                // Until user gives permission the location loaded will be false
                show ?
                    <div>
                        <Typography variant="h6" gutterBottom component="div">
                            GPS latitude: {location?.coordinates.lat}<br/>
                            GPS longitude: {location?.coordinates.lng}<br/>
                            Address: {address.key1}
                        </Typography>

                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': {m: 1},
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Divider/>
                            <TextField
                                id="outlined"
                                label="Address"
                                variant="outlined"
                                onChange={(event) => setSearchAddress(event.target.value)}
                            />

                            <Typography variant="h6" gutterBottom component="div">
                                Address latitude: {coords.lat} <br/>
                                Address longitude: {coords.lng}<br/>
                            </Typography>
                            <Divider/>

                            <FormControl component="fieldset">
                                <FormLabel component="legend">Choose prefer coordinates source</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="Options"
                                    defaultValue={onChangeDef}
                                    name="radio-buttons-group"
                                    onChange={(e) => {onChange(e)}}
                                >
                                    <FormControlLabel value="GPS" control={<Radio/>} label="GPS"/>
                                    <FormControlLabel
                                        disabled={!coords.lat}
                                        value="Address"
                                        control={<Radio/>}
                                        label="Address"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Divider/>

                        </Box>

                        <br/>
                        <Button
                            component={Link}
                            variant="contained"
                            startIcon={<AttractionsIcon/>}
                            to={{
                                pathname: "/attractions",
                                state: {source}
                            }}
                        >
                            Find nearest attractions option 1
                        </Button>
                        <br/>
                        <br/>
                        <Button
                            component={Link}
                            variant="contained"
                            startIcon={<AttractionsIcon/>}
                            to={{
                                pathname: "/attractions-2",
                                state: {source}
                            }}
                        >
                            Find nearest attractions option 2
                        </Button>
                        <br/>
                        <br/>
                        <div style={{height: '50vh', width: '350px'}}>
                            <GoogleMapReact
                                bootstrapURLKeys={{key: 'AIzaSyDeEh3fjjN5bIoRfQvfhB9nwaWIFxiACpQ'}}
                                defaultZoom={10}
                                defaultCenter={{lat: location.coordinates.lat, lng: location.coordinates.lng}}
                            >
                                <MapMarker
                                    lat={location.coordinates.lat}
                                    lng={location.coordinates.lng}
                                    text="My GPS Location"
                                />
                            </GoogleMapReact>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
};

export default Dashboard;