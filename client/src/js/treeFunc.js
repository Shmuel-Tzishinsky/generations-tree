let SPACE_TO_ONE_CHILD;
let SPACE_TO_MORE_THAN_ONE_CHILD;
let SPACE_BETWEEN_BROTHERS;
let SPACE_BETWEEN_SAN_OF_SAN = 20;
let previousLevelTree = []; // right human in each line
let nodesArrayList = []; //for loop pointer event

// // find the left human
const getLeftMost = (tree, level, maxLevel) => {
  if (level >= maxLevel) return tree;
  if (tree.children.length === 0) return null;
  let n = tree.children.length;
  for (let i = 0; i < n; i++) {
    let iChild = tree.children[i];
    let leftmostDescendant = getLeftMost(iChild, level + 1, maxLevel);
    if (leftmostDescendant !== null) return leftmostDescendant;
  }
  return null;
};

// // Makes sure that no one person oversteps the other's position
const apportion = (tree, level) => {
  let firstChild = tree.children[0],
    firstChildLeftNeighbor = firstChild.leftNeighbor,
    j = 1;

  for (let k = 100 - level; firstChild !== null && firstChildLeftNeighbor !== undefined && j <= k; ) {
    let modifierSumRight = 0;
    let modifierSumLeft = 0;
    let rightAncestor = firstChild;
    let leftAncestor = firstChildLeftNeighbor;
    for (let l = 0; l < j; l++) {
      rightAncestor = rightAncestor.father;
      leftAncestor = leftAncestor.father;
      modifierSumRight += rightAncestor.modifier;
      modifierSumLeft += leftAncestor.modifier;
    }
    let totalGap =
      firstChildLeftNeighbor.prelimX +
      modifierSumLeft +
      firstChildLeftNeighbor.width +
      SPACE_BETWEEN_BROTHERS -
      (firstChild.prelimX + modifierSumRight);
    if (totalGap > 0) {
      let subtreeAux = tree;
      let numSubtrees = 0;
      for (; subtreeAux !== null && subtreeAux !== leftAncestor; subtreeAux = subtreeAux.leftNeighbor) {
        numSubtrees++;
      }
      if (subtreeAux !== null) {
        let subtreeMoveAux = tree;
        let singleGap = totalGap / numSubtrees;
        for (; subtreeMoveAux !== leftAncestor; subtreeMoveAux = subtreeMoveAux.leftNeighbor) {
          subtreeMoveAux.prelimX += totalGap + SPACE_BETWEEN_SAN_OF_SAN;
          subtreeMoveAux.modifier += totalGap + SPACE_BETWEEN_SAN_OF_SAN;
          totalGap -= singleGap;
        }
      }
    }
    j++;
    if (!firstChild.children.length) {
      firstChild = getLeftMost(tree, 0, j);
    } else {
      firstChild = firstChild.children[0];
    }
    if (firstChild !== null) {
      firstChildLeftNeighbor = firstChild.leftNeighbor;
    }
  }
};

// // set the prelim
const addPrelim = ({ tree, level }) => {
  tree.prelimX = 0;
  tree.prelimY = 0;
  tree.leftNeighbor = null;
  tree.rightNeighbor = null;
  tree.modifier = 0;
  tree.xPos = 0;
  tree.yPos = 0;

  if (tree.partner.length) {
    for (let i = 0; i < tree.partner.length; i++) {
      const partner = tree.partner[i];
      tree.width += partner.width + SPACE_BETWEEN_BROTHERS;
    }
  }
  tree.leftNeighbor = previousLevelTree[level];
  previousLevelTree[level] = tree;

  let leftSibling = tree.leftNeighbor && tree.leftNeighbor.father === tree.father ? tree.leftNeighbor : undefined;

  if (tree.leftNeighbor) tree.leftNeighbor.rightNeighbor = tree;

  if (leftSibling) tree.prelimX = leftSibling.prelimX + leftSibling.width + SPACE_BETWEEN_BROTHERS;
  else if (!tree.children.length) tree.prelimX = 0;

  if (tree.children.length) {
    // call te function on each child
    for (let i = 0; i < tree.children.length; i++) {
      addPrelim({
        tree: tree.children[i],
        level: level + 1,
      });
    }
    let firstHuman = tree.children[0];
    let lastHuman = tree.children[tree.children?.length - 1];
    let midPoint = firstHuman.prelimX + (lastHuman.prelimX - firstHuman.prelimX + lastHuman.width - tree.width) / 2;
    if (leftSibling) {
      tree.modifier = tree.prelimX - midPoint;
      apportion(tree, level);
    } else {
      tree.prelimX = midPoint;
    }
  }
};
// //  add the position=
const addThePos = ({ tree, level, x, y }) => {
  tree.xPos = tree.prelimX + x;
  tree.yPos = y;

  for (let i = 0; i < tree.partner.length; i++) {
    const par = tree.partner[i];
    tree.width = par.width;
    par.xPos = tree.xPos + (i !== 0 ? 0 : SPACE_BETWEEN_BROTHERS) * i;
    par.yPos = tree.yPos;
    tree.xPos = par.xPos + (SPACE_BETWEEN_BROTHERS + par.width) * (i === 0 ? i + 1 : i);
  }

  if (tree.children.length)
    addThePos({
      tree: tree.children[0],
      level: level + 1,
      x: x + (tree.modifier || 0),
      y: y + tree.height + (tree.children.length > 1 ? SPACE_TO_MORE_THAN_ONE_CHILD : SPACE_TO_ONE_CHILD),
    });

  let rightSibling = tree?.rightNeighbor?.father === tree.father ? tree.rightNeighbor : null;
  if (rightSibling)
    addThePos({
      tree: rightSibling,
      level,
      x,
      y,
    });
};
// align them all according to the main father end mouse position
const alignThePos = ({ tree, x, y }) => {
  tree.xPos += x;
  tree.yPos += y;

  for (let i = 0; i < tree.children?.length; i++) {
    alignThePos({
      tree: tree.children[i],
      x,
      y,
    });
  }
  if (tree.gender !== "female")
    for (let i = 0; i < tree.partner?.length; i++) {
      alignThePos({
        tree: tree.partner[i],
        x,
        y,
      });
    }
};

