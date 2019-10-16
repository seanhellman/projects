'''
cs5001
fall 2018
final project (othello)
'''

import turtle
import collections
import random

# CONSTANTS
SQUARE = 50
PAD = SQUARE/2
TILE_SIZE = 20
BOARD_SIZE = 8
BLACK = "black"
WHITE = "white"
PLAYER = collections.deque([BLACK, WHITE])
SPACES = []
COORDINATES = []
FONT = ("Arial", 14, "normal")

black_legal_moves = []
white_legal_moves = []

# INIT MAIN TURTLE AND SCREEN
t = turtle.Turtle()
t.up()
t.speed(0)
t.hideturtle()
wn = turtle.Screen()

# INIT TURTLE TILE ANNOUNCER
tile_announcer = turtle.Turtle()
tile_announcer.up()
tile_announcer.speed(0)
tile_announcer.hideturtle()
tile_announcer.color(BLACK)

# INIT TURTLE TURN ANNOUNCER
turn_announcer = turtle.Turtle()
turn_announcer.up()
turn_announcer.speed(0)
turn_announcer.hideturtle()
turn_announcer.color(BLACK)

#### PURPOSE
# This function starts the game by calling functions to draw the board,
# create a nested listed of spaces, created a nested list of space
# coordinates, draw the starting tiles, and draw static text, which is 
# used to display messages to the user
#### SIGNATURE
# init_game :: Void => Void
#### EXAMPLES
# n/a
def init_game():
    draw_board()
    create_spaces()
    create_coordinates()
    draw_starting_tiles()
    draw_static_text()

#### PURPOSE
# This function determines the corner value of the board based on the 
# size of the board (BOARD_SIZE) and each space (SQUARE). Valid board
# sizes are powers of 2 >= 4. Note: BOARD_SIZE and SQUARE are constants
# defined above.
#### SIGNATURE
# signature :: Void => Int
#### EXAMPLES
# If BOARD_SIZE = 4 and SQUARE = 50, corner() => 100
# If BOARD_SIZE = 8 and SQUARE = 50, corner()=> 200
def corner():
    return SQUARE * (BOARD_SIZE/2)

#### PURPOSE
# This function opens a window and draws the Othello game board.
#### SIGNATURE
# draw_board() :: Void => Void
#### EXAMPLES
# n/a
def draw_board():
    # Create the screen & canvas for the board
    wn.setup(BOARD_SIZE * SQUARE * 3, BOARD_SIZE * SQUARE * 1.5)
    wn.screensize(BOARD_SIZE * SQUARE, BOARD_SIZE * SQUARE)
    wn.bgcolor(WHITE)

    # Line color is black, fill color is green
    t.color(BLACK, "forest green")
    
    # Move the turtle to the lower left corner
    t.setposition(-corner(), -corner())

    # Draw the green background
    t.begin_fill()
    for i in range(4):
        t.down()
        t.forward(SQUARE * BOARD_SIZE)
        t.left(90)
    t.end_fill()

    # Draw the horizontal lines
    for i in range(BOARD_SIZE + 1):
        t.setposition(-corner(), SQUARE * i + -corner())
        draw_lines()

    # Draw the vertical lines
    t.left(90)
    for i in range(BOARD_SIZE + 1):
        t.setposition(SQUARE * i + -corner(), -corner())
        draw_lines()

    # Uncomment to toggle draw row & column indicies for 8x8 board
    # x = -175
    # y = 215
    # for i in range(BOARD_SIZE):
    #     t.setposition(x,y)
    #     t.write(i, font=("Arial", 14, "normal"))
    #     x += SQUARE
    # x = -225
    # y = 165
    # for i in range(BOARD_SIZE):
    #     t.setposition(x,y)
    #     t.write(i, font=("Arial", 14, "normal"))
    #     y -= SQUARE

#### PURPOSE
# This function is called by draw_board() and draws lines that divide
# the game board into a BOARD_SIZE x BOARD_SIZE grid.
#### SIGNATURE
# draw_lines() :: Void => Void
#### EXAMPLES
# n/a
def draw_lines():
    t.down()
    t.forward(SQUARE * BOARD_SIZE)
    t.up()

#### PURPOSE
# This function replaces SPACES (a constant) with a nested list of spaces,
# which is used as a virtual representation of the game board spaces.
# Each space is initialized as empty by appending None to each space.
# The number of lists = BOARD_SIZE and the number of lists within each
# list = BOARD_SIZE.
#### SIGNATURE
# create_spaces() :: Void => Void
#### EXAMPLES
# If BOARD_SIZE = 8, create_spaces() => Void, SPACES is updated to be:
# [
# [None, None, None, None, None, None, None, None],
# [None, None, None, None, None, None, None, None], 
# [None, None, None, None, None, None, None, None], 
# [None, None, None, None, None, None, None, None], 
# [None, None, None, None, None, None, None, None], 
# [None, None, None, None, None, None, None, None], 
# [None, None, None, None, None, None, None, None], 
# [None, None, None, None, None, None, None, None]
# ]
def create_spaces():
    for row in range(BOARD_SIZE):
        temp = []
        for column in range(BOARD_SIZE):
            temp.append(None)
        SPACES.append(temp)

