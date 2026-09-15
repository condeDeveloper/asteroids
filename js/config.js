// Constantes
const W = 800, H = 600;
const SHIP_R = 14;
const SHIP_TURN = 4.2;          // rad/s
const SHIP_THRUST = 260;        // px/s²
const SHIP_FRICTION = 0.995;    // por frame a 60fps (aplicado com dt)
const SHIP_MAX = 420;
const SHIP_INVULN = 2.5;        // s após renascer
const FIRE_COOLDOWN = 0.18;     // s
const BULLET_SPEED = 520, BULLET_LIFE = 1.1, MAX_BULLETS = 5;
const AST_SIZES = { large: { r: 46, pts: 20, speed: 45 }, medium: { r: 26, pts: 50, speed: 75 }, small: { r: 13, pts: 100, speed: 115 } };
const AST_NEXT = { large: 'medium', medium: 'small', small: null };
const START_ASTEROIDS = 4;
const LIVES = 3;
const EXTRA_LIFE_EVERY = 10000;
const HYPER_COOLDOWN = 4;       // s
const RESPAWN_DELAY = 1.6;      // s
