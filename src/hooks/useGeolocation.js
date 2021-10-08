import {useEffect, useState} from 'react';

// Custom hook to use in multiple places in application
const UseGeolocation = () => {

    // Hold the location details of the user
    // Until the user gives his permission the location state will be not loaded
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: {lat: "", lng: ""}
    });

    const onSuccess = location => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
        })
    }

    const onError = (error) => {
        setLocation({
            loaded: true,
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    // When the component renders ask the user for permission of user location
    useEffect(() => {
        // Check if browser supports the Geolocation
        // Return the detailed error to user if not supported
        if (!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: "Geolocation not supported"
            })
        }

        // Request for the location
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }, [])

    return location;
};

export default UseGeolocation;