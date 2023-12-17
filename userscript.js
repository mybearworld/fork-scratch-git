/** @typedef {{author: {date: string; email: string; name: string}; body: string; commit: string; subject: string; shortDate: string} Commit */

/** @type {Array.<string>} */
const classNames = [
  ...[...document.styleSheets].map((e) => {
    try {
      return e.cssRules;
    } catch (e) {
      return;
    }
  }),
]
  .filter((e) => e !== undefined)
  .map((e) => Array.from(e))
  .flatMap((e) => e)
  .map((e) => e.selectorText)
  .filter((e) => e !== undefined)
  .map((e) => e.slice(1));

const select = (className) =>
  classNames.filter((e) => e.includes(className))[0];

/**
 * Accessors for parts of the UI
 */
const components = {
  menu: {
    main: select("menu-bar_main-menu"),
    bar: select("menu-bar_menu-bar"),
    position: select("gui_menu-bar-position"),
    item: select("menu-bar_menu-bar-item"),
    accountInfoGroup: select("menu-bar_account-info-group"),
  },
  settingsButton: select("settings-modal_button"),
  saveStatus: select("save-status_save-now"),
};
window.components = components;

// https://stackoverflow.com/a/69122877/16019146
function timeAgo(input) {
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key);
    }
  }
}

class ArrayUtils {
  /**
   * @param {any[]} list
   * @param {any} item
   * @returns {number}
   */
  static count = (list, item) =>
    list.reduce(
      (count, currentValue) => count + (currentValue === item ? 1 : 0),
      0
    );

  /**
   * @param {any[]} oldArray
   * @param {any[]} newArray
   * @returns {any[]}
   */
  static merge(oldArray, newArray) {
    const mergedArray = [...oldArray];

    for (const newItem of newArray) {
      if (!mergedArray.includes(newItem)) {
        mergedArray.push(newItem);
      }
    }

    return mergedArray;
  }

  /**
   * @param {any[]} oldArray
   * @param {any[]} newArray
   * @returns {any[]}
   */
  static diff(oldArray, newArray) {
    const dp = Array.from({ length: oldArray.length + 1 }, () =>
      Array(newArray.length + 1).fill(0)
    );
    const changes = { added: [], removed: [], modified: [] };
    for (let i = 1; i <= oldArray.length; i++)
      for (let j = 1; j <= newArray.length; j++)
        oldArray[i - 1] === newArray[j - 1]
          ? (dp[i][j] = dp[i - 1][j - 1] + 1)
          : (dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]));
    for (let i = oldArray.length, j = newArray.length; i > 0 || j > 0; )
      i > 0 && j > 0 && oldArray[--i] === newArray[--j]
        ? null
        : j === 0 || (i > 0 && dp[i][j] === dp[i - 1][j])
        ? changes.removed.push(oldArray[i])
        : i === 0 || (j > 0 && dp[i][j] === dp[i][j - 1])
        ? changes.added.push(newArray[j])
        : (changes.modified.push({ from: oldArray[i], to: newArray[j] }),
          i--,
          j--);
    changes.added.reverse();
    changes.removed.reverse();
    return changes;
  }
}

// Funny editor "hack" so I don't need htm
const html = (strings, ...values) => {
  let result = strings[0];
  values.forEach((e, i) => {
    result += e + strings[i + 1];
  });
  return result;
};

globalThis.diffs = undefined;
globalThis.sprites = undefined;

class Alert {
  /** @param {{message: string; showTime: number}} */
  constructor({ message, showTime }) {
    this.message = message;
    this.showTime = showTime;
  }

