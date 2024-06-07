class Adventure extends Phaser.Scene {
    constructor() {
        super("AdventureScene");
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
        this.iframes_counter = 0;
        this.actionable = true;
        this.map_coords = [['A0', '', 'C0', ''], //MUST BE ACCESSED VIA map_coords[y][x]
                            ['A1', 'B1', 'C1', 'D1', ''],
                            ['A2', 'B2', 'C2', 'D2', ''],
                            ['A3', 'B3', 'C3', 'D3', 'E3'],
                            ['A4', 'B4', 'C4', 'D4', ''],
                            ['', '', '', 'D5', '']];
        this.spawn_locations = [{screen: 'C4', type: 'octo_front', x: 850, y: 650}, {screen: 'C4', type: 'octo_front', x: 866, y: 650}];
        this.xKey = this.input.keyboard.addKey('X');
        this.zKey = this.input.keyboard.addKey('Z');
        this.enemies = [];
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
//CREATING MAP/TILESETS===================================================================================================================
        this.map = this.add.tilemap("overworld", 8, 8, 0, 0);
        this.overworld_tileset = this.map.addTilesetImage("zelda_overworld_tileset", "overworld_tileset");
        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset","mountain_tileset");
        this.groundLayer = this.map.createLayer("basic-geometry-layer", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset], 0, 0);
        this.groundLayer.setCollisionByProperty({//collision with geometry layer
            collides: true
        }); 
        my.sprite.player = this.add.container(480, 694); // container for player sprites

//ITEMS====================================================================================================================================
        //set up sword
        my.sprite.sword_up = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "sword_up").setDepth(99);
        my.sprite.sword_up.setScale(.75);
        my.sprite.player.add(my.sprite.sword_up);
        my.sprite.sword_up.visible = false;
        my.sprite.sword_up.body.enable = false;
        my.sprite.sword_side = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "sword_side").setDepth(99);
        my.sprite.sword_side.setScale(.75);
        my.sprite.player.add(my.sprite.sword_side);
        my.sprite.sword_side.visible = false;
        my.sprite.sword_side.body.enable = false;

        //set up wand
        my.sprite.ice_wand_up = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "ice_wand_up").setDepth(99);
        my.sprite.player.add(my.sprite.ice_wand_up);
        my.sprite.ice_wand_up.visible = false;
        my.sprite.ice_wand_up.body.enable = false;
        my.sprite.ice_wand_side = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, "ice_wand_side").setDepth(99);
        my.sprite.player.add(my.sprite.ice_wand_side);
        my.sprite.ice_wand_side.visible = false;
        my.sprite.ice_wand_side.body.enable = false;

//PLAYER SETUP============================================================================================================================
        my.sprite.link = this.physics.add.sprite(0, 0, "link_green_walk", "LinkMove-4.png").setDepth(100);
        my.sprite.player.add(my.sprite.link);
        this.physics.world.enable(my.sprite.player);
        my.sprite.player.x_coord = 1;
        my.sprite.player.y_coord = 4;
        my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
        events.emit('mapCursor');
        my.sprite.player.body.setCollideWorldBounds(false);//no out of bounds collision
        my.sprite.player.element = 'green';
        my.sprite.player.facing = 'up';
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Set the size and offset container physics to match link
        my.sprite.player.body.setSize(my.sprite.link.width, my.sprite.link.height, true);
        my.sprite.player.body.setOffset(-my.sprite.link.width / 2, -my.sprite.link.height / 2);

        // Adjust position to be on tile
        my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
        my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);

//DEUBG====================================================================================================================================
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

//CAMERA===================================================================================================================================
        // adjust camera to full game canvas
        this.mapCamera = this.cameras.main
        this.mapCamera.setViewport(0, 0, 320, 144);
        this.mapCamera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.mapCamera.scrollX = 320
        this.mapCamera.scrollY = 576
    }

//SCREEN FUNCTIONS=========================================================================================================================

    screenSetup() {
        // console.log("in screenSetup!");
        this.move = false;
        this.mapCamera.isMoving = true;
        this.spawn_locations.forEach((spawn) =>{
            //console.log(spawn.screen, ", ", my.playerVal.pos)
            if(spawn.screen == my.playerVal.pos) {
                my.sprite.enemy = this.physics.add.sprite(spawn.x, spawn.y, spawn.type);
                my.sprite.enemy.map_pos = my.playerVal.pos;
                this.physics.add.collider(my.sprite.enemy, this.groundLayer);
                this.enemies.forEach((enemy) =>{
                    this.physics.add.collider(my.sprite.enemy, enemy);
                })
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
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())   
            this.relative_gameFrame = 0;     
            
            
        } else if (playerScreenX < 0) {
            my.sprite.player.x_coord--;   
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX - boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
            this.relative_gameFrame = 0;  
            }
        // Move camera vertical
        if (playerScreenY > boundsHeight) {
            my.sprite.player.y_coord++;   
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY + boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart()) 
            this.relative_gameFrame = 0;  
            
        } else if (playerScreenY < 0) {
            my.sprite.player.y_coord--;
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY - boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())  
            this.relative_gameFrame = 0;     
            
        }
    }


