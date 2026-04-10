const mazeInput = document.getElementById('mazeInput');
const targetInput = document.getElementById('targetInput');
const solveButton = document.getElementById('solveButton');
const resetButton = document.getElementById('resetButton');
const grid = document.getElementById('grid');
const message = document.getElementById('message');
const statusValue = document.getElementById('statusValue');
const expressionValue = document.getElementById('expressionValue');
const valueValue = document.getElementById('valueValue');
const pathValue = document.getElementById('pathValue');

const sampleMaze = `7 * 2 * 6 +
- 1 - 2 - 2
3 * 5 + 5 -
- 4 + 9 + 5
2 + 3 + 9 /
+ 9 / 3 * 7`;

let currentMaze = null;

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function parseMaze(text) {
  const rows = text
    .trim()
    .split(/\n+/)
    .map((row) => row.trim().split(/\s+/).filter(Boolean));

  if (rows.length === 0 || rows[0].length === 0) {
    throw new Error('Please provide at least one row and one cell.');
  }

  const width = rows[0].length;
  if (rows.some((row) => row.length !== width)) {
    throw new Error('Every row must contain the same number of cells.');
  }

  for (const row of rows) {
    for (const cell of row) {
      if (!/^[0-9]+$/.test(cell) && !/^[+\-*/]$/.test(cell)) {
        throw new Error(`Invalid cell value: ${cell}`);
      }
    }
  }

  return rows;
}

function evaluateExpression(expr) {
  const numbers = [];
  const ops = [];
  let current = '';

  for (const char of expr) {
    if (/\d/.test(char)) {
      current += char;
      continue;
    }

    if (current === '') {
      throw new Error('Expression cannot contain two operators in a row.');
    }

    numbers.push(Number(current));
    current = '';
    ops.push(char);
  }

  if (current === '') {
    throw new Error('Expression cannot end with an operator.');
  }

  numbers.push(Number(current));

  let result = numbers[0];
  for (let i = 0; i < ops.length; i += 1) {
    const next = numbers[i + 1];
    switch (ops[i]) {
      case '+':
        result += next;
        break;
      case '-':
        result -= next;
        break;
      case '*':
        result *= next;
        break;
      case '/':
        if (next === 0) {
          throw new Error('Division by zero in expression.');
        }
        result /= next;
        break;
      default:
        throw new Error(`Unsupported operator: ${ops[i]}`);
    }
  }

  return result;
}

function solveMaze(maze, target) {
  const rows = maze.length;
  const cols = maze[0].length;

  function dfs(row, col, expr, path) {
    const nextExpr = expr + maze[row][col];
    const nextPath = path.concat([[row, col]]);

    if (row === rows - 1 && col === cols - 1) {
      const value = evaluateExpression(nextExpr);
      if (value === target) {
        return { expression: nextExpr, value, path: nextPath };
      }
      return null;
    }

    if (row + 1 < rows) {
      const down = dfs(row + 1, col, nextExpr, nextPath);
      if (down) {
        return down;
      }
    }

    if (col + 1 < cols) {
      const right = dfs(row, col + 1, nextExpr, nextPath);
      if (right) {
        return right;
      }
    }

    return null;
  }

  return dfs(0, 0, '', []);
}

function renderGrid(maze, solvedPath = []) {
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${maze[0].length}, minmax(0, 1fr))`;

  const pathSet = new Set(solvedPath.map(([row, col]) => `${row}:${col}`));

  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellEl = document.createElement('div');
      cellEl.className = 'cell';
      cellEl.textContent = cell;
      cellEl.setAttribute('role', 'gridcell');
      cellEl.setAttribute('aria-label', `Row ${rowIndex + 1}, column ${colIndex + 1}: ${cell}`);

      if (rowIndex === 0 && colIndex === 0) {
        cellEl.classList.add('start');
      }

      if (rowIndex === maze.length - 1 && colIndex === row.length - 1) {
        cellEl.classList.add('end');
      }

      if (pathSet.has(`${rowIndex}:${colIndex}`)) {
        cellEl.classList.add('path');
      }

      grid.appendChild(cellEl);
    });
  });
}

function resetView() {
  currentMaze = parseMaze(sampleMaze);
  renderGrid(currentMaze);
  statusValue.textContent = 'Waiting';
  expressionValue.textContent = '-';
  valueValue.textContent = '-';
  pathValue.textContent = '-';
  setMessage('Paste a maze and press Solve to find a valid path.');
}

function pathToString(path) {
  return path.map(([row, col]) => `(${row + 1},${col + 1})`).join(' -> ');
}

function handleSolve() {
  try {
    currentMaze = parseMaze(mazeInput.value);
    const target = Number(targetInput.value);

    if (!Number.isFinite(target)) {
      throw new Error('Target must be a valid number.');
    }

    const solved = solveMaze(currentMaze, target);

    if (!solved) {
      renderGrid(currentMaze);
      statusValue.textContent = 'No solution';
      expressionValue.textContent = '-';
      valueValue.textContent = '-';
      pathValue.textContent = '-';
      setMessage('No path matches the target for this maze.', 'error');
      return;
    }

    renderGrid(currentMaze, solved.path);
    statusValue.textContent = 'Solved';
    expressionValue.textContent = solved.expression;
    valueValue.textContent = String(solved.value);
    pathValue.textContent = pathToString(solved.path);
    setMessage('Solution found and highlighted on the grid.', 'success');
  } catch (error) {
    renderGrid(currentMaze ?? parseMaze(sampleMaze));
    statusValue.textContent = 'Error';
    expressionValue.textContent = '-';
    valueValue.textContent = '-';
    pathValue.textContent = '-';
    setMessage(error.message, 'error');
  }
}

solveButton.addEventListener('click', handleSolve);
resetButton.addEventListener('click', () => {
  mazeInput.value = sampleMaze;
  targetInput.value = '6';
  resetView();
});

mazeInput.addEventListener('input', () => {
  setMessage('Maze updated. Solve again to refresh the highlighted path.');
});

targetInput.addEventListener('input', () => {
  setMessage('Target updated. Solve again to refresh the highlighted path.');
});

resetView();