import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './CountryDetails.css'; 

function CountryDetails() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetchCountryDetails();
  }, [code]);

  const fetchCountryDetails = async () => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
      setCountry(response.data[0]);
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  };

  if (!country) return <p>Loading...</p>;

  return (
    <div className="country-details-container">
      <h1 className="country-name">{country.name.common}</h1>
      <img className="country-flag" src={country.flags.svg} alt={country.name.common} />
      <div className="country-info">
        <p><strong>Хүн ам:</strong> {country.population}</p>
        <p><strong>Бүс нутаг:</strong> {country.region}</p>
        <p><strong>Нийслэл:</strong> {country.capital}</p>
        <p><strong>Хэл:</strong> {Object.values(country.languages).join(", ")}</p>
        <p><strong>Мөнгөн тэмдэгт:</strong> {Object.values(country.currencies).map(c => c.name).join(", ")}</p>
        <p><strong>Нийт газар нутаг:</strong> {country.area} km²</p>
      </div>

      {/* Coordinates with Google Maps link */}
      <a
        className="google-maps-link"
        href={`https://www.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Google Maps
      </a>
    </div>
  );
}

export default CountryDetails;
