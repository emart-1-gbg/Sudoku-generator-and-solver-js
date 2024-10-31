
const delayOutput = document.querySelector("#delay-output");
const delaySlider = document.querySelector("#delay-slider");
let timer = 0
delaySlider.value = timer

delayOutput.textContent = delaySlider.value * 10
delaySlider.addEventListener("input", (event) => {
    delayOutput.textContent = event.target.value * 10; // Multiply by 10 for ms display
    timer = delaySlider.value * 10
});

const grid = document.getElementById("grid")
const test_file = "test_puzzles/hard.txt"

// set the tiles and design
window.onload = async function () {
    console.log("laod")

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let tile = document.createElement("div")
            tile.id = give_id(x, y)
            tile.classList.add("tile")
            grid.appendChild(tile)

            if (y == 2 || y == 5) {
                tile.classList.add("horisontal_line")
            }

            if (x == 2 || x == 5) {
                tile.classList.add("vertical_line")
            }

            // give the tile a class representing the box 
            let block_class = "b" + get_n_box(give_id(x, y)).toString()
            tile.classList.add(block_class)

            // create text container inside tile, for better visuals
            let text_container = document.createElement("div")
            text_container.classList.add("text_container")
            tile.appendChild(text_container)
        }
    }
    console.clear()
}

let solutions = 0

async function finalise_puzzle() {
    let stay_list = [] // will be final puzzle
    // all of the ids are in the list initially
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 9; j++) {

            let id_p = give_id(j, i)
            stay_list.push(id_p)
        }
    }

    for (let k = 0; k < 4; k++) {
        let id_p = give_id(k, 4)
        stay_list.push(id_p)
    }

    await remove_ids(stay_list)

}


async function remove_ids(list) {
    update_tile(get_tile("4-4"), "")
    get_tile("4-4").classList.add("removed")

    let n_invalid = 0

    let j = 0
    while (list.length > 0) {

        console.log(j);

        let rand_i = Math.floor(Math.random() * list.length)

        let id = list[rand_i]
        let tile = get_tile(id)
        let val = read_tile(tile)

        let inv_id = get_inv_id(id)
        let inv_tile = get_tile(inv_id)
        let inv_val = read_tile(inv_tile)

        console.log(`picked ${id}, ${inv_id}`);


        update_tile(tile, "")
        update_tile(inv_tile, "")

        tile.classList.add("processing")
        inv_tile.classList.add("processing")

        await delay()

        let res = "removed"
        solutions = 0
        if (!await has_1_solution()) {
            console.log("Multiple solutions, invalid");

            res = "invalid"

            update_tile(tile, val)
            update_tile(inv_tile, inv_val)
        } else {
            console.log("Valid");
        }

        list.splice(rand_i, 1)

        tile.classList.replace("processing", res)
        inv_tile.classList.replace("processing", res)

        j++
    }

    console.log("\nCreated puzzle");


}

function show_final_puzzle() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let id = give_id(x, y)

        }
    }
}

function get_inv_id(id) {
    let [x, y] = give_xy(id)
    let inv_x = 8 - x
    let inv_y = 8 - y

    return give_id(inv_x, inv_y)
}

async function has_1_solution(x = 0, y = 0, count = 0) { // start from 0 0       

    if (x == 9) {
        return await has_1_solution(0, y + 1, count + 1)
    }

    if (y == 9) {
        if (check_filled()) {
            solutions++
        }
        return false
    }

    if (solutions > 1) {
        return false
    }

    // get info on current tile
    let id = give_id(x, y)
    let current_tile = get_tile(id)
    let is_full = read_tile(current_tile) !== ""

    if (is_full) { // go to next of its full
        return await has_1_solution(x + 1, y, count + 1) // try palcing the next number
    }

    for (let n = 1; n < 10; n++) { // try 1-9
        let val = n.toString()

        if (check_valid_placement(id, val)) { // if n doesnt exist in region
            await update_tile(current_tile, val) // try placing n
            // (or place a valid number)

            await has_1_solution(x + 1, y, count + 1)

            // if path is not valid, undo until 
            await update_tile(current_tile, "")
        }
    }
    return solutions === 1
}

