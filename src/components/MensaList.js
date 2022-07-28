import React, {useState} from 'react';

import {Box, Button, Checkbox, CircularProgress, IconButton, TextField} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import MensaInfo from "./MensaInfo";
import Standort from "./MensaStandort";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {updateProfil} from "../db/indexedDB";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function MensaList() {

    const [navigated, setNavigated] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setloading] = useState(false);
    const [query, setQuery] = useState('');
    const [voll, setVoll] = useState(false);
    const [mensa, setMensa] = useState([]);
    const label = {inputProps: {'aria-label': 'Checkbox Favorit'}};
    const [favorites, setFavorites] = useState([]);
    const [data, setData] = useState(() => {

        //alle Mensen aus Db
        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction('mensa', "readwrite");
            const store = tx.objectStore('mensa');

            store.getAll().onsuccess = (event) => {
                setData(event.target.result);
                console.log("Data loaded")
            }

            // close the database connection
            tx.oncomplete = () => {
                db.close();
            };
        };
    });
    const [profil, setProfil] = useState(() => {
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
    });

    const search = async (e) => {

        if (e.key === 'Enter') {

            setVoll(false);
            setIsLoaded(false);
            setloading(true);

            if (mensa.length !== 0) {
                mensa.length = 0;
            }


            for (let i = 0; i < data.length; i++) {
                if (data[i].name.includes(query) || data[i].address.includes(query)) {
                    mensa.push(data[i]);
                }
            }

            if (mensa.length !== 0) {
                setVoll(true);
                setMensa(mensa);
                console.log(mensa);
            }

            setTimeout(() => {
                setIsLoaded(true);
                setloading(false);
            }, 2000)
            setQuery('');
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

    const navigateToStandort = () => {
        setNavigated(false);
    };

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth: '80%'
        }}>
            <div>
                {navigated && (
                    <div>
                        <TextField
                            className="search"
                            placeholder="Search..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyPress={search}
                            fullWidth
                        />
                        <Button sx={{mt: 2, ml: '40%'}} variant="contained" onClick={() => navigateToStandort()}>
                            Mensen in der Nähe ermitteln
                        </Button>
                    </div>
                )}
                {loading && (
                    <CircularProgress color="success" sx={{mt: 2, ml: '50%'}}/>
                )}
                {/*Mensa auflistung*/}
                {isLoaded && voll && (
                    <Box sx={{margin: 2}}>
                        {mensa.map((value) => (
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
                {/*Keine Mensa gefunden*/}
                {isLoaded && !voll && (
                    <Box sx={{margin: 2}}>
                        <label>
                            Kein Eintrag gefunden!
                        </label>
                    </Box>
                )}
                {/*Standort ermitteln*/}
                {!navigated && (
                    <Box sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2,
                        minWidth: '80%'
                    }}>
                        <IconButton onClick={() => setNavigated(true)}>
                            <ArrowBackIcon/>
                        </IconButton>
                        <Standort favorites={favorites} profil={profil}/>
                    </Box>
                )}
            </div>
        </Box>
    );
}

export default MensaList;
