import * as React from 'react';
//vorlage https://www.javascripttutorial.net/web-apis/javascript-indexeddb/ zur hilfe genommen

export const init = () => {

    const request = indexedDB.open("MensaDb", 2);

    request.onerror = (event) => {
        console.log("Fehler beim erstellen der Datenbank!");
        console.log(event);
    };

    request.onsuccess = (event) => {
    };


    request.onupgradeneeded = (event) => {

        const db = event.target.result;

        let storeMensa = db.createObjectStore("mensa", {keyPath: "id"});
        let storeProfil = db.createObjectStore("profil", {
            autoIncrement: true
        });
        let storeFavorit = db.createObjectStore("favorit", {keyPath: "id"});

        console.log("Datenbank wurde erstellt!");

        //Daten fetchen (Mensa)
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://openmensa.org/api/v2/canteens", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    for (let i = 0; i < result.length; i++) {
                        insertMensaList(db, result[i]);
                    }

                }, (error) => {
                    console.log(error);
                }
            )
        console.log("Daten wurden in die Datenbank geladen!");

        //Profil initialisiert
        storeProfil.add({
            user: "students",
            notification: true,
            style: "omnivor",
            favMensa: [],
            allZus: []
        });
        console.log("Profil wurde erstellt! Sie gehören der Gruppe Studenten an und ihre Ernährungsform ist Omnivor.");
    };
};
//Profil in die Db hinzufügen
export const updateProfil = (db, profil) => {

    const tx = db.transaction("profil", "readwrite");
    const store = tx.objectStore("profil");

    let query = store.put(profil, 1);

    query.onsuccess = () => {
        console.log("Profil wurde geupdatet!");
    };

    query.onerror = (event) => {
        console.log(event);
    };

    tx.oncomplete = () => {
        db.close();
    };

};
//Favorit in die Db hinzufügen
export const insertFavorit = (db, favorit) => {

    const tx = db.transaction("favorit", "readwrite");
    const store = tx.objectStore("favorit");

    let query = store.put(favorit);

    query.onsuccess = () => {
        console.log("Speise zu Favoriten hinzugefügt!");
    };

    query.onerror = (event) => {
        console.log(event);
    };

    tx.oncomplete = () => {
        db.close();
    };

};
//Favorit aus der Db entfernen
export const deleteFavorit = (db, favoritId) => {

    const tx = db.transaction("favorit", "readwrite");
    const store = tx.objectStore("favorit");

    let query = store.delete(favoritId);

    query.onsuccess = () => {
        console.log("Speise von Favoriten entfernt!");
    };

    query.onerror = (event) => {
        console.log(event);
    };

    tx.oncomplete = () => {
        db.close();
    };

};
//Mensen in die Db hinzufügen
export const insertMensaList = (db, mensa) => {

    const tx = db.transaction("mensa", "readwrite");
    const store = tx.objectStore("mensa");

    let query = store.put(mensa);

    query.onsuccess = () => {
    };

    query.onerror = (event) => {
        console.log(event);
    };

    tx.oncomplete = () => {
        db.close();
    };

};
//Mensa nach Id abfragen
export const getMensaById = (db, mensaId) => {
    const tx = db.transaction("mensa", "readonly");
    const store = tx.objectStore("mensa");

    let query = store.get(mensaId);

    query.onsuccess = (event) => {
        if (!event.target.result) {
            console.log(`Die Mensa mit der Id ${mensaId} konnte nicht gefunden werden!`);
        } else {
            console.table(event.target.result);
        }
    };

    query.onerror = (event) => {
        console.log(event.target.errorCode);
    };

    tx.oncomplete = () => {
        db.close();
    };
};
//Mensa nach Name abfragen
export const getMensaByName = (db, mensaName) => {
    const tx = db.transaction("mensa", "readonly");
    const store = tx.objectStore("mensa");
    const index = store.index("name");

    let query = store.get(mensaName);

    query.onsuccess = (event) => {
        console.log(query.result);
        return query.result;
    };

    query.onerror = (event) => {
        console.log(event.target.errorCode);
    };

    tx.oncomplete = () => {
        db.close();
    };
};

