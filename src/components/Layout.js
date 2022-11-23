import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Tree from "../pages/Tree";
import NotFound from "./NotFound";

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tree" element={<Tree />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Layout;
