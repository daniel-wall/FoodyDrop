import * as React from 'react';

import {Box, Checkbox, Typography} from "@mui/material";
import {updateProfil} from "../db/indexedDB";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccordionDetails from "@mui/material/AccordionDetails";
import MensaInfo from "./MensaInfo";
import {useEffect, useState} from "react";

function Favorit_Mensa() {

    const label = {inputProps: {'aria-label': 'Checkbox Favorit'}};
    const [favorites, setFavorites] = useState([]);
    const [load, setLoad] = useState(false);
    const [profil, setProfil] = useState([]);
    const [mensa, setMensa] = useState(favorites);

    useEffect(() => {

        //get Profil
        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("profil", "readonly");
            const store = tx.objectStore("profil");

            //gibt nur ein Profil
            store.get(1).onsuccess = (event) => {
                setProfil(event.target.result);
                setFavorites(event.target.result.favMensa);
            };

            //close the database connection
            tx.oncomplete = () => {
                db.close();
            };
        };

        setMensa(favorites);

        setLoad(true);
    },[load, favorites]);

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
                    if (favorites[i].id === data.id){
                        index = i;
                    }
                }
                favorites.splice(index,1);
                updateProfil(db, profil);
            }
        };
        setLoad(false);
    };

    const onClickFav = (event) => {
        event.stopPropagation();
    };

    const checkLength = () => {
        return mensa.length === 0;
    };


    return (
        <Box sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth: '80%'
        }}>
            <Typography variant="h4" component="div" gutterBottom>
                Deine Mensen
            </Typography>
            {/*Mensa auflistung*/}
            {load && !checkLength() &&(
                <Box sx={{margin: 2}}>
                    {mensa.map((value) => (
                        <Accordion sx={{mt: 2}} key={value.id}  TransitionProps={{ unmountOnExit: true }}>
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
                                        defaultChecked={true}
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
            {checkLength() &&(
                <Typography mt={2} variant="subtitle1" component="div" align={"center"} gutterBottom>
                    Keine Einträge vorhanden!
                </Typography>
            )}
        </Box>
    );
}

export default Favorit_Mensa;