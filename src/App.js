import React, {useState} from 'react';
import {init} from './db/indexedDB'
import {Box, createTheme, ThemeProvider} from "@mui/material";
import Typography from "@mui/material/Typography";

const Dashboard = React.lazy(() => import('./components/Ui-static/Dashboard'));

function App() {

    const [loading, setLoading] = useState(false);

    init();

    const mdTheme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#2b8342',
                dark: '#409056',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: '#2b8342',
            },
        }
    },);

    return (
        <Box>
            {loading && (
                <ThemeProvider theme={mdTheme}>
                    <Box>
                        <Typography component={"span"} variant={"h2"}>Loading...</Typography>
                    </Box>
                </ThemeProvider>
            )}
            <Dashboard/>
        </Box>
    );
}

export default App;
