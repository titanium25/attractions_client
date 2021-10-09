import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import CalcDistance from "../utils/CalcDistance";
import attDAL from '../adapters/AttDAL';
import Box from "@mui/material/Box";
import {Slider, Typography} from "@material-ui/core";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useLocalStorage from "../hooks/useLocalStorage";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from "@mui/material/IconButton";
import parse from 'html-react-parser'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';


const Attractions = () => {
    const [fav, setFav] = useLocalStorage('fav', [])
    const {state} = useLocation();
    const [att, setAtt] = useState([])
    const [attType, setAttType] = useState([])
    const [maxDistance, setMaxDistance] = useState(30);
    const [type, setType] = useState('');


    useEffect(async () => {
        const response = await attDAL.getAtt();

        const attArr = response
            .data
            .map(v => ({
                ...v, distance: CalcDistance(
                    [state.location.coordinates.lat, state.location.coordinates.lng],
                    [v.Coordinates.lat, v.Coordinates.lng]) ^ 0
            }))
            .filter(v => v.distance <= maxDistance)
            .sort((a, b) => a.distance - b.distance);

        setAtt(attArr)

        // const unique = [...new Set(att.map(item => item.Attraction_Type))];
        // setAttType(unique)

    }, [maxDistance, attType, fav])

    const handleDistance = (event, newValue) => {
        setMaxDistance(newValue);
    };

    const addToFavorite = (id) => {
        const index = fav.indexOf(id)
        if (index > -1) {
            fav.splice(index, 1);
            setFav(fav)
        } else {
            setFav([...fav, id])
        }
    }

    const handleType = (event) => {
        const filter = att.filter(element => element.Attraction_Type === event.target.value)
        setType(event.target.value)
        setAtt(filter);
    };

    const reset = () => {
        setMaxDistance(30);
        setAttType(null)
        setType(null)
    }

    return (
        <div>

            <Box width={300}>
                <Typography id="continuous-slider" gutterBottom>
                    Max Distance: {maxDistance} km
                </Typography>
                <Typography id="select" gutterBottom>
                    Selected Type: {type}
                </Typography>
                <Slider
                    value={maxDistance}
                    onChange={handleDistance}
                    aria-label="Default"
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"/>
                <FormControl fullWidth>

                    <InputLabel id="select-label">Attraction Type: </InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        value={attType}
                        label="Attraction Type"
                        onChange={handleType}
                    >
                        {
                            [...new Set(att.map(item => item.Attraction_Type))]
                                .map(x => <MenuItem value={x}>{x}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <br/> <br/>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" onClick={reset}>Reset</Button>
                    <Button variant="outlined" component={Link} to="/">Back to home page</Button>
                </Stack>

            </Box>

            <br/><br/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650, background: '#fafafa'}} aria-label="table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"/>
                            <TableCell align="center"><b>Name</b></TableCell>
                            <TableCell align="center"><b>Distance (km)</b></TableCell>
                            <TableCell align="center"><b>Vendor ID</b></TableCell>
                            <TableCell align="center"><b>Address</b></TableCell>
                            <TableCell align="center"><b>Opening Hours</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {att.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="center" component="th" scope="row">
                                    <IconButton
                                        color={fav.indexOf(row._id) > -1 ? "primary" : "default"}
                                        onClick={() => addToFavorite(row._id)}>
                                        {fav.indexOf(row._id) > -1 ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                                    </IconButton>
                                </TableCell>

                                <TableCell align="center">
                                    <a href={row.URL} target="_blank"> {row.Name}</a>
                                </TableCell>
                                <TableCell align="center">{row.distance}</TableCell>
                                <TableCell align="center">{row.VendorId}</TableCell>
                                <TableCell align="center">{row.Address}</TableCell>
                                <TableCell align="center">{parse(row.Opening_Hours)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


        </div>
    );
};

export default Attractions;