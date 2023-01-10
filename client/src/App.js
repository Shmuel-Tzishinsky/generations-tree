import "./App.css";

import CanvasState from "./context/CanvasState";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <CanvasState>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </CanvasState>
  );
}

export default App;