#### PURPOSE
# This function is creates a nested list that is the same same as the 
# nested list created by create_spaces(). The list stores the
# cooresponding x- and y-coordinates for tiles to be drawn on each space.
# This function doesn't return anything. Rather, it updates the
# COORDINATES list (constant).
#### SIGNATURE
# create_coordinates() :: Void => Void
#### EXAMPLES
# If BOARD_SIZE = 8, create_coordinates() => Void, COORDINATES is updated:
# [
# [(-175.0, 155.0), (-125.0, 155.0), (-75.0, 155.0), (-25.0, 155.0), (25.0, 155.0), (75.0, 155.0), (125.0, 155.0), (175.0, 155.0)],
# [(-175.0, 105.0), (-125.0, 105.0), (-75.0, 105.0), (-25.0, 105.0), (25.0, 105.0), (75.0, 105.0), (125.0, 105.0), (175.0, 105.0)],
# [(-175.0, 55.0), (-125.0, 55.0), (-75.0, 55.0), (-25.0, 55.0), (25.0, 55.0), (75.0, 55.0), (125.0, 55.0), (175.0, 55.0)],
# [(-175.0, 5.0), (-125.0, 5.0), (-75.0, 5.0), (-25.0, 5.0), (25.0, 5.0), (75.0, 5.0), (125.0, 5.0), (175.0, 5.0)],
# [(-175.0, -45.0), (-125.0, -45.0), (-75.0, -45.0), (-25.0, -45.0), (25.0, -45.0), (75.0, -45.0), (125.0, -45.0), (175.0, -45.0)],
# [(-175.0, -95.0), (-125.0, -95.0), (-75.0, -95.0), (-25.0, -95.0), (25.0, -95.0), (75.0, -95.0), (125.0, -95.0), (175.0, -95.0)],
# [(-175.0, -145.0), (-125.0, -145.0), (-75.0, -145.0), (-25.0, -145.0), (25.0, -145.0), (75.0, -145.0), (125.0,-145.0), (175.0, -145.0)],
# [(-175.0, -195.0), (-125.0, -195.0), (-75.0, -195.0), (-25.0, -195.0), (25.0, -195.0), (75.0, -195.0), (125.0, -195.0), (175.0, -195.0)]]
def create_coordinates():
    y = corner() - SQUARE*0.9
    for row in range(BOARD_SIZE):
        temp = []
        x = -corner() + SQUARE/2
        for column in range(BOARD_SIZE):
            temp.append((x,y))
            x += SQUARE
        COORDINATES.append(temp)
        y -= SQUARE

#### PURPOSE
# This function draws the starting tiles.
#### SIGNATURE
# draw_starting_tiles :: Void => Void
#### EXAMPLES
# n/a
def draw_starting_tiles():
    PLAYER.rotate(1)
    for row in range(BOARD_SIZE):
        if row == (BOARD_SIZE/2)-1 or row == (BOARD_SIZE/2):
            for column in range(BOARD_SIZE):
                if column == (BOARD_SIZE/2)-1 or column == (BOARD_SIZE/2):
                    tile_x_coord, tile_y_coord = COORDINATES[row][column]
                    draw_tile(tile_x_coord, tile_y_coord)
                    PLAYER.rotate(1)
            PLAYER.rotate(1)
    PLAYER.rotate(1)

#### PURPOSE
# This function draws static text on the game window, used to display
# messages to the user.
#### SIGNATURE
# draw_static_text :: Void => Void
#### EXAMPLES
# n/a
def draw_static_text():
    # position static text (turn, black tiles, white tiles) next to board
    x = corner() + PAD
    y = corner() - SQUARE
    t.color(BLACK)
    text = ["Turn:", "Black tiles:", "White tiles:"]
    for i in range(3):
        t.setpos(x,y)
        t.write(text[i], font=FONT)
        y -= PAD

#### PURPOSE
# This function draws a tile based on the x- and y-coordinate of the 
# selected move made by either the human or ai player.
#### SIGNATURE
# draw_tile :: (Float, Float) => Void
#### EXAMPLES
# n/a
def draw_tile(x, y):
    row = get_row_index(y)
    column = get_column_index(x)
    tile_x_coord, tile_y_coord = COORDINATES[row][column]
    t.setheading(0)
    t.setpos(tile_x_coord,tile_y_coord)
    t.color(PLAYER[0])
    t.begin_fill()
    t.down()
    t.circle(TILE_SIZE)
    t.end_fill()
    t.up()
    # update SPACES matrix
    update_spaces(row, column)

#### PURPOSE
# This function updates the SPACES list after tiles are drawn.
#### SIGNATURE
# update_spaces :: Void => Void
#### EXAMPLES
# n/a
def update_spaces(row, column):
    SPACES[row][column] = PLAYER[0]

#### PURPOSE
# This function verifies that the user click is within the boundaries
# of the board.
#### SIGNATURE
# click_in_bounds :: (Float, Float) => Bool
#### EXAMPLES
# click_in_bounds(-500,-500) => False
# click_in_bounds(0,0) => True
# click_in_bounds(-154,176) => True
# click_in_bounds(201,201) => False
def click_in_bounds(x, y):
    bound = SQUARE * BOARD_SIZE/2
    return -bound <= x <= bound and -bound <= y <= bound

