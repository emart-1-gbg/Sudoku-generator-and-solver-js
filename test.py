import numpy as np


# Sudoku grid provided by the user in a list

sudoku_grid = [

]


# Reshape the list into a 9x9 grid

sudoku_grid = np.array(sudoku_grid).reshape((9, 9))


# Function to check if a Sudoku grid is valid


def is_valid_sudoku(grid):

    # Check rows and columns

    for i in range(9):

        if len(set(grid[i, :])) != 9:  # Row check

            return False

        if len(set(grid[:, i])) != 9:  # Column check

            return False

    # Check 3x3 sub-grids

    for row in range(0, 9, 3):

        for col in range(0, 9, 3):

            subgrid = grid[row : row + 3, col : col + 3].flatten()

            if len(set(subgrid)) != 9:

                return False

    return True


# Check if the provided Sudoku grid is valid

is_valid = is_valid_sudoku(sudoku_grid)

is_valid

