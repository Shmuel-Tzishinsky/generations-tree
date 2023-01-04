import { useContext, useEffect, useRef } from "react";
import { update } from "../js/treeFunc";

import Style from "../style/canvas.module.css";

import canvasContext from "../context/canvas-context";

function Canvas() {
  const { uid, nodeTree, currentHuman, ctx, setArrayTree, setContext, setMouseMove, setOnClick, setWheel } = useContext(canvasContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const parentCanvasNode = ctx.canvas.parentNode;

    const canvasSize = () => {
      ctx.canvas.width = parentCanvasNode.offsetWidth - 20;
      ctx.canvas.height = parentCanvasNode.offsetHeight - 20;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      setContext(ctx);
    };

    canvasSize();

    window.addEventListener("resize", () => canvasSize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nodeTree) {
      update({
        ctx,
        setArrayTree,
        canvasTree: canvasRef.current,
        nodes: nodeTree,
        x: 0,
        y: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeTree, nodeTree?.width, currentHuman, currentHuman?.children, uid, ctx]);

  return (
    <div className={Style.canvas_container}>
      <canvas ref={canvasRef} onMouseMove={setMouseMove} onClick={setOnClick} onWheel={setWheel} className={Style.canvas}></canvas>
    </div>
  );
}

export default Canvas;
