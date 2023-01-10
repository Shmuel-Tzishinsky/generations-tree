import Node from "../class/Node";

export const letsStart = ({ uid = 0, generations, width, height }) => {
  let father = new Node({
    id: generations[0].id,
    name: generations[0].name,
    gender: generations[0].gender,
    born: generations[0].born,
    deceased: generations[0].deceased,
    details: generations[0].details,
    partner: [],
    width,
    height,
  });

  // create the children
  for (let i = 0; i < generations.length; i++) {
    const g = generations[i];

    // if it's the not the first father
    if (i !== 0) {
      let getFather = g.father === father.id ? father : father.getDescendent(g.father);
      let mother = g.mother === father?.partner[0]?.id ? father?.partner[0] : null; // g.mother ? father.getThePartners(g.mother) :
      // console.log(g, getFather);
      getFather?.addChild(
        new Node({
          id: g.id,
          name: g.name,
          gender: g.gender,
          father: getFather,
          born: g.born,
          deceased: g.deceased,
          details: g.details,
          mother: mother,
          width,
          height,
        })
      );
    }
  }

  // create the partners
  for (let i = 0; i < generations.length; i++) {
    const g = generations[i];
    if (g?.gender === "female")
      g?.partner?.forEach(({ id }) => {
        const partner = id === father.id ? father : father.getDescendent(id);
        const getFather = g.father === father.id ? father : father.getDescendent(g.father);
        let mother = g.mother ? father.getThePartners(g.mother) : null;

        partner?.addPartner(
          new Node({
            id: g.id,
            name: g.name,
            gender: g.gender,
            partner: [partner],
            father: getFather,
            born: g.born,
            deceased: g.deceased,
            details: g.details,
            mother: mother,
            width,
            height,
          })
        );
      });
  }

  // console.log(father);

  return {
    node: father,
    lastUid: uid,
  };
};

/* 
  event listener
 */
export const mouseMove = (e, nodeArray, canvas) => {
  let x = e.pageX - canvas.offsetLeft,
    y = e.pageY - canvas.offsetTop;

  for (let i = 0; i < nodeArray.length; i++) {
    if (x > nodeArray[i].xPos && y > nodeArray[i].yPos && x < nodeArray[i].xPos + nodeArray[i].width && y < nodeArray[i].yPos + nodeArray[i].height) {
      canvas.style.cursor = "pointer";
      break;
    } else {
      canvas.style.cursor = "auto";
    }
  }

  return {
    x,
    y,
  };
};

export const onClick = (e, nodeArray, caches, nodeTree) => {
  let x = e.pageX - caches.offsetLeft,
    y = e.pageY - caches.offsetTop,
    currentHuman;

  for (let i = 0; i < nodeArray.length; i++) {
    if (
      !nodeArray[i].select &&
      x > nodeArray[i].xPos &&
      y > nodeArray[i].yPos &&
      x < nodeArray[i].xPos + nodeArray[i].width &&
      y < nodeArray[i].yPos + nodeArray[i].height
    ) {
      nodeArray[i].selected(true);
      currentHuman = nodeArray[i];
    } else {
      nodeArray[i].selected(false);
    }
  }

  return {
    nodeArray,
    currentHuman,
  };
};

// set wheel => zooming the human in canvas
export const setWheelZooming = (e, tree) => {
  let inOrOut,
    width = tree.width,
    height = tree.height;
  // if (!tree || tree?.width < 35 || tree?.width > 200) return;

  if (Math.sign(e.deltaY) !== 1) {
    if (tree.width > 200) return { width, height };
    inOrOut = 1.05;
  } else {
    if (tree.width < 35) return { width, height };
    inOrOut = 0.95;
  }

  width = tree.width *= inOrOut;
  height = tree.height *= inOrOut;

  for (let i = 0; i < tree.children.length; i++) {
    setWheelZooming(e, tree.children[i]);
  }

  for (let i = 0; i < tree.partner.length; i++) {
    if (tree.partner[i].gender === "female") setWheelZooming(e, tree.partner[i]);
  }

  return {
    width,
    height,
  };
};

// Remove child node
export const removeTheNode = (tree) => {
  if (!tree?.father) {
    alert("Removing root node not supported at this time");
    return;
  }
  let children = tree.father.children;
  for (let i = 0; i < children.length; i++) {
    if (children[i].id === tree.id) {
      children.splice(i, 1);
      break;
    }
  }
};

// Remove partner
export const removeThePartner = (tree) => {
  if (!tree?.partner) {
    alert("Removing root node not supported at this time");
    return;
  }
  let partners = tree?.partner?.partner;

  for (let i = 0; i < partners?.length; i++) {
    if (partners[i]?.id === tree?.id) {
      partners.splice(i, 1);
      break;
    }
  }
};

// Add child
export const addTheChild = ({ tree, uid, width, height, name, father, mother, gender, deceased, born, details }) => {
  tree.addChild(
    new Node({
      id: uid++,
      name: name,
      gender: gender,
      father: tree.gender === "male" ? tree : father,
      mother: tree.gender === "female" ? tree : mother,
      born,
      deceased,
      details,
      width,
      height,
    })
  );
  return {
    uid,
  };
};
// Add partner
export const addThePartner = ({ tree, uid, mother, father, width, height, born, deceased, name, gender, details }) => {
  tree.addPartner(
    new Node({
      id: uid,
      name: name,
      gender: gender,
      partner: [tree],
      father: father,
      mother: mother,
      born,
      deceased,
      details,
      width,
      height,
    })
  );

  return {
    uid,
  };
};
