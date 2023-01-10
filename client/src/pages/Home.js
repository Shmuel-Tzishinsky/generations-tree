import React from "react";
import { Link } from "react-router-dom";

import Style from "../style/home.module.css";

function Home() {
  return (
    <div className={Style.home}>
      <h1>Home page</h1>
      <h2>
        Welcome to <Link to="/generations-tree/tree">Tree</Link> app
      </h2>
    </div>
  );
}

export default Home;
