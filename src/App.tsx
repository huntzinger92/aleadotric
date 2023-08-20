import { Box, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import { Aleadotric } from "./components/Aleadotric/Aleadotric";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box>
        <Aleadotric />
      </Box>
    </ThemeProvider>
  );
}

export default App;
