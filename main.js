const grid = document.getElementById("grid")


window.onload = function(){
    console.log("laod")

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div")
            tile.id = r.toString() + "-" + c.toString()
            tile.classList.add("tile")
            grid.appendChild(tile)
            
            if (r == 2 || r == 5) {
                tile.classList.add("horisontal_line")
            }

            if (c == 2 || c == 5) {
                tile.classList.add("vertical_line")
            }

        }
    }
}

function read_tile(tile) {
    null
}

function solve() {
    null
}
