import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCountriesAndCities = async () => {
      const { data } = await axios.get(
        `https://countriesnow.space/api/v0.1/countries/capital`
      );

      const mainCountries = [
        "Armenia",
        "Georgia",
        "France",
        "Germany",
        "Italy",
        "Hungary",
        "Bosnia and Herzegovina",
        "Lithuania",
        "United Kingdom",
        "United States",
        "Czech Republic",
        "Russia",
        "Egypt",
        "United Arab Emirates",
        "Greece",
        "Romania",
        "Ukraine",
        "Moldova",
        "Cyprus",
        "Colombia",
        "Cuba",
        "Costa Rica",
        "Urugway",
        "Denmark",
        "Monaco",
        "New Zealand",
        "Singapore",
        "Spain",
        "Sweden",
        "Switzerland",
        "Israel",
        "Iraq",
      ];

      const capitals = data.data
        .filter((el) => mainCountries.includes(el.name))
        .map((el) => el.capital);

      const getRandomCapitals = () => {
        // Create a Set to store unique capitals
        const uniqueCapitals = new Set();

        // Continue adding random capitals until we have 5 unique ones
        while (uniqueCapitals.size < 5) {
          const randomIndex = Math.floor(Math.random() * capitals.length);
          uniqueCapitals.add(capitals[randomIndex]);
        }

        // Convert the Set back to an array
        const randomCapitals = Array.from(uniqueCapitals);

        return randomCapitals;
      };

      const randomCities = getRandomCapitals();

      const fetchCityImages = randomCities.map((city) =>
        axios.get(`https://api.pexels.com/v1/search`, {
          headers: {
            Authorization: process.env.REACT_APP_PEXELS_API_KEY,
          },
          params: {
            per_page: 1,
            query: encodeURIComponent(city),
          },
        })
      );

      // Wait for all API requests to finish using Promise.all()
      const cityImagesResponses = await Promise.all(fetchCityImages);

      const cityImages = cityImagesResponses.map(
        (response) => response.data.photos[0].src.original
      );

      const citiesWithImages = randomCities.map((city, index) => ({
        city,
        image: cityImages[index],
      }));

      setData(citiesWithImages);
    };
    getCountriesAndCities();
  }, []);
  return (
    <div className="App">
      <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
        Guess temperature (C)
      </Typography>
      <Box sx={{ display: "flex", mt: 3, gap: 2, px: 4 }}>
        {data.map((el) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                padding: "1rem",
                borderRadius: "10px",
                boxShadow:
                  "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
              }}
              key={el.city}
            >
              <Box
                sx={{
                  width: "240px",
                  height: "240px",
                  "& > img": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                }}
              >
                <img src={el.image} />
              </Box>
              <Typography fontWeight={500} fontSize={18}>{el.city}</Typography>
            </Box>
          );
        })}
      </Box>
    </div>
  );
}

export default App;
