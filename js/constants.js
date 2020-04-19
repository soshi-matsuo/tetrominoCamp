'use strict'
const IN_PRODUCTION = true;

const FONT_DEFAULT = "Press Start 2P";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const LINES_PER_LEVEL = 3;
const MAX_HP = 10;

const BOARD_SCREEN_WIDTH = COLS * BLOCK_SIZE;
const BOARD_SCREEN_HEIGHT = ROWS * BLOCK_SIZE;
const ACCOUNT_SCREEN_WIDTH = 7 * BLOCK_SIZE;
const KEY_MAP_HEIGHT = 200;
const SCREEN_WIDTH = BOARD_SCREEN_WIDTH + ACCOUNT_SCREEN_WIDTH * 2;
const SCREEN_HEIGHT = BOARD_SCREEN_HEIGHT + KEY_MAP_HEIGHT;
const KEY_MAP_WIDTH = SCREEN_WIDTH / 2;
const PLAYER1_HP_X = 0;
const PLAYER1_HP_Y = 250;
const PLAYER1_HPBAR_X = 170;
const PLAYER1_HPBAR_Y = 300;
const PLAYER1_HPBAR_FILL_COLOR = 'red';
const PLAYER2_HP_X = 520;
const PLAYER2_HP_Y = 250;
const PLAYER2_HPBAR_X = 530;
const PLAYER2_HPBAR_Y = 300;
const PLAYER2_HPBAR_FILL_COLOR = 'blue';
const PLAYER_HPBAR_WIDTH = 20;
const PLAYER_HPBAR_HEIGHT = 307.5;
const PLAYER_HPBAR_LINEWIDTH = 3;
const PLAYER_HPBAR_BORDER_COLOR = 'black';
const PLAYER1_X = 50;
const PLAYER1_Y = 300;
const PLAYER2_X = 570;
const PLAYER2_Y = 300;
const TURN_X = 70;
const TURN_Y = 50;
const NEXT_PIECE_X = 12;
const NEXT_PIECE_Y = 3;
const NEXT_X = 570;
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
    1: 720,
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30,
    // 29+ is 20ms
}
Object.freeze(LEVEL);

const COLORS = [
    'none',
    'red',
    'blue'
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