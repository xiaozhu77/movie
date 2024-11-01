import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={10}
      color="red"
      fontSize={20}
      message={["Terrible", "Bad", "Okey", "Good", "Amazing"]}
    />
    <StarRating
      maxRating={5}
      color="yellow"
      fontSize={20}
      message={["Terrible", "Bad", "Okey", "Good", "Amazing"]}
    /> */}
    {/* <Text /> */}
  </React.StrictMode>
);
