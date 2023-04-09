import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormCocinero from "./FormCocinero";
import FormMesero from "./FormMesero";

function App() {
      return (
            <Router>
                  <Routes>
                        <Route path="/mesero" exact element={<FormMesero />} />
                        <Route
                              path="/cocinero"
                              exact
                              element={<FormCocinero />}
                        />
                  </Routes>
            </Router>
      );
}

export default App;