  display() {
    document.querySelector(
      ".alerts_alerts-inner-container_0UOfk"
    ).innerHTML = html`<div
      class="alert_alert_K5u0l alert_success_QZsAp box_box_2jjDp"
      style="justify-content: space-between"
    >
      <div class="alert_alert-message_b1o2e">${message}</div>
      <div class="alert_alert-buttons_qzCdj">
        <div class="alert_alert-close-button-container_sK95e box_box_2jjDp">
          <div
            aria-label="Close"
            class="close-button_close-button_hsJUK alert_alert-close-button_XMbBP close-button_large_UcF64"
            role="button"
            tabindex="0"
          >
            <img
              class="close-button_close-icon_rixGf undefined"
              style="filter: invert(70%)"
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3LjQ4IDcuNDgiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojZmZmO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4O308L3N0eWxlPjwvZGVmcz48dGl0bGU+aWNvbi0tYWRkPC90aXRsZT48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIzLjc0IiB5MT0iNi40OCIgeDI9IjMuNzQiIHkyPSIxIi8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMSIgeTE9IjMuNzQiIHgyPSI2LjQ4IiB5Mj0iMy43NCIvPjwvc3ZnPg=="
            />
          </div>
        </div>
      </div>
    </div>`;
    if (document.querySelector("body").getAttribute("theme") === "dark") {
      document.querySelector(
        ".close-button_close-button_hsJUK"
      ).style.backgroundColor = "rgba(0, 0, 0, 0.255)";
    }
    document.querySelector(".close-button_close-button_hsJUK").onclick =
      this.remove;
    setTimeout(this.remove, showTime);
  }

  remove() {
    document.querySelector(".alerts_alerts-inner-container_0UOfk").innerHTML =
      "";
  }
}

