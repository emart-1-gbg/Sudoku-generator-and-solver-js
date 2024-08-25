const grid = document.getElementById("grid")


window.onload = function(){
    console.log("laod")

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let tile = document.createElement("div")
            tile.id = y.toString() + "-" + x.toString()
            tile.classList.add("tile")
            grid.appendChild(tile)
            
            if (y == 2 || y == 5) {
                tile.classList.add("horisontal_line")
            }

            if (x == 2 || x == 5) {
                tile.classList.add("vertical_line")
            }

            tile.innerHTML = null

        }
    }
        
    generate(grid)

}



function rand_num() {
            return Math.floor(Math.random() * 9)
        }

function generate(grid) {

    for (let i = 0; i < 20; i++) {
        let y = rand_num()
        let x = rand_num()
        let current_tile = y.toString() + "-" + x.toString()
        
        let n = Math.floor(Math.random() * 9) + 1
        document.getElementById(current_tile).innerHTML = n
    }

    alert(current_tile)


    console.log(x, y)
}




function read_tile(tile) {
    return tile.innerHTML
}

function update_tile(tile) {
    null
}

function solve() {
    null
}
