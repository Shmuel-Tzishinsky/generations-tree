import React from "react";

import Panel from "../components/Panel";
import Canvas from "../components/Canvas";

import Style from "../assets/style/canvas.module.css";

function Tree() {
  return (
    <main className={Style.main}>
      <Panel />
      <Canvas />
    </main>
  );
}

export default Tree;
