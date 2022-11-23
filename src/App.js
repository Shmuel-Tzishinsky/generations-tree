import "./App.css";

import CanvasState from "./context/CanvasState";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <CanvasState>
      <Navbar />
      <Layout />
    </CanvasState>
  );
}

export default App;
