import React, {Suspense} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";


const MensaList = React.lazy(() => import('./MensaList.js'));
const Profil = React.lazy(() => import('./Profil.js'));
const Favorites = React.lazy(() => import('./Favorit_Speise.js'));
const Favorit_Mensa = React.lazy(() => import('./Favorit_Mensa.js'));
const Allergen_Zusatz = React.lazy(() => import('./Allergen_Zusatz.js'));


function Content() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<MensaList/>}/>
                    <Route path="/Profil" element={<Profil/>}/>
                    <Route path="/Ernährung" element={<Profil/>}/>
                    <Route path="/Favoriten" element={<Favorites/>}/>
                    <Route path="/Favorit-Mensen" element={<Favorit_Mensa/>}/>
                    <Route path="/Allergene-Zusatz" element={<Allergen_Zusatz/>}/>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default  Content;