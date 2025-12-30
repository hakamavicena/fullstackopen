import axios from "axios";

const countriesUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

const getAll = () => {
  const request = axios.get(countriesUrl);
  return request.then((response) => response.data);
};

const getWeather = (city, apiKey) => {
  const request = axios.get(
    `${weatherBaseUrl}?q=${city}&appid=${apiKey}&units=metric`
  );
  return request.then((response) => response.data);
};

export default {
  getAll,
  getWeather,
};
