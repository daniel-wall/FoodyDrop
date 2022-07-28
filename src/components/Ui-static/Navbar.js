import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PeopleIcon from '@mui/icons-material/People';
import HideSourceIcon from '@mui/icons-material/HideSource';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HomeIcon from '@mui/icons-material/Home';
/* Template von  Material UI  https://github.com/mui/material-ui/blob/v5.8.4/docs/data/material/getting-started/templates/dashboard/listItems.js */

export const mainListItems = (
        <React.Fragment>
            <ListItemButton to="/">
                <ListItemIcon>
                    <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary="Home"/>
            </ListItemButton>
            <ListItemButton  to="/Allergene-Zusatz">
                <ListItemIcon>
                    <HideSourceIcon/>
                </ListItemIcon>
                <ListItemText primary="Allergene & Zusatzstoffe"/>
            </ListItemButton>
            <ListItemButton to="/Profil">
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Profil"/>
            </ListItemButton>
        </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Favoriten
        </ListSubheader>
        <ListItemButton to="/Favoriten">
            <ListItemIcon>
                <FastfoodIcon/>
            </ListItemIcon>
            <ListItemText primary="Lieblingsspeise"/>
        </ListItemButton>
        <ListItemButton to="/Favorit-Mensen">
            <ListItemIcon>
                <RestaurantIcon/>
            </ListItemIcon>
            <ListItemText primary="Lieblings-Mensa"/>
        </ListItemButton>
    </React.Fragment>
);