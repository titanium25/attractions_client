import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import CalcDistance from "../utils/CalcDistance";
import attDAL from '../adapters/AttDAL';
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import {Slider, Typography} from "@material-ui/core";

const columns = [
    {
        name: "Name",
        label: "Name",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "distance",
        label: "Distance (km)",
        options: {
            filter: true,
            sort: true
        }
    },
    {
        name: "Attraction_Type",
        label: "Attraction Type",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "City",
        label: "City",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "Email",
        label: "Email",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Phone",
        label: "Phone",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "ShortDescription",
        label: "Description",
        options: {
            filter: false,
            sort: false,
            display: false
        }
    },
    {
        name: "Address",
        label: "Address",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Opening_Hours",
        label: "Opening Hours",
        options: {
            filter: false,
            sort: false,
            display: false
        }
    },
    {
        name: "URL",
        label: "Web Page",
        options: {
            filter: false,
            sort: false,
            customRender: (value, tableMeta, updateValue) => {
                return (
                    <a href={value}>{value}</a>
                );
            }
        }
    },
];

const options = {
    filterType: 'checkbox',
};

const Attractions = () => {
    const {state} = useLocation();
    const [att, setAtt] = useState([])
    const [maxDistance, setMaxDistance] = React.useState(40);


    useEffect(async () => {
        const response = await attDAL.getAtt();
        const z = response
            .data
            .map(v => ({
                ...v, distance: CalcDistance(
                    [state.source.coordinates.lat, state.source.coordinates.lng],
                    [v.Coordinates.lat, v.Coordinates.lng]) ^ 0
            }))
            .filter(v => v.distance < maxDistance)
        setAtt(z)
    }, [maxDistance])

    const handleChange = (event, newValue) => {
        setMaxDistance(newValue);
    };

    return (
        <div>

            My coordinates: <br/>
            latitude: {state.source.coordinates.lat}
            <br/>
            longitude: {state.source.coordinates.lng}
            <br/><br/>
            <Box width={300}>
                <Typography id="continuous-slider" gutterBottom>
                    Max Distance: {maxDistance} km
                </Typography>
                <Slider
                    // defaultValue={50}
                    value={maxDistance}
                    onChange={handleChange}
                    aria-label="Default"
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto" />
            </Box>
            <MUIDataTable
                title={"Near by attractions"}
                data={att}
                columns={columns}
                options={options}
            />

        </div>
    );
};

export default Attractions;