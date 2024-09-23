const delayOutput = document.querySelector("#delay-output");
const delaySlider = document.querySelector("#delay-slider");
let timer

delayOutput.textContent = delaySlider.value * 10
delaySlider.addEventListener("input", (event) => {
    delayOutput.textContent = event.target.value * 10; // Multiply by 10 for ms display
    timer = delaySlider.value * 10
});

const grid = document.getElementById("grid")

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
            let block_class = "b" + get_box(give_id(x, y)).toString()
            tile.classList.add(block_class)

            // create text container inside tile, for better visuals
            let text_container = document.createElement("div")
            text_container.classList.add("text_container")
            tile.appendChild(text_container)
        }
    }
}

function generate() {
    solve(rand_num(), rand_num())
    update_tile(get_tile("0-3"), "")
}

async function solve(x = 0, y = 0) {
    console.log("solving");


    if (x == 9) {
        return await solve(0, y + 1)
    }

    if (y == 9) {
        if (check_full()) {
            return true
        }
    }

    if (timer != 0) {
        await delay(timer)
    }
    let id = give_id(x, y)
    let current_tile = get_tile(id)
    let is_full = read_tile(current_tile) !== ""

    if (is_full) {
        return await solve(x + 1, y)
    }

    for (let n = 1; n < 10; n++) {

        let val = n.toString()

        if (check_valid_placement(id, val)) {
            update_tile(current_tile, val)

            if (await solve(x + 1, y)) {
                console.log("return true");
                return true

            }
            update_tile(current_tile, "")
            console.log("backtrack");
            if (timer != 0) {
                await delay(timer)
            }
        }
    }
    return false
}

function check_valid_placement(id, n) {
    let current_row = get_row_num(id)
    let current_col = get_col_num(id)
    let current_box = get_box_num(id)

    return !current_row.includes(n) &&
        !current_col.includes(n) &&
        !current_box.includes(n)
}

function check_full() {
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
    let box_n = "b" + get_box(id).toString()

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
function get_box(id) {
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
    file = "test_puzzles/hard.txt";
    let current_row;

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
function update_tile(tile, val) {
    console.log("updating ", tile.id, " to ", val);

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
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}