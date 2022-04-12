import "../App.css";
import React from "react";
import SignInSide from "../components/SignInSide";

function Signin() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <SignInSide></SignInSide>
      <footer className="App-header">
        <div>{!data ? "Loading..." : data}</div>
      </footer>
    </div>
  );
}

export default Signin;
