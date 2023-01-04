const initialTree = {
  treeUid: 0,
  treeWidth: 100,
  treeHeight: 30,
  nodeTree: null,
  nodesArrayList: [], //for loop pointer event
  posTree: { x: 0, y: 0 },
};

const initialLine = {
  nodeLine: null,
};

export const initialState = {
  ctx: null,
  nodes: [],
  currentHuman: null,
  ...initialTree,
  ...initialLine,
};
