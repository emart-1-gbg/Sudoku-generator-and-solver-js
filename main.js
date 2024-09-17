const grid = document.getElementById("grid")


window.onload = async function(){
    console.log("laod")

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let tile = document.createElement("div")
            tile.id = give_id(x, y)
            tile.classList.add("tile", "candidates")
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
            
            update_tile(tile, "123456789")
        }
    }
    
    generate()

}

async function generate() {
    let x = rand_num()
    let y = rand_num()

    
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

function clear_grid(grid) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) { 
            let id = give_id(x, y)
            let tile = document.getElementById(id)
            update_tile(tile, null)
            tile.classList.remove("hint")
        }
    }
}

function rand_num() {
    return Math.floor(Math.random() * 9)
}

function read_tile(tile) {
    return tile.children[0].innerHTML
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