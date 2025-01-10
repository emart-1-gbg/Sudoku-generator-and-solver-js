// helpers.js

const delayOutput = document.querySelector("#delay-output");
const delaySlider = document.querySelector("#delay-slider");
let timer = 0;
delaySlider.value = timer;

delayOutput.textContent = delaySlider.value * 10;
delaySlider.addEventListener("input", (event) => {
    delayOutput.textContent = event.target.value * 10;
    timer = delaySlider.value * 10;
});

function get_region_ids(id) {
    return [...get_row_id(id), ...get_col_id(id), ...get_box_id(id)];
}

function eliminate_candidates(id, n) {
    let region = get_region_ids(id);

    for (let i = 0; i < region.length; i++) {
        let tile = get_tile(region[i]);
        if (tile.classList.contains("candidates")) {
            remove_candidate(region[i], n);
        }
    }
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
        }
    }
    console.clear();
}

function clear_grid() {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let id = give_id(x, y);
            let tile = document.getElementById(id);
            update_tile(tile, "");
            tile.classList.remove("hint", "candidates");
        }
    }
}

function delay(time = timer) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function give_id(x, y) {
    return x.toString() + '-' + y.toString();
}

function give_xy(id) {
    let sep = id.split("-");
    return [sep[0], sep[1]];
}

function read_tile(tile) {
    return tile.children[0].innerHTML;
}

async function update_tile(tile, val) {
    tile.children[0].innerHTML = val;
}

function get_tile(id) {
    return document.getElementById(id);
}

// Export relevant helper functions
export {
    delay,
    give_id,
    give_xy,
    read_tile,
    update_tile,
    get_tile,
    fill_candidates,
    eliminate_candidates,
    remove_candidate,
    get_region_ids,
    clear_grid
};
