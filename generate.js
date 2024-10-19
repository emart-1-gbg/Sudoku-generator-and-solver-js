// generator.js

async function generate() {
    console.log("Generating");
    if (timer != 0) { await delay() }

    let tiles_least_candidates = await tiles_with_least_candidates()

    if (tiles_least_candidates.length == 0) {
        console.log("Complete");
        return true
    }

    let rand_i = Math.floor(Math.random() * tiles_least_candidates.length)
    let current_id = tiles_least_candidates[rand_i]

    let candidates = await read_tile(get_tile(current_id))

    let previous_state = save_region_state(current_id);

    for (let i = 0; i < candidates.length; i++) {
        let candidate = candidates[i]

        set_tile(current_id, candidate)

        if (await generate()) {
            return true
        }
        console.log("Backtrack");

        undo(current_id, previous_state)
    };
    return false
}

function undo(id, previous_state) {
    previous_state.forEach(({ tile_id, candidates }) => {
        let tile = get_tile(tile_id);
        update_tile(tile, candidates);
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

export { generate, undo, save_region_state, tiles_with_least_candidates };