// draw to canvas
const draw = (tree, c) => {
  nodesArrayList.push(tree);
  c.fillStyle = "black";
  c.font = "15px sans-serif";
  c.font = `${tree.width / 6}px sans-serif`;
  c.fillText(tree.name + " " + tree.id, tree.xPos + tree.width / 2, tree.yPos + tree.height / 2);
  c.fillStyle = tree.gender !== "male" ? "hsl(0deg 100% 50% / 50%)" : "#0a42e3a3";
  c.fillRect(tree.xPos, tree.yPos, tree.width, tree.height);
  if (tree.select) {
    c.strokeStyle = "red";
    c.lineWidth = 1.5;
    c.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
    c.strokeRect(tree.xPos, tree.yPos, tree.width, tree.height);
  }
  if (tree.id === 0) {
    c.beginPath();
    c.moveTo(tree.xPos + tree.width / 2, tree.yPos);
    c.lineTo(tree.xPos + tree.width / 2, tree.yPos + tree.height);
    c.strokeStyle = "red";
    c.lineWidth = 1;
    c.stroke();
  }
  if (tree.gender !== "female")
    for (let i = 0; i < tree.partner?.length; i++) {
      draw(tree.partner[i], c);
    }

  for (let i = 0; i < tree.children?.length; i++) {
    draw(tree.children[i], c);
  }

  // c.strokeRect();
};

function sizing(c) {
  c.fillStyle = "white";

  c.fillRect(0, 0, c.canvas.width, c.canvas.height);

  const cutTime = 20;
  const cutWidthCanvas = c.canvas.width / cutTime;
  const cutHeightCanvas = c.canvas.height / cutTime;
  for (let w = 0; w <= cutTime; w++) {
    c.beginPath();
    c.strokeStyle = "rgb(33 44 48 / 35%)";
    c.fillStyle = "red";
    c.lineWidth = c.canvas.width / 2 === cutWidthCanvas * w || c.canvas.height / 2 === cutHeightCanvas * w ? 1 : 0.5;
    c.moveTo(cutWidthCanvas * w, 0);
    c.lineTo(cutWidthCanvas * w, cutHeightCanvas * cutTime);
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.font = `10px sans-serif`;

    c.fillText((cutWidthCanvas * w).toFixed(1), cutWidthCanvas * w, 20);
    c.moveTo(0, cutHeightCanvas * w);
    c.fillText((cutWidthCanvas * w).toFixed(1), 25, cutHeightCanvas * w);
    c.lineTo(cutWidthCanvas * cutTime, cutHeightCanvas * w);
    c.stroke();
    c.closePath();
  }
}

export const update = ({ ctx, setArrayTree, canvasTree, nodes, x, y }) => {
  SPACE_TO_ONE_CHILD = nodes.height / 3;
  SPACE_TO_MORE_THAN_ONE_CHILD = nodes.height / 2;
  SPACE_BETWEEN_BROTHERS = (nodes.width * 10) / 100;
  previousLevelTree = [];
  nodesArrayList = [];

  addPrelim({
    tree: nodes,
    level: 0,
  });

  addThePos({
    tree: nodes,
    level: 0,
    x: 0,
    y: 0,
  });

  sizing(ctx);

  alignThePos({
    tree: nodes,
    x: (canvasTree.width - nodes.width) / 2 - nodes.xPos,
    y: 50,
  });

  draw(nodes, ctx);

  setArrayTree({
    nodesArrayList,
    uid: nodesArrayList.length,
  });
};
