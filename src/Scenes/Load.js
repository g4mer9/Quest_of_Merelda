class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas('link_green_walk', 'link/LinkMove/LinkMove.png', 'link/LinkMove/LinkMove.json');
        this.load.atlas('link_green_item', 'link/LinkItem/LinkItem.png', 'link/LinkItem/LinkItem.json');
        this.load.image('link_green_pickup', 'link/LinkPickup/LinkPickup-0.png');
        
        this.load.atlas('link_ice_walk', 'Link-Ice/LinkMove-Ice/LinkMove-Ice.png', 'Link-Ice/LinkMove-Ice/LinkMove-Ice.json');
        this.load.atlas('link_ice_item', 'Link-Ice/LinkItem-Ice/LinkItem-Ice.png', 'Link-Ice/LinkItem-Ice/LinkItem-Ice.json');
        this.load.image('link_ice_pickup', 'Link-Ice/LinkPickup-Ice/LinkPickup-Ice-0.png');

        this.load.atlas('link_fire_walk', 'Link-Fire/LinkMove-Fire/LinkMove-Fire.png', 'Link-Fire/LinkMove-Fire/LinkMove-Fire.json');
        this.load.atlas('link_fire_item', 'Link-Fire/LinkItem-Fire/LinkItem-Fire.png', 'Link-Fire/LinkItem-Fire/LinkItem-Fire.json');
        this.load.image('link_fire_pickup', 'Link-Fire/LinkPickup-Fire/LinkPickup-Fire-0.png');

        this.load.atlas('link_lightning_walk', 'Link-Lightning/LinkMove-Lightning/LinkMove-Lightning.png', 'Link-Lightning/LinkMove-Lightning/LinkMove-Lightning.json');
        this.load.atlas('link_lightning_item', 'Link-Lightning/LinkItem-Lightning/LinkItem-Lightning.png', 'Link-Lightning/LinkItem-Lightning/LinkItem-Lightning.json');
        this.load.image('link_lightning_pickup', 'Link-Lightning/LinkPickup-Lightning/LinkPickup-Lightning-0.png');

        this.load.atlas('link_dark_walk', 'Link-Dark/LinkMove-Dark/LinkMove-Dark.png', 'Link-Dark/LinkMove-Dark/LinkMove-Dark.json');
        this.load.atlas('link_dark_item', 'Link-Dark/LinkItem-Dark/LinkItem-Dark.png', 'Link-Dark/LinkItem-Dark/LinkItem-Dark.json');
        this.load.image('link_dark_pickup', 'Link-Dark/LinkPickup-Dark/LinkPickup-Dark-0.png');

        this.load.atlas('link_light_walk', 'Link-Light/LinkMove-Light/LinkMove-Light.png', 'Link-Light/LinkMove-Light/LinkMove-Light.json');
        this.load.atlas('link_light_item', 'Link-Light/LinkItem-Light/LinkItem-Light.png', 'Link-Light/LinkItem-Light/LinkItem-Light.json');
        this.load.image('link_light_pickup', 'Link-Light/LinkPickup-Light/LinkPickup-Light-0.png');
        //this.load.atlas('link_green_item', 'link/LinkMove/LinkItem.png', 'link/LinkMove/LinkItem.json');
        this.load.atlas('armos_back', 'Armos/ArmosBack/ArmosBack.png', 'Armos/ArmosBack/ArmosBack.json');
        this.load.atlas('armos_front', 'Armos/ArmosFront/ArmosFront.png', 'Armos/ArmosFront/ArmosFront.json');
        this.load.atlas('leever', 'Leever/Leever.png', 'Leever/Leever.json');
        this.load.atlas('octo_front', 'Octo/OctoFront/OctoFront.png', 'Octo/OctoFront/OctoFront.json');
        this.load.atlas('octo_side', 'Octo/OctoSide/OctoSide.png', 'Octo/OctoSide/OctoSide.json');
        
        this.load.image("ice_wand_up", "small_assets/ice_wand_up.png");
        this.load.image("ice_wand_side", "small_assets/ice_wand_side.png");

        this.load.image("fire_wand_up", "small_assets/fire_wand_up.png");
        this.load.image("fire_wand_side", "small_assets/fire_wand_side.png");

        this.load.image("dark_wand_up", "small_assets/dark_wand_up.png");
        this.load.image("dark_wand_side", "small_assets/dark_wand_side.png");

        this.load.image("light_wand_up", "small_assets/light_wand_up.png");
        this.load.image("light_wand_side", "small_assets/light_wand_side.png");

        this.load.image("lightning_wand_up", "small_assets/lightning_wand_up.png");
        this.load.image("lightning_wand_side", "small_assets/lightning_wand_side.png");

        this.load.image("bow", "small_assets/bow.png");
        this.load.image("arrow_up", "small_assets/arrow_up.png");
        this.load.image("arrow_side", "small_assets/arrow_side.png");

        this.load.image("sword_up", "small_assets/sword_up.png");
        this.load.image("sword_side", "small_assets/sword_side.png");
        this.load.image("heart_container", "small_assets/heart_container.png");
        this.load.image("heart", "small_assets/heart.png");
        this.load.image("blue_rupee", "small_assets/blue_rupee.png");
        this.load.image("yellow_rupee", "small_assets/yellow_rupee.png");
        this.load.image("key", "small_assets/key.png");
        this.load.image("cave", "cave.png");
        this.load.image("old_man", "small_assets/old_man.png")

        // Load tilemap information
        this.load.image("teal_dungeon_tileset", "teal_dungeon.png");
        this.load.image("grey_dungeon_tileset", "grey_dungeon.png");
        this.load.image("blue_dungeon_tileset", "blue_dungeon.png");
        this.load.image("orange_dungeon_tileset", "orange_dungeon.png");
        this.load.image("frozen_water", "FrozenWaterTiles.png");
        this.load.image("graveyard_tileset", "zelda_graveyard_tileset.png");
        this.load.image("overworld_tileset", "zelda_overworld_tileset.png");
        this.load.image("forest_tileset", "zelda_forest_tileset.png");
        this.load.image("mountain_tileset", "zelda_mountain_tileset.png");
        this.load.tilemapTiledJSON("HUD", "HUD.tmj"); 
        this.load.tilemapTiledJSON("overworld", "overworld.tmj");   // Tilemap in JSON
    }

    create() {

//GREEN=========================================================================================================================
        this.anims.create({
            key: 'green_walk_up',
            frames: this.anims.generateFrameNames('link_green_walk', {
                prefix: "LinkMove-",
                start: 4,
                end: 5,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'green_walk_down',
            frames: this.anims.generateFrameNames('link_green_walk', {
                prefix: "LinkMove-",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'green_walk_side',
            frames: this.anims.generateFrameNames('link_green_walk', {
                prefix: "LinkMove-",
                start: 2,
                end: 3,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });


        this.anims.create({
            key: 'green_item_side',
            frames: this.anims.generateFrameNames('link_green_item', {
                prefix: "LinkItem-",
                start: 1,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'green_item_up',
            frames: this.anims.generateFrameNames('link_green_item', {
                prefix: "LinkItem-",
                start: 2,
                end: 2,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'green_item_down',
            frames: this.anims.generateFrameNames('link_green_item', {
                prefix: "LinkItem-",
                start: 0,
                end: 0,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 0,
            repeat: -1
        });


//ICE==================================================================================================================

        this.anims.create({
            key: 'ice_walk_up',
            frames: this.anims.generateFrameNames('link_ice_walk', {
                prefix: "LinkMove-Ice-",
                start: 4,
                end: 5,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'ice_walk_side',
            frames: this.anims.generateFrameNames('link_ice_walk', {
                prefix: "LinkMove-Ice-",
                start: 2,
                end: 3,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'ice_walk_down',
            frames: this.anims.generateFrameNames('link_ice_walk', {
                prefix: "LinkMove-Ice-",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'ice_item_side',
            frames: this.anims.generateFrameNames('link_ice_item', {
                prefix: "LinkItem-Ice-",
                start: 1,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'ice_item_up',
            frames: this.anims.generateFrameNames('link_ice_item', {
                prefix: "LinkItem-Ice-",
                start: 2,
                end: 2,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'ice_item_down',
            frames: this.anims.generateFrameNames('link_ice_item', {
                prefix: "LinkItem-Ice-",
                start: 0,
                end: 0,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 0,
            repeat: -1
        });

//FIRE==================================================================================================================

    this.anims.create({
        key: 'fire_walk_up',
        frames: this.anims.generateFrameNames('link_fire_walk', {
            prefix: "LinkMove-Fire-",
            start: 4,
            end: 5,
            suffix: ".png",
            zeroPad: 1
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'fire_walk_side',
        frames: this.anims.generateFrameNames('link_fire_walk', {
            prefix: "LinkMove-Fire-",
            start: 2,
            end: 3,
            suffix: ".png",
            zeroPad: 1
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'fire_walk_down',
        frames: this.anims.generateFrameNames('link_fire_walk', {
            prefix: "LinkMove-Fire-",
            start: 0,
            end: 1,
            suffix: ".png",
            zeroPad: 1
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'fire_item_side',
        frames: this.anims.generateFrameNames('link_fire_item', {
            prefix: "LinkItem-Fire-",
            start: 1,
            end: 1,
            suffix: ".png",
            zeroPad: 1
        }),
        frameRate: 0,
        repeat: -1
    });
    this.anims.create({
        key: 'fire_item_up',
        frames: this.anims.generateFrameNames('link_fire_item', {
            prefix: "LinkItem-Fire-",
            start: 2,
            end: 2,
            suffix: ".png",
            zeroPad: 1
        }),
        frameRate: 0,
        repeat: -1
    });
    this.anims.create({
        key: 'fire_item_down',
        frames: this.anims.generateFrameNames('link_fire_item', {
            prefix: "LinkItem-Fire-",
            start: 0,
            end: 0,
            suffix: ".png",
            zeroPad: 1
        }),
        frameRate: 0,
        repeat: -1
    });

//LIGHTNING==================================================================================================================

this.anims.create({
    key: 'lightning_walk_up',
    frames: this.anims.generateFrameNames('link_lightning_walk', {
        prefix: "LinkMove-Lightning-",
        start: 4,
        end: 5,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'lightning_walk_side',
    frames: this.anims.generateFrameNames('link_lightning_walk', {
        prefix: "LinkMove-Lightning-",
        start: 2,
        end: 3,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'lightning_walk_down',
    frames: this.anims.generateFrameNames('link_lightning_walk', {
        prefix: "LinkMove-Lightning-",
        start: 0,
        end: 1,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'lightning_item_side',
    frames: this.anims.generateFrameNames('link_lightning_item', {
        prefix: "LinkItem-Lightning-",
        start: 1,
        end: 1,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});
this.anims.create({
    key: 'lightning_item_up',
    frames: this.anims.generateFrameNames('link_lightning_item', {
        prefix: "LinkItem-Lightning-",
        start: 2,
        end: 2,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});
this.anims.create({
    key: 'lightning_item_down',
    frames: this.anims.generateFrameNames('link_lightning_item', {
        prefix: "LinkItem-Lightning-",
        start: 0,
        end: 0,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});

//DARK==================================================================================================================

this.anims.create({
    key: 'dark_walk_up',
    frames: this.anims.generateFrameNames('link_dark_walk', {
        prefix: "LinkMove-Dark-",
        start: 4,
        end: 5,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'dark_walk_side',
    frames: this.anims.generateFrameNames('link_dark_walk', {
        prefix: "LinkMove-Dark-",
        start: 2,
        end: 3,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'dark_walk_down',
    frames: this.anims.generateFrameNames('link_dark_walk', {
        prefix: "LinkMove-Dark-",
        start: 0,
        end: 1,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'dark_item_side',
    frames: this.anims.generateFrameNames('link_dark_item', {
        prefix: "LinkItem-Dark-",
        start: 1,
        end: 1,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});
this.anims.create({
    key: 'dark_item_up',
    frames: this.anims.generateFrameNames('link_dark_item', {
        prefix: "LinkItem-Dark-",
        start: 2,
        end: 2,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});
this.anims.create({
    key: 'dark_item_down',
    frames: this.anims.generateFrameNames('link_dark_item', {
        prefix: "LinkItem-Dark-",
        start: 0,
        end: 0,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});

//FIRE==================================================================================================================

this.anims.create({
    key: 'light_walk_up',
    frames: this.anims.generateFrameNames('link_light_walk', {
        prefix: "LinkMove-Light-",
        start: 4,
        end: 5,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'light_walk_side',
    frames: this.anims.generateFrameNames('link_light_walk', {
        prefix: "LinkMove-Light-",
        start: 2,
        end: 3,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'light_walk_down',
    frames: this.anims.generateFrameNames('link_light_walk', {
        prefix: "LinkMove-Light-",
        start: 0,
        end: 1,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 8,
    repeat: -1
});

this.anims.create({
    key: 'light_item_side',
    frames: this.anims.generateFrameNames('link_light_item', {
        prefix: "LinkItem-Light-",
        start: 1,
        end: 1,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});
this.anims.create({
    key: 'light_item_up',
    frames: this.anims.generateFrameNames('link_light_item', {
        prefix: "LinkItem-Light-",
        start: 2,
        end: 2,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});
this.anims.create({
    key: 'light_item_down',
    frames: this.anims.generateFrameNames('link_light_item', {
        prefix: "LinkItem-Light-",
        start: 0,
        end: 0,
        suffix: ".png",
        zeroPad: 1
    }),
    frameRate: 0,
    repeat: -1
});

//ENEMIES===============================================================================================================

        this.anims.create({
            key: 'armos_back',
            frames: this.anims.generateFrameNames('armos_back', {
                prefix: "ArmosBack-",
                start: 1,
                end: 2,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'armos_front',
            frames: this.anims.generateFrameNames('armos_front', {
                prefix: "ArmosFront-",
                start: 1,
                end: 2,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'octo_front',
            frames: this.anims.generateFrameNames('octo_front', {
                prefix: "OctoFront-",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'octo_side',
            frames: this.anims.generateFrameNames('octo_side', {
                prefix: "OctoSide-",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'leever_walk',
            frames: this.anims.generateFrameNames('leever', {
                prefix: "Leever-",
                start: 3,
                end: 4,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 8,
            repeat: -1
        });

         // ...and pass to the next Scene
         this.scene.start("AdventureScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}