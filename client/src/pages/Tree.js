import React, { useContext, useState } from "react";

import Panel from "../components/Panel";
import Canvas from "../components/Canvas";

import Style from "../style/canvas.module.css";
import { AddChild, AddPartner, WhichPartner } from "../components/DialogueAddHuman";
import canvasContext from "../context/canvas-context";

function Tree() {
  const { nodeTree, currentHuman, timeline, addChild, removeNode, addPartner, nodesArrayList, removePartner } = useContext(canvasContext);

  const [showAddChild, setShowAddChild] = useState(!1);
  const [showAddPartner, setShowAddPartner] = useState(!1);
  const [showWhichPartner, setShowWhichPartner] = useState(!1);

  const detailsOfForm = (e) => {
    e.preventDefault();
    const data = {};

    Array.from(e.target.elements).forEach((inp) => {
      if (inp.type !== "submit" && inp.type !== "button") {
        data[inp.name.toLowerCase()] = inp.value;
      }
    });

    if (showAddChild) {
      addChild(data);
      setShowAddChild(!1);
    } else if (showWhichPartner) {
      let { name, id, born, deceased, details, father, mother } = nodesArrayList.filter(
        (e) => parseFloat(e.id) === parseFloat(data.selectpartner)
      )[0];

      addPartner({ name, id, born, deceased, details, father, mother });
      setShowWhichPartner(!1);
    } else if (showAddPartner) {
      addPartner(data);
      setShowAddPartner(!1);
    }
  };

  const ifCurrentHuman = (key) => {
    if (!currentHuman) {
      alert("Select human first");
      return;
    }

    switch (key) {
      case "addChild":
        setShowAddChild(!0);
        setShowAddPartner(!1);
        setShowWhichPartner(!1);
        break;
      case "addPartner":
        setShowAddPartner(!0);
        setShowAddChild(!1);
        setShowWhichPartner(!1);
        break;
      case "whichPartner":
        setShowWhichPartner(!0);
        setShowAddPartner(!1);
        setShowAddChild(!1);
        break;
      default:
        throw Error("Unexpected key");
    }
  };

  return (
    <main className={Style.main}>
      <Panel {...{ nodeTree, ifCurrentHuman, currentHuman, timeline, removeNode, removePartner }} />
      <Canvas />
      {showAddChild ? <AddChild {...{ setShowAddChild, detailsOfForm, nodesArrayList, currentHuman }} /> : null}
      {showAddPartner ? <AddPartner {...{ setShowAddPartner, detailsOfForm }} /> : null}
      {showWhichPartner ? <WhichPartner {...{ detailsOfForm, setShowWhichPartner, ifCurrentHuman, nodesArrayList, currentHuman }} /> : null}
    </main>
  );
}

export default Tree;
