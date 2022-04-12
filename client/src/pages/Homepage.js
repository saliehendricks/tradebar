import "../App.css";
import React from "react";
import Button from "@mui/material/Button";
import SignInSide from "../components/SignInSide";

function Homepage() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Button variant="contained" color="primary">
            {!data ? "Loading..." : data}
          </Button>
        </div>
      </header>
      <SignInSide></SignInSide>
    </div>
  );
}

export default Homepage;