#### PURPOSE
# This function converts the y-coordinate of the user click into a
# corresponding row index that can be used to access elements in the
# SPACES and COORDINATES nested lists.
#### SIGNATURE
# get_row_index :: (Float) => Int
#### EXAMPLES
# get_row_index(190) => 0
# get_row_index(-199) => 7
# get_row_index(20) => 3
def get_row_index(y):
    row_index = int((-y + SQUARE*(BOARD_SIZE/2)) // SQUARE)
    return row_index

#### PURPOSE
# This function converts the x-coordinate of the user click into a
# corresponding column index that can be used to access elements in the
# SPACES and COORDINATES nested lists.
#### SIGNATURE
# get_column_index :: (Float) => Int
#### EXAMPLES
# get_column_index(155) == 7
# get_column_index(-80) == 2
# get_column_index(-176) == 0
def get_column_index(x):
    column_index = int((x + SQUARE*(BOARD_SIZE/2)) // SQUARE)
    return column_index

#### PURPOSE
# This function draws dynamic text on the game window, used to display
# messages to the user. After each move, this text is cleared and updated.
# For example, this is used to update the number of black and white tiles
# on the board before/after every turn.
#### SIGNATURE
# draw_dynamic_text :: Void => Void
#### EXAMPLES
# n/a
def update_dynamic_text():
    # clear tile counts from previous turn
    tile_announcer.clear()
    # clear turn indicator from previous turn
    turn_announcer.clear()
    # align dynamic text with static text
    x = corner() + PAD*5
    y = corner() - SQUARE
    # write, in order: current player, # black tiles, # white tiles
    text = [PLAYER[0], count_black_tiles(), count_white_tiles()]
    for i in range(3):
        if i == 0:
            turn_announcer.setpos(x,y)
            turn_announcer.write(text[i], font=FONT)
        else:
            tile_announcer.setpos(x,y)
            tile_announcer.write(text[i], font=FONT)
        y -= PAD

#### PURPOSE
# This function switches the player by rotating the PLAYER deque,
# calls the functions to update dynamic text and update lists of legal
# moves, and starts the human move or ai move accordingly.
#### SIGNATURE
# switch_player :: Void => Void
#### EXAMPLES
# n/a
def switch_player():
    PLAYER.rotate(1)
    update_dynamic_text()
    update_legal_moves()
    if PLAYER[0] == BLACK:
        start_user_move()
    else:
        # disable user click event capture
        wn.onscreenclick(None)
        start_ai_move()

#### PURPOSE
# This function starts the human player turn. If there are legal moves,
# available, it will activate the onscreenclick method to capture
# the user move selection. If no legal moves remain for the human player
# but legal moves remain for the ai player, it will call the
# switch_player() function. If no legal moves are left for either player,
# it will trigger the report_winner() function.
#### SIGNATURE
# start_user_move :: Void => Void
#### EXAMPLES
# n/a
def start_user_move():
    if black_legal_moves_remain():
        wn.onscreenclick(execute_user_move)
    elif white_legal_moves_remain():
        switch_player()
    else:
        report_winner()

#### PURPOSE
# This function executes the human player move. It gets the x- and y-
# coordinates from the start_user_move() function, converts those
# coordinates to row/column values, verifies the click is in bounds,
# validates the legality of the selected move, and, if valid, draws/flips
# tiles. If a move is invalid, the function will simply wait until
# a valid move is selected.
#### SIGNATURE
# execute_user_move :: (Float, Float) => Void
#### EXAMPLES
# n/a
def execute_user_move(x, y):
    row = get_row_index(y)
    column = get_column_index(x)
    if click_in_bounds(x, y):
        if validate_move(row, column):
            tile_x_coord, tile_y_coord = COORDINATES[row][column]
            draw_tile(tile_x_coord, tile_y_coord)
            north_flip_tiles(row, column)
            NE_flip_tiles(row, column)
            east_flip_tiles(row, column)
            SE_flip_tiles(row, column)
            south_flip_tiles(row, column)
            SW_flip_tiles(row, column)
            west_flip_tiles(row, column)
            NW_flip_tiles(row, column)
            switch_player()

#### PURPOSE
# This function starts the ai player turn. If there are legal moves,
# available, it will choose the move that flips tiles in as many
# directions as possible. If there are no legal moves for the ai player
# but there are for the human player, it will call the switch_user()
# function. If no legal moves are left for either player, it will trigger
# the report_winner() function.
#### SIGNATURE
# start_ai_move :: Void => Void
#### EXAMPLES
# n/a
def start_ai_move():
    if white_legal_moves_remain():
        freq = collections.Counter(white_legal_moves).most_common()
        most_freq = [i for i in freq if (i[1] == freq[0][1])]
        choice = random.choice(most_freq)[0]
        row = choice[0]
        column = choice[1]
        execute_ai_move(row, column)
    elif black_legal_moves_remain():
        switch_player()
    else:
        report_winner()

#### PURPOSE
# This function executes the ai move. Since the ai player will never
# attempt an invalid move, it simply proceeds to drawing/flipping tiles
# as relevant.
#### SIGNATURE
# execute_ai_move :: (Int, Int) => Void
#### EXAMPLES
# n/a
def execute_ai_move(row, column):
    tile_x_coord, tile_y_coord = COORDINATES[row][column]
    draw_tile(tile_x_coord, tile_y_coord)
    north_flip_tiles(row, column)
    NE_flip_tiles(row, column)
    east_flip_tiles(row, column)
    SE_flip_tiles(row, column)
    south_flip_tiles(row, column)
    SW_flip_tiles(row, column)
    west_flip_tiles(row, column)
    NW_flip_tiles(row, column)
    switch_player()

#### PURPOSE
# This function updates but does not return a list of legal moves available
# to the human player (black_legal_moves) and a separate list of legal
# moves available to the ai player (white legal moves).
#### SIGNATURE
# update_legal_moves :: Void => Void
#### EXAMPLES
# n/a
def update_legal_moves():
    black_legal_moves.clear()
    white_legal_moves.clear()
    for i in range(2):
        if PLAYER[0] == BLACK:
            for row in range(BOARD_SIZE):
                for column in range(BOARD_SIZE):
                    if validate_move(row, column):
                        black_legal_moves.append((row, column))
        if PLAYER[0] == WHITE:
            for row in range(BOARD_SIZE):
                for column in range(BOARD_SIZE):
                    if space_empty(row, column):
                        if north_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if NE_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if east_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if SE_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if south_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if SW_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if west_legal_move(row, column):
                            white_legal_moves.append((row, column))
                        if NW_legal_move(row, column):
                            white_legal_moves.append((row, column))
        PLAYER.rotate(1)

#### PURPOSE
# The function determines if any legal moves remain for the human player
# by determining if the list of relevant legal moves is empty or not.
#### SIGNATURE
# black_legal_moves_remain() :: Void => Bool
#### EXAMPLES
# If black_legal_moves = [], black_legal_moves_remain() => False
# If black_legal_moves = [(0,1)], black_legal_moves_remain() => True
def black_legal_moves_remain():
    return len(black_legal_moves) != 0

#### PURPOSE
# The function determines if any legal moves remain for the ai player
# by determining if the list of relevant legal moves is empty or not.
#### SIGNATURE
# white_legal_moves_remain() :: Void => Bool
#### EXAMPLES
# If white_legal_moves = [], white_legal_moves_remain() => False
# If white_legal_moves = [(0,1)], white_legal_moves_remain() => True
def white_legal_moves_remain():
    return len(white_legal_moves) != 0

#### PURPOSE
# The function determines if any legal moves remain for the ai player
# by determining if the list of relevant legal moves is empty or not.
#### SIGNATURE
# white_legal_moves_remain() :: Void => Bool
#### EXAMPLES
# If white_legal_moves = [], white_legal_moves_remain() => False
# If white_legal_moves = [(0,1)], white_legal_moves_remain() => True
def space_empty(row, column):
    return SPACES[row][column] == None

#### PURPOSE
# The function determines if a move is valid by determing if the space
# is both empty and is a legal move in any one of 8 directions (N, NE,
# E, SE, S, SW, W, or NW)
#### SIGNATURE
# validate_move :: (Int, Int) => Bool
#### EXAMPLES
# validate_move(0,2) => True
# validate_move(6,7) => False
def validate_move(row, column):
    direction = (
    north_legal_move(row, column)
    or NE_legal_move(row, column)
    or east_legal_move(row, column)
    or SE_legal_move(row, column)
    or south_legal_move(row, column)
    or SW_legal_move(row, column)
    or west_legal_move(row, column)
    or NW_legal_move(row, column)
    )
    return space_empty(row, column) and direction

#### PURPOSE
# The function counts the number of black tiles on the board by iterating
# through the SPACES list.
#### SIGNATURE
# count_black_tiles :: Void => Bool
#### EXAMPLES
# If there are 4 black tiles on the board, count_black_tiles() => 4
# If there are no black tiles on the board, count_black_tiles() => 0
def count_black_tiles():
    black_tiles = 0
    for row in range(BOARD_SIZE):
        for column in range(BOARD_SIZE):
            if SPACES[row][column] == BLACK:
                black_tiles += 1
    return black_tiles

#### PURPOSE
# The function counts the number of white tiles on the board by iterating
# through the SPACES list.
#### SIGNATURE
# count_white_tiles :: Void => Bool
#### EXAMPLES
# If there are 10 white tiles on the board, count_black_tiles() => 10
# If there are no whitetiles on the board, count_black_tiles() => 0
def count_white_tiles():
    white_tiles = 0
    for row in range(BOARD_SIZE):
        for column in range(BOARD_SIZE):
            if SPACES[row][column] == WHITE:
                white_tiles += 1
    return white_tiles

#### PURPOSE
# The function compares the number of black tiles with the number of 
# white tiles and determines the winner (whoever has more tiles).
#### SIGNATURE
# determine_winner :: Void => Str
#### EXAMPLES
# If black > white, determine_winner() => "Black player wins!"
# If white > black, determine_winner() => "White player wins!"
# If black = white, determine_winner() => "It's a tie!"
def determine_winner():
    black_tiles = count_black_tiles()
    white_tiles = count_white_tiles()
    if black_tiles > white_tiles:
        return "Black player wins!"
    elif white_tiles > black_tiles:
        return "White player wins!"
    else:
        return "It's a tie!"

#### PURPOSE
# The function reports the winner to the user by writing on the window.
#### SIGNATURE
# report_winner() :: Void => Void
#### EXAMPLES
# n/a
def report_winner():
    turn_announcer.clear()
    winner = determine_winner()
    message = "Close window/exit to terminal to record your score."
    x = corner() + PAD
    y = corner() - SQUARE*3
    text = [winner, message]
    for i in range(2):
        tile_announcer.setpos(x,y)
        tile_announcer.write(text[i], font=FONT)
        y -= SQUARE
    get_previous_scores("scores.txt")

#### PURPOSE
# The function accesses a list of high scores and adds each score entry
# as a separate element to a list of scores.
#### SIGNATURE
# get_previous_scores :: File => Void
#### EXAMPLES
# n/a
def get_previous_scores(file_path):
    scores = []
    with open(file_path, "r") as file:
        for line in file:
            lst = line.split(",")
            scores.append([lst[0], int(lst[1].strip())])
    capture_user_score(file_path, scores)    

#### PURPOSE
# The function captures the user name and accesses their score at
# the end of the game.
#### SIGNATURE
# capture_user_score :: (File, List) => Void
#### EXAMPLES
# n/a
def capture_user_score(file_path, scores_lst):
    user = input("Enter your name: ")
    score = count_black_tiles()
    user_score_entry = [user.replace(" ", ""), score]
    add_user_to_scores(file_path, scores_lst, user_score_entry)

#### PURPOSE
# The function adds the user score to the list of scores. The score is 
# added above all lower scores. If the score is equal to any of the 
# previous scores, it will be added above the first score with which 
# it is equal. If the score is lower than all other score previously 
# recorded, it will be added to the bottom of the list.
#### SIGNATURE
# add_user_to_scores :: (File, List, List) => Void
#### EXAMPLES
# n/a
def add_user_to_scores(file_path, scores_lst, user_score_entry):
    if len(scores_lst) == 0:
        scores_lst.append(user_score_entry)
    else:
        for i in range(len(scores_lst)):
            if user_score_entry[1] >= scores_lst[i][1]:
                scores_lst.insert(i,user_score_entry)
                added = True
                break
            else:
                added = False
        if not added:
            scores_lst.append(user_score_entry)
    save_scores(file_path, scores_lst)

#### PURPOSE
# The function overwrites the scores file using the list of scores,
# which now includes the new score from the last game played.
#### SIGNATURE
# save_scores :: (File, List) => Void
#### EXAMPLES
# n/a
def save_scores(file_path, scores_lst):
    with open(file_path, "w") as file:
        for entry in scores_lst:
            data = "{},{}\n".format(entry[0],entry[1])
            file.write(data)

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the NORTH of the space. It will resolve True if placing the 
# tile will create a sandwich, a series of the opposing player's tiles
# between two of the current player's tiles. 
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# north_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# north_legal_move(6, 3) => True
# north_legal_move(2, 4) => False
# north_legal_move(0,0) => False
def north_legal_move(row, column):
    next_row = north_next_row(row)
    if row >= 2 and SPACES[next_row][column] == PLAYER[1]:
        stop_row = north_stop_row(row, column)
        if SPACES[stop_row][column] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the row directly north of the
# attempted space.
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# north_next_row :: Int => Int
#### EXAMPLES
# north_next_row(6) => 5
# north_next_row(5) => 4
# north_next_row(4) => 3
def north_next_row(row):
    return row - 1

#### PURPOSE
# This function returns the index of the row of the second to last tile
# in the sandwich that will be made if the move if chosen (i.e., the last
# of the opposing player's tiles to be flipped.)
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# north_stop_row :: (Int, Int) => Int
#### EXAMPLES
# north_stop_row(7,4) => 6
# north_stop_row(5,1) => 2
# north_stop_row(4,4) => 1
def north_stop_row(row, column):
    i = 1
    while SPACES[row - i][column] == PLAYER[1] and row - i > 0:
        i += 1 
    return row - i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# north_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def north_flip_tiles(row, column):
    if north_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_row = north_next_row(row)
        stop_row = north_stop_row(row, column)
        tile_y_coord += SQUARE
        while next_row > stop_row:
            draw_tile(tile_x_coord, tile_y_coord)
            next_row -= 1
            tile_y_coord += SQUARE

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the NORTH EAST of the space. It will resolve True if placing
# the tile will create a sandwich, a series of the opposing player's tiles 
# between two of the current player's tiles.
# Note: NORTH EAST = from bottom left to top right, decreasing row index,
# increasing column index, increasing x-coordinate, increasing y-coordinate.
#### SIGNATURE
# NE_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# NE_legal_move(7, 0) => True
# NE_legal_move(5, 4) => True
# NE_legal_move(2, 7) => False
def NE_legal_move(row, column):
    next_row = NE_next_row(row)
    next_col = NE_next_col(column)
    if row >= 2 and column < BOARD_SIZE - 2 and SPACES[next_row][next_col] == PLAYER[1]:
        stop_row = NE_stop_row(row, column)
        stop_col = NE_stop_col(row, column)
        if SPACES[stop_row][stop_col] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the row directly NORTH of the
# attempted space.
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# NE_next_row :: Int => Int
#### EXAMPLES
# north_next_row(6) => 5
# north_next_row(5) => 4
# north_next_row(4) => 3
def NE_next_row(row):
    return row - 1

#### PURPOSE
# This function returns the index of the column directly EAST of the
# attempted space.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# NE_next_col :: Int => Int
#### EXAMPLES
# NE_next_col(5) => 6
# NE_next_col(2) => 3
# NE_next_col(3) => 4
def NE_next_col(column):
    return column + 1

#### PURPOSE
# This function returns the index of the row of the second to last tile
# in the sandwich that will be made if the move if chosen (i.e., the last
# of the opposing player's tiles to be flipped.)
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# NE_stop_row :: (Int, Int) => Int
#### EXAMPLES
# NE_stop_row(7,4) => 6
# NE_stop_row(5,1) => 2
# NE_stop_row(4,4) => 1
def NE_stop_row(row, column):
    i = 1
    while SPACES[row - i][column + i] == PLAYER[1] and row - i > 0 and column + i < BOARD_SIZE - 1:
        i += 1
    return row - i

#### PURPOSE
# This function returns the index of the column of the second to last
# tile in the sandwich that will be made if the move if chosen.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# NE_stop_col :: (Int, Int) => Int
#### EXAMPLE
# NE_stop_col(3, 3) => 4
# NE_stop_col(4, 4) => 5
def NE_stop_col(row, column):
    i = 1
    while SPACES[row - i][column + i] == PLAYER[1] and row - i > 0 and column + i < BOARD_SIZE - 1:
        i += 1
    return column + i  

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
#### SIGNATURE
# NE_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def NE_flip_tiles(row, column):
    if NE_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_row = NE_next_row(row)
        next_col = NE_next_col(column)
        stop_row = NE_stop_row(row, column)
        stop_col = NE_stop_col(row, column)
        tile_x_coord += SQUARE
        tile_y_coord += SQUARE
        while next_row > stop_row and next_col < stop_col:
            draw_tile(tile_x_coord, tile_y_coord)
            next_row -= 1
            next_col += 1
            tile_x_coord += SQUARE
            tile_y_coord += SQUARE

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the EAST of the space. It will resolve True if placing the 
# tile will create a sandwich, a series of the opposing player's tiles 
# between two of the current player's tiles.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# east_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# east_legal_move(5, 2) => True
# east_legal_move(4, 3) => False
# east_legal_move(7, 7) => False
def east_legal_move(row, column):
    next_col = east_next_col(column)
    if column < BOARD_SIZE - 2 and SPACES[row][next_col] == PLAYER[1]:
        stop_col = east_stop_col(row, column)
        if SPACES[row][stop_col] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the column directly east of the
# attempted space.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# east_next_col :: Int => Int
#### EXAMPLES
# east_next_col(4) => 5
# east_next_col(5) => 6
# east_next_col(0) => 1
def east_next_col(column):
    return column + 1

#### PURPOSE
# This function returns the index of the column of the second to last
# tile in the sandwich that will be made if the move if chosen.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# east_stop_col :: (Int, Int) => Int
#### EXAMPLE
# east_stop_col(2, 3) => 4
# east_stop_col(3, 1) => 3
# east_stop_col(0, 7) => 5
def east_stop_col(row, column):
    i = 1
    while SPACES[row][column + i] == PLAYER[1] and column + i < BOARD_SIZE - 1:
        i += 1
    return column + i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
#### SIGNATURE
# east_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def east_flip_tiles(row, column):
    if east_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_col = east_next_col(column)
        stop_col = east_stop_col(row, column)
        tile_x_coord += SQUARE
        while next_col < stop_col:
            draw_tile(tile_x_coord, tile_y_coord)
            next_col += 1  
            tile_x_coord += SQUARE     

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the SOUTH EAST of the space. It will resolve True if placing
# the tile will create a sandwich, a series of the opposing player's tiles 
# between two of the current player's tiles.
# Note: SOUTH EAST = from top left to bottom right, increasing row index,
# increasing column index, increasing x-coordinate, decreasing y-coordinate.
#### SIGNATURE
# SE_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# SE_legal_move(7, 0) => False
# SE_legal_move(3, 4) => True
# SE_legal_move(1, 7) => False
def SE_legal_move(row, column):
    next_row = SE_next_row(row)
    next_col = SE_next_col(column)
    if row < BOARD_SIZE - 2 and column < BOARD_SIZE - 2 and SPACES[next_row][next_col] == PLAYER[1]:
        stop_row = SE_stop_row(row, column)
        stop_col = SE_stop_col(row, column)
        if SPACES[stop_row][stop_col] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the row directly SOUTH of the
# attempted space.
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# SE_next_row :: Int => Int
#### EXAMPLES
# SE_next_row(6) => 7
# SE_next_row(5) => 6
# SE_next_row(4) => 5
def SE_next_row(row):
    return row + 1

#### PURPOSE
# This function returns the index of the column directly EAST of the
# attempted space.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# SE_next_col :: Int => Int
#### EXAMPLES
# SE_next_col(5) => 6
# SE_next_col(2) => 3
# SE_next_col(3) => 4
def SE_next_col(column):
    return column + 1

#### PURPOSE
# This function returns the index of the row of the second to last tile
# in the sandwich that will be made if the move if chosen (i.e., the last
# of the opposing player's tiles to be flipped.)
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# SE_stop_row :: (Int, Int) => Int
#### EXAMPLES
# SE_stop_row(3,4) => 5
# SE_stop_row(5,1) => 7
# SE_stop_row(4,4) => 7
def SE_stop_row(row, column):
    i = 1
    while SPACES[row + i][column + i] == PLAYER[1] and row + i < BOARD_SIZE - 1 and column + i < BOARD_SIZE - 1:
        i += 1
    return row + i

#### PURPOSE
# This function returns the index of the column of the second to last
# tile in the sandwich that will be made if the move if chosen.
# Note: EAST = from left to right of board, increasing column index,
# increasing x-coordinate.
#### SIGNATURE
# SE_stop_col :: (Int, Int) => Int
#### EXAMPLE
# SE_stop_col(3, 3) => 6
def SE_stop_col(row, column):
    i = 1
    while SPACES[row + i][column + i] == PLAYER[1] and row + i < BOARD_SIZE - 1 and column + i < BOARD_SIZE - 1:
        i += 1
    return column + i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
#### SIGNATURE
# SE_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def SE_flip_tiles(row, column):
    if SE_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_row = SE_next_row(row)
        next_col = SE_next_col(column)
        stop_row = SE_stop_row(row, column)
        stop_col = SE_stop_col(row, column)  
        tile_x_coord += SQUARE
        tile_y_coord -= SQUARE
        while next_row < stop_row and next_col < stop_col:
            draw_tile(tile_x_coord, tile_y_coord)
            next_row += 1
            next_col += 1
            tile_x_coord += SQUARE
            tile_y_coord -= SQUARE 

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the SOUTH of the space. It will resolve True if placing the 
# tile will create a sandwich, a series of the opposing player's tiles
# between two of the current player's tiles. 
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# south_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# south_legal_move(4, 3) => True
def south_legal_move(row, column):
    next_row = south_next_row(row)
    if row < BOARD_SIZE - 2 and SPACES[next_row][column] == PLAYER[1]:
        stop_row = south_stop_row(row, column)
        if SPACES[stop_row][column] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the row directly SOUTH of the
# attempted space.
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# south_next_row :: Int => Int
#### EXAMPLES
# south_next_row(3) => 4
def south_next_row(row):
    return row + 1

#### PURPOSE
# This function returns the index of the row of the second to last tile
# in the sandwich that will be made if the move if chosen (i.e., the last
# of the opposing player's tiles to be flipped.)
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# south_stop_row :: (Int, Int) => Int
#### EXAMPLES
# south_stop_row(3,4) => 6
def south_stop_row(row, column):
    i = 1
    while SPACES[row + i][column] == PLAYER[1] and row + i < BOARD_SIZE - 1:
        i += 1
    return row + i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# south_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def south_flip_tiles(row, column):
    if south_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_row = south_next_row(row)
        stop_row = south_stop_row(row, column)
        tile_y_coord -= SQUARE
        while next_row < stop_row:
            draw_tile(tile_x_coord, tile_y_coord)
            next_row += 1
            tile_y_coord -= SQUARE

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the SOUTH WEST of the space. It will resolve True if placing
# the tile will create a sandwich, a series of the opposing player's tiles 
# between two of the current player's tiles.
# Note: SOUTH WEST = from top right to bottom left, increasing row index,
# decreasing column index, decreasing x-coordinate, decreasing y-coordinate.
#### SIGNATURE
# SW_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# SW_legal_move(1, 6) => True
def SW_legal_move(row, column):
    next_row = SW_next_row(row)
    next_col = SW_next_col(column)
    if row < BOARD_SIZE - 2 and column >= 2 and SPACES[next_row][next_col] == PLAYER[1]:
        stop_row = SW_stop_row(row, column)
        stop_col = SW_stop_col(row, column)
        if SPACES[stop_row][stop_col] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the row directly SOUTH of the
# attempted space.
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# SW_next_row :: Int => Int
#### EXAMPLES
# SW_next_row(5) => 6
def SW_next_row(row):
    return row + 1

#### PURPOSE
# This function returns the index of the column directly WEST of the
# attempted space.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# SW_next_col :: Int => Int
#### EXAMPLES
# SW_next_col(5) => 4
def SW_next_col(column):
    return column - 1

#### PURPOSE
# This function returns the index of the row of the second to last tile
# in the sandwich that will be made if the move if chosen (i.e., the last
# of the opposing player's tiles to be flipped.)
# Note: SOUTH = from top to bottom of board, increasing row index, 
# decreasing y-coordinate.
#### SIGNATURE
# SW_stop_row :: (Int, Int) => Int
#### EXAMPLES
# SW_stop_row(0,7) => 4
def SW_stop_row(row, column):
    i = 1
    while SPACES[row + i][column - i] == PLAYER[1] and row + i < BOARD_SIZE - 1 and column - i > 0:
        i += 1
    return row + i

#### PURPOSE
# This function returns the index of the column of the second to last
# tile in the sandwich that will be made if the move if chosen.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# SW_stop_col :: (Int, Int) => Int
#### EXAMPLE
# SW_stop_col(1, 7) => 4
def SW_stop_col(row, column):
    i = 1
    while SPACES[row + i][column - i] == PLAYER[1] and row + i < BOARD_SIZE - 1 and column - i > 0:
        i += 1
    return column - i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
#### SIGNATURE
# SW_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def SW_flip_tiles(row, column):
    if SW_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_row = SW_next_row(row)
        next_col = SW_next_col(column)
        stop_row = SW_stop_row(row, column)
        stop_col = SW_stop_col(row, column)
        tile_x_coord -= SQUARE
        tile_y_coord -= SQUARE
        while next_row < stop_row and next_col > stop_col:
            draw_tile(tile_x_coord, tile_y_coord)
            next_row += 1
            next_col -= 1
            tile_x_coord -= SQUARE
            tile_y_coord -= SQUARE

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the WEST of the space. It will resolve True if placing the 
# tile will create a sandwich, a series of the opposing player's tiles 
# between two of the current player's tiles.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# west_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# west_legal_move(5, 2) => True
# east_legal_move(4, 3) => False
def west_legal_move(row, column):
    next_col = west_next_col(column)
    if column >= 2 and SPACES[row][next_col] == PLAYER[1]:
        stop_col = west_stop_col(row, column)
        if SPACES[row][stop_col] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the column directly WEST of the
# attempted space.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# west_next_col :: Int => Int
#### EXAMPLES
# east_next_col(4) => 3
def west_next_col(column):
    return column - 1

#### PURPOSE
# This function returns the index of the column of the second to last
# tile in the sandwich that will be made if the move if chosen.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# west_stop_col :: (Int, Int) => Int
#### EXAMPLE
# west_stop_col(4, 4) => 1 
def west_stop_col(row, column):
    i = 1
    while SPACES[row][column - i] == PLAYER[1] and column - i > 0:
        i += 1
    return column - i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
#### SIGNATURE
# west_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def west_flip_tiles(row, column):
    if west_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_col = west_next_col(column)
        stop_col = west_stop_col(row, column)
        tile_x_coord -= SQUARE
        while next_col > stop_col:
            draw_tile(tile_x_coord, tile_y_coord)
            next_col -= 1
            tile_x_coord -= SQUARE  

#### PURPOSE
# This function evaluates the validity of a move by looking at existing 
# tiles to the NORTH WEST of the space. It will resolve True if placing
# the tile will create a sandwich, a series of the opposing player's tiles 
# between two of the current player's tiles.
# Note: NORTH WEST = from bottom left to top right, decreasing row index,
# decreasing column index, decreasing x-coordinate, increasing y-coordinate.
#### SIGNATURE
# NW_legal_move :: (Int, Int) => Bool
#### EXAMPLES
# NW_legal_move(0, 0) => False
# NW_legal_move(7, 7) => True
def NW_legal_move(row, column):
    next_row = NW_next_row(row)
    next_col = NW_next_col(column)
    if row >= 2 and column >= 2 and SPACES[next_row][next_col] == PLAYER[1]:
        stop_row = NW_stop_row(row, column)
        stop_col = NW_stop_col(row, column)
        if SPACES[stop_row][stop_col] == PLAYER[0]:
            return True
    return False

#### PURPOSE
# This function returns the index of the row directly NORTH of the
# attempted space.
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# NW_next_row :: Int => Int
#### EXAMPLES
# north_next_row(6) => 5
def NW_next_row(row):
    return row - 1

#### PURPOSE
# This function returns the index of the column directly WEST of the
# attempted space.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# NW_next_col :: Int => Int
#### EXAMPLES
# NW_next_col(5) => 4
def NW_next_col(column):
    return column - 1

#### PURPOSE
# This function returns the index of the row of the second to last tile
# in the sandwich that will be made if the move if chosen (i.e., the last
# of the opposing player's tiles to be flipped.)
# Note: NORTH = from bottom to top of board, decreasing row index, 
# increasing y-coordinate.
#### SIGNATURE
# NW_stop_row :: (Int, Int) => Int
#### EXAMPLES
# NW_stop_row(3, 4) => 2
def NW_stop_row(row, column):
    i = 1
    while SPACES[row - i][column - i] == PLAYER[1] and row - i > 0 and column - i > 0:
        i += 1
    return row - i

#### PURPOSE
# This function returns the index of the column of the second to last
# tile in the sandwich that will be made if the move if chosen.
# Note: WEST = from right to left of board, decreasing column index,
# decreasing x-coordinate.
#### SIGNATURE
# NW_stop_col :: (Int, Int) => Int
#### EXAMPLE
# NW_stop_col(4, 5) => 3
def NW_stop_col(row, column):
    i = 1
    while SPACES[row - i][column - i] == PLAYER[1] and row - i > 0 and column - i > 0:
        i += 1
    return column - i

#### PURPOSE
# This function flips the necessary tiles in a given direction based on
# the player's selected move, if and only if the placement of the tile
# should legally flip tiles in said direction.
#### SIGNATURE
# SE_flip_tiles :: (Int, Int) => Void
#### EXAMPLES
# n/a
def NW_flip_tiles(row, column):
    if NW_legal_move(row, column):
        tile_x_coord, tile_y_coord = COORDINATES[row][column]
        next_row = NW_next_row(row)
        next_col = NW_next_col(column)
        stop_row = NW_stop_row(row, column)
        stop_col = NW_stop_col(row, column)
        tile_x_coord -= SQUARE
        tile_y_coord += SQUARE
        while next_row > stop_row and next_col > stop_col:
            draw_tile(tile_x_coord, tile_y_coord)
            next_row -= 1
            next_col -= 1
            tile_x_coord -= SQUARE
            tile_y_coord += SQUARE

# MAIN
def main():
    # prepare game
    init_game()

    # update legal moves before first user turn
    update_legal_moves()

    # update dynamic text before first user turn
    update_dynamic_text()

    # begin game, user goes first
    start_user_move()

if __name__ == "__main__":
    main()
    turtle.done()