function random_remove() {
    let remove_list1 = []
    for (let i = 0; i < 60; i++) {

        let x = rand_num()
        let y = rand_num()
        let rand_id = give_id(x, y)

        if (remove_list1.includes(rand_id)) {
            continue
        }
        remove_list1.push(rand_id)
        console.log(i);

    }

    remove_list1.forEach(id => {
        let tile = get_tile(id)

        update_tile(tile, "")
    });


}



// ---------------

function generate_btn() {
    fill_candidates()
    generate()
}

async function generate() {
    console.log("Generating");
    if (timer != 0) { await delay() }

    // list of ids with the least number of candidates (options to choose from)
    let tiles_least_candidates = await tiles_with_least_candidates()

    // if there are none it's complete
    if (tiles_least_candidates.length == 0) {
        console.log("Complete");
        await delay(timer * 2)
        finalise_puzzle()
        return true
    }

    // random index for next id
    let rand_i = Math.floor(Math.random() * tiles_least_candidates.length)
    let current_id = tiles_least_candidates[rand_i]

    let candidates = await read_tile(get_tile(current_id))

    let previous_state = save_region_state(current_id); // Save the current state

    for (let i = 0; i < candidates.length; i++) {
        let candidate = candidates[i]

        set_tile(current_id, candidate)
        //console.log("Setting ", current_id, " to ", candidate);

        if (await generate()) {
            return true
        }

        console.log("Backtrack");
        undo(current_id, previous_state)
    };
    return false
}

function online_check(filler) {
    let s = ""
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) { 
            let id = give_id(x, y)
            let tile = get_tile(id)
            let val = read_tile(tile)

            if (val == "") {
                val = filler
            }

            s+=val
        }
    }
    console.log(s);
}

function undo(id, previous_state) {
    // Restore the saved state of the region
    previous_state.forEach(({ tile_id, candidates }) => {
        let tile = get_tile(tile_id);
        update_tile(tile, candidates);  // Restore the candidates
        tile.classList.add("candidates")
    });
    console.log("Reverting for ", id);
}


function save_region_state(id) {
    let region = get_region_ids(id)
    let state = []

    region.forEach(tile_id => {
        let tile = get_tile(tile_id)
        let candidates = read_tile(tile)

        state.push({ tile_id, candidates });
    });
    return state
}

async function tiles_with_least_candidates() {
    let tiles = document.querySelectorAll('.candidates')

    let lowest = 9
    let lowest_list = []

    tiles.forEach(tile => {
        if (tile.classList.contains("candidates")) {
            let candidates = read_tile(tile)
            let len = candidates.length

            if (len < lowest) {
                lowest = len
                lowest_list = []
                lowest_list.push(tile.id)
            } else if (len == lowest) {
                lowest_list.push(tile.id)
            }
        }
    });
    return lowest_list
}

function set_tile(id, n) {
    let tile = get_tile(id);
    tile.classList.remove("candidates");
    update_tile(tile, n);
    eliminate_candidates(id, n);
}

function eliminate_candidates(id, n) {
    let region = get_region_ids(id);

    // Eliminate `n` from all tiles in the same row, col, and box
    for (let i = 0; i < region.length; i++) {
        let tile = get_tile(region[i]);
        if (tile.classList.contains("candidates")) {
            remove_candidate(region[i], n);
        }
    }
}


function get_region_ids(id) {
    // Combine the row, col, and box IDs
    return [...get_row_id(id), ...get_col_id(id), ...get_box_id(id)];
}

function remove_candidate(id, n) {
    let tile = get_tile(id);
    if (!tile.classList.contains("set")) {
        let nums = read_tile(tile);
        let new_nums = nums.replace(n.toString(), "");
        update_tile(get_tile(id), new_nums);

        return true;
    }
    return false;
}

function fill_candidates() {
    clear_grid();
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let tile = get_tile(give_id(x, y));
            update_tile(tile, "123456789");
            tile.classList.add("candidates");
            tile.classList.remove("invalid");
            tile.classList.remove("removed");
        }
    }
    console.clear();
}

function get_row_id(id) {
    let [x, y] = give_xy(id)
    let ids = []

    for (let i = 0; i < 9; i++) {
        ids.push(give_id(i, y))
    }
    return ids
}

function get_col_id(id) {
    let [x, y] = give_xy(id)
    let ids = []

    for (let i = 0; i < 9; i++) {
        ids.push(give_id(x, i))
    }
    return ids
}

function get_box_id(id) {
    let class_name = "b" + get_n_box(id).toString()
    let ids = []

    let elements = document.getElementsByClassName(class_name)

    ids = [...elements].map(element => element.id)

    return ids
}

