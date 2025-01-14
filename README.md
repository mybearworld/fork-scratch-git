<picture>
<img alt="" src="./logo.svg" align=right width=100 />
</picture>

<h1>scratch.git</h1>

> Git version control integration for Scratch (TurboWarp) that just works and makes sense

https://github.com/ajskateboarder/scratch-git/assets/81255936/4374d0a8-1d89-4aad-a968-5919a63b6b27

The goals of this interface is to:

- teach children about code versioning through a dead-simple interface
- make it easier to track changes
- make collaboration efficient, relying less on remixing

## Usage

scratch.git works by modifying TurboWarp Desktop through a userscript. Git interfacing is done between the desktop GUI and the local computer through a WebSocket interface between the userscript and a small server.

To get started:

1. Install these things:

- [TurboWarp Desktop](https://desktop.turbowarp.org/)
- [Git](https://git-scm.com) (in case you didn't read the title)

2. Download the scratch.git release for your system from the [Releases section](https://github.com/ajskateboarder/scratch-git/releases)

3. Unpack the zip or tar.gz and run the scratch.git executable - it'll run continuously until you close out the terminal or do Ctrl+C

Congrats, you are now a 🦄✨~ _**1000x** developer_ ~✨🦄, no Git skills required!!

You should now see:

- a welcome dialog to set up a project with scratch.git

- a Git menu to view commits, configure an online repository on GitHub/GitLab/etc, and push the current commits

- diff indicators that show up next to your sprites and stage when you save the project. These will show differences between the code before and after you save.

These features closely mimic the kind of Git development seen in editors such as Visual Studio or VS Code, but in a more friendly manner.

Currently, scratch.git releases are only made for 64-bit Windows, MacOS, and recent Linux versions such as Ubuntu 20.04. Other systems will need to [build from scratch](#developing) for now - contributions for other systems are greatly appreciated!

## Developing

Install the build dependencies:

```bash
npm install
```

And run the debug script (Linux only for now):

```bash
.vscode/debug.sh
```

Alternatively, if you are using VSCode, there is a build task you can configure to run with <kbd>Ctrl+Shift+B</kbd>.

## Commit specification

scratch-git uses a derivative of [Convential Commits](https://www.conventionalcommits.org/en/v1.0.0/) which has been adapted to fit Scratch programming.

Changes are done by sprite and are separated by commas.

Commits start with the name of the sprite you are making changes to (e.g. Sprite1, Stage) with a colon afterwards (similar to CC).

Commits then specify the change they are making using one of the following statements:

| Statement                  | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `add [costumes]`           | The following costumes: `[costumes]` have been added                                 |
| `remove [costumes]`        | The following costumes: `[costumes]` have been removed                               |
| `modify [costumes]`        | The following costumes: `[costumes]` have been edited                                |
| `{+\|-\|/}{blocks} blocks` | `{blocks}` number of blocks have been added (`+`), removed (`-`), or rewritten (`/`) |

### Commit examples

```text
Sprite1: +3 blocks, add costume1, Stage: remove backdrop3
```

```text
Ball: /12 blocks, add red-ball, Stage: add matrix
```

```text
Player: +36 blocks, remove old-player, Cloud: +15 blocks
```

## Credits

Thanks to:

- @apple502j for the [parse-sb3-blocks](https://github.com/apple502j/parse-sb3-blocks) library

- @tjvr for the [scratchblocks](https://github.com/scratchblocks/scratchblocks) library

- @rokcoder-scratch for inspiration, [sb3-commit](https://github.com/rokcoder-scratch/sb3-commit)

- @GarboMuffin for TurboWarp
