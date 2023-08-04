import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const queryClient = useQueryClient();

  const cities = queryClient.getQueryData("cities");
  const navigate = useNavigate();
  useEffect(() => {
    if (!cities) {
      navigate("/");
    }
  }, []);
  const [currentStage, setCurrentStage] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [realAnswer, setRealAnswer] = useState(null);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const checkRealTemperature = async (values) => {
    if (!userAnswer) {
      setError("The field is required");
      return;
    }

    setDisabled(true);

    const { data } =
      await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${values.city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}
    `);
    if (data[0] && data[0].lat && data[0].lon) {
      const { data: tempData } =
        await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}
        `);

      const temp = tempData.main.temp;
      setRealAnswer(temp);
      // if deviation is 5 degrees, set answer to true, if not set false

      const deviation = Math.abs(temp - userAnswer);
      console.log(deviation, "dev");
      if (deviation <= 5) {
        setAnswers([...answers, { [currentStage]: true }]);
      }
      setTimeout(() => {
        setUserAnswer("");
        setDisabled(false);
        setCurrentStage((prev) => (prev === 5 ? 5 : prev + 1));

        setRealAnswer(null);
      }, 3000);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        height: "100%",
        width: "100%",
        placeItems: "center",
      }}
    >
      {currentStage === 5 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Typography
            fontSize={20}
            fontWeight={500}
            sx={{ color: answers.length >= 3 ? "green" : "red", mt: 4 }}
          >
            {answers.length >= 3 ? "Congrats, you won" : "You lost, try again"}
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Try again
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: "20px", md: "unset" },
              top: { xs: "unset", md: "20px" },
              left: "20px",
            }}
          >
            <Typography color={"primary"} fontWeight={500} fontSize={20}>
              {currentStage + 1} / 5
            </Typography>
          </Box>
          {cities && cities[currentStage] && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  padding: "1rem",
                  borderRadius: "10px",
                  mt: 2,
                  boxShadow:
                    "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "300px",
                      md: "400px",
                    },
                    height: {
                      xs: "300px",
                      md: "400px",
                    },
                    "& > img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  }}
                >
                  <img src={cities[currentStage].image} />
                </Box>
                <Typography fontWeight={500} fontSize={18}>
                  {cities[currentStage].city}
                </Typography>

                <TextField
                  required
                  sx={{ mt: 2 }}
                  label="Enter temperature (Celsius)"
                  type="number"
                  value={userAnswer}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  onChange={(e) => {
                    setError(null);
                    setUserAnswer(e.target.value);
                  }}
                  error={!!error}
                  helperText={error}
                />
              </Box>
              {realAnswer && (
                <Box sx={{ mt: 2 }}>
                  <Typography fontSize={18} fontWeight={500} color={"primary"}>
                    The real answer is {realAnswer}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={!!realAnswer || disabled}
                  onClick={() => checkRealTemperature(cities[currentStage])}
                >
                  Submit
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default Quiz;