window.onload = () => {
  document.head.innerHTML += html`
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
    />
  `;
  document.head.innerHTML += html`<style>
    #push-status:hover {
      cursor: pointer;
    }
    #allcommits-log:hover {
      cursor: pointer;
    }
    .content {
      display: flex;
    }
    .sidebar {
      width: fit-content;
      position: fixed;
      top: 25%;
      height: 50%;
      padding-right: 5px;
      border-right: 1px solid grey;
      background-color: #e6f0ff;
      overflow: auto;
    }
    .sidebar ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    .sidebar li {
      list-style-type: none;
    }
    .sidebar li button {
      padding: 15px 30px;
      border: 0.5px solid grey;
      background-color: #d9e3f2;
      color: hsla(225, 15%, 40%, 0.75);
      transition: 0.2s background-color ease-in;
      margin-top: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .sidebar li button:hover {
      background-color: #ccd3dd;
    }
    .sidebar li button.active-tab,
    .topbar a.active-tab {
      color: hsla(0, 100%, 65%, 1);
      background-color: white;
      outline: none;
    }
    .blocks {
      flex: 1;
      padding: 20px;
      margin-left: 12.5%;
      margin-top: 30px;
    }
    .bottom {
      margin-top: auto;
    }
    #commitLog,
    #allcommitLog {
      height: 50%;
      max-height: 50%;
      padding: 0;
      width: 50%;
    }
    .bottom-bar {
      position: sticky;
      width: 100%;
      display: flex;
      justify-content: space-between;
      background-color: transparent;
      padding: 10px;
      bottom: 0;
    }
    .bottom-bar select {
      font-size: 14px;
      background-color: hsla(0, 100%, 65%, 1);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
    }
    .tab-btn {
      display: flex;
      align-items: center;
    }
    .tab-btn i {
      font-size: 17px;
      margin-right: 10px;
    }
    .scratchblocks {
      margin-left: 10px;
    }
    .dark {
      background-color: #111;
      color: #eee;
    }
    .dark #scripts li button {
      background-color: rgb(46, 46, 46);
      color: #707070;
    }
    .dark #scripts li button.active-tab {
      background-color: rgb(76, 76, 76);
      color: #eee;
    }

    .commit {
      border: 1px solid grey;
      min-width: 100%;
      padding: 10px 20px;
    }
    .commit-group .commit:first-child {
      border-radius: 5px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .commit-group .commit:not(:first-child) {
      border-top: none;
    }
    .commit-group .commit:last-child {
      border-radius: 5px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
    }

    .topbar {
      background-color: #e6f0ff;
      overflow: hidden;
      position: sticky;
      top: 0;
      display: flex;
      position: absolute;
      margin-left: 135px;
      padding: 10px;
      border-bottom: 1px solid grey;
      width: 100%;
    }

    .topbar a {
      display: inline-block;
      padding: 0 10px;
      color: hsla(225, 15%, 40%, 0.75);
      text-decoration: none;
    }

    .dark .topbar {
      background-color: #111;
    }

    .dark .topbar a {
      color: #707070;
    }

    .dark .topbar a.active-tab {
      color: #eee;
    }

    .pagination {
      display: flex;
      justify-content: center;
    }

    .disabled-funny {
      background-color: hsla(0, 60%, 55%, 1);
      color: rgba(255, 255, 255, 0.4);
      cursor: default;
    }
  </style>`;

  let MENU = `#app > div > div.${components.menu.position}.${components.menu.bar} > div.${components.menu.main}`;
  let SAVE_AREA = `${MENU} > div:nth-child(6)`;

  document.querySelector(SAVE_AREA).innerHTML += html`&nbsp;
    <div class="${components.menu.accountInfoGroup}">
      <div class="${components.menu.item}">
        <div id="push-status">
          <span>Push project</span>
        </div>
      </div>
    </div>`;
  document.querySelector(SAVE_AREA).innerHTML += html`&nbsp;
    <div class="${components.menu.accountInfoGroup}">
      <div class="${components.menu.item}">
        <div id="allcommits-log">
          <span>Commits</span>
        </div>
      </div>
    </div>`;

  document.querySelector(SAVE_AREA).innerHTML += html`<dialog
    id="commitLog"
    style="overflow-x: hidden"
  >
    <div class="content">
      <div class="topbar"></div>
      <div class="sidebar">
        <ul id="scripts"></ul>
        <br />
      </div>
      <div class="blocks">
        <p id="commits">Hello worldus</p>
        <div
          class="bottom-bar"
          style="margin: 0; padding: 0; bottom: 10px; margin-left: 10px;"
        >
          <select onchange="rerender(this.value)" id="styleChoice">
            <option value="scratch3">Scratch 3.0</option>
            <option value="scratch2">Scratch 2.0</option>
            <option value="scratch3-high-contrast">
              Scratch 3.0 (High Contrast)
            </option>
          </select>
          <button
            onclick="document.querySelector('#commitLog').close()"
            class="${components.settingsButton}"
            id="commitButton"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  </dialog>`;

  document.querySelector(SAVE_AREA).innerHTML += html`<dialog
    id="allcommitLog"
    style="overflow-x: hidden"
  >
    <div
      style="
  position: absolute;
  left: 47%;
  transform: translateX(-50%);
  width: 65%;
  "
    >
      <h1>Commits</h1>
      <div class="pagination"></div>
      <br />
      <div class="commit-group"></div>
      <div
        class="bottom-bar"
        style="margin: 0; padding: 0; bottom: 10px; margin-left: 10px;"
      >
        <button
          onclick="document.querySelector('#allcommitLog').close()"
          class="${components.settingsButton}"
          id="commitButton"
        >
          Okay
        </button>
      </div>
    </div>
  </dialog>`;

  const renderCommits = (commits) =>
    (document.querySelector(".commit-group").innerHTML = commits
      .map(
        (e) =>
          html`<div class="commit">
  <span style="font-size: 1rem">${
    e.subject
  }<span><br /><span style="font-size: 0.75rem"
        >${e.author.name} <span style="font-weight: lighter" title="${
            e.author.date
          }">commited ${timeAgo(e.author.date)}</span></span
      >
    </div>`
      )
      .join(""));

  setTimeout(() => {
    document.querySelector("#push-status").onclick = async () => {
      document.querySelector("#push-status").style.opacity = "0.5";
      document.querySelector("#push-status").querySelector("span").innerText =
        "Pushing project...";
      await fetch("http://localhost:6969/push");
      document.querySelector("#push-status").style.opacity = "1";
      document.querySelector("#push-status").querySelector("span").innerText =
        "Push project";
      new Alert({
        message: "Commits pushed successfully",
        showTime: 5000,
      }).display();
    };
    document.querySelector("#allcommits-log").onclick = async () => {
      let offset = 0;
      /** @type {Commit[]} */
      let commits = await (await fetch(`http://localhost:6969/commits`)).json();
      [...commits].forEach(
        (commit, i) =>
          (commits[i].shortDate = commit.author.date.split(" ").slice(0, 4))
      );
      renderCommits(commits.slice(offset, offset + 40));

      document.querySelector(".pagination").innerHTML = html`<button
          class="${components.settingsButton} disabled-funny"
          style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
          id="newer"
        >
          Newer</button
        ><button
          class="${components.settingsButton}"
          style="border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
          id="older"
        >
          Older
        </button>`;
      document.querySelector("#older").onclick = () => {
        if (
          document.querySelector("#older").classList.contains("disabled-funny")
        ) {
          return;
        }
        offset += 40;
        renderCommits(commits.slice(offset, offset + 40));
        if (
          commits
            .slice(offset, offset + 40)
            .includes(commits[commits.length - 1])
        ) {
          document.querySelector("#older").classList.add("disabled-funny");
        }
        if (commits.slice(offset, offset + 40).includes(commits[0])) {
          document.querySelector("#newer").classList.add("disabled-funny");
        } else {
          document.querySelector("#newer").classList.remove("disabled-funny");
        }
      };
      document.querySelector("#newer").onclick = () => {
        if (
          document.querySelector("#newer").classList.contains("disabled-funny")
        ) {
          return;
        }
        offset -= 40;
        renderCommits(commits.slice(offset, offset + 40));
        if (
          !commits
            .slice(offset, offset + 40)
            .includes(commits[commits.length - 1])
        ) {
          document.querySelector("#older").classList.remove("disabled-funny");
        }
        if (commits.slice(offset, offset + 40).includes(commits[0])) {
          document.querySelector("#newer").classList.add("disabled-funny");
        }
      };

      const modal = document.querySelector("#allcommitLog");
      if (!modal.open) {
        modal.showModal();
      }
      document.querySelector("#older").blur();
    };
  }, 500);
};

