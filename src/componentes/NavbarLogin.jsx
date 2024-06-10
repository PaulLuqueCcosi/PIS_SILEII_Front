import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import theme_d from "../js/temaConfig";

const styles = {
  barra: {
    backgroundColor: "#64001D",
    color: "#FFFFFF",
  },
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  ...styles.barra,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

function NavbarLogin({ children }) {
  return (
    <ThemeProvider theme={theme_d}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              SILEII
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Aquí se renderizan los componentes hijos, como Login */}
        {children}
      </Box>
    </ThemeProvider>
  );
}

export default NavbarLogin;
