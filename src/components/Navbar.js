import React from "react";
import { Link } from "react-router-dom";

import Style from "../assets/style/navbar.module.css";

function Navbar() {
  return (
    <nav className={Style.nav}>
      <Link to="/">Home</Link>
      <Link to="/tree">Tree</Link>
    </nav>
  );
}

export default Navbar;
