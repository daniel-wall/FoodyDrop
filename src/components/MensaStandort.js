import React, {useEffect, useState} from "react";
import {
    Box, Checkbox,
    FormControl, InputAdornment,
    InputLabel,
    OutlinedInput
} from "@mui/material";
import {updateProfil} from "../db/indexedDB";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccordionDetails from "@mui/material/AccordionDetails";
import MensaInfo from "./MensaInfo";

function MensaStandort({favorites, profil}) {

    const [latitude, setLatitude] = useState();
    const label = {inputProps: {'aria-label': 'Checkbox Favorit'}};
    const [isLoaded, setIsLoaded] = useState(false);
    const [longitude, setLongitude] = useState();
    const [loading, setloading] = useState(false);
    const [value, setValue] = React.useState(1);
    const [data, setData] = useState([]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                }, function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                }
            );
        } else {
            console.log("Not Available");
        }

        if (loading === true) {
            //Daten fetchen (Mensa)
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://openmensa.org/api/v2/canteens?near[lat]=" + latitude + "&near[lng]=" + longitude + "&near[dist]=" + value, requestOptions)
                .then(res => res.json())
                .then(
                    (result) => {
                        setData(result);
                    }, (error) => {
                        console.log(error);
                    }
                )
            setIsLoaded(true);
            setloading(false);
        }
    }, [loading, data, longitude, latitude]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value > 0 && event.target.value <= 150) {
            setValue(event.target.value);
        } else {
            setValue(1);
        }
    };

    const checkFavorit = (mensaId) => {
        if (favorites != null) {
            for (let i = 0; i < favorites.length; i++) {
                if (favorites[i].id === mensaId) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleFavorit = (checked, data) => {
        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;

            if (checked) {
                favorites.push(data);
                updateProfil(db, profil);
            } else {
                let index = 0;
                for (let i = 0; i < favorites.length; i++) {
                    if (favorites[i].id === data.id) {
                        index = i;
                    }
                }
                favorites.splice(index, 1);
                console.log(favorites);
                updateProfil(db, profil);
            }
        };
    };

    const onClickFav = (event) => {
        event.stopPropagation();
    };

    const search = async (e) => {

        if (e.key === 'Enter') {
            setloading(true);
        }
    };
    const checkLength = () => {
        return data.length === 0;
    };

    return (
        <div>
            <div>
                <FormControl sx={{m: 1, width: '15%', ml: '40%'}} variant="outlined">
                    <InputLabel htmlFor="outlined-entfernung">Umkreis</InputLabel>
                    <OutlinedInput
                        id="outlined-entfernung"
                        type="number"
                        max="150"
                        min="1"
                        value={value}
                        onChange={handleChange}
                        endAdornment={<InputAdornment position="end">km</InputAdornment>}
                        aria-describedby="standard-weight-helper-text"
                        label="Password"
                        onKeyPress={search}
                    />
                </FormControl>
            </div>
            {isLoaded && !checkLength() && (
                <Box sx={{margin: 2}}>
                    {data.map((value) => (
                        <Accordion sx={{mt: 2}} key={value.id} TransitionProps={{unmountOnExit: true}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id={value.id}
                            >
                                <Typography component={"span"} variant={"body2"}>{value.name}
                                    <Checkbox
                                        onClick={onClickFav}
                                        onChange={(event) => {
                                            handleFavorit(event.target.checked, value)
                                        }}
                                        defaultChecked={checkFavorit(value.id)}
                                        {...label} icon={<FavoriteBorderIcon/>} checkedIcon={<FavoriteIcon/>}/>
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography component={"span"} variant={"body2"}><MensaInfo
                                    mensaId={value.id}/></Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
            {isLoaded && checkLength() && (
                <Typography mt={2} variant="subtitle1" component="div" align={"center"} gutterBottom>
                    Keine Mensen in der Nähe!
                </Typography>
            )}
        </div>
    );
}

export default MensaStandort;