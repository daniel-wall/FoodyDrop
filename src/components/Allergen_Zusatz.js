import React, {useEffect} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Grid, Snackbar,
    Typography
} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {useState} from  "react";
import {deleteFavorit, insertFavorit, updateProfil} from "../db/indexedDB";

function Allergen_Zusatz() {
    const [checked, setChecked] = React.useState([0]);
    const [benutzer, setBenutzer] = useState('');
    const [style, setStyle] = useState('');
    const [notify, setNotify] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [allZus, setAllZus] = useState([]);
    const [newData, setNewData] = useState(null);

    useEffect(() => {
        //insert new Profil
        if (newData !== null) {

            const request = indexedDB.open("MensaDb", 2)

            request.onsuccess = (event) => {
                const db = event.target.result;
                updateProfil(db, newData);
            }
        } else {
            //get Profil
            const request = indexedDB.open("MensaDb", 2)

            request.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction("profil", "readonly");
                const store = tx.objectStore("profil");

                //gibt nur ein Profil
                store.get(1).onsuccess = (event) => {

                    setBenutzer(event.target.result.user);
                    setStyle(event.target.result.style);
                    if (event.target.result.notification === true) {
                        setNotify(event.target.result.notification);
                    }
                    setFavorites(event.target.result.favMensa);
                    setAllZus(event.target.result.allZus);
                };

                //close the database connection
                tx.oncomplete = () => {
                    db.close();
                };
            };
        }
    }, [newData])

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const dialogClickOpen = () => {
        setOpen(true);
    };

    const dialogClose = () => {

        setOpen(false);
    };

    const dialogClosePositiv = () => {
        setNewData({
            user: benutzer,
            notification: notify,
            style: style,
            favMensa: favorites,
            allZus: allZus
        });
        setOpen(false);
        setOpenAlert(true);
    };

    const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    const checkAllZus = (value) => {
        for (let i = 0; i < allZus.length; i++) {
            if (allZus[i] === value) {
                return true;
            }
        }
        return false;
    };

    const handleCheck = (checked, value) => {

        if (checked) {
            allZus.push(value);
            console.log(allZus);
        } else {
            let index = 0;
            for (let i = 0; i < allZus.length; i++) {
                if (allZus[i] === value){
                    index = i;
                }
            }
            allZus.splice(index,1);
            console.log(allZus);
        }
    };

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth: '80%'
        }}>
            <Grid container
                  rowSpacing={1}
                  direction="row"
                  justifyContent="center"
                  alignItems="flex-start">
                <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Allergene
                    </Typography>
                    {['Dinkel', 'Eier', 'Erdnüsse', 'Fisch', 'Gerste', 'Glutenhaltiges Getreide', 'Hafer', 'Haselnuss', 'Hefe', 'Kamut', 'Kaschunuss'
                        , 'Krebstiere', 'Lupine', 'Macadamia', 'Mandeln', 'Knoblauch', 'Milch und Milchprodukte (inkl. Laktose', 'Nitritpökelsalz', 'Pacannuss', 'Pistazie', 'Roggen',
                        'Schalenfrüchte, Schwefeldioxid und Sulfide', 'Sellerie', 'Senf', 'Sesam', 'Soja', 'Walnuss', ' Weichtiere'].map((value) => {
                        const labelId = `checkbox-list-label-${value}`;
                        return (
                            <ListItem
                                key={value}
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(value)} onChange={(event) => {
                                    handleCheck(event.target.checked, value)
                                }}  dense >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkAllZus(value)}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{'aria-labelledby': labelId}}
                                        />
                                    </ListItemIcon>
                                    <ListItemText  id={labelId} primary={` ${value}`}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Zusatzstoffe
                    </Typography>
                    {['Alkohol', 'Antioxidationsmittel',
                        'chininhaltig', 'Farbstoff', 'Geschmacksverstärker', 'geschwärzt', 'geschwefelt', 'koffeinhaltig', 'konserviert', 'Phosphat', 'Schweinefleisch bzw mit Gelatine',
                        'Süßungsmittel'].map((value) => {
                        const labelId = `checkbox-list-label-${value}`;
                        return (
                            <ListItem
                                key={value}
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(value)}  onChange={(event) => {
                                    handleCheck(event.target.checked, value)
                                }} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkAllZus(value)}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{'aria-labelledby': labelId}}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={` ${value}`}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
            <Button variant="contained" edge="end" color="success" onClick={dialogClickOpen}>
                Speichern
            </Button>
            <Dialog
                open={open}
                onClose={dialogClose}
                aria-labelledby="alert-Bestätigung"
                aria-describedby="alert-dialog-beschreibung"
            >
                <DialogTitle id="alert-Bestätigung">
                    {"Änderung übernehmen?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-beschreibung">
                        Sind Sie sicher, dass Sie die Änderungen übernehmen möchten?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogClose}>Ablehnen</Button>
                    <Button onClick={dialogClosePositiv} autoFocus>
                        Zustimmen
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openAlert} autoHideDuration={6000} onClose={alertClose}>
                <Alert onClose={alertClose} severity="success" sx={{width: '100%'}}>
                    Daten erfolgreich gespeichert!
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Allergen_Zusatz;