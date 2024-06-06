class Adventure extends Phaser.Scene {
    constructor() {
        super("adventureScene");
    }

    init() {
        // variables and settings
        this.move = true; // can move
        this.moving = false; // is moving
        this.tileSize = 8;
        this.playerVelocity = 80;
        this.gameFrame = 0;
        this.relative_gameFrame = 0;
        this.actionable_timer = 0;
        this.actionable_offset = 0;
        this.actionable = true;
    }

    create() {
        this.map_coords = [['A0', '', 'C0', ''], //MUST BE ACCESSED VIA map_coords[y][x]
                            ['A1', 'B1', 'C1', 'D1', ''],
                            ['A2', 'B2', 'C2', 'D2', ''],
                            ['A3', 'B3', 'C3', 'D3', 'D4'],
                            ['A4', 'B4', 'C4', 'D4', ''],
                            ['', '', '', 'D5', '']];
        this.spawn_locations = [{screen: 'C4', type: 'octo_front', x: 850, y: 550}, {screen: 'C4', type: 'octo_front', x: 866, y: 550}];
        this.xKey = this.input.keyboard.addKey('X');
        this.zKey = this.input.keyboard.addKey('Z');
        this.enemies = [];

        this.map = this.add.tilemap("overworld", 8, 8, 0, 0);
        this.overworld_tileset = this.map.addTilesetImage("zelda_overworld_tileset", "overworld_tileset");
        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset","mountain_tileset");
        //this.groundLayer = this.map.createLayer("basic_geometry_layer", 0, 96);
        this.groundLayer = this.map.createLayer("basic-geometry-layer", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset], 0, 0);
        //this.groundLayer.setVisible(true);

        //this.groundLayer.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        }); 

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(480, 550, "link_green_walk", "LinkMove-4.png").setDepth(1000);
        my.sprite.player.x_coord = 1;
        my.sprite.player.y_coord = 4;
        my.sprite.player.map_pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
        
        my.sprite.player.setCollideWorldBounds(false);
        my.sprite.player.element = 'green';
        my.sprite.player.facing = 'up';

        // adjust position to be on tile
        my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
        my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);

        //set up sword
        my.sprite.sword_up = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "sword_up").setDepth(1);
        my.sprite.sword_up.visible = false;
        my.sprite.sword_up.body.enable = false;

        my.sprite.sword_side = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "sword_side").setDepth(2);
        my.sprite.sword_side.visible = false;
        my.sprite.sword_side.body.enable = false;

        
        my.sprite.ice_wand_up = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "ice_wand_up").setDepth(1);
        my.sprite.ice_wand_up.visible = false;
        my.sprite.ice_wand_up.body.enable = false;

        my.sprite.ice_wand_side = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "ice_wand_side").setDepth(2);
        my.sprite.ice_wand_side.visible = false;
        my.sprite.ice_wand_side.body.enable = false;

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
        // console.log("in screenSetup!");
        this.move = false;
        this.mapCamera.isMoving = true;
        this.spawn_locations.forEach((spawn) =>{
            //console.log(spawn.screen, ", ", my.sprite.player.map_pos)
            if(spawn.screen == my.sprite.player.map_pos) {
                my.sprite.enemy = this.physics.add.sprite(spawn.x, spawn.y, spawn.type);
                my.sprite.enemy.map_pos = my.sprite.player.map_pos;
                this.enemies.push(my.sprite.enemy);
            }
        })
    }

    screenStart() {
        // console.log("in screenStart!");
        this.actionable_timer = 0;
        this.move = true;
        this.mapCamera.isMoving = false;
        this.relative_gameFrame = 0;
        //console.log(my.sprite.player.map_pos)
    }

    // Function to update player hitbox based on animation
    updatePlayerHitbox(animation) {
        if (animation === 'side'|| animation === 'down') {
            my.sprite.player.body.setSize(16, 16)
            my.sprite.player.body.setOffset(0, 0)
        } else if (animation === 'up') {
            my.sprite.player.body.setSize(12, 15)
            my.sprite.player.body.setOffset(0, 0)
        }
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
            my.sprite.player.x_coord++;
            my.sprite.player.map_pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())   
            this.relative_gameFrame = 0;     
            
            
        } else if (playerScreenX < 0) {
            my.sprite.player.x_coord--;   
            my.sprite.player.map_pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            this.screenSetup();
            cam.pan(cam.scrollX - boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
            this.relative_gameFrame = 0;  
            }
        // Move camera vertical
        if (playerScreenY > boundsHeight) {
            my.sprite.player.y_coord++;   
            my.sprite.player.map_pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];

            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY + boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart()) 
            this.relative_gameFrame = 0;  
            
        } else if (playerScreenY < 0) {
            my.sprite.player.y_coord--;
            my.sprite.player.map_pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY - boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())  
            this.relative_gameFrame = 0;     
            
        }
    }

    update() {
        let anim;
        this.checkCameraBounds();
        if(this.actionable_offset > 0) this.actionable_offset--;
        if(this.actionable_timer > 0 ) this.actionable_timer--;
        else {
            if(this.actionable_offset <= 0) this.actionable = true; 
            let anim = null;
            if(my.sprite.player.anims.currentAnim && (my.sprite.player.anims.currentAnim.key.includes("item")  || my.sprite.player.anims.currentAnim.key.includes("pickup"))){ 
                if(!this.mapCamera.isMoving)this.move = true;
                switch (my.sprite.player.facing) {
                case 'up':
                    anim = my.sprite.player.element+'_walk_up';
                    my.sprite.player.anims.play(anim, true);
                    my.sprite.player.anims.stop();
                    this.updatePlayerHitbox("up");
                    my.sprite.sword_up.visible = false;
                    my.sprite.ice_wand_up.visible = false;
                    break;
                case 'down':
                    anim = my.sprite.player.element+'_walk_down';
                    my.sprite.player.anims.play(anim, true);
                    my.sprite.player.anims.stop();
                    this.updatePlayerHitbox("down");
                    my.sprite.sword_up.visible = false;
                    my.sprite.ice_wand_up.visible = false;
                    break;
                case 'right':
                    anim = my.sprite.player.element+'_walk_side';
                    my.sprite.player.anims.play(anim, true);
                    my.sprite.player.anims.stop();
                    this.updatePlayerHitbox("right");
                    my.sprite.player.resetFlip();
                    my.sprite.sword_side.visible = false;
                    my.sprite.ice_wand_side.visible = false; 
                    break;
                case 'left':
                    anim = my.sprite.player.element+'_walk_side';
                    my.sprite.player.anims.play(anim, true);
                    my.sprite.player.anims.stop();
                    this.updatePlayerHitbox("left");
                    my.sprite.player.setFlip(true, false);
                    my.sprite.sword_side.visible = false;
                    my.sprite.ice_wand_side.visible = false; 
                    break;
                    

                }
            }

        }

        if (this.move && !this.moving && this.actionable) {
            if(Phaser.Input.Keyboard.JustDown(this.xKey)) {
                this.actionable = false;
                this.actionable_timer = 8;
                this.actionable_offset = this.actionable_timer + 4;
                let anim = null;
                this.move = false;
                switch (my.sprite.player.facing) {
                    case 'up':
                        anim = my.sprite.player.element+'_item_up';
                        my.sprite.sword_up.x = my.sprite.player.x;
                        my.sprite.sword_up.y = my.sprite.player.y - 11;
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.resetFlip(); 
                        break;
                    case 'down':
                        anim = my.sprite.player.element+'_item_down';
                        my.sprite.sword_up.x = my.sprite.player.x;
                        my.sprite.sword_up.y = my.sprite.player.y + 11;
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.setFlip(false, true);
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.x = my.sprite.player.x + 11;
                        my.sprite.sword_side.y = my.sprite.player.y;
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.resetFlip(); 
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.x = my.sprite.player.x - 11;
                        my.sprite.sword_side.y = my.sprite.player.y;
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.setFlip(true, false);
                        break;
                }
                my.sprite.player.anims.play(anim, true);
            } else if(Phaser.Input.Keyboard.JustDown(this.zKey)) {
                my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
                my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);
                this.actionable = false;
                this.actionable_timer = 8;
                this.actionable_offset = this.actionable_timer + 4;
                let anim = null;
                this.move = false;
                switch (my.sprite.player.facing) {
                    case 'up':
                        anim = my.sprite.player.element+'_item_up';
                        my.sprite.ice_wand_up.x = my.sprite.player.x;
                        my.sprite.ice_wand_up.y = my.sprite.player.y - 11;
                        my.sprite.ice_wand_up.visible = true;
                        my.sprite.ice_wand_up.body.enable = true;
                        my.sprite.ice_wand_up.resetFlip(); 
                        break;
                    case 'down':
                        anim = my.sprite.player.element+'_item_down';
                        my.sprite.ice_wand_up.x = my.sprite.player.x;
                        my.sprite.ice_wand_up.y = my.sprite.player.y + 11;
                        my.sprite.ice_wand_up.visible = true;
                        my.sprite.ice_wand_up.body.enable = true;
                        my.sprite.ice_wand_up.setFlip(false, true);
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.ice_wand_side.x = my.sprite.player.x + 11;
                        my.sprite.ice_wand_side.y = my.sprite.player.y;
                        my.sprite.ice_wand_side.visible = true;
                        my.sprite.ice_wand_side.body.enable = true;
                        my.sprite.ice_wand_side.resetFlip(); 
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.ice_wand_side.x = my.sprite.player.x - 11;
                        my.sprite.ice_wand_side.y = my.sprite.player.y;
                        my.sprite.ice_wand_side.visible = true;
                        my.sprite.ice_wand_side.body.enable = true;
                        my.sprite.ice_wand_side.setFlip(true, false);
                        break;
                }
                my.sprite.player.anims.play(anim, true);
            }
            else if(cursors.left.isDown) {
                // TODO: have the player accelerate to the left
                let tX = my.sprite.player.x - 8;
                my.sprite.player.setVelocity(-this.playerVelocity, 0);
                let anim = my.sprite.player.element+'_walk_side';
                my.sprite.player.anims.play(anim, true);
                this.updatePlayerHitbox("side");
                my.sprite.player.facing = 'left';
                my.sprite.player.setFlip(true, false);
            } else if(cursors.right.isDown) {
                // TODO: have the player accelerate to the right
                my.sprite.player.setVelocity(this.playerVelocity, 0);
                let anim = my.sprite.player.element+'_walk_side';
                my.sprite.player.anims.play(anim, true);
                this.updatePlayerHitbox("side")
                my.sprite.player.facing = 'right';
                my.sprite.player.resetFlip();    
            } else if(cursors.up.isDown) {
                // TODO: have the player accelerate to the right
                my.sprite.player.setVelocity(0, -this.playerVelocity);
                let anim = my.sprite.player.element+'_walk_up';
                my.sprite.player.anims.play(anim, true);
                my.sprite.player.facing = 'up';
                this.updatePlayerHitbox("up")
            }else if(cursors.down.isDown) {
                // TODO: have the player accelerate to the right
                my.sprite.player.setVelocity(0, this.playerVelocity);
                let anim = my.sprite.player.element+'_walk_down';
                my.sprite.player.anims.play(anim, true);
                my.sprite.player.facing = 'down';
                this.updatePlayerHitbox("down")
            }else {
                // TODO: set acceleration to 0 and have DRAG take over
                my.sprite.player.setVelocity(0, 0)
                my.sprite.player.anims.stop();
                // adjust position to be on tile
                
            }
        } else {
            
            my.sprite.player.setVelocity(0, 0)
            my.sprite.player.anims.stop();
        }

        if(my.sprite.player.body.deltaX() == 0 && my.sprite.player.body.deltaY() == 0) {
            my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
            my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);
        }

        this.gameFrame++;
        this.relative_gameFrame++;
    }
}