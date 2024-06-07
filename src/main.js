// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let game_config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 320,
        height: 144,
    },
    fps: { forceSetTimeOut: true, target: 30 },
    scene: [Load, Adventure],
    render: {
        pixelArt: true,  // prevent pixel art from getting blurred when scaled
        antialias: false,
        roundPixels: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    }
}
let hud_config = {
    parent: 'hud-canvas',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 320,
        height: 48,
    },
    fps: { forceSetTimeOut: true, target: 30 },
    transparent: true,
    scene: [HUDLoad, HudScene], // Separate scene for HUD elements
    render: {
        pixelArt: true,  // prevent pixel art from getting blurred when scaled
        antialias: false,
        roundPixels: true
    }
};

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, 
    playerVal: {max: 6,
        health: 6,
        rupees: 0,
        keys: 0,
        pos: ''
    }
};

const hud = new Phaser.Game(hud_config);
const game = new Phaser.Game(game_config);
const events = new Phaser.Events.EventEmitter();