function parseTheBlocks(oldProject, newProject, scriptNumber) {
  const oldBlocks = parseSB3Blocks.toScratchblocks(
    Object.keys(oldProject).filter((key) =>
      oldProject[key].opcode.startsWith("event_when")
    )[scriptNumber],
    oldProject,
    "en",
    {
      tabs: "",
    }
  );

  const newBlocks = parseSB3Blocks.toScratchblocks(
    Object.keys(newProject).filter((key) =>
      newProject[key].opcode.startsWith("event_when")
    )[scriptNumber],
    newProject,
    "en",
    {
      tabs: "",
    }
  );

  return {
    oldBlocks,
    newBlocks,
  };
}

function rerender(style) {
  const activeButton = parseInt(
    document
      .querySelector("button[class='tab-btn active-tab']")
      .getAttribute("script-no")
  );
  globalThis.diffs[activeButton].renderBlocks(style);
}

class ScriptDiff {
  /** @type {string[]} */
  old;
  /** @type {string[]} */
  new;
  difference;
  /** @type {string[]} */
  merged;
  /** @type {number} */
  scriptNo;
  /** @type {("added" | "removed" | "modified")} */
  status;

  /**
   * @constructor
   * @param {object} oldProject
   * @param {object} newProject
   * @param {number} scriptNumber
   */
  constructor({ oldProject, newProject, scriptNumber, skipParsing = false }) {
    if (!skipParsing) {
      const parsed = parseTheBlocks(oldProject, newProject, scriptNumber);
      this.old = parsed.oldBlocks
        .split("\n")
        .map((item, i) => `${i} ${item.trim()}`);
      this.new = parsed.newBlocks
        .split("\n")
        .map((item, i) => `${i} ${item.trim()}`);
    }
    this.scriptNo = scriptNumber;
    if (!skipParsing) {
      this.difference = ArrayUtils.diff(this.old, this.new);
      this.merged = ScriptDiff.fixCBlocks(ArrayUtils.merge(this.old, this.new));
    }
  }

  /** @param {string[]} merged @returns {string[]}*/
  static fixCBlocks(merged) {
    /** @type {string[]} */
    let mergedNre = merged.map((e) => e.substring(e.indexOf(" ") + 1));
    let cBlockFound = false;
    [...mergedNre].forEach((block, i) => {
      if (block === "forever" || block.startsWith("repeat")) {
        cBlockFound = true;
      }
      if (block === "end" && cBlockFound) {
        mergedNre = mergedNre.filter((e) => e !== mergedNre[i]);
        cBlockFound = false;
      }
    });
    let cBlocksOnly = mergedNre.map((e) => {
      if (e.includes("forever") || e.includes("repeat")) {
        return "cBlock";
      } else if (e.includes("end")) {
        return "end";
      } else {
        return e;
      }
    });
    while (
      ArrayUtils.count(cBlocksOnly, "cBlock") !==
      ArrayUtils.count(cBlocksOnly, "end")
    ) {
      mergedNre.push("end");
      cBlocksOnly.push("end");
    }
    let returned = mergedNre.map((e, i) => `${i} ${e}`);
    return returned;
  }

