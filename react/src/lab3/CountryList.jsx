import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './App.css';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 10;

  useEffect(() => {
    fetchCountries();
  }, [search]);

  const fetchCountries = async () => {
    let url = "https://restcountries.com/v3.1/all";
    if (search) {
      url = `https://restcountries.com/v3.1/name/${search}`;
    }
    try {
      const response = await axios.get(url);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Pagination logic
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(indexOfFirstCountry, indexOfLastCountry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="country-list-container">
      <input
        type="text"
        placeholder="Хайх улсаа нэрээ бичнэ үү..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="country-list">
        {currentCountries.map((country) => (
          <div className="country-item" key={country.cca3}>
            <Link to={`/country/${country.cca3}`} className="country-link">
              <img src={country.flags.svg} alt={country.name.common} className="country-flag" />
              <p>{country.name.common}</p>
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(countries.length / countriesPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className="pagination-button">
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountryList;
