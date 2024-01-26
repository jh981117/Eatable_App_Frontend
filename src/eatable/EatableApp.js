import React from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

const EatableApp = () => {
  return (
    <div>
      <Container>
        <Routes>
          <Route path="/" Component={HomePage}></Route>
          <Route path="/home" Component={HomePage}></Route>
        </Routes>
      </Container>
    </div>
  );
};

export default EatableApp;