// solving ------------
async function solve(x = 0, y = 0) { // start from 0 0

    // Base cases 
    if (x == 9) {
        return await solve(0, y + 1)
    }

    if (y == 9) {
        if (check_filled()) {
            console.log("Puzzle complete");
            return true
        }
    }

    // get info on current tile
    let id = give_id(x, y)
    let current_tile = get_tile(id)
    let is_full = read_tile(current_tile) !== ""

    if (is_full) { // go to next of its full
        return await solve(x + 1, y) // try palcing the next number
    }

    if (timer != 0) { await delay() }


    // Elimination loop
    for (let n = 1; n < 10; n++) { // try 1-9
        let val = n.toString()

        if (check_valid_placement(id, val)) { // if n doesnt exist in region
            await update_tile(current_tile, val) // try placing n
            console.log(`Updating ${id} to ${val}`);
            // (or place a valid number)


            if (await solve(x + 1, y)) {
                return true
            }

            if (timer != 0) { await delay(timer / 2) }
        }
    }
    // if path is not valid, undo until 
    await update_tile(current_tile, "")
    console.log("backtrack");

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

function check_filled() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let id = give_id(x, y)
            let tile = get_tile(id)
            if (read_tile(tile) == "") {
                return false
            }
        }
    }
    return true
}

// get values in the same row
function get_row_num(id) {
    let [x, y] = give_xy(id)
    let row = []

    for (let i = 0; i < 9; i++) {
        let current_id = give_id(i, y)
        let num = read_tile(get_tile(current_id))
        if (num) { row.push(num) }
    } return row
}

// get values in the same column
function get_col_num(id) {
    let [x, y] = give_xy(id)
    let col = []

    for (let i = 0; i < 9; i++) {
        let current_id = give_id(x, i)
        let num = read_tile(get_tile(current_id))
        if (num) { col.push(num) }
    } return col
}

// get values in the same box
function get_box_num(id) {
    let box = []
    let box_n = "b" + get_n_box(id).toString()

    for (let i = 0; i < 9; i++) {
        let tile = document.getElementsByClassName(box_n)[i]
        let val = read_tile(tile)
        if (val !== "") {
            box.push(val)
        }
    }
    return box
}

// get the box number of tile
function get_n_box(id) {
    let [x, y] = give_xy(id)
    let block = 1

    if (3 <= y && y < 6) {
        block += 3
    }
    else if (6 <= y) {
        block += 6
    }

    block += Math.floor(x / 3)
    return block
}

// for testing, read file and fill grid
async function set_grid(file) {
    clear_grid()
    file = test_file
    let current_row

    for (let y = 0; y < 9; y++) {
        // wait for the row to be read from file
        current_row = await read_file_row(file, y);

        for (let x = 0; x < 9; x++) {
            // append the value to the right box
            let tile = get_tile(give_id(x, y));
            if (current_row[x] != 0) {
                tile.classList.add("hint")
                update_tile(tile, current_row[x])
            }
        }
    }
    console.clear()
}

// reads the puzzle file one line at a time
async function read_file_row(file, row) {
    try {
        const raw = await fetch(file); // Await the fetch operation
        const text = await raw.text(); // Await the text conversion
        const lines = text.split("\n"); // Split text by lines
        return lines[row]; // Return the specific row

    } catch (e) { console.error(e) }
}

// general functions -----------
// generate random number 0-8
function rand_num() {
    return Math.floor(Math.random() * 9)
}

// reads values in tile
function read_tile(tile) {
    // console.log("reading: ", tile);
    return tile.children[0].innerHTML
}

// changes value in tile
async function update_tile(tile, val) {
    tile.children[0].innerHTML = val
}

// returns tile DOM from id
function get_tile(id) {
    return document.getElementById(id)
}

// returns id in string form for HTML DOM
function give_id(x, y) {
    return x.toString() + '-' + y.toString()
}

// returns seperate x and y from id
function give_xy(id) { // usage: let [x, y] = give_xy(id)
    let sep = id.split("-")
    return [sep[0], sep[1]]
}

// delays operations, for visualisation
function delay(time = timer) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function clear_grid() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let id = give_id(x, y)
            let tile = document.getElementById(id)
            update_tile(tile, "")
            tile.classList.remove("hint", "candidates")
        }
    }
}