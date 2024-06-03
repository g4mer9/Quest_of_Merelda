class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas('link_green_walk', 'link/LinkMove/LinkMove.png', 'link/LinkMove/LinkMove.json');
        //this.load.atlas('link_green_item', 'link/LinkMove/LinkItem.png', 'link/LinkMove/LinkItem.json');

        // Load tilemap information
        this.load.image("forest_tileset", "zelda_forest_tileset.png");
        this.load.image("mountain_tileset", "zelda_mountain_tileset.png");                         // Packed tilemap
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
            frameRate: 4,
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
            frameRate: 4,
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
            frameRate: 4,
            repeat: -1
        });
/**
        this.anims.create({
            key: 'green_walk_side',
            frames: this.anims.generateFrameNames('link_green_walk', {
                prefix: "LinkMove-",
                start: 2,
                end: 3,
                suffix: ".png",
                zeroPad: 1
            }),
            frameRate: 4,
            repeat: -1
        });**/

         // ...and pass to the next Scene
         this.scene.start("adventureScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}