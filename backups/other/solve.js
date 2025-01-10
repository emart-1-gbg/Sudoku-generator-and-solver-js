// solver.js

async function solve(x = 0, y = 0) {
    console.log("solving");

    if (x == 9) {
        return await solve(0, y + 1)
    }

    if (y == 9) {
        if (check_solved()) {
            return true
        }
    }

    if (timer != 0) { await delay() }

    let id = give_id(x, y)
    let current_tile = get_tile(id)
    let is_full = read_tile(current_tile) !== ""

    if (is_full) {
        return await solve(x + 1, y)
    }

    for (let n = 1; n < 10; n++) {

        let val = n.toString()

        if (check_valid_placement(id, val)) {
            await update_tile(current_tile, val)
            console.log("updating ", current_tile.id, " to ", val);

            if (await solve(x + 1, y)) {
                return true
            }
            await update_tile(current_tile, "")
            console.log("backtrack");

            if (timer != 0) { await delay() }
        }
    }
    return false
}

function check_valid_placement(id, n) {
    let row = get_row_num(id)
    let col = get_col_num(id)
    let box = get_box_num(id)

    return !row.includes(n) &&
        !col.includes(n) &&
        !box.includes(n)
}

function check_solved() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let id = give_id(x, y)
            let tile = get_tile(id)
            if (read_tile(tile) == "") {
                return false
            }
        }
    }
    console.log("Puzzle complete");
    return true
}

export { solve, check_valid_placement, check_solved };
