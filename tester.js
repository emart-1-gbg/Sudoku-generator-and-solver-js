const grid = document.getElementById("grid")


window.onload = async function(){
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

            tile.innerHTML = null

            let block = 1

            if (3 <= y && y < 6){
                block += 3
            }
            else if (6 <= y){
                block += 6
            }

            block += Math.floor(x/3)
            let block_class = "b" + block.toString()
            tile.classList.add(block_class)


            let text_container = document.createElement("div")
            text_container.classList.add("text_container")
            tile.appendChild(text_container)
            
        }

    }
    
    set_grid()

}

async function generate(grid) {
    clear_grid()
    let a = 0

    // randomise
    for (let i = 0; i < 30; i++) {
        await delay(a)
        let y = rand_num()
        let x = rand_num()
        let id = give_id(x, y)
        
        let value = rand_num() + 1

        let tile = get_tile(id)
        if (tile.innerHTML.length === 0) {
            update_tile(tile, value)
            a++
        }
        else{continue}
        
    }
    console.log("done" + a.toString())
    
}

//tile.classList.add("hint")


function solve() {
    null
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function check_valid(id) {
    let tile = get_tile(id)
    let [x, y] = give_xy(id)

    let num = tile.innerHTML

}

// Make set_grid async to handle asynchronous code
async function set_grid(file) {
    file = "test_puzzles/medium1.txt";
    let current_row;
    
    for (let y = 0; y < 9; y++) {
        // Await the result of read_file_row
        current_row = await read_file_row(file, y);

        for (let x = 0; x < 9; x++) {
            let tile = get_tile(give_id(x, y));
            if (current_row[x] != 0) {
                update_tile(tile, current_row[x])
            }
        }   
    }
}

// Make read_file_row async and return a Promise
async function read_file_row(file, row) {
    try {
        const raw = await fetch(file); // Await the fetch operation
        const text = await raw.text(); // Await the text conversion
        const lines = text.split("\n"); // Split text by lines
        return lines[row]; // Return the specific row
        
    } catch (e) {
        console.error(e); // Handle any errors
    }
}

function rand_num() {
    return Math.floor(Math.random() * 9)
}

function read_tile(tile) {
    return tile.innerHTML
}

function update_tile(tile, val) {
    tile.children[0].innerHTML = val
}

function get_tile(id) {
    return document.getElementById(id)
}

function give_id(x, y) {
    return x.toString() + '-' + y.toString()
}

function give_xy(id) {
    let sep = id.split("-")
    return [sep[0], sep[1]]
}