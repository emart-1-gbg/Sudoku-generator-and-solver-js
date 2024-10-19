import { solve } from './solver.js';
import { generate, undo } from './generator.js';
import { delay, fill_candidates, clear_grid } from './helpers.js';

// On window load, you can set up the tiles as you originally did
window.onload = function() {
    setupGrid();  // Assuming this is where you set up the grid structure
}

// Attach event listeners for solving or generating Sudoku, e.g.
document.querySelector('#solve-btn').addEventListener('click', async () => {
    await solve();
});

document.querySelector('#generate-btn').addEventListener('click', async () => {
    fill_candidates();
    await generate();
});
