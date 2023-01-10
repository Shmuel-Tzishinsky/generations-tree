import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Tree from "./pages/Tree";
import NotFound from "./components/NotFound";

function Router() {
  return (
    <Routes>
      <Route path="/generations-tree" element={<Home />} />
      <Route path="/generations-tree/tree/" element={<Tree />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
