import "./App.css";
import React from "react";
import { connect } from "react-redux";
import Search from "./pages/Search";
import Signin from "./pages/Signin";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {          
          background: #2c3e50;
        }
        h1 {
          color: grey;
        }
      `,
    },
  },
});

const mapStateToProps = (state) => {
  return {
    cartitems: state.cartitems,
  };
};

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Router>
          <div>
            <Stack spacing={2} sx={{ paddingBottom: 5 }}>
              <nav>
                <Link to="/">Home</Link>
                <Link to="/signin">Sign In</Link>
                <div className="animation start-home"></div>
              </nav>
            </Stack>

            <Routes>
              <Route path="/signin" element={<Signin />} />
              <Route path="/register" element={<Signin />} />
              <Route path="/" element={<Search />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default connect(mapStateToProps)(App);
