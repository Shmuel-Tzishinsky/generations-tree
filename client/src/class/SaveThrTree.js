class SaveTheTree {
  constructor() {
    this.node = {};
    this.newTree = [];
  }

  loopTheNode(tree) {
    const { id, name, born = 0, gender, partner, children, father, mother, deceased = 0, details } = tree;

    this.newTree.push({
      id,
      name,
      born,
      gender,
      partner: typeof partner === "object" ? partner?.map((par) => ({ id: par.id, name: par.name })) || null : null,
      father: father ? father?.id : null, // The father can be id 0 which is equal to false
      mother: mother?.id || null,
      details: details,
      deceased,
    });

    for (let i = 0; i < children.length; i++) {
      this.loopTheNode(children[i]);
    }
    if (tree.gender !== "female")
      for (let i = 0; i < partner?.length; i++) {
        if (!partner.father && !partner.mother) {
          this.loopTheNode(partner[i]);
        }
      }
  }

  async sendToServer() {
    try {
      const fetchData = await fetch("http://localhost:3500/saveTheTree", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.newTree, null, 2),
      });
      await fetchData.json();
    } catch (error) {
      console.log(error);
    }
  }

  save(node) {
    this.node = node;
    this.newTree = [];
    this.loopTheNode(node);
    console.log(this.newTree);

    this.sendToServer();
  }
}

export const saveTheTree = new SaveTheTree();
