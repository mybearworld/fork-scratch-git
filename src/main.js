import { showDiffs } from "./diffrenderer";
import initialize from "./initialize";

function main() {
  globalThis.diffs = undefined;
  globalThis.sprites = undefined;

  let addNote = setInterval(async () => {
    try {
      let leHTML = document.querySelector(`.${C.SAVE_STATUS}`).innerHTML;
      if (leHTML.startsWith("<span>")) {
        let span = document.createElement("span");
        span.id = "shortcutNote";
        span.style.opacity = "0.7";
        span.appendChild(document.createTextNode("(Ctrl+Shift+S for commits)"));
        document
          .querySelector(".save-status_save-now_xBhky")
          .parentNode.after(span);
        clearInterval(addNote);
      }
    } catch {}
  }, 500);

  async function initDiffs() {
    await fetch("http://localhost:6969/unzip");

    globalThis.sprites = (
      await (await fetch("http://localhost:6969/sprites")).json()
    ).sprites;

    document.querySelector("#styleChoice").value = "scratch3";

    await showDiffs({ sprite: globalThis.sprites[0] });
  }

  setInterval(async () => {
    try {
      document.querySelector(`.${C.SAVE_STATUS}`).onclick = initDiffs;
      document.onkeydown = async (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "S") {
          await initDiffs();
          document.querySelector("#shortcutNote").remove();
        }
      };
    } catch {}
  }, 500);

  window.onload = initialize;
}

main();
