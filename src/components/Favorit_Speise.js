import React from 'react';
import {Box, Checkbox, Divider, Grid, ListItem, ListItemText, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import List from "@mui/material/List";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {deleteFavorit} from "../db/indexedDB";

function Favorit_Speise() {

    const [data, setData] = useState([]);
    const label = {inputProps: {'aria-label': 'Checkbox Favorit'}};
    const [load, setLoad] = useState(false);
    const [benutzer, setBenutzer] = useState(() => {
        //get Profil
        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("profil", "readonly");
            const store = tx.objectStore("profil");

            //gibt nur ein Profil
            store.get(1).onsuccess = (event) => {
                setBenutzer(event.target.result.user);
            };

            //close the database connection
            tx.oncomplete = () => {
                db.close();
            };
        };
    });

    useEffect(() => {
            //alle Favoriten aus Db
            const request = indexedDB.open("MensaDb", 2)

            request.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction('favorit', "readwrite");
                const store = tx.objectStore('favorit');

                store.getAll().onsuccess = (event) => {
                    setData(event.target.result);
                }

                // close the database connection
                tx.oncomplete = () => {
                    db.close();
                };
            };
        setLoad(true);
    }, [load]);

    const filterNotes = (notes) => {
        const newNotes = [];
        for (let i = 0; i < notes.length; i++) {
            if (!newNotes.includes(notes[i])) {
                newNotes.push(notes[i]);
            }
        }
        return newNotes;
    };

    const handleFavorit = (checked, id) => {
        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;

            deleteFavorit(db, id);
        }

        setLoad(false);
    };

    const checkLength = () => {
      return data.length === 0;
    };

    return(
        <Box sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            borderRadius: 2,
            p: 3,
            minWidth: '80%'
        }}>
            <Typography variant="h4" component="div" gutterBottom>
                Favorites
            </Typography>
            {load && !checkLength() &&(<List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    mt: 2
                }}
            >
                {data.map((value) => (
                    <ListItem
                        key={value.id}
                        disablePadding>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={5}
                            sx={{m: 2}}
                        >
                            <ListItemText primary={value.category}/>
                            <ListItemText primary={value.name} secondary={filterNotes(value.notes) + ' '}/>
                            <ListItemText primary={value.prices[benutzer] + ' €'}/>
                            <Checkbox
                                key={value.id}
                                onChange={(event) => {
                                    handleFavorit(event.target.checked, value.id)
                                }}
                                defaultChecked={true}
                                {...label} icon={<FavoriteBorderIcon/>} checkedIcon={<FavoriteIcon/>}/>
                            <Divider variant="fullwidth"/>
                        </Grid>
                    </ListItem>
                ))}
            </List>)}
            {checkLength() &&(
                <Typography mt={2} variant="subtitle1" component="div" align={"center"} gutterBottom>
                    keine Einträge vorhanden!
                </Typography>
            )}
        </Box>
    );
}

export default Favorit_Speise;
