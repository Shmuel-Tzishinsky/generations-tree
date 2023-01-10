import { useReducer } from "react";

import { initialState } from "./initialState";
import CanvasContext from "./canvas-context";
import canvasReducer from "./canvas-reducer";

import * as types from "./canvas-actions";

import generations from "../json/generations.json";
import { addTheChild, addThePartner, letsStart, mouseMove, onClick, removeTheNode, removeThePartner, setWheelZooming } from "../js/canvasTreeFunc";

function CanvasState({ children }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const setContext = async (ctx) => {
    const { node, lastUid } = letsStart({
      uid: state.uid,
      generations: generations,
      width: state.treeWidth,
      height: state.treeHeight,
    });
    dispatch({
      type: types.SET_CONTEXT,
      payload: {
        ctx: ctx,
        treeUid: lastUid,
        nodeTree: node,
        tree: null,
        currentHuman: null,
      },
    });
  };

  const setArrayTree = ({ nodesArrayList, uid }) => {
    dispatch({
      type: types.SET_ARRAY_LIST,
      payload: {
        nodesArrayList,
        treeUid: uid || state.treeUid,
      },
    });
  };

  const setMouseMove = (e) => {
    if (!state.nodeTree) return;
    const pos = mouseMove(e, state.nodesArrayList, state.ctx?.canvas);

    dispatch({
      type: types.MOUSE_MOVE,
      payload: pos,
    });
  };

  const setOnClick = (e) => {
    const { nodeArray, currentHuman } = onClick(e, state.nodesArrayList, state.ctx.canvas, state.nodeTree);
    dispatch({
      type: types.ON_CLICK,
      payload: {
        nodesArrayList: nodeArray,
        nodeTree: state.nodeTree,
        currentHuman: currentHuman,
      },
    });
  };

  const setWheel = (e) => {
    const { width, height } = setWheelZooming(e, state.nodeTree);

    dispatch({
      type: types.SET_WHEEL,
      payload: {
        nodeTree: state.nodeTree,
        treeWidth: width,
        treeHeight: height,
      },
    });
  };

  const addChild = ({ name, father, mother, gender, deceased, born, details }) => {
    const { uid } = addTheChild({
      tree: state.currentHuman,
      uid: state.treeUid,
      width: state.treeWidth,
      height: state.treeHeight,
      name,
      father,
      mother,
      gender,
      deceased,
      details,
      born,
    });

    dispatch({
      type: types.ADD_CHILD,
      payload: {
        nodeTree: state.nodeTree,
        treeUid: uid,
      },
    });
  };

  const addPartner = ({ id, name, father, mother, born, deceased, details }) => {
    const { uid } = addThePartner({
      tree: state.currentHuman,
      uid: !id ? state.treeUid++ : id,
      width: state.treeWidth,
      height: state.treeHeight,
      name,
      father,
      mother,
      born,
      deceased,
      details,
      gender: state.currentHuman.gender === "male" ? "female" : "male",
    });

    dispatch({
      type: types.ADD_CHILD,
      payload: {
        nodeTree: state.nodeTree,
        treeUid: id ? state.treeUid : uid,
      },
    });
  };

  const removeNode = () => {
    removeTheNode(state.currentHuman);

    dispatch({
      type: types.REMOVE_NODE,
      payload: {
        nodeTree: state.nodeTree,
        currentHuman: null,
      },
    });
  };

  const removePartner = () => {
    removeThePartner(state.currentHuman);
    dispatch({
      type: types.REMOVE_NODE,
      payload: {
        nodeTree: state.nodeTree,
        currentHuman: null,
      },
    });
  };

  const value = {
    uid: state.treeUid,
    ctx: state.ctx,
    pos: state.pos,
    currentHuman: state.currentHuman,
    nodeTree: state.nodeTree,
    nodesArrayList: state.nodesArrayList,
    setContext,
    setArrayTree,
    setMouseMove,
    setOnClick,
    setWheel,
    addChild,
    removeNode,
    addPartner,
    removePartner,
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export default CanvasState;
