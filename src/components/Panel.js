import { useContext } from "react";

import Style from "../assets/style/canvas.module.css";

import canvasContext from "../context/canvas-context";

function Panel() {
  const { infoPanel, pos, setZoomIn, setZoomOut, addChild, removeNode } = useContext(canvasContext);

  return (
    <div className={Style.control_panel}>
      <div className={Style.title_panel}>Control Panel</div>
      <button className={Style.add_child} onClick={addChild}>
        Add Child
      </button>
      <button className={Style.remove_node} onClick={removeNode}>
        Remove Node
      </button>
      <button className={Style.zoom_in} onClick={setZoomIn}>
        Zoom In
      </button>
      <button className={Style.zoom_out} onClick={setZoomOut}>
        Zoom Out
      </button>

      <div className={Style.information_panel}>
        <ul>
          <li>
            First Name: <span>{infoPanel.name}</span>
          </li>
          <li>
            Father Name: <span>{infoPanel.father}</span>
          </li>
        </ul>
      </div>

      <h2 className={Style.xPos}>xPos: {pos?.x}</h2>
      <h2 className={Style.xPos}>yPos: {pos?.y}</h2>
    </div>
  );
}

export default Panel;
