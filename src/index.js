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

  const bamboo = file.artboardByName("bamboo");
  const animation = new rive.LinearAnimationInstance(
    bamboo.animationByName("Timeline 1"),
    bamboo
  );

  const canvas = document.getElementById("canvas");
  const renderer = rive.makeRenderer(canvas);

  function computeSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.onresize = computeSize;
  computeSize();

  let lastTime = 0;

  function renderLoop(time) {
    if (!lastTime) {
      lastTime = time;
    }
    const elapsedTimeMs = time - lastTime;
    const elapsedTimeSec = elapsedTimeMs / 1000;
    lastTime = time;

    renderer.clear();

    // Draw stuff
    animation.advance(elapsedTimeSec);
    animation.apply(1);
    bamboo.advance(elapsedTimeSec);

    renderer.save();
    renderer.align(
      rive.Fit.contain,
      rive.Alignment.center,
      {
        minX: 0,
        minY: 0,
        maxX: canvas.width,
        maxY: canvas.height,
      },
      bamboo.bounds
    );

    bamboo.draw(renderer);
    renderer.restore();

    rive.requestAnimationFrame(renderLoop);
  }
  rive.requestAnimationFrame(renderLoop);
}

main();

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// let bamboos = [];

// function SpawnBamboo(num) {
//   for (let i = 0; i < num; i++) {
//     const newBamboo = new rive.Rive({
//       src: "./src/rebung.riv",
//       artboard: "bamboo",
//       canvas: canvas,
//       autoplay: true,
//       onLoad: () => {
//         newBamboo.resizeDrawingSurfaceToCanvas();
//       },
//     });

//     bamboos.push(newBamboo);
//   }
//   drawToMainCanvas();
// }

// function drawToMainCanvas() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   bamboos.forEach(({ canvas }, index) => {
//     // Adjust the position as necessary
//     ctx.drawImage(canvas, index * 50, 0);
//   });

//   requestAnimationFrame(drawToMainCanvas);
// }

// SpawnBamboo(12);

// console.log(bamboos);