  /** @returns {boolean} */
  get hasDiffs() {
    return !(
      this.difference.added.length === 0 &&
      this.difference.removed.length === 0 &&
      this.difference.modified.length === 0
    );
  }

  /** @returns {string[]} */
  static events(project) {
    return Object.keys(project).filter((key) =>
      project[key].opcode.startsWith("event_when")
    );
  }

  /** Finds all scripts which have been modified in some way */
  static availableSprites(oldProject, newProject) {
    const _scripts = this.events(oldProject);
    const _newScripts = this.events(newProject);

    const scripts = _scripts.map((e, i) => ({ scriptLoc: e, index: i }));
    const newScripts = _newScripts.map((e, i) => ({ scriptLoc: e, index: i }));

    const modified = scripts.filter((e) => {
      try {
        const oldblocks = parseSB3Blocks.toScratchblocks(
          _scripts[e.index],
          oldProject,
          "en",
          {
            tabs: "",
          }
        );
        const newblocks = parseSB3Blocks.toScratchblocks(
          _newScripts[e.index],
          newProject,
          "en",
          {
            tabs: "",
          }
        );
        return oldblocks !== newblocks;
      } catch {
        console.warn(e);
      }
    });

    const removed = scripts.filter((e) => newScripts[e.index] === undefined);
    const added = newScripts.filter((e) => scripts[e.index] === undefined);

    return {
      modified,
      removed,
      added,
    };
  }

  /** @param {("scratch3" | "scratch3-high-contrast" | "scratch2")} style */
  renderBlocks(style = "scratch3") {
    const code = this.merged
      .map((item) => item.substring(item.indexOf(" ") + 1))
      .join("\n");
    document.querySelector("#commits").innerText = code;

    scratchblocks.renderMatching("#commits", {
      style: style,
      scale: style === "scratch2" ? 1.15 : 0.675,
    });

    let blocks = Array.from(
      document.querySelectorAll(`.scratchblocks-style-${style} g > g path`)
    ).filter((e) => e?.parentElement?.nextElementSibling?.innerHTML !== "then");
    if (style === "scratch2") {
      blocks = blocks.filter((e) => !e.classList.contains("sb-input"));
    }

    let addedC = [...this.difference.added];
    let removedC = [...this.difference.removed];

    // highlight blocks that have been removed in merge
    if (this.status !== "added") {
      // added scripts don't have any removed blocks lol
      this.merged.forEach((item, i) => {
        if (removedC.includes(item)) {
          try {
            removedC = removedC.filter((e) => e !== item);
            const block = blocks[i].cloneNode(true);
            block.style.fill = "red";
            block.style.opacity = "0.5";
            blocks[i].parentElement.appendChild(block);
          } catch {}
        }
      });
    }

    // highlight blocks that have been added in merge
    this.merged.forEach((item, i) => {
      if (addedC.includes(item)) {
        addedC = addedC.filter((e) => e !== item);
        let block;
        try {
          block = blocks[i].cloneNode(true);
        } catch (e) {
          return console.warn(`${e}\n\nFailed to find/parse block ${i}`);
        }
        block.style.fill = "green";
        block.style.opacity = "0.5";
        try {
          blocks[i].parentElement.appendChild(block);
        } catch (e) {
          console.warn(`${e}\n\nFailed to find/parse block ${i}`);
        }
      }
    });

    console.log(addedC);

    // TODO: support more C-blocks (maybe done?)
    if (
      typeof addedC[0] !== "undefined" &&
      (addedC[0].endsWith("forever") || addedC[0].includes("repeat"))
    ) {
      let forevers = blocks.filter((e) => {
        let _text = e.parentElement.querySelector("text").innerHTML;
        return _text === "forever" || _text === "repeat";
      });
      if (forevers.length === 1) {
        let afterForevers = blocks.slice(blocks.indexOf(forevers[0]));
        afterForevers.forEach((block) => {
          let copy = block.cloneNode();
          copy.style.fill = "green";
          copy.style.opacity = "0.5";
          block.parentElement.appendChild(copy);
        });
      } else {
        let lineNo = parseInt(addedC[0].split(" ")[0]);
        let changedForeverBlock = forevers[lineNo - 1] ?? forevers[lineNo - 2];
        let shrek2 = blocks.slice(blocks.indexOf(changedForeverBlock));
        shrek2.forEach((block) => {
          let copy = block.cloneNode();
          copy.style.fill = "green";
          copy.style.opacity = "0.5";
          block.parentElement.appendChild(copy);
        });
      }
    }

    if (this.status === "added") {
      blocks.forEach((block) => {
        let copy = block.cloneNode();
        copy.style.fill = "green";
        copy.style.opacity = "0.5";
        block.parentElement.appendChild(copy);
      });
    }

    // remove duplicate highlights
    const htmls = Array.from(document.querySelectorAll("path[class^='sb3-'"));

    if (addedC.length !== 0) {
      htmls
        .slice(
          htmls.indexOf(htmls.filter((e) => e.style.fill === "red").pop()) + 1
        )
        .forEach((block) => {
          let copy = block.cloneNode();
          copy.style.fill = "green";
          copy.style.opacity = "0.5";
          block.parentElement.appendChild(copy);
        });
    }

    const noDupes = [...new Set(htmls.map((e) => e.outerHTML))];

    const dupesOnly = htmls.filter((e) => !noDupes.includes(e.outerHTML));
    dupesOnly.forEach((element) => element.remove());
  }
}

