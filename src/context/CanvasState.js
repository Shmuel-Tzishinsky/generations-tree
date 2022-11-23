import { useReducer } from "react";

import CanvasContext from "./canvas-context";
import canvasReducer from "./canvas-reducer";

import * as types from "./canvas-actions";
import { populateDummyData, zoomInClick, zoomOutClick } from "../assets/js/canvasFunction";

import TREE from "../assets/js/tree";

const initialState = {
  ctx: null,
  tree: null,
  nodes: [],
  currNode: null,
  pos: {
    x: 0,
    y: 0,
  },
};

function CanvasState({ children }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const setContext = async (ctx) => {
    TREE.clearTree();
    console.log(TREE);
    TREE.clearTree();
    const fatherTree = await populateDummyData();
    TREE.draw(ctx, fatherTree);

    dispatch({
      type: types.SET_CONTEXT,
      payload: {
        ctx: ctx,
        nodes: TREE.getNodeList(fatherTree),
        tree: fatherTree,
        currNode: fatherTree,
      },
    });
  };

  const setMouseMove = (event) => {
    if (!state.ctx?.canvas) return;
    let x = event.pageX - state.ctx.canvas.offsetLeft,
      y = event.pageY - state.ctx.canvas.offsetTop;

    for (let i = 0; i < state.nodes.length; i++) {
      if (
        x > state.nodes[i].xPos &&
        y > state.nodes[i].yPos &&
        x < state.nodes[i].xPos + state.nodes[i].width &&
        y < state.nodes[i].yPos + state.nodes[i].height
      ) {
        state.ctx.canvas.style.cursor = "pointer";
        break;
      } else {
        state.ctx.canvas.style.cursor = "auto";
      }
    }

    dispatch({
      type: types.MOUSE_MOVE,
      payload: { x, y },
    });
  };

  const setOnClick = (event) => {
    let nodes = state.nodes,
      currNode = state.currNode;

    let x = event.pageX - state.ctx.canvas.offsetLeft,
      y = event.pageY - state.ctx.canvas.offsetTop;

    for (let i = 0; i < state.nodes.length; i++) {
      if (
        x > state.nodes[i].xPos &&
        y > state.nodes[i].yPos &&
        x < state.nodes[i].xPos + state.nodes[i].width &&
        y < state.nodes[i].yPos + state.nodes[i].height
      ) {
        currNode.selected(false);
        nodes[i].selected(true);
        currNode = state.nodes[i];
        TREE.clear(state.ctx);
        TREE.draw(state.ctx, state.tree);
        break;
      }
    }

    dispatch({
      type: types.ON_CLICK,
      payload: {
        nodes,
        currNode,
      },
    });
  };

  const setWheel = (event) => {
    let nodes;
    const delta = Math.sign(event.deltaY);
    if (delta === -1) {
      nodes = zoomInClick(state.nodes, state.ctx, state.tree);
    } else if (delta === 1) {
      nodes = zoomOutClick(state.nodes, state.ctx, state.tree);
    }

    if (!nodes) return;

    dispatch({
      type: types.SET_WHEEL,
      payload: nodes,
    });
  };

  const setZoomIn = () => {
    let nodes = zoomInClick(state.nodes, state.ctx, state.tree);
    if (!nodes) return;

    dispatch({
      type: types.SET_WHEEL,
      payload: nodes,
    });
  };

  const setZoomOut = () => {
    let nodes = zoomOutClick(state.nodes, state.ctx, state.tree);
    if (!nodes) return;

    dispatch({
      type: types.SET_WHEEL,
      payload: nodes,
    });
  };

  const addChild = () => {
    let nodes = state.nodes;
    const name = prompt("מה שם הילד?");
    if (!name) return;

    state.currNode.addChild(TREE.create(name));
    TREE.clear(state.ctx);
    nodes = TREE.getNodeList(state.tree);

    dispatch({
      type: types.ADD_CHILD,
      payload: nodes,
    });
    TREE.draw(state.ctx, state.tree);
  };

  const removeNode = () => {
    let nodes = state.nodes;

    TREE.destroy(state.currNode);
    TREE.clear(state.ctx);
    nodes = TREE.getNodeList(state.tree);
    TREE.draw(state.ctx, state.tree);

    dispatch({
      type: types.REMOVE_NODE,
      payload: nodes,
    });
  };

  const infoPanel = {
    father: state.currNode?.parentTree?.text || "-",
    name: state.currNode?.text || "-",
  };
  const value = {
    ctx: state.ctx,
    pos: state.pos,
    currNode: state.currNode,
    infoPanel,
    setContext,
    setMouseMove,
    setOnClick,
    setWheel,
    setZoomIn,
    setZoomOut,
    addChild,
    removeNode,
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export default CanvasState;
