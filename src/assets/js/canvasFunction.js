import TREE from "./tree";
import generationsJson from "../json/generations.json";

export function zoomInClick(nodes, ctx, tree) {
  if (tree.width > 200) return;
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].width *= 1.05;
    nodes[i].height *= 1.05;
  }
  TREE.config.width *= 1.05;
  TREE.config.height *= 1.05;
  TREE.clear(ctx);
  TREE.draw(ctx, tree);

  return nodes;
}

export function zoomOutClick(nodes, ctx, tree) {
  if (tree.width < 32) return;
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].width *= 0.95;
    nodes[i].height *= 0.95;
  }
  TREE.config.width *= 0.95;
  TREE.config.height *= 0.95;
  TREE.clear(ctx);
  TREE.draw(ctx, tree);

  return nodes;
}

export async function populateDummyData() {
  let father;

  for (let i = 0; i < generationsJson?.length; i++) {
    if (!generationsJson[i].parents.fatherID) {
      if (i === 0) {
        father = TREE.create(generationsJson[i].name);
      } else {
        // father.addPartner(TREE.create(generationsJson[i].name));
      }
    }
    if (generationsJson[i].parents.fatherID === 1) {
      father.addChild(TREE.create(generationsJson[i].name));
    } else if (generationsJson[i].parents.fatherID) {
      father.getDescendent(generationsJson[i].parents.fatherID - 1).addChild(TREE.create(generationsJson[i].name));
    }
  }

  father.selected(true);
  return father;
}

// const zoomInWheel = (e, nodes, ctx, tree) => {
//   for (let i = 0; i < nodes.length; i++) {
//     nodes[i].width *= 1.05;
//     nodes[i].height *= 1.05;
//     nodes[i].xPos = nodes[i].xPos - e.pageX;
//     nodes[i].yPos = nodes[i].yPos - e.pageY;
//   }
//   TREE.config.width *= 1.05;
//   TREE.config.height *= 1.05;

//   const wheelPos = {
//     x: e.clientX,
//     y: e.clientY,
//   };
//   TREE.clear(ctx);
//   TREE.draw(ctx, tree, wheelPos);
// };

// const zoomOutWheel = (e, nodes, ctx, tree) => {
//   for (let i = 0; i < nodes.length; i++) {
//     nodes[i].xPos = nodes[i].xPos + e.pageX * (ctx.canvas.offsetLeft + 10);
//     nodes[i].yPos = nodes[i].yPos + e.pageY * (ctx.canvas.offsetTop + 10);
//     nodes[i].width = nodes[i].width * 0.95;
//     nodes[i].height = nodes[i].height * 0.95;
//   }
//   TREE.config.width *= 10.95;
//   TREE.config.height *= 10.95;

//   const wheelPos = {
//     x: e.clientX,
//     y: e.clientY,
//   };
//   console.log("🚀 ~ file: canvasResolution.js ~ line 52 ~ zoomOutWheel ~ wheelPos", wheelPos);
//   TREE.clear(ctx);
//   TREE.draw(ctx, tree, wheelPos);
// };
