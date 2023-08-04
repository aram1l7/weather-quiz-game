import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Navigate, useNavigate } from "react-router-dom";

function Quiz() {
  const queryClient = useQueryClient();

  const cities = queryClient.getQueryData("cities");
  const navigate = useNavigate();
  useEffect(() => {
    if (!cities) {
      navigate("/");
    }
  }, []);
  return <div>Quiz</div>;
}

export default Quiz;
