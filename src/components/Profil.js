import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl,
    FormLabel, Grid, IconButton,
    InputLabel,
    MenuItem,
    Select, Snackbar, Switch, Typography
} from "@mui/material";
import AddAlertIcon from '@mui/icons-material/AddAlert';
import CloseIcon from '@mui/icons-material/Close';
import {updateProfil} from "../db/indexedDB";

function Profil() {


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
    }
    const alertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    const fillInfo = () => {

        let info;

        if (style === 'omnivor') {
            info = 'Du isst sowohl pflanzliche als auch tierische Produkte!';
        } else if (style === 'vegetarier') {
            info = 'Du verzichtest auf Fleisch und Fisch!';
        } else if (style === 'vegan') {
            info = 'Du verzichtest auf alle tierischen Produkte!';
        } else {
            info = 'Du isst eigentlich vegetarisch, machst bei Fisch aber eine Ausnahme!';
        }

        return info;
    }

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 3,
            minWidth: '80%'
        }}>
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={5}
            >
                <Typography variant="h5" component={"span"} gutterBottom>
                    Nutzereinstellungen
                </Typography>
                {/*Benutzer*/}
                <FormControl fullWidth>
                    <InputLabel id="select-user">Benutzer</InputLabel>
                    <Select
                        labelId="select-user"
                        id="user"
                        value={benutzer}
                        label="Benutzer"
                        onChange={(event) => setBenutzer(event.target.value)}
                    >
                        <MenuItem value={'students'}>Student</MenuItem>
                        <MenuItem value={'employees'}>Mitarbeiter</MenuItem>
                        <MenuItem value={'pupils'}>Schüler</MenuItem>
                        <MenuItem value={'others'}>Other</MenuItem>
                    </Select>
                </FormControl>
                {/*Benachrichtigung*/}
                <FormControl component="fieldset" variant="standard">
                    <Grid container>
                        <FormLabel component="legend">Benachrichtigung</FormLabel>
                        <AddAlertIcon/>
                    </Grid>
                    <Switch checked={notify} onChange={(event) => setNotify(event.target.checked)}
                            inputProps={{'aria-label': 'controlled'}}/>
                </FormControl>
                {/*Ernährungsform*/}
                <FormControl fullWidth>
                    <InputLabel id="select-style">Ernährung</InputLabel>
                    <Select
                        labelId="select-style"
                        id="style"
                        value={style}
                        label="Benutzer"
                        onChange={(event) => {
                            setStyle(event.target.value);
                            setOpenInfo(true);
                        }}
                    >
                        <MenuItem value={'omnivor'}>Omnivor</MenuItem>
                        <MenuItem value={'vegetarier'}>Vegetarisch</MenuItem>
                        <MenuItem value={'vegan'}>Vegan</MenuItem>
                        <MenuItem value={'pescetarier'}>Pescetarisch</MenuItem>
                    </Select>
                    <Collapse in={openInfo}>
                        <Alert
                            severity="info"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpenInfo(false);
                                    }}
                                >
                                    <CloseIcon fontSize="inherit"/>
                                </IconButton>
                            }
                            sx={{mt: 2}}
                        >
                            {fillInfo()}
                        </Alert>
                    </Collapse>
                </FormControl>
                <Button variant="contained" color="success" onClick={dialogClickOpen}>
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
            </Grid>
        </Box>
    );
}

export default Profil;