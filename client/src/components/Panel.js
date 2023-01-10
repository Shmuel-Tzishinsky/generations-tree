import { Link } from "react-router-dom";
import { saveTheTree } from "../class/SaveThrTree";

import Style from "../style/canvas.module.css";
import { arrowLeft } from "../assets/svg/arrow-left";

function Panel({ nodeTree, ifCurrentHuman, currentHuman, timeline, removeNode, removePartner }) {
  return (
    <div className={Style.control_panel}>
      <div className={Style.container_headers}>
        <div className={Style.title_panel}>Control Panel</div>
        <button className={`${Style.btn} d ${currentHuman ? Style.select_human : ""}`} onClick={timeline}>
          Timeline
        </button>
        <button className={`${Style.btn} ${currentHuman ? Style.select_human : ""}`} onClick={() => ifCurrentHuman("addChild")}>
          Add Child
        </button>
        <button className={`${Style.btn} ${currentHuman ? Style.select_human : ""}`} onClick={removeNode}>
          Remove Node
        </button>
        <button className={`${Style.btn} ${currentHuman ? Style.select_human : ""}`} onClick={() => ifCurrentHuman("whichPartner")}>
          Add partner
        </button>
        <button className={`${Style.btn} ${currentHuman ? Style.select_human : ""}`} onClick={removePartner}>
          Remove partner
        </button>
        <button style={{ marginTop: "40px" }} className={Style.btn} onClick={() => saveTheTree.save(nodeTree)}>
          Save the tree
        </button>
      </div>

      <div className={Style.back_to_home_page}>
        <Link to="/generations-tree/">
          <span>{arrowLeft()}</span>
          <span> Home</span>
        </Link>
      </div>
    </div>
  );
}

export default Panel;
