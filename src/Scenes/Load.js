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
        //this.load.atlas('link_green_item', 'link/LinkMove/LinkItem.png', 'link/LinkMove/LinkItem.json');
        this.load.atlas('armos_back', 'Armos/ArmosBack/ArmosBack.png', 'Armos/ArmosBack/ArmosBack.json');
        this.load.atlas('armos_front', 'Armos/ArmosFront/ArmosFront.png', 'Armos/ArmosFront/ArmosFront.json');
        this.load.atlas('leever', 'Leever/Leever.png', 'Leever/Leever.json');
        this.load.atlas('octo_front', 'Octo/OctoFront/OctoFront.png', 'Octo/OctoFront/OctoFront.json');
        this.load.atlas('octo_side', 'Octo/OctoSide/OctoSide.png', 'Octo/OctoSide/OctoSide.json');
        
        this.load.image("ice_wand_up", "small_assets/ice_wand_up.png");
        this.load.image("ice_wand_side", "small_assets/ice_wand_side.png");
        this.load.image("sword_up", "small_assets/sword_up.png");
        this.load.image("sword_side", "small_assets/sword_side.png");

        // Load tilemap information
        this.load.image("graveyard_tileset", "zelda_graveyard_tileset.png");
        this.load.image("overworld_tileset", "zelda_overworld_tileset.png");
        this.load.image("forest_tileset", "zelda_forest_tileset.png");
        this.load.image("mountain_tileset", "zelda_mountain_tileset.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("HUD", "HUD.tmj"); 
        this.load.tilemapTiledJSON("overworld", "overworld.tmj");   // Tilemap in JSON
    }

    create() {
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