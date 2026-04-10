# MathMaze Solver

Static front-end for solving a MathMaze puzzle in the browser.

## What it does

- Accepts a maze pasted as rows of space-separated tokens
- Solves the maze using the same right/down DFS rule as the Java version
- Evaluates expressions left to right
- Highlights the solved path in a dark responsive UI

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server.

## Deploy to GitHub Pages

1. Push these files to your repository.
2. In GitHub, open the repository settings.
3. Go to Pages.
4. Set the source branch to the branch containing `index.html`.
5. Save and wait for GitHub Pages to publish the site.

## Input format

Each row goes on its own line. Separate cells with spaces.

Example:

```text
7 * 2 * 6 +
- 1 - 2 - 2
3 * 5 + 5 -
- 4 + 9 + 5
2 + 3 + 9 /
+ 9 / 3 * 7
```
