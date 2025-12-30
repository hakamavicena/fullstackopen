import { useState, useEffect } from "react";
import service from "./services";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_KEY;

  useEffect(() => {
    if (!capital) return;

    service
      .getWeather(capital, api_key)

      .then((initWeather) => {
        console.log(initWeather);
        setWeather(initWeather);
      })
      .catch((error) => console.log("Weather fetch failed:", error));
  }, [capital, api_key]);

  if (!weather) return <div>Loading weather data...</div>;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celcius</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  );
};

const ShowCountry = ({ country }) => {
  const capital = country.capital ? country.capital[0] : null;

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt}
        style={{ width: 150, border: "1px solid #ccc", marginTop: 10 }}
      />

      {capital && <Weather capital={capital} />}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    service
      .getAll()

      .then((init) => {
        setCountries(init);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Find Countries</h2>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      {filter === "" && <p></p>}
      {countriesToShow.length > 10 && filter !== "" && (
        <p>Too many matches, specify another filter</p>
      )}

      {countriesToShow.length > 1 && countriesToShow.length <= 10 && (
        <ul>
          {countriesToShow.map((country) => (
            <li key={country.name.common}>
              {country.name.common}{" "}
              <button onClick={() => setFilter(country.name.common)}>
                show
              </button>
            </li>
          ))}
        </ul>
      )}

      {countriesToShow.length === 1 && (
        <ShowCountry country={countriesToShow[0]} />
      )}

      {countriesToShow.length === 0 && filter !== "" && (
        <p>Hasil pencarian tidak ditemukan</p>
      )}
    </div>
  );
};

export default App;
