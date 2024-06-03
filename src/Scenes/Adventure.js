class Adventure extends Phaser.Scene {
    constructor() {
        super("adventureScene");
    }

    init() {
        // variables and settings
        this.xVelocity = 100;
        this.yVelocity = 100;
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
        my.sprite.player = this.physics.add.sprite(480, 550, "link_green_walk", "link_green_walk_down0.png");
        my.sprite.player.setCollideWorldBounds(false);

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
    }

    checkCameraBounds() {
        const cam = this.mapCamera;
        const boundsWidth = 320;
        const boundsHeight = 144;
        const playerScreenX = my.sprite.player.x - cam.scrollX;
        const playerScreenY = my.sprite.player.y - cam.scrollY;
        console.log(playerScreenY, ", ", boundsHeight)
        // Move camera horizontal 
        if (playerScreenX > boundsWidth && cam.scrollX + boundsWidth < this.map.widthInPixels) {
            cam.scrollX += boundsWidth;
        }
        else if (playerScreenX < 0 && cam.scrollX > 0) {
            cam.scrollX -= boundsWidth;
        }
        // Move camera vertical
        if (playerScreenY > boundsHeight && cam.scrollY + boundsHeight < this.map.heightInPixels) {
            cam.scrollY += boundsHeight;
        }
        else if (playerScreenY < 0 && cam.scrollY >0) {
            cam.scrollY -= boundsHeight;
        }
    }

    isCameraMoving() {
        const cam = this.cameras.main;
        // Check if the camera is currently moving (panning)
        return cam.isMoving;
    }
    update() {
        if (this.isCameraMoving()) {
            my.sprite.player.body.setVelocity(0, 0); // Player stops moving
        }
        //else move
            
        this.checkCameraBounds();
        //console.log("x: ",my.sprite.player.body.x / 8,", y: ", my.sprite.player.body.y / 8);
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setVelocityX(-this.xVelocity);
            my.sprite.player.body.setVelocityY(0);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('green_walk_side', true);

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setVelocityX(this.xVelocity);
            my.sprite.player.body.setVelocityY(0);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('green_walk_side', true);

        } 
        else if(cursors.up.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setVelocityX(0);
            my.sprite.player.body.setVelocityY(-this.yVelocity);
            my.sprite.player.anims.play('green_walk_up', true);

        }
        else if(cursors.down.isDown) {
            my.sprite.player.body.setVelocityX(0);
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setVelocityY(this.yVelocity);
            my.sprite.player.anims.play('green_walk_down', true);

        }
        else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setVelocityX(0);
            my.sprite.player.body.setVelocityY(0);
            my.sprite.player.anims.stop();
        }
    }
}