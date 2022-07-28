import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import {Checkbox, Divider, Grid, ListItem, ListItemText, Tabs} from "@mui/material";
import {useEffect, useState} from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {deleteFavorit, insertFavorit} from "../db/indexedDB";

function LoadKategorieTabs({category, data}) {
    const [value, setValue] = useState('0');
    const [number, setNumber] = useState(0);
    const label = {inputProps: {'aria-label': 'Checkbox Favorit'}};
    const [favorites, setFavorites] = useState([]);
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

        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("favorit", "readwrite");
            const store = tx.objectStore("favorit");

            store.getAll().onsuccess = (event) => {
                setFavorites(event.target.result);
            }

            tx.oncomplete = () => {
                db.close();
            };
        }
    }, [value]);


    const handleChange = (event: React.SyntheticEvent, newValue: string) => {

        setNumber(parseInt(newValue));
        setValue(newValue);
    };

    const filterNotes = (notes) => {
        const newNotes = [];
        for (let i = 0; i < notes.length; i++) {
            if (!newNotes.includes(notes[i])) {
                newNotes.push(notes[i]);
            }
        }
        return newNotes;
    };

    const checkFavorit = (FavId) => {
        if (favorites != null) {
            for (let i = 0; i < favorites.length; i++) {
                if (favorites[i].id === FavId) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleFavorit = (checked, id) => {
        const request = indexedDB.open("MensaDb", 2)

        request.onsuccess = (event) => {
            const db = event.target.result;

            if (checked) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
                        insertFavorit(db, data[i]);
                    }
                }
            } else {
                deleteFavorit(db, id);
            }
        };
    };

    return (
        <Box sx={{width: '100%', typography: 'body1'}}>
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="lab API tabs example">
                        {category.map((c, i) => (
                            <Tab key={i} value={i.toString()} label={c.category}/>
                        ))}
                    </Tabs>
                </Box>

                {category.map((c, i) => {
                    if (i === number) {
                        const food = c.hasOwnProperty('food') ?
                            c.food.map((food) => (
                                <Box key={food.id} sx={{borderBottom: 1, borderColor: 'divider', mt: 1}}>
                                    <ListItem
                                        key={food.id}
                                    >
                                        <Grid container spacing={1}
                                              direction="row"
                                              justifyContent="flex-start"
                                              alignItems="center"
                                              key={food.id}>
                                            <Grid item xs={6} md={8}>
                                                <ListItemText primary={food.name}
                                                              secondary={filterNotes(food.notes) + ' '}/>
                                            </Grid>
                                            <ListItemText primary={food.prices[benutzer] + ' €'}/>
                                            <Checkbox
                                                edge="end"
                                                onChange={(event) => {
                                                    handleFavorit(event.target.checked, food.id)
                                                }}
                                                defaultChecked={checkFavorit(food.id)}
                                                {...label} icon={<FavoriteBorderIcon/>} checkedIcon={<FavoriteIcon/>}/>
                                            <Divider/>
                                        </Grid>
                                    </ListItem>
                                </Box>
                            ))
                            : null;
                        return (

                            <TabPanel key={i} value={value} index={i}>{food}</TabPanel>

                        )
                    }
                })}
            </TabContext>
        </Box>
    );
}

export default LoadKategorieTabs;