/**
 * @param {object} oldProject
 * @param {object} newProject
 */
function createDiffs(oldProject, newProject) {
  const changes = ScriptDiff.availableSprites(oldProject, newProject);
  /** @type {{modified: ScriptDiff[]; removed: ScriptDiff[]; added: ScriptDiff[]}} */
  const diffs = {
    modified: [],
    removed: [],
    added: [],
  };
  changes.modified.forEach((e) => {
    const script = new ScriptDiff({
      oldProject: oldProject,
      newProject: newProject,
      scriptNumber: e.index,
    });
    script.status = "modified";
    if (script.hasDiffs) {
      diffs.modified.push(script);
    }
  });
  changes.removed.forEach((e) => {
    const oldBlocks = parseSB3Blocks.toScratchblocks(
      e.scriptLoc,
      oldProject,
      "en",
      {
        tabs: "",
      }
    );
    const script = new ScriptDiff({ skipParsing: true });
    script.old = oldBlocks.split("\n").map((item, i) => `${i} ${item.trim()}`);
    script.new = "".split("\n").map((item, i) => `${i} ${item.trim()}`);
    script.difference = ArrayUtils.diff(script.old, script.new);
    script.merged = ScriptDiff.fixCBlocks(
      ArrayUtils.merge(script.old, script.new)
    );
    script.scriptNo = e.index;
    script.status = "removed";
    diffs.removed.push(script);
  });
  changes.added.forEach((e) => {
    const newBlocks = parseSB3Blocks.toScratchblocks(
      e.scriptLoc,
      newProject,
      "en",
      {
        tabs: "",
      }
    );
    const script = new ScriptDiff({ skipParsing: true });
    script.old = "".split("\n").map((item, i) => `${i} ${item.trim()}`);
    script.new = newBlocks.split("\n").map((item, i) => `${i} ${item.trim()}`);
    script.difference = ArrayUtils.diff(script.old, script.new);
    script.merged = ScriptDiff.fixCBlocks(
      ArrayUtils.merge(script.old, script.new)
    );
    script.scriptNo = e.index;
    script.status = "added";
    diffs.added.push(script);
  });
  return diffs;
}

/**
 * Render diffs from a script from a sprite
 * @param {{sprite: string; script: number?; style: "scratch3" | "scratch3-high-contrast" | "scratch2")}}
 */
