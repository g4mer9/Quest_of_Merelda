class Adventure extends Phaser.Scene {
    constructor() {
        super("adventureScene");
    }

    init() {
        // variables and settings
        this.move = true; // can move
        this.moving = false; // is moving
        this.tileSize = 8;
    }

    create() {
        /**
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);
**/
       

        this.map = this.add.tilemap("overworld", 8, 8, 0, 0);

        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset","mountain_tileset");
        //this.groundLayer = this.map.createLayer("basic_geometry_layer", 0, 96);
        this.groundLayer = this.map.createLayer("basic-geometry-layer", [this.forest_tileset, this.mountain_tileset], 0, 0);
        //this.groundLayer.setVisible(true);

        //this.groundLayer.setScale(2.0);

 // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        }); 

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(480, 550, "link_green_walk", "LinkMove-2.png");
        my.sprite.player.setCollideWorldBounds(false);
        my.sprite.player.element = 'green';

        // adjust position to be on tile
        my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
        my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // adjust camera to full game canvas
        this.mapCamera = this.cameras.main
        this.mapCamera.setViewport(0, 0, 320, 144);
        this.mapCamera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.mapCamera.scrollX = 320
        this.mapCamera.scrollY = 432
    }

    screenSetup() {
        console.log("in screenSetup!");
        this.move = false;
    }

    screenStart() {
        console.log("in screenStart!");
        this.move = true;
    }

    checkCameraBounds() {
        const cam = this.mapCamera;
        const boundsWidth = 320;
        const boundsHeight = 144;
        const playerScreenX = my.sprite.player.x - cam.scrollX;
        const playerScreenY = my.sprite.player.y - cam.scrollY;
        const panDuration = 1000
        // Move camera horizontal 
        if (playerScreenX > boundsWidth) {
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
        } else if (playerScreenX < 0) {
            this.screenSetup();
            cam.pan(cam.scrollX - boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
        }
        // Move camera vertical
        if (playerScreenY > boundsHeight) {
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY + boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
        } else if (playerScreenY < 0) {
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY - boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
        }
    }

    update() {
        let anim;
        this.checkCameraBounds();

        if (this.move && !this.moving) {
            if(cursors.left.isDown) {
                // TODO: have the player accelerate to the left
                let tX = my.sprite.player.x - 8;
                my.sprite.player.setVelocity(-80, 0);
                anim = my.sprite.player.element+'_walk_side';
                my.sprite.player.anims.play(anim, true);
                my.sprite.player.setFlip(true, false);
            } else if(cursors.right.isDown) {
                // TODO: have the player accelerate to the right
                my.sprite.player.setVelocity(80, 0);
                anim = my.sprite.player.element+'_walk_side';
                my.sprite.player.anims.play(anim, true);
                my.sprite.player.resetFlip();    
            } 
            else if(cursors.up.isDown) {
                // TODO: have the player accelerate to the right
                my.sprite.player.setVelocity(0, -80);
                anim = my.sprite.player.element+'_walk_up';
                my.sprite.player.anims.play(anim, true);
            }
            else if(cursors.down.isDown && this.move) {
                // TODO: have the player accelerate to the right
                my.sprite.player.setVelocity(0, 80);
                anim = my.sprite.player.element+'_walk_down';
                my.sprite.player.anims.play(anim, true);
            }
            else {
                // TODO: set acceleration to 0 and have DRAG take over
                my.sprite.player.setVelocity(0, 0)
                my.sprite.player.anims.stop();
                // adjust position to be on tile
                my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
                my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);
            }
        } else {
            my.sprite.player.setVelocity(0, 0)
            my.sprite.player.anims.stop();
            // adjust position to be on tile
            my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
            my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);
        }
    }
}