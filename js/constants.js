'use strict'
const IN_PRODUCTION = true;

const FONT_DEFAULT = "Press Start 2P";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 3;
const MAX_HP = 5;
const GAMEOVER_PENALTY = 2;

const RED = '#f05e5e';
const DARK_RED = '#bb4c4c';
const BLUE = '#5e89f0';
const DARK_BLUE = '#4665b0';
const YELLOW = '#ffe458';
const LIGHT_BLUE = '#5ef0d6';
const BLACK = '#666';
const PLAYER1_WIN_COLOR = RED;
const PLAYER2_WIN_COLOR = BLUE;
const DRAW_COLOR = 'purple';
const CLEAR_LINE_COLORS = [
    YELLOW,
    LIGHT_BLUE,
];

const BOARD_SCREEN_WIDTH = COLS * BLOCK_SIZE;
const BOARD_SCREEN_HEIGHT = ROWS * BLOCK_SIZE;
const ACCOUNT_SCREEN_WIDTH = 7 * BLOCK_SIZE;
const KEY_MAP_HEIGHT = 150;
const SCREEN_WIDTH = BOARD_SCREEN_WIDTH + ACCOUNT_SCREEN_WIDTH * 2;
const SCREEN_HEIGHT = BOARD_SCREEN_HEIGHT + KEY_MAP_HEIGHT;
const KEY_MAP_WIDTH = SCREEN_WIDTH / 2;
const PLAYER1_HP_X = 160;
const PLAYER1_HP_Y = 270;
const PLAYER1_HPBAR_X = 170;
const PLAYER1_HPBAR_Y = 300;
const PLAYER1_HPBAR_FILL_COLOR = RED;
const PLAYER_HPBAR_BORDER_COLOR1 = DARK_RED;
const PLAYER2_HP_X = 522;
const PLAYER2_HP_Y = 270;
const PLAYER2_HPBAR_X = 530;
const PLAYER2_HPBAR_Y = 300;
const PLAYER2_HPBAR_FILL_COLOR = BLUE;
const PLAYER_HPBAR_BORDER_COLOR2 = DARK_BLUE;
const PLAYER_HPBAR_WIDTH = 20;
const PLAYER_HPBAR_HEIGHT = 307.5;
const PLAYER_HPBAR_LINEWIDTH = 3;
const PLAYER1_X = -20;
const PLAYER1_Y = 350;
const PLAYER2_X = 510;
const PLAYER2_Y = 350;
const TURN_X = 100;
const TURN_Y = 50;
const TURN_AVATOR_X = -20;
const TURN_AVATOR_Y = -10;
const NEXT_PIECE_X = 12;
const NEXT_PIECE_Y = 3;
const NEXT_X = 620;
const NEXT_Y = 50;
const IMAGE_WIDTH = 100;
const IMAGE_HEIGHT = 100;

const OFFSET_X = ACCOUNT_SCREEN_WIDTH;
const OFFSET_Y = 3;

const PLAYER_STATUS_NORMAL = 0;
const PLAYER_STATUS_DAMAGED = 1;
const PLAYER_STATUS_DEAD = 2;

const GAME_STATES = {
    READY: 0,
    PLAYING: 1,
    PAUSE: 2,
    GAMEOVER: 3
};
Object.freeze(GAME_STATES);

const TURN = {
    PLAYER1: 1,
    PLAYER2: 2
};
Object.freeze(TURN);

// map keys to their keycode to move the piece
// freeze() convert Object into Enum with 'use strict'
const KEY = {
    P: 80,
    // for player1
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40,
    UP: 38,
    SPACE: 32,
    // for player2
    A: 65,
    D: 68,
    S: 83,
    W: 87,
    C: 67
};
Object.freeze(KEY);

// define game speed
const LEVEL = {
    0: 800,
    1: 500,
    2: 300,
    3: 100,
    4: 70,
    5: 50,
    6: 30,
    7: 30,
    8: 30,
    9: 30,
    10: 30,
    // 1: 720,
    // 2: 630,
    // 3: 550,
    // 4: 470,
    // 5: 380,
    // 6: 300,
    // 7: 220,
    // 8: 130,
    // 9: 100,
    // 10: 80,
    // 11: 80,
    // 12: 80,
    // 13: 70,
    // 14: 70,
    // 15: 70,
    // 16: 50,
    // 17: 50,
    // 18: 50,
    // 19: 30,
    // 20: 30,
    // 29+ is 20ms
}
Object.freeze(LEVEL);

const COLORS = [
    'none',
    RED,
    BLUE
];

const SHAPES_NUM = 7;
const SHAPES = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [0, 0, 2],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [2, 2],
        [2, 2]
    ],
    [
        [0, 2, 2],
        [2, 2, 0],
        [0, 0, 0]
    ],
    [
        [0, 2, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [2, 2, 0],
        [0, 2, 2],
        [0, 0, 0]
    ]
];
Object.freeze(SHAPES);