async function showDiffs({ sprite, script = 0, style }) {
  await import(
    "https://cdn.jsdelivr.net/npm/parse-sb3-blocks@0.5.0/dist/parse-sb3-blocks.browser.js"
  );
  await import(
    "https://cdn.jsdelivr.net/npm/scratchblocks@latest/build/scratchblocks.min.js"
  );

  const oldProject = await (
    await fetch(`http://localhost:6969/project.old.json?name=${sprite}`)
  ).json();

  const newProject = await (
    await fetch(`http://localhost:6969/project.json?name=${sprite}`)
  ).json();

  const diffs = createDiffs(oldProject, newProject);

  document.querySelector("#scripts").innerHTML = "";
  document.querySelector("#commits").innerHTML = "";

  document.querySelector("#commitButton").onclick = async () => {
    const message = await (await fetch("http://localhost:6969/commit")).text();
    document.querySelector("#commitLog").close();
    new Alert({
      message: `Commit successful. ${message}`,
      showTime: 5000,
    }).display();
  };
  Array.from(Object.values(diffs)).flat(Infinity)[script].renderBlocks(style);

  const modal = document.querySelector("#commitLog");
  if (!modal.open) {
    modal.showModal();
  }

  document.querySelector(".topbar").innerHTML = "";
  globalThis.sprites.forEach((sprite) => {
    let newItem = document.createElement("a");
    newItem.href = "#whatever";
    newItem.appendChild(document.createTextNode(sprite));
    newItem.onclick = async () => {
      document
        .querySelectorAll(".topbar a")
        .forEach((e) => e.classList.remove("active-tab"));
      newItem.classList.add("active-tab");
      await showDiffs({
        sprite: sprite,
        style: document.querySelector("#styleChoice").value,
      });
    };
    document.querySelector(".topbar").appendChild(newItem);
  });

  Array.from(Object.values(diffs))
    .flat(Infinity)
    .forEach((diff, i) => {
      let newItem = document.createElement("li");
      let link = document.createElement("button");
      link.title = diff.status.charAt(0).toUpperCase() + diff.status.slice(1);
      link.classList.add("tab-btn");
      link.setAttribute("script-no", i);
      link.onclick = async () => {
        document
          .querySelectorAll(".tab-btn")
          .forEach((e) => e.classList.remove("active-tab"));
        link.classList.add("active-tab");
        console.log(i);
        await showDiffs({
          sprite: document.querySelector("a.active-tab").innerText,
          script: i,
          style: document.querySelector("#styleChoice").value,
        });
      };
      switch (diff.status) {
        case "added":
          link.innerHTML = `<i class="fa-solid fa-square-plus"></i> Script ${diff.scriptNo}`;
          break;
        case "modified":
          link.innerHTML = `<i class="fa-solid fa-square-minus"></i> Script ${diff.scriptNo}`;
          break;
        case "removed":
          link.innerHTML = `<i class="fa-solid fa-square-xmark"></i> Script ${diff.scriptNo}`;
          break;
      }
      newItem.appendChild(link);
      document.querySelector("#scripts").appendChild(newItem);
    });

  document.querySelectorAll(".tab-btn")[script].classList.add("active-tab");
  document
    .querySelectorAll(".topbar a")
    [globalThis.sprites.indexOf(sprite)].classList.add("active-tab");

  globalThis.diffs = Array.from(Object.values(diffs)).flat(Infinity);
  if (document.querySelector("body").getAttribute("theme") === "dark") {
    document.querySelector(".sidebar").classList.add("dark");
    document.querySelector(".topbar").classList.add("dark");
  } else {
    document.querySelector(".sidebar").classList.remove("dark");
  }
}

let addNote = setInterval(async () => {
  try {
    let leHTML = document.querySelector(`.${components.saveStatus}`).innerHTML;
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

setInterval(async () => {
  try {
    document.querySelector(`.${components.saveStatus}`).onclick =
      theMainFunction;
    document.onkeydown = async (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        await theMainFunction();
        document.querySelector("#shortcutNote").remove();
      }
    };
  } catch {}
}, 500);

async function theMainFunction() {
  await fetch("http://localhost:6969/unzip");

  globalThis.sprites = (
    await (await fetch("http://localhost:6969/sprites")).json()
  ).sprites;

  document.querySelector("#styleChoice").value = "scratch3";
  await showDiffs({ sprite: globalThis.sprites[0] });
}
