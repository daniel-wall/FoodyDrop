import * as React from 'react';
import {
    Box, Button, Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Divider,
    TextField
} from "@mui/material";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import LoadKategorieTabs from "./LoadKategorieTabs";

function MensaInfo({mensaId}) {

    const [alert, setAlert] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [MensaDate, setMensaDate] = useState(new Date().toISOString().slice(0, 10));
    const [food, setFood] = useState([]);
    const [IsClosed, setIsClosed] = useState(true);
    const [today] = useState(new Date().toISOString().slice(0, 10));
    const [allZus, setAllZus] = useState([]);
    const [style, setStyle] = useState('');
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
                setStyle(event.target.result.style);
                setAllZus(event.target.result.allZus);
            };

            //close the database connection
            tx.oncomplete = () => {
                db.close();
            };
        };
    });

    useEffect(() => {
        if (alert) setAlert(false);

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://openmensa.org/api/v2/canteens/" + mensaId + "/days/" + MensaDate, requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsClosed(result.closed);

                    if (result.closed === true) console.log("Mensa geschlossen!");

                    if (!IsClosed.closed) {
                        fetch("https://openmensa.org/api/v2/canteens/" + mensaId + "/days/" + MensaDate + "/meals", requestOptions)
                            .then(res => res.json())
                            .then(
                                (result) => {
                                    setFood(result);
                                    console.log("Gerichte geladen");
                                }, (error) => {
                                    setOpenDialog(true)
                                    setAlert(true);
                                    console.log(error);
                                }
                            )
                    }
                }, (error) => {

                    setOpenDialog(true);
                    setAlert(true);
                    console.log(error);
                }
            )

        filterKategorie(food);
    }, [MensaDate]);


    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const filterKategorie = (food) => {

        const newKategorie = [];

        for (let i = 0; i < food.length; i++) {

            if (checkSettings(food[i])) {

                if (newKategorie.length === 0) {

                    const item = {
                        food: filterFood(food[i].category),
                        category: food[i].category
                    }
                    newKategorie.push(item);

                } else {
                    if (!checkKategorie(newKategorie, food[i].category)) {

                        const item = {
                            food: filterFood(food[i].category),
                            category: food[i].category
                        }

                        newKategorie.push(item);
                    }
                }
            }
        }
        return newKategorie;
    };

    const checkSettings = (data) => {
        for (let i = 0; i < allZus.length; i++) {
            for (let j = 0; j < data.notes.length; j++) {

                if (style === 'vegetarier'){
                    if (data.notes[i] === 'Fleisch' || data.notes[i] === 'Fisch' ){
                        return false;
                    }
                } else if (style === 'vegan') {
                    if (data.notes[i] === 'Fleisch' || data.notes[i] === 'Fisch' || data.notes[i] === 'Eier'|| data.notes[i] === 'Milch und Milchprodukte (inkl. Laktose)' ){
                        return false;
                    }
                } else if (style === 'pescetarier'){
                    if (data.notes[i] === 'Fleisch' || data.notes[i] === 'Eier'|| data.notes[i] === 'Milch und Milchprodukte (inkl. Laktose)' ){
                        return false;
                    }
                }

                if (data.notes[j] === allZus[i]){
                    return false;
                }
            }
        }

        return true;

    };

    const checkKategorie = (list, category) => {

        for (let i = 0; i < list.length; i++) {

            if (list[i].category === category) {

                return true;
            }
        }

        return false;
    }

    const filterFood = (category) => {

        const newFood = [];

        for (let i = 0; i < food.length; i++) {

            if (food[i].category === category) {
                newFood.push(food[i]);
            }
        }
        return newFood;
    }

    return (
        <div>
            <Box sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                p: 2
            }}>
                <TextField
                    id="date"
                    label="Datum"
                    type="date"
                    defaultValue={MensaDate}
                    inputProps={{min: today.toString()}}
                    onChange={(event) => {
                        setMensaDate(event.target.value);
                    }
                    }
                    sx={{maxWidth: '100%'}}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Divider variant="fullwidth">Speiseplan</Divider>
                {/*Error handling*/}
                {alert && (
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="Keine Daten"
                        aria-describedby="Keine Daten für ausgewählte Mensa"
                    >
                        <DialogTitle id="Keine Daten">
                            {"Keine Daten für ausgewählte Mensa"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="Keine Daten für ausgewählte Mensa">
                                Für die ausgewählte Mensa gibt es am {MensaDate.toString()} keine Daten.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} autoFocus>
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {/*Mensa geschlossen*/}
                {!alert && IsClosed && (
                    <Typography component={"span"} variant={"body1"}>Mensa geschlossen</Typography>
                )}
                {/*Speise Infos (Name,Kategorie,Preis)*/}
                {!alert && !IsClosed && (
                    <LoadKategorieTabs category={filterKategorie(food)} data={food}/>
                )}
            </Box>
        </div>
    );
}

export default MensaInfo;