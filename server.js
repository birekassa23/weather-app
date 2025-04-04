require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const API_KEY = process.env.API_KEY;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

app.get("/cities", async (req, res) => {
  const cityPrefix = req.query.q;
  const limit = 10;

  try {
    const response = await axios.get(
      "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
      {
        params: { namePrefix: cityPrefix, limit },
        headers: {
          "X-RapidAPI-Key": process.env.GEODB_API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );

    const cityList = response.data.data.map((city) => ({
      name: `${city.city}, ${city.countryCode}`,
    }));

    res.json(cityList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
