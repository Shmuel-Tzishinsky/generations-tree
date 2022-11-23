import { useContext, useEffect, useRef } from "react";

import Style from "../assets/style/canvas.module.css";

import canvasContext from "../context/canvas-context";

function Canvas() {
  const { setContext, setMouseMove, setOnClick, setWheel } = useContext(canvasContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    const parentCanvasNode = ctx.canvas.parentNode;

    ctx.canvas.width = parentCanvasNode.offsetWidth - 20;
    ctx.canvas.height = parentCanvasNode.offsetHeight - 20;

    setContext(ctx);
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className={Style.canvas_container}>
      <canvas ref={canvasRef} onMouseMove={setMouseMove} onClick={setOnClick} onWheel={setWheel} className={Style.canvas}></canvas>
    </div>
  );
}

export default Canvas;