//MISC FUNCTIONS=========================================================================================================================

    // Function to update player hitbox based on animation
    updatePlayerHitbox(animation) {
        if (animation === 'side'|| animation === 'down') {
            my.sprite.link.body.setSize(16, 16)
            my.sprite.link.body.setOffset(0, 0)
        } else if (animation === 'up') {
            my.sprite.link.body.setSize(12, 15)
            my.sprite.link.body.setOffset(0, 0)
        }
    }
    
    //sprite collision
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2 - 10))return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight + b.displayHeight - 10)) return false;
        return true;
    }
    
    e_move(enemy) {
        let rand = Math.random();
        if(rand < .25) { //move left
            let targetX = enemy.x - (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetX = targetX;
            enemy.facing = 'left';
            enemy.setVelocity(-this.playerVelocity / 2, 0);
        }
        else if(rand >= .25 && rand < .5) {//move up
            let targetY = enemy.y - (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetY = targetY;
            enemy.facing = 'up';
            enemy.setVelocity(0, -this.playerVelocity / 2);
        }
        else if(rand >= .5 && rand < .75) { //move right
            let targetX = enemy.x + (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetX = targetX;
            enemy.facing = 'right';
            enemy.setVelocity(this.playerVelocity / 2, 0);
        }
        else if(rand > .75) {//move down
            let targetY = enemy.y + (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetY = targetY;
            enemy.facing = 'down';
            enemy.setVelocity(0, this.playerVelocity / 2);
        }
    }

    update() {
        if(!this.mapCamera.isMoving)this.checkCameraBounds();
        //console.log(this.actionable_timer)

//ENEMY CHECKS==========================================================================================================================
        if(this.enemies.length != 0) for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            let prob = 1/5;
            //console.log(enemy.x - enemy.targetX, enemy.y - enemy.targetY)
            if(Math.random() < prob && !enemy.isMoving) {
                enemy.isMoving = true;
                this.e_move(enemy);
            }
            else if(enemy.isMoving) {

                //stopping code
                if((enemy.body.deltaX() == 0 && enemy.body.deltaY() == 0)) enemy.isMoving = false;
                else {
                    switch(enemy.facing){
                        case 'left':
                            if(enemy.x < enemy.targetX || (enemy.body.velocity.x && enemy.body.velocity.x > -this.playerVelocity / 2)) enemy.isMoving = false;
                            break
                        case 'up':
                            if(enemy.y < enemy.targetY || (enemy.body.velocity.y && enemy.body.velocity.y > -this.playerVelocity / 2)) enemy.isMoving = false;
                            break
                        case 'right':
                            if(enemy.x > enemy.targetX || (enemy.body.velocity.x && enemy.body.velocity.x < this.playerVelocity / 2)) enemy.isMoving = false;
                            break
                        case 'down':
                            if(enemy.y > enemy.targetY|| (enemy.body.velocity.y && enemy.body.velocity.y < this.playerVelocity / 2)) enemy.isMoving = false;
                            break
                    }
                } if(!enemy.isMoving){
                    enemy.targetX = null;
                    enemy.targetY = null;
                    enemy.setVelocity(0, 0);
                    enemy.anims.stop();
                }
            }

            if(this.collides(enemy, my.sprite.player) && this.iframes_counter == 0){
                let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, my.sprite.player.x, my.sprite.player.y);
                my.sprite.player.dir = angle;
                this.actionable = false;
                this.actionable_timer = 7;
                this.iframes_counter = 20;
                this.move = false;
            }

            if(enemy.delete == true) this.enemies.splice(i, 1);
        }

//PLAYER CHECKS=========================================================================================================================
        //if(my.sprite.player.dir)console.log(this.actionable_timer)
        if(this.iframes_counter > 0) this.iframes_counter--;
        if(this.actionable_offset > 0) this.actionable_offset--;
        if(this.actionable_timer > 0 ) this.actionable_timer--;
        else { //not actionable yet, but not active
            if(this.actionable_offset <= 0) this.actionable = true; 
            let anim = null;

            //item or pickup anim or hitstun ended, so walk anim must be restored
            if(my.sprite.link.anims.currentAnim && (my.sprite.link.anims.currentAnim.key.includes("item")  || my.sprite.link.anims.currentAnim.key.includes("pickup") || my.sprite.player.dir)){ 
                my.sprite.player.dir = null;
                if(!this.mapCamera.isMoving)this.move = true;
                switch (my.sprite.player.facing) {
                case 'up':
                    anim = my.sprite.player.element+'_walk_up';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("up");
                    my.sprite.sword_up.visible = false;
                    my.sprite.ice_wand_up.visible = false;
                    break;
                case 'down':
                    anim = my.sprite.player.element+'_walk_down';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("down");
                    my.sprite.sword_up.visible = false;
                    my.sprite.ice_wand_up.visible = false;
                    break;
                case 'right':
                    anim = my.sprite.player.element+'_walk_side';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("right");
                    my.sprite.link.resetFlip();
                    my.sprite.sword_side.visible = false;
                    my.sprite.ice_wand_side.visible = false; 
                    break;
                case 'left':
                    anim = my.sprite.player.element+'_walk_side';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("left");
                    my.sprite.link.setFlip(true, false);
                    my.sprite.sword_side.visible = false;
                    my.sprite.ice_wand_side.visible = false; 
                    break;
                    

                }
            }

        }

        if (this.move && !this.moving && this.actionable) { //moveable
            if(Phaser.Input.Keyboard.JustDown(this.xKey)) { //sword button pressed
                this.actionable = false;
                this.actionable_timer = 8;
                this.actionable_offset = this.actionable_timer + 4;
                let anim = null;
                this.move = false;
                switch (my.sprite.player.facing) {
                    case 'up':
                        anim = my.sprite.player.element+'_item_up';
                        my.sprite.sword_up.setPosition(1, -12);
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.resetFlip(); 
                        break;
                    case 'down':
                        anim = my.sprite.player.element+'_item_down';
                        my.sprite.sword_up.setPosition(0, 12);
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.setFlip(false, true);
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.setPosition(12, 1);
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.resetFlip(); 
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.setPosition(-13, 1);
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.setFlip(true, false);
                        break;
                }
                my.sprite.link.anims.play(anim, true);
            } else if(Phaser.Input.Keyboard.JustDown(this.zKey)) { //item button pressed
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
                        my.sprite.ice_wand_up.setPosition(0, -11);
                        my.sprite.ice_wand_up.visible = true;
                        my.sprite.ice_wand_up.body.enable = true;
                        my.sprite.ice_wand_up.resetFlip(); 
                        break;
                    case 'down':
                        anim = my.sprite.player.element+'_item_down';
                        my.sprite.ice_wand_up.setPosition(0, 11);
                        my.sprite.ice_wand_up.visible = true;
                        my.sprite.ice_wand_up.body.enable = true;
                        my.sprite.ice_wand_up.setFlip(false, true);
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.ice_wand_side.setPosition(12, 1);
                        my.sprite.ice_wand_side.visible = true;
                        my.sprite.ice_wand_side.body.enable = true;
                        my.sprite.ice_wand_side.resetFlip();
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.ice_wand_side.setPosition(-12, 1);
                        my.sprite.ice_wand_side.visible = true;
                        my.sprite.ice_wand_side.body.enable = true;
                        my.sprite.ice_wand_side.setFlip(true, false);
                        break;
                }
                my.sprite.link.anims.play(anim, true);
            } else if(cursors.left.isDown) { //move left pressed
                my.sprite.player.body.setVelocity(-this.playerVelocity, 0);
                let anim = my.sprite.player.element+'_walk_side';
                my.sprite.link.anims.play(anim, true);
                this.updatePlayerHitbox("side");
                my.sprite.player.facing = 'left';
                my.sprite.link.setFlip(true, false);
            } else if(cursors.right.isDown) { //move right pressed
                my.sprite.player.body.setVelocity(this.playerVelocity, 0);
                let anim = my.sprite.player.element+'_walk_side';
                my.sprite.link.anims.play(anim, true);
                this.updatePlayerHitbox("side")
                my.sprite.player.facing = 'right';
                my.sprite.link.resetFlip();    
            } else if(cursors.up.isDown) { //move up pressed
                my.sprite.player.body.setVelocity(0, -this.playerVelocity);
                let anim = my.sprite.player.element+'_walk_up';
                my.sprite.link.anims.play(anim, true);
                my.sprite.player.facing = 'up';
                this.updatePlayerHitbox("up")
            }else if(cursors.down.isDown) { //move down pressed
                my.sprite.player.body.setVelocity(0, this.playerVelocity);
                let anim = my.sprite.player.element+'_walk_down';
                my.sprite.link.anims.play(anim, true);
                my.sprite.player.facing = 'down';
                this.updatePlayerHitbox("down")
            }else { //no movement or button pressed
                // TODO: set acceleration to 0 and have DRAG take over
                my.sprite.player.body.setVelocity(0, 0)
                my.sprite.link.anims.stop();
                // adjust position to be on tile
                
            }
        } else { //not moveable
            if(my.sprite.player.dir) {
                // my.sprite.player.x += 2.5 * Math.cos(my.sprite.player.dir);
                // my.sprite.player.y += 2.5 * Math.sin(my.sprite.player.dir);
                let tx = this.playerVelocity * 2 * Math.cos(my.sprite.player.dir);
                let ty = this.playerVelocity * 2 * Math.sin(my.sprite.player.dir);
                my.sprite.player.body.setVelocity(tx, ty);
            }
            else my.sprite.player.body.setVelocity(0, 0)
            my.sprite.link.anims.stop();
        }

        if(my.sprite.player.body.deltaX() == 0 && my.sprite.player.body.deltaY() == 0) {//snap to tile if you have no momentum
            my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
            my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);
        }
//TIMERS=================================================================================================================================
        this.gameFrame++;
        this.relative_gameFrame++;
    }
}