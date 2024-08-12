import RiveCanvas from "@rive-app/canvas-advanced";

async function main() {
  const rive = await RiveCanvas({
    locateFile: (_) =>
      "https://unpkg.com/@rive-app/canvas-advanced@2.19.6/rive.wasm",
  });

  const fileBytes = new Uint8Array(
    await (await fetch(new Request("/rebung.riv"))).arrayBuffer()
  );

  const file = await rive.load(fileBytes);

  let nodes = [];
  const decorDivs = document.querySelectorAll(".decor");

  decorDivs.forEach((div) => {
    const bounds = div.getBoundingClientRect();

    const artboard = file.artboardByName("bamboo");
    const animation = new rive.LinearAnimationInstance(
      artboard.animationByName("Timeline 1"),
      artboard
    );
    const timeOffset = Math.random() * 4;

    const node = {
      artboard: artboard,
      animation: animation,
      bounds: bounds,
      timeOffset: timeOffset,
    };

    nodes.push(node);
  });

  const canvas = document.getElementById("canvas");
  const renderer = rive.makeRenderer(canvas);

  function computeSize() {
    const content = document.getElementById("content");
    canvas.width = content.clientWidth;
    canvas.height = content.clientHeight;
  }
  window.onresize = computeSize;
  computeSize();

  let lastTime = 0;

  let firstRun = true;

  function renderLoop(time) {
    if (!lastTime) {
      lastTime = time;
    }
    const elapsedTimeMs = time - lastTime;
    const elapsedTimeSec = elapsedTimeMs / 1000;
    lastTime = time;

    renderer.clear();

    nodes.map((node) => {
      node.animation.advance(firstRun ? node.timeOffset : elapsedTimeSec);
      node.animation.apply(1);
      node.artboard.advance(firstRun ? node.timeOffset : elapsedTimeSec);

      renderer.save();

      renderer.align(
        rive.Fit.contain,
        rive.Alignment.center,
        {
          minX: node.bounds.left,
          minY: node.bounds.top,
          maxX: node.bounds.right,
          maxY: node.bounds.bottom,
        },
        node.artboard.bounds
      );

      node.artboard.draw(renderer);
      renderer.restore();
    });

    firstRun = false;

    rive.requestAnimationFrame(renderLoop);
  }
  rive.requestAnimationFrame(renderLoop);
}

main();
