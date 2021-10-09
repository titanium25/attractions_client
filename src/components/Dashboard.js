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
import { IconContext } from "react-icons";

function RedLargeIcon() {
    return (
        <IconContext.Provider
            value={{ color: 'red', size: '50px' }}
        >
            <div>
                <LocationOnIcon/>
            </div>
        </IconContext.Provider>
    );
}

const MapMarker = ({ text }) => <div className="marker-container"><LocationOnIcon /> {text}</div>

const Dashboard = () => {
    const [show, setShow] = useState(false);
    const location = UseGeolocation();

    return (
        <div className="centered column">
            <Button
                variant="outlined"
                onClick={() => setShow(!show)}
                disabled={location.error}
                startIcon={location.error ? <LocationOffIcon/> : show ? <CloseIcon/> : <LocationOnIcon/>}
            >
                {show ? "close" : "Show my location"}
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
                            latitude: {location?.coordinates.lat}
                            <br/>
                            longitude: {location?.coordinates.lng}
                        </Typography>
                        <br/>
                        <Button
                            component={Link}
                            variant="contained"
                            startIcon={<AttractionsIcon/>}
                            to={{
                                pathname: "/attractions",
                                state: {location}
                            }}
                        >
                            Find nearest attractions
                        </Button>
                        <br/>
                        <br/>
                        <Button
                            component={Link}
                            variant="contained"
                            startIcon={<AttractionsIcon/>}
                            to={{
                                pathname: "/attractions-2",
                                state: {location}
                            }}
                        >
                            Find nearest attractions 2
                        </Button>
                        <br/>
                        <br/>
                        <div style={{ height: '60vh', width: '350px' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyDeEh3fjjN5bIoRfQvfhB9nwaWIFxiACpQ' }}
                                defaultZoom={8}
                                defaultCenter={{ lat: location.coordinates.lat, lng: location.coordinates.lng }}
                            >
                                <MapMarker
                                    lat={location.coordinates.lat}
                                    lng={location.coordinates.lng}
                                    text="My Location"
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