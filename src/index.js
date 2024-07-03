let prog;
let setTextRun;

const app = new rive.Rive({
  src: "./src/wotah.riv",
  artboard: "Artboard",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  stateMachines: "main",
  onLoad: () => {
    app.resizeDrawingSurfaceToCanvas();

    const inputs = app.stateMachineInputs("main");
    prog = inputs.find((i) => i.name === "progress");

    setTextRun = (value) => {
      app.setTextRunValue("progressAmt", value);
    };

    setTextRun("0%");
  },
});

const slider = document.getElementById("slider");
slider.addEventListener("input", (event) => UpdateProgress(event.target.value));

function UpdateProgress(value) {
  if (prog) {
    prog.value = value;
  }

  if (setTextRun) {
    setTextRun(value + "%");
  }
}
