//TREE.js is a library for creating and drawing properly displayed family trees on the HTML canvas element.
//This is a work in progress.

//--------------------------------------------------------------------------------------------------------
let TREE = (() => {
  let uID = 0,
    config = {
      width: 100,
      height: 50,
      color: "black",
      bgColor: "white",
    };
  class Tree {
    constructor(text, parentId, width, height, color, bgColor, treeData) {
      this.uid = uID += 1;
      this.parentId = parentId || -1;
      this.text = text;
      this.width = width || config.width;
      this.height = height || config.height;
      this.color = color || config.color;
      this.bgColor = bgColor || config.bgColor;
      this.treeData = treeData || {};
      this.xPos = 0;
      this.yPos = 0;
      this.prelim = 0;
      this.modifier = 0;
      this.leftNeighbor = null;
      this.rightNeighbor = null;
      this.parentTree = null;
      this.children = [];
    }
    /**
     * Gets the vertical level of the tree.
     * @returns {*} A number representing the vertical level of the tree.
     */
    getLevel() {
      return this.parentId === -1 ? 0 : this.parentTree.getLevel() + 1;
    }
    /**
     * Sets the text color of the tree node.
     * @param color The color to change it to.
     */
    setColor(color) {
      this.color = color;
    }
    /**
     * Sets the background color of the tree node.
     * @param color The color to change it to.
     */
    setBgColor(color) {
      this.bgColor = color;
    }
    /**
     * Visually changes the style of the node if it is 'selected'.
     * @param bool A true or false value representing if node is selected or not.
     */
    selected(bool) {
      if (bool) {
        this.setColor("white");
        this.setBgColor("red");
      } else {
        this.setColor("black");
        this.setBgColor("white");
      }
    }
    /**
     * Returns the number of children of this tree.
     * @returns {Number} The number of children.
     */
    numChildren() {
      return this.children.length;
    }
    /**
     * Returns the left sibling of this tree.
     * @returns {*} The left sibling or null.
     */
    getLeftSibling() {
      return this.leftNeighbor && this.leftNeighbor.parentTree === this.parentTree ? this.leftNeighbor : null;
    }
    /**
     * Returns the right sibling of this tree.
     * @returns {*} The right sibling tree or null.
     */
    getRightSibling() {
      return this.rightNeighbor && this.rightNeighbor.parentTree === this.parentTree ? this.rightNeighbor : null;
    }
    /**
     * Returns the child at a specified index.
     * @param index The specified index.
     * @returns {*} The child if found or null.
     */
    getChildAt(index) {
      return this.children[index];
    }
    /**
     * Searches children and returns a tree by UID.
     * @param id The UID to search for.
     * @returns {*} The child if found or null.
     */
    getChild(id) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].uid === id) {
          return this.children[i];
        }
      }
    }
    /**
     * Returns an X value representing the center location of all this tree's children.
     * @returns {*} The center X value.
     */
    getChildrenCenter() {
      let firstChild = this.getFirstChild(),
        lastChild = this.getLastChild();
      return firstChild.prelim + (lastChild.prelim - firstChild.prelim + lastChild.width) / 2;
    }
    /**
     * Return the first child of this tree.
     * @returns {Object} The child node.
     */
    getFirstChild() {
      return this.getChildAt(0);
    }
    /**
     * Gets the last child of this tree.
     * @returns {Object} The child node.
     */
    getLastChild() {
      return this.getChildAt(this.numChildren() - 1);
    }
    /**
     * Adds a tree node to the children to this tree.
     * @param tree The tree to be added.
     */
    addChild(tree) {
      tree.parentTree = this;
      tree.parentId = this.uid;
      this.children.push(tree);
      return;
    }

    addPartner(tree) {
      tree.parentTree = this;
      tree.parentId = this.uid;
      this.children.push(tree);
      return;
    }
    /**
     * Find and return a descendant by the UID.
     * @param id The UID to search for.
     * @returns {*} The found tree node or null if not found.
     */
    getDescendent(id) {
      let children = this.children;
      let found;
      if (this.getChild(id)) {
        return this.getChild(id);
      } else {
        for (let i = 0; i < children.length; i++) {
          found = children[i].getDescendent(id);
          if (found) {
            return found;
          }
        }
      }
    }
  }

  return {
    maxPrelim: 0,
    maxWidth: config.width,
    config: config,

    clearTree: function () {
      uID = 0;
      let newConfig = {
        width: 100,
        height: 50,
        color: "black",
        bgColor: "white",
      };

      config = newConfig;
      TREE.config = newConfig;
    },
    /**
     * Create and return a new tree.
     * @constructor
     * @param text The textual representation of the tree.
     * @returns {Tree} The newly created tree.
     */
    create: function (text) {
      return new Tree(text);
    },

    /**
     * Removes a tree from it's parents list of children. This effectively removes the tree and all of its
     * descendants from an existing tree.
     * @param tree The tree to be removed.
     */
    destroy: function (tree) {
      if (!tree.parentTree) {
        alert("Removing root node not supported at this time");
        return;
      }
      let children = tree.parentTree.children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].uid === tree.uid) {
          children.splice(i, 1);
          break;
        }
      }
    },

    /**
     * Get an array of all nodes in a tree.
     * @param tree The tree.
     * @returns {Array} An array of tree nodes.
     */
    getNodeList: function (tree) {
      let nodeList = [];
      nodeList.push(tree);
      for (let i = 0; i < tree.numChildren(); i++) {
        nodeList = nodeList.concat(this.getNodeList(tree.getChildAt(i)));
      }
      return nodeList;
    },

    /**
     * Clears the canvas.
     * @param ctx The 2-d ctx of an html canvas element.
     */
    clear: function (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },

    /**
     * Draws a well-formed tree on a canvas.
     * @param ctx The 2-d ctx of a canvas html element.
     * @param tree The tree that will be drawn.
     */
    draw: function (ctx, tree) {
      let config = {
          maxDepth: 100,
          levelSeparation: 40,
          siblingSeparation: 20,
          subtreeSeparation: 20,
          topXAdjustment: 0,
          topYAdjustment: 20,
        },
        maxLevelHeight = [],
        maxLevelWidth = [],
        previousLevelTree = [],
        rootXOffset = 0,
        rootYOffset = 0,
        /**
         * Saves the height of a tree at a specified level.
         * @param tree The tree.
         * @param level The current vertical level of the tree.
         */
        setLevelHeight = function (tree, level) {
          maxLevelHeight[level] = tree.height;
        },
        /**
         * Saves the width of a tree at a specified level.
         * @param tree The tree.
         * @param level The current vertical level of the tree.
         */
        setLevelWidth = function (tree, level) {
          maxLevelWidth[level] = tree.width;
        },
        /**
         * Sets the neighbors of the tree.
         * @param tree The specified tree
         * @param level The vertical level of the tree.
         */
        setNeighbors = function (tree, level) {
          tree.leftNeighbor = previousLevelTree[level];
          if (tree.leftNeighbor) tree.leftNeighbor.rightNeighbor = tree;
          previousLevelTree[level] = tree;
        },
        /**
         * Returns the leftmost descendant of the tree.
         * @param tree The specified tree.
         * @param level The vertical level of the tree.
         * @param maxLevel The maximum level in which to stop searching.
         * @returns {*} The leftmost descendant if found, or null.
         */
        getLeftMost = function (tree, level, maxLevel) {
          if (level >= maxLevel) return tree;
          if (tree.numChildren() === 0) return null;
          let n = tree.numChildren();
          for (let i = 0; i < n; i++) {
            let iChild = tree.getChildAt(i);
            let leftmostDescendant = getLeftMost(iChild, level + 1, maxLevel);
            if (leftmostDescendant !== null) return leftmostDescendant;
          }
          return null;
        },
        /**
         * Gets the width of the tree.
         * @param tree The specified tree.
         * @returns {number} The width of the tree.
         */
        getNodeSize = function (tree) {
          return tree.width;
        },
        /**
         * Part of the first traversal of the tree for positioning. Smaller subtrees that could float between
         * two adjacent larger subtrees are evenly spaced out.
         * @param tree
         * @param level
         */
        apportion = function (tree, level) {
          let firstChild = tree.getFirstChild(),
            firstChildLeftNeighbor = firstChild.leftNeighbor,
            j = 1;
          for (let k = config.maxDepth - level; firstChild !== null && firstChildLeftNeighbor !== undefined && j <= k; ) {
            let modifierSumRight = 0;
            let modifierSumLeft = 0;
            let rightAncestor = firstChild;
            let leftAncestor = firstChildLeftNeighbor;
            for (let l = 0; l < j; l++) {
              rightAncestor = rightAncestor.parentTree;
              leftAncestor = leftAncestor.parentTree;
              modifierSumRight += rightAncestor.modifier;
              modifierSumLeft += leftAncestor.modifier;
            }
            let totalGap =
              firstChildLeftNeighbor.prelim +
              modifierSumLeft +
              getNodeSize(firstChildLeftNeighbor) +
              config.subtreeSeparation -
              (firstChild.prelim + modifierSumRight);

            if (totalGap > 0) {
              let subtreeAux = tree;
              let numSubtrees = 0;
              for (; subtreeAux !== null && subtreeAux !== leftAncestor; subtreeAux = subtreeAux.getLeftSibling()) {
                numSubtrees++;
              }
              if (subtreeAux !== null) {
                let subtreeMoveAux = tree;
                let singleGap = totalGap / numSubtrees;
                for (; subtreeMoveAux !== leftAncestor; subtreeMoveAux = subtreeMoveAux.getLeftSibling()) {
                  subtreeMoveAux.prelim += totalGap;
                  subtreeMoveAux.modifier += totalGap;
                  totalGap -= singleGap;
                }
              }
            }
            j++;
            if (parseFloat(firstChild.numChildren()) === 0) {
              firstChild = getLeftMost(tree, 0, j);
            } else {
              firstChild = firstChild.getFirstChild();
            }
            if (firstChild !== null) {
              firstChildLeftNeighbor = firstChild.leftNeighbor;
            }
          }
        },
        /**
         * A postOrder traversal of the tree. Each subtree is manipulated recursively from the bottom to top
         * and left to right, positioning the rigid units that form each subtree until none are touching each
         * other. Smaller subtrees are combined, forming larger subtrees until the root has been reached.
         * @param tree
         * @param level
         */
        firstWalk = function (tree, level) {
          let leftSibling = null;
          tree.xPos = 0;
          tree.yPos = 0;
          tree.prelim = 0;
          tree.modifier = 0;
          tree.leftNeighbor = null;
          tree.rightNeighbor = null;
          setLevelHeight(tree, level);
          setLevelWidth(tree, level);
          setNeighbors(tree, level);
          if (tree.numChildren() === 0 || parseFloat(level) === parseFloat(config.maxDepth)) {
            leftSibling = tree.getLeftSibling();
            if (leftSibling !== null) tree.prelim = leftSibling.prelim + getNodeSize(leftSibling) + config.siblingSeparation;
            else tree.prelim = 0;
          } else {
            let n = tree.numChildren();
            for (let i = 0; i < n; i++) {
              firstWalk(tree.getChildAt(i), level + 1);
            }
            let midPoint = tree.getChildrenCenter();
            midPoint -= getNodeSize(tree) / 2;
            leftSibling = tree.getLeftSibling();
            if (leftSibling) {
              tree.prelim = leftSibling.prelim + getNodeSize(leftSibling) + config.siblingSeparation;
              tree.modifier = tree.prelim - midPoint;
              apportion(tree, level);
            } else {
              tree.prelim = midPoint;
            }
          }
        },
        /**
         * A preOrder traversal. Each node is given it's final X,Y coordinates by summing the preliminary
         * coordinate and the modifiers of all of its ancestor trees.
         * @param tree The tree that will be traversed.
         * @param level The vertical level of the tree.
         * @param X The X value of the tree.
         * @param Y The Y value of the tree.
         */
        secondWalk = (tree, ctx, level, X, Y) => {
          // Set the max prelim in all nodes
          if (tree.prelim > this.maxPrelim) {
            this.maxPrelim = tree.prelim;
          }

          if (tree.width > this.maxWidth) this.maxWidth = tree.width;

          let firstWidth = this.maxWidth - tree.width;
          tree.xPos = rootXOffset + tree.prelim + X + (ctx.canvas.width - this.maxPrelim - tree.width) / 2 + firstWidth;
          if (tree.text === "אדם") {
            console.log("🚀 ~ file: tree.js ~ line 416 ~ TREE ~ this.maxWidth", this.maxWidth);
            // console.log("tree.text: ", tree.text);
            // console.log("rootXOffset: ", rootXOffset);
            // console.log("tree.prelim: ", tree.prelim);
            // console.log("X: ", X);
            // console.log("ctx.canvas.width: ", ctx.canvas.width);
            // console.log("this.maxPrelim: ", this.maxPrelim);
            console.log("this.maxWidth: ", this.maxWidth);
            console.log("tree.width: ", tree.width);
            // console.log("tree.xPos: ", tree.xPos);
            // console.log("--------------");
            // console.log("--------------");
            console.log("--------------");
          }
          tree.yPos = rootYOffset + Y;
          if (tree.numChildren())
            secondWalk(tree.getFirstChild(), ctx, level + 1, X + tree.modifier, Y + maxLevelHeight[level] + config.levelSeparation);
          let rightSibling = tree.getRightSibling();
          if (rightSibling) secondWalk(rightSibling, ctx, level, X, Y);
        },
        /**
         * Assign X,Y position values to the tree and it's descendants.
         * @param tree The tree to be positioned.
         */
        positionTree = function (tree, ctx) {
          maxLevelHeight = [];
          maxLevelWidth = [];
          previousLevelTree = [];
          firstWalk(tree, 0);
          rootXOffset = config.topXAdjustment + tree.xPos;
          rootYOffset = config.topYAdjustment + tree.yPos;
          secondWalk(tree, ctx, 0, 0, 0);
          rootXOffset = Math.abs(getMinX(tree)); //Align to left
          secondWalk(tree, ctx, 0, 0, 0);
        },
        getMinX = function (tree) {
          let nodes = TREE.getNodeList(tree);
          let min = 0;
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].xPos < min) min = nodes[i].xPos;
          }
          return min;
        },
        /**
         * Draw the tree and it's descendants on the canvass.
         * @param tree The tree that will be drawn.
         */
        drawNode = function (tree) {
          let x = tree.xPos,
            y = tree.yPos,
            width = tree.width,
            height = tree.height,
            text = tree.text;
          ctx.beginPath();

          const radius = 7;

          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y + height, x + width, y + height, radius);
          ctx.lineTo(x + width - radius, y + height);
          ctx.arcTo(x + width, y + height, x + width, y, radius);
          ctx.lineTo(x + width, y + radius);
          ctx.arcTo(x + width, y, x, y, radius);
          ctx.lineTo(x + radius, y);
          ctx.arcTo(x, y, x, y + height, radius);
          ctx.lineWidth = 1;

          ctx.fillStyle = tree.bgColor;

          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = tree.color;

          // console.log(width, textWidth);

          ctx.font = `${width / 4.5}px sans-serif`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillText(text, x + width / 2, y + height / 2);
          ctx.strokeStyle = "black";
          if (tree.children.length > 0) {
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y + height);
            ctx.lineTo(x + width / 2, y + height + config.levelSeparation / 2);
            // Left line
            ctx.arcTo(
              tree.getFirstChild().xPos + tree.getFirstChild().width / 2,
              y + height + config.levelSeparation / 2,
              tree.getFirstChild().xPos + tree.getFirstChild().width / 2,
              y + height + config.levelSeparation / 2 + 20,
              5
            );
            ctx.stroke();
            ctx.closePath();
            // Right line
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y + height + config.levelSeparation / 2);
            ctx.arcTo(
              tree.getLastChild().xPos + tree.getLastChild().width / 2,
              y + height + config.levelSeparation / 2,
              tree.getLastChild().xPos + tree.getLastChild().width / 2,
              y + height + config.levelSeparation / 2 + 20,
              5
            );
            ctx.stroke();
            ctx.closePath();
          }

          if (tree.children.length > 1) {
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y + height + config.levelSeparation / 2);
            ctx.fillStyle = "white";
            ctx.lineWidth = 3;
            ctx.arc(x + width / 2, y + height + config.levelSeparation / 2, 5, Math.PI * 2, false);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
          }

          if (parseFloat(tree.parentId) !== -1) {
            const getBrothersId = tree.parentTree.children?.map((bro) => bro.uid);
            ctx.beginPath();
            ctx.moveTo(x + width / 2, y);
            ctx.lineTo(x + width / 2, y - config.levelSeparation / 2 + 5);
            ctx.stroke();
            if (tree.uid !== getBrothersId[0] && tree.uid !== getBrothersId[getBrothersId.length - 1]) {
              ctx.beginPath();
              ctx.moveTo(x + width / 2 + 5, y - config.levelSeparation / 2);
              ctx.strokeStyle = "rgb(100 100 100)";
              ctx.fillStyle = "white";
              ctx.lineWidth = 2;
              ctx.arc(x + width / 2, y - config.levelSeparation / 2, 5, Math.PI * 2, false);
              ctx.fill();
              ctx.stroke();
              ctx.lineWidth = 1;
            } else if (getBrothersId.length === 1) {
              ctx.beginPath();
              ctx.moveTo(x + width / 2, y - config.levelSeparation / 2 + 5);
              ctx.lineTo(x + width / 2, y - config.levelSeparation / 2);
              ctx.stroke();
            }
            ctx.strokeStyle = "black";
          }
          for (let i = 0; tree.numChildren() > 0 && i < tree.numChildren(); i++) {
            drawNode(tree.getChildAt(i));
          }
        };

      positionTree(tree, ctx);
      this.clear(ctx);

      const cutTime = 20;
      const cutWidthCanvas = ctx.canvas.width / cutTime;
      const cutHeightCanvas = ctx.canvas.height / cutTime;
      for (let w = 0; w <= cutTime; w++) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "red";
        ctx.lineWidth = ctx.canvas.width / 2 === cutWidthCanvas * w || ctx.canvas.height / 2 === cutHeightCanvas * w ? 1 : 0.5;
        ctx.moveTo(cutWidthCanvas * w, 0);
        ctx.lineTo(cutWidthCanvas * w, cutHeightCanvas * cutTime);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = `10px sans-serif`;

        ctx.fillText(cutWidthCanvas * w, cutWidthCanvas * w, 10);
        ctx.moveTo(0, cutHeightCanvas * w);
        ctx.fillText(cutWidthCanvas * w, 10, cutHeightCanvas * w);
        ctx.lineTo(cutWidthCanvas * cutTime, cutHeightCanvas * w);
        ctx.stroke();
        ctx.closePath();
      }
      drawNode(tree);
    },
  };
})();

export default TREE;
