import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CountryList from "./CountryList";
import CountryDetails from "./CountryDetails";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/country/:code" element={<CountryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
