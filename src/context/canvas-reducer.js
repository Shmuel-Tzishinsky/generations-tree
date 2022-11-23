import * as type from "./canvas-actions";

const canvasReducer = (state, action) => {
  switch (action.type) {
    case type.SET_CONTEXT:
      return {
        ...state,
        ctx: action.payload.ctx,
        nodes: action.payload.nodes,
        tree: action.payload.tree,
        currNode: action.payload.currNode,
      };
    case type.MOUSE_MOVE:
      return {
        ...state,
        pos: action.payload,
      };
    case type.ON_CLICK:
      console.log("On click");
      return {
        ...state,
        nodes: action.payload.nodes,
        currNode: action.payload.currNode,
      };
    case type.SET_WHEEL:
      console.log("Set wheel");
      return {
        ...state,
        nodes: action.payload,
      };

    case type.ADD_CHILD:
      console.log("Add child");
      return {
        ...state,
        nodes: action.payload,
      };

    case type.REMOVE_NODE:
      console.log("Remove node");
      return {
        ...state,
        nodes: action.payload,
      };

    default:
      throw Error("unsupported action type");
  }
};

export default canvasReducer;
