import * as type from "./canvas-actions";

const canvasReducer = (state, action) => {
  switch (action.type) {
    case type.SET_CONTEXT:
      return {
        ...state,
        ctx: action.payload.ctx,
        treeUid: action.payload.treeUid,
        nodeTree: action.payload.nodeTree,
        tree: action.payload.tree,
        currentHuman: action.payload.currentHuman,
      };
    case type.SET_ARRAY_LIST:
      return {
        ...state,
        treeUid: action.payload.treeUid,
        nodesArrayList: action.payload.nodesArrayList,
      };
    case type.MOUSE_MOVE:
      return {
        ...state,
        posTree: action.payload,
      };
    case type.ON_CLICK:
      return {
        ...state,
        nodesArrayList: action.payload.nodesArrayList,
        nodeTree: action.payload.nodeTree,
        currentHuman: action.payload.currentHuman,
      };
    case type.SET_WHEEL:
      return {
        ...state,
        nodeTree: action.payload.nodeTree,
        treeWidth: action.payload.treeWidth,
        treeHeight: action.payload.treeHeight,
      };

    case type.ADD_CHILD:
      return {
        ...state,
        nodeTree: action.payload.nodeTree,
        treeUid: action.payload.treeUid,
      };

    case type.REMOVE_NODE:
      return {
        ...state,
        nodeTree: action.payload.nodeTree,
        currentHuman: action.payload.currentHuman,
      };

    default:
      throw Error("unsupported action type");
  }
};

export default canvasReducer;
