class Adventure extends Phaser.Scene {
    constructor() {
        super("AdventureScene");
    }

    init(data) {
        //passed in checkpoint values
        this.spawn_x =  data.spawn_x || 480;
        this.spawn_y =  data.spawn_y || 694;
        this.c_x =  data.c_x || 320;
        this.c_y =  data.c_y || 576;
        this.x_coord = data.x_coord || 1;
        this.y_coord = data.y_coord || 4;
        if(data.overworld != null) this.overworld = data.overworld; else this.overworld = true;
        this.items = data.items || [];
        this.max = data.max || 6;
        this.heart_containers_spawn = data.heart_containers_spawn || [0, 1, 2, 3, 4, 5, 6, 7, 8]
        this.rupees = data.rupees || 0;
        this.keys = data.keys || 0;
        
        //setting current game state
        my.playerVal.max = this.max;
        my.playerVal.health = this.max;
        my.playerVal.item = this.items[0];
        my.playerVal.item_index = 0;
        my.playerVal.rupees = this.rupees;
        my.playerVal.keys = this.keys;
        my.gameState.spawn_x =  this.spawn_x;
        my.gameState.spawn_y =  this.spawn_y;
        my.gameState.c_x =  this.c_x;
        my.gameState.c_y =  this.c_y;
        my.gameState.x_coord = this.x_coord;
        my.gameState.y_coord = this.y_coord;
        my.gameState.overworld = this.overworld;
        my.gameState.items = this.items;
        my.gameState.max = this.max;
        my.gameState.rupees = this.rupees;
        my.gameState.keys = this.keys;
        my.gameState.heart_containers_spawn = this.heart_containers_spawn;

        //console.log(my.playerVal.max, my.playerVal.health)
        // variables and settings
        this.move = true; // can move
        this.sailing = false;
        this.frozen = false;
        this.moving = false; // is moving
        this.tileSize = 8;
        this.playerVelocity = 80;
        this.gameFrame = 0;
        this.relative_gameFrame = 0;
        this.actionable_timer = 0;
        this.actionable_offset = 0;
        this.iframes_counter = 0;
        this.actionable = true;
        this.map_coords = [['A0',   '',  'C0', '', 'sub'], //MUST BE ACCESSED VIA map_coords[y][x]
                            ['A1', 'B1', 'C1', 'D1', 'sub',  '',     'ldG1',  ''],
                            ['A2', 'B2', 'C2', 'D2', '',  '',     'ldG2',  ''],
                            ['A3', 'B3', 'C3', 'D3', 'E3', '',    'ldG3', 'ldH3'],
                            ['A4', 'B4', 'C4', 'D4',  '', 'ldF4', 'ldG4', 'ldH4'],
                            ['',    '',   '',  'D5',  '', 'ldF5', 'ldG5', 'ldH5']];
        this.spawn_locations = [{screen: 'C4', item: false, key: false, type: 'ghini', weakness: 'ice', health: 4, x: 850, y: 650}, {screen: 'C4', item: false, key: false, type: 'peahat', weakness: 'ice', health: 4, x: 866, y: 650}, {screen: 'ldF5', item: false, key: true, type: 'darknut', weakness: 'ice', health: 4, x: 1760, y: 800} ];
        this.xKey = this.input.keyboard.addKey('X');
        this.zKey = this.input.keyboard.addKey('Z');
        // this.aKey = this.input.keyboard.addKey('A');
        // this.sKey = this.input.keyboard.addKey('S');
        this.enemies = [];
        this.hearts = [];
        this.yellow_rupees = [];
        this.blue_rupees = [];
        this.keys = [];
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
//CREATING MAP/TILESETS===================================================================================================================
        this.map = this.add.tilemap("overworld", 8, 8, 0, 0);
        
        this.overworld_tileset = this.map.addTilesetImage("zelda_overworld_tileset", "overworld_tileset");
        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset","mountain_tileset");
        this.graveyard_tileset = this.map.addTilesetImage("zelda_graveyard_tileset","graveyard_tileset");
        this.teal_tileset = this.map.addTilesetImage("teal_dungeon", "teal_dungeon_tileset");
        this.teal_dark_tileset = this.map.addTilesetImage("teal_dungeon_dark", "teal_dungeon_dark_tileset");
        this.frozen_tileset = this.map.addTilesetImage("FrozenWaterTiles", "frozen_water");
        this.cave_tileset = this.map.addTilesetImage("cave", "cave");
        this.old_man_tileset = this.map.addTilesetImage("old_man", "old_man");

        this.groundLayer = this.map.createLayer("basic-geometry-layer", [this.forest_tileset, this.mountain_tileset, this.graveyard_tileset, this.overworld_tileset, this.teal_tileset, this.frozen_tileset, this.cave_tileset], 0, 0);
        this.enemyBoundary = this.map.createLayer("boundaries", this.forest_tileset, 0, 0);
        this.darkLayer = this.map.createLayer("dark-layer", [this.teal_dark_tileset], 0, 0);
        this.transitionsLayer = this.map.createLayer("transitions", [this.forest_tileset, this.mountain_tileset, this.graveyard_tileset, this.overworld_tileset], 0, 0);
        this.foregroundLayer = this.map.createLayer("foreground", [this.forest_tileset, this.mountain_tileset, this.graveyard_tileset, this.overworld_tileset, this.teal_tileset, this.old_man_tileset], 0, 0).setDepth(100000);
        this.enemyBoundary.visible = false;
        this.transitionsLayer.visible = false;
        
        this.enemyBoundary.setCollisionByProperty({//collision with geometry layer
            collides: true
        }); 
        this.groundLayer.setCollisionByProperty({//collision with geometry layer
            collides: true
        }); 
        this.foregroundLayer.setCollisionByProperty({//collision with geometry layer
            collides: true
        }); 
        //this.transitionsLayer.setCollisionByExclusion([-1])
        my.sprite.player = this.add.container(this.spawn_x, this.spawn_y).setDepth(100); // container for player sprites

//ITEMS====================================================================================================================================
        //sword
        my.sprite.sword_up = this.physics.add.sprite(0, 0, "sword_up").setDepth(99);
        my.sprite.sword_up.setScale(.75);
        my.sprite.player.add(my.sprite.sword_up);
        my.sprite.sword_up.visible = false;
        my.sprite.sword_up.body.enable = false;
        my.sprite.sword_side = this.physics.add.sprite(0, 0, "sword_side").setDepth(99);
        my.sprite.sword_side.setScale(.75);
        my.sprite.player.add(my.sprite.sword_side);
        my.sprite.sword_side.visible = false;
        my.sprite.sword_side.body.enable = false;

        //arrows
        my.sprite.arrow_up = this.physics.add.sprite(0, 0, "arrow_up").setDepth(1);
        my.sprite.arrow_up.visible = false;
        my.sprite.arrow_up.body.enable = false;
        my.sprite.arrow_up.isMoving = false;
        my.sprite.arrow_side = this.physics.add.sprite(0, 0, "arrow_side").setDepth(1);
        my.sprite.arrow_side.visible = false;
        my.sprite.arrow_side.body.enable = false;
        my.sprite.arrow_side.isMoving = false;

        //wand
        my.sprite.ice_wand_up = this.physics.add.sprite(0, 0, "ice_wand_up").setDepth(99);
        my.sprite.player.add(my.sprite.ice_wand_up);
        my.sprite.ice_wand_up.visible = false;
        my.sprite.ice_wand_up.body.enable = false;
        my.sprite.ice_wand_side = this.physics.add.sprite(0, 0, "ice_wand_side").setDepth(99);
        my.sprite.player.add(my.sprite.ice_wand_side);
        my.sprite.ice_wand_side.visible = false;
        my.sprite.ice_wand_side.body.enable = false;
        this.physics.add.collider(my.sprite.ice_wand_side, this.groundLayer);
        this.physics.add.collider(my.sprite.ice_wand_up, this.groundLayer);

        //boat
        my.sprite.boat = this.physics.add.sprite(0, 0, "boat").setDepth(99);
        my.sprite.player.add(my.sprite.boat);
        my.sprite.boat.visible = false;
        my.sprite.boat.body.enable = false;
        this.physics.add.collider(my.sprite.boat, this.groundLayer);


//OBJECT SETUP==============================================================================================================================
        
        this.heart_containers = this.map.createFromObjects("objects", {
            name: "heart_container",
            key: "heart_container"
        });
        this.heart_containers.forEach((heart_container, index) => {
            heart_container.index = index
          })
        this.hearts_to_delete = this.heart_containers.filter((container, index) => !this.heart_containers_spawn.includes(index));
        
        this.heart_containers = this.heart_containers.filter((container, index) => this.heart_containers_spawn.includes(index));
        this.hearts_to_delete.forEach((heart) =>{ heart.destroy()})
        this.physics.world.enable(this.heart_containers, Phaser.Physics.Arcade.STATIC_BODY);
        this.heart_containers_group = this.add.group(this.heart_containers);

        this.ice_wand_obj = null;
        if(!my.gameState.items.includes("ice")) {

            this.ice_wand_obj = this.map.createFromObjects("objects", {
                name: "ice_wand",
                key: "ice_wand_up"
            });
            this.physics.world.enable(this.ice_wand_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }   this.lightning_wand_obj = null;
        if(!my.gameState.items.includes("lightning")) {

            this.lightning_wand_obj = this.map.createFromObjects("objects", {
                name: "lightning_wand",
                key: "lightning_wand_up"
            });
            this.physics.world.enable(this.lightning_wand_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }   this.light_wand_obj = null;
        if(!my.gameState.items.includes("light")) {

            this.light_wand_obj = this.map.createFromObjects("objects", {
                name: "light_wand",
                key: "light_wand_up"
            });
            this.physics.world.enable(this.light_wand_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }   this.fire_wand_obj = null;
        if(!my.gameState.items.includes("fire")) {

            this.fire_wand_obj = this.map.createFromObjects("objects", {
                name: "fire_wand",
                key: "fire_wand_up"
            });
            this.physics.world.enable(this.fire_wand_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }   this.dark_wand_obj = null;
        if(!my.gameState.items.includes("dark")) {

            this.dark_wand_obj = this.map.createFromObjects("objects", {
                name: "dark_wand",
                key: "dark_wand_up"
            });
            this.physics.world.enable(this.dark_wand_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }   this.bow_obj = null;
        if(!my.gameState.items.includes("bow")) {

            this.bow_obj = this.map.createFromObjects("objects", {
                name: "bow",
                key: "bow"
            });
            this.physics.world.enable(this.bow_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }
        if(!my.gameState.items.includes("boat")) {

            this.boat_obj = this.map.createFromObjects("objects", {
                name: "boat",
                key: "boat"
            });
            this.physics.world.enable(this.boat_obj, Phaser.Physics.Arcade.STATIC_BODY);

        }   



//PLAYER SETUP============================================================================================================================
        my.sprite.link = this.physics.add.sprite(0, 0, "link_green_walk", "LinkMove-4.png").setDepth(100);
        my.sprite.player.add(my.sprite.link);
        this.physics.world.enable(my.sprite.player);
        my.sprite.player.x_coord = this.x_coord;
        my.sprite.player.y_coord = this.y_coord;
        my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
        if(this.overworld) events.emit('mapCursor');
        my.sprite.player.body.setCollideWorldBounds(false);//no out of bounds collision
        my.sprite.player.element = 'green';
        my.sprite.player.facing = 'up';
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        //this.physics.add.collider(my.sprite.player, this.foregroundLayer);
        this.physics.add.overlap(my.sprite.player, this.transitionsLayer, this.handleTransition, null, this);


        // Set the size and offset container physics to match link
        my.sprite.player.body.setSize(my.sprite.link.width, my.sprite.link.height, true);
        my.sprite.player.body.setOffset(-my.sprite.link.width / 2, -my.sprite.link.height / 2);

        // Adjust position to be on tile
        my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
        my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);


//WORLD INTERACTION===========================================================================================================================
        // freeze fountain
        this.groundLayer.setTileIndexCallback(this.overworld_tileset.firstgid + 151, (sprite, tile) => {
            if (sprite === my.sprite.ice_wand_side && my.sprite.ice_wand_side.visible === true && my.sprite.player.element == "ice" && my.sprite.player.x === 360 && my.sprite.player.y === 504) {
                this.freezeFountain();
            }
        }, this);

        // dock boat
        this.groundLayer.setTileIndexCallback(this.forest_tileset.firstgid + 154, (sprite, tile) => {
            if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 1120 && my.sprite.player.y === 680 && my.sprite.player.facing === 'down')) {
                this.dockBoat('down');
            } else if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 1192 && my.sprite.player.y === 504 && my.sprite.player.facing === 'right')) {
                this.dockBoat('right');
            }
        }, this);
        this.groundLayer.setTileIndexCallback(this.mountain_tileset.firstgid + 154, (sprite, tile) => {
            if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 816 && my.sprite.player.y === 352 && my.sprite.player.facing === 'up')) {
                this.dockBoat('up');
            }
        }, this);

        //burn tree
        this.groundLayer.setTileIndexCallback(this.overworld_tileset.firstgid + 210, (sprite, tile) => {
            if (sprite === my.sprite.ice_wand_up && my.sprite.ice_wand_up.visible === true && my.sprite.player.element == "fire" && my.sprite.player.x >=  672 && my.sprite.player.x <= 688 && my.sprite.player.y ==  472) {
                let tiles = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                this.createStairs(tiles, this.forest_tileset);
            }
        }, this);

        //blow up rock
        this.groundLayer.setTileIndexCallback(this.mountain_tileset.firstgid + 190, (sprite, tile) => {
            if (sprite === my.sprite.ice_wand_side && my.sprite.ice_wand_side.visible === true && my.sprite.player.element == "lightning" ) {
                console.log(my.sprite.player.x, my.sprite.player.y)
                // let tiles = [tile];
                // tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                // tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                // tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                // this.createStairs(tiles, this.mountain_tileset);
            }
        }, this);

        //Dungeon doors

        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 156], (sprite, tile) => { //up door
            //console.log(my.playerVal.keys, my.gameState.keys)
            if(my.playerVal.keys > 0) {
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                my.playerVal.keys--;
        my.gameState.keys--;
                this.unlockDoor(tiles);
            }
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 143], (sprite, tile) => { //down door
            //console.log(my.playerVal.keys, my.gameState.keys)
            if(my.playerVal.keys > 0) {
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
                tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y + 1));
                my.playerVal.keys--;
        my.gameState.keys--;
                this.unlockDoor(tiles);
            }
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 177], (sprite, tile) => { //left door
            //console.log(my.playerVal.keys, my.gameState.keys)
            if(my.playerVal.keys > 0) {
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y - 1));
                my.playerVal.keys--;
        my.gameState.keys--;
                this.unlockDoor(tiles);
            }
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 162], (sprite, tile) => { //right door
            //console.log(my.playerVal.keys, my.gameState.keys)
            if(my.playerVal.keys > 0) {
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y + 1));
                my.playerVal.keys--;
        my.gameState.keys--;
                this.unlockDoor(tiles);
            }
        }, this)

        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 180], (sprite, tile) => { //up door
            let tiles  = [tile];
            tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
            tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
            tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
            if(this.enemies.length == 0) this.unlockDoor(tiles);
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 164], (sprite, tile) => { //down door
            let tiles  = [tile];
            tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
            tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
            tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y + 1));
            if(this.enemies.length == 0) this.unlockDoor(tiles);
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 167], (sprite, tile) => { //left door
            let tiles  = [tile];
            tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y));
            tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
            tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y + 1));
            if(this.enemies.length == 0) this.unlockDoor(tiles);
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 166], (sprite, tile) => { //right door
            let tiles  = [tile];
            tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
            tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
            tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y + 1));
            if(this.enemies.length == 0) this.unlockDoor(tiles);
        }, this)

//NON CUTSCENE ITEMS==========================================================================================================================
        this.physics.add.overlap(my.sprite.player, this.hearts, (obj1, obj2) => {
            if(my.playerVal.health >= my.playerVal.max - 1) my.playerVal.health = my.playerVal.max;
            else my.playerVal.health+=2;
            this.hearts.pop();
            obj2.destroy();
        });     

        this.physics.add.overlap(my.sprite.player, this.yellow_rupees, (obj1, obj2) => {
            if(my.playerVal.rupees >= 98) my.playerVal.rupees = 99;
            else my.playerVal.rupees += 1;
            my.gameState.rupees = my.playerVal.rupees;
            this.yellow_rupees.pop();
            obj2.destroy();
        });     

        this.physics.add.overlap(my.sprite.player, this.blue_rupees, (obj1, obj2) => {
            if(my.playerVal.rupees >= 94) my.playerVal.rupees = 99;
            else my.playerVal.rupees += 5;
            my.gameState.rupees = my.playerVal.rupees;

            this.blue_rupees.pop();
            obj2.destroy();
        }); 
        
        this.physics.add.overlap(my.sprite.player, this.keys, (obj1, obj2) => {
            if(my.playerVal.keys >= 8) my.playerVal.keys = 9;
            else my.playerVal.keys++;
            my.gameState.keys = my.playerVal.keys;

            this.keys.pop();
            obj2.destroy();
        }); 

//HEART CONTAINERS===========================================================================================================================
        this.physics.add.overlap(my.sprite.player, this.heart_containers_group, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.playerVal.max +=2;
                my.gameState.max = my.playerVal.max;
                let i = obj2.index
                my.gameState.heart_containers_spawn.splice(i, 1);
                my.playerVal.health = my.playerVal.max;
            }
            
        });

//WANDS======================================================================================================================================

        if(!my.gameState.items.includes("ice")) this.physics.add.overlap(my.sprite.player, this.ice_wand_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            if(this.move) {
                obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("ice");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

        if(!my.gameState.items.includes("dark")) this.physics.add.overlap(my.sprite.player, this.dark_wand_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("dark");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

        if(!my.gameState.items.includes("light")) this.physics.add.overlap(my.sprite.player, this.light_wand_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("light");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

        if(!my.gameState.items.includes("lightning")) this.physics.add.overlap(my.sprite.player, this.lightning_wand_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("lightning");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

        if(!my.gameState.items.includes("fire")) this.physics.add.overlap(my.sprite.player, this.fire_wand_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("fire");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

//OTHER ITEMS======================================================================================================================================

        if(!my.gameState.items.includes("bow")) this.physics.add.overlap(my.sprite.player, this.bow_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("bow");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

        if(!my.gameState.items.includes("boat")) this.physics.add.overlap(my.sprite.player, this.boat_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
            if(this.move) {
                this.move = false;
                this.actionable_timer = 20;
                let anim = 'link_'+my.sprite.player.element+'_pickup';
                my.sprite.link.setTexture(anim);
                //obj2.destroy(); // remove coin on overlap
                this.time.delayedCall(600, () => obj2.destroy())
                my.gameState.items.push("boat");
                //if(my.playerVal.item_index != 0) my.playerVal.item_index++;
                my.playerVal.item_index = my.gameState.items.length - 1;
                my.playerVal.item = my.gameState.items[my.playerVal.item_index];
            }
            
        });

//DEUBG====================================================================================================================================
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
    
        this.input.keyboard.on('keydown-A', () => {
            my.playerVal.item_index--;
            if (my.playerVal.item_index < 0) my.playerVal.item_index = my.gameState.items.length - 1;
            my.playerVal.item = my.gameState.items[my.playerVal.item_index];
        }, this);

        this.input.keyboard.on('keydown-S', () => {
            my.playerVal.item_index++;
            if (my.playerVal.item_index >= my.gameState.items.length) my.playerVal.item_index = 0;
            my.playerVal.item = my.gameState.items[my.playerVal.item_index];
        }, this);

//CAMERA===================================================================================================================================
        // adjust camera to full game canvas
        this.mapCamera = this.cameras.main
        this.mapCamera.setViewport(0, 0, 320, 144);
        this.mapCamera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.mapCamera.scrollX = this.c_x;
        this.mapCamera.scrollY = this.c_y;
    }

//SCREEN FUNCTIONS=========================================================================================================================

    screenSetup() {
        // console.log("in screenSetup!");
        this.move = false;
        this.mapCamera.isMoving = true;
        this.spawn_locations.forEach((spawn) =>{
            //console.log(spawn.screen, ", ", my.playerVal.pos)
            if(spawn.screen == my.playerVal.pos) {
                my.sprite.enemy = this.physics.add.sprite(spawn.x, spawn.y, spawn.type+"_front");
                my.sprite.enemy.type = spawn.type;
                my.sprite.enemy.weakness = spawn.weakness;
                my.sprite.enemy.health = spawn.health;
                my.sprite.enemy.map_pos = my.playerVal.pos;
                my.sprite.enemy.iframes_counter = 0;
                my.sprite.enemy.key = spawn.key;
                my.sprite.enemy.s = spawn.screen;
                this.physics.add.collider(my.sprite.enemy, this.groundLayer);
                this.physics.add.collider(my.sprite.enemy, this.enemyBoundary);
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
        //console.log(my.playerVal.pos, my.sprite.player.x_coord, my.sprite.player.y_coord)
        
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
            if(this.overworld) events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())   
            this.relative_gameFrame = 0;     
            
            
        } else if (playerScreenX < 0) {
            my.sprite.player.x_coord--;   
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            if(this.overworld) events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX - boundsWidth + boundsWidth / 2, cam.scrollY + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())        
            this.relative_gameFrame = 0;  
            }
        // Move camera vertical
        if (playerScreenY > boundsHeight) {
            my.sprite.player.y_coord++;   
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            if(this.overworld) events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY + boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart()) 
            this.relative_gameFrame = 0;  
            
        } else if (playerScreenY < 0) {
            my.sprite.player.y_coord--;
            my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord];
            if(this.overworld) events.emit('mapCursor');
            this.screenSetup();
            cam.pan(cam.scrollX + boundsWidth / 2, cam.scrollY - boundsHeight + boundsHeight / 2, panDuration);
            this.time.delayedCall(panDuration + 50, () => this.screenStart())  
            this.relative_gameFrame = 0;     
            
        }
    }

    handleTransition(player, tile) {
        if(tile.index != -1) {
            player.x = tile.properties['tx'];
            player.y = tile.properties['ty'];
            this.mapCamera.scrollX = tile.properties['cx'];
            this.mapCamera.scrollY = tile.properties['cy'];
            player.x_coord = tile.properties['x_coord'];
            player.y_coord = tile.properties['y_coord'];
            this.overworld = tile.properties['overworld'];
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
    
    collides(sprite1, sprite2) {
        // Ensure both sprites are enabled and part of the Arcade Physics system
        if (sprite1.body && sprite2.body) {
          // Use Phaser's built-in collision check method
          return this.physics.world.collide(sprite1, sprite2)
        }
        return false
      }
    
    e_move(enemy) {
        let rand = Math.random();
        if(rand < .25) { //move left
            let targetX = enemy.x - (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetX = targetX;
            enemy.facing = 'left';
            let anim = null;
            if(enemy.type == "octo" || enemy.type == "darknut" || enemy.type == "lynel") anim = enemy.type+'_side';
            else if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
            else anim = enemy.type + "_front";
            enemy.anims.play(anim, true);
            if(enemy.type != "wizrobe" && enemy.type != "darknut") enemy.resetFlip();
            else enemy.setFlip(true, false);
            enemy.setVelocity(-this.playerVelocity / 2, 0);
        }
        else if(rand >= .25 && rand < .5) {//move up
            let targetY = enemy.y - (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetY = targetY;
            enemy.facing = 'up';
            let anim = null;
            if(enemy.type == "armos" || enemy.type == "darknut" || enemy.type == "lynel" || enemy.type == "wizrobe" ||enemy.type == "ghini") anim = enemy.type+"_back"
            else if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
            else {anim = enemy.type+"_front"; enemy.setFlip(false, true);}
            enemy.anims.play(anim, true);
            enemy.setVelocity(0, -this.playerVelocity / 2);
        }
        else if(rand >= .5 && rand < .75) { //move right
            let targetX = enemy.x + (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetX = targetX;
            enemy.facing = 'right';
            let anim = null;
            if(enemy.type == "octo" || enemy.type == "darknut" || enemy.type == "lynel") anim = enemy.type+'_side';
            else if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
            else anim = enemy.type + "_front";
            enemy.anims.play(anim, true);
            if(enemy.type != "wizrobe" && enemy.type != "darknut") enemy.setFlip(true, false);
            else enemy.resetFlip();
            enemy.setVelocity(this.playerVelocity / 2, 0);
        }
        else if(rand > .75) {//move down
            let targetY = enemy.y + (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetY = targetY;
            enemy.facing = 'down';
            let anim = null;
            if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
            else anim = enemy.type+'_front';
            enemy.anims.play(anim, true);
            enemy.resetFlip();
            enemy.setVelocity(0, this.playerVelocity / 2);
        }
    }

    kill_screen() {
        /**
         * spawn_x: 2080,
            spawn_y: 840,
            c_x: 1920,
            c_y: 1720,
            x_coord: 6,
            y_coord: 5,
            overworld: false,
            items: my.gameState.items,
            max: 10,
            rupees: 75,
            keys: 7
         */
        this.scene.restart(my.gameState);
    }

    
//MAP CHANGE FUNCTIONS=========================================================================================================================
    freezeFountain() {
        if(this.frozen == false) {
        console.log("in freeze!");
        this.frozen = true;
        let id = this.frozen_tileset.firstgid;
        
        let gid = this.overworld_tileset.firstgid;
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+154) {console.log(tile.x, tile.y); this.groundLayer.putTileAt(id + 3, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+136) {console.log(tile.x, tile.y); this.groundLayer.putTileAt(id + 6, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+151) {console.log(tile.x, tile.y); this.groundLayer.putTileAt(id + 1, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+151) {console.log(tile.x, tile.y); this.groundLayer.putTileAt(id + 1, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+152) {console.log(tile.x, tile.y); this.groundLayer.putTileAt(id + 2, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+150) {console.log(tile.x, tile.y); this.groundLayer.putTileAt(id, tile.x, tile.y);}
        })
    }   
    }

    dockBoat(facing) {
        console.log("docking! "+facing);
        if(!this.sailing) {
            this.move = false;
            this.actionable = false;
            this.actionable_timer = 60;
        }
        this.sailing = true;
        my.sprite.boat.setPosition(0, 0);
        my.sprite.boat.visible = true;
        my.sprite.boat.body.enable = true;
        switch(facing) {
            case 'down':
                // move downwards
                break;
            case 'right':
                // move right
                break;
            case 'up':
                // move up
                break;
        }
    }

    unlockDoor(tiles) {
        tiles.forEach(tile => {
            this.groundLayer.putTileAt(this.teal_tileset.firstgid + 249, tile.x, tile.y);
        })
        
    }

    createStairs(tiles, tileset) {
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 120, tiles[0].x, tiles[0].y);
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 121, tiles[1].x, tiles[1].y);
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 104, tiles[2].x, tiles[2].y);
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 105, tiles[3].x, tiles[3].y);
    }
    

    
    update() {
        // console.log("x: "+my.sprite.player.x+", y: "+my.sprite.player.y);
        //console.log(my.playerVal.item)
        console.log(this.move, this.actionable_timer)
        //console.log(my.sprite.player.x, my.sprite.player.y);
        //console.log(this.overworld, my.playerVal.pos, my.sprite.player.x_coord, my.sprite.player.y_coord)
        if(!this.mapCamera.isMoving)this.checkCameraBounds();
        my.sprite.sword_side.setVelocity(0, 0);
        my.sprite.sword_up.setVelocity(0, 0);
        if(my.playerVal.health <= 0) this.kill_screen();
        //console.log(this.actionable_timer)


//ARROW MOVEMENT======================================================================================================================================================
        if(my.sprite.arrow_side.isMoving) {
            const boundsWidth = 320;
            const boundsHeight = 144;
            const playerScreenX = my.sprite.arrow_side.x - this.mapCamera.scrollX;
            const playerScreenY = my.sprite.arrow_side.y - this.mapCamera.scrollY;
            switch(my.sprite.arrow_side.dir) {
                case 'left':
                    my.sprite.arrow_side.setVelocity(-100, 0);
                    break
                case 'right':
                    my.sprite.arrow_side.setVelocity(100, 0);
                    break
            }
            if(playerScreenX > boundsWidth || playerScreenX < 0 || playerScreenY > boundsHeight || playerScreenY < 0) {
                my.sprite.arrow_side.isMoving = false;
                my.sprite.arrow_side.setVelocity(0, 0);
                my.sprite.arrow_side.visible = false;
            }
        }
        if(my.sprite.arrow_up.isMoving) {
            const boundsWidth = 320;
            const boundsHeight = 144;
            const playerScreenX = my.sprite.arrow_up.x - this.mapCamera.scrollX;
            const playerScreenY = my.sprite.arrow_up.y - this.mapCamera.scrollY;
            switch(my.sprite.arrow_up.dir) {
                case 'up':
                    my.sprite.arrow_up.setVelocity(0, -100);
                    break
                case 'down':
                    my.sprite.arrow_up.setVelocity(0, 100);
                    break
            }
            if(playerScreenX > boundsWidth || playerScreenX < 0 || playerScreenY > boundsHeight || playerScreenY < 0) {
                my.sprite.arrow_up.isMoving = false;
                my.sprite.arrow_up.setVelocity(0, 0);
                my.sprite.arrow_up.visible = false;
            }
        }

//ENEMY CHECKS==========================================================================================================================
        if(this.enemies.length != 0) for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            if(enemy.iframes_counter >0) enemy.iframes_counter--;
            if(enemy.map_pos != my.playerVal.pos && !this.mapCamera.isMoving) {enemy.delete = true; } //kill when out of bounds
            if((this.collides(enemy, my.sprite.sword_side) && my.sprite.sword_side.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.sword_up) && my.sprite.sword_up.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.arrow_side) && my.sprite.arrow_side.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.arrow_up) && my.sprite.arrow_up.visible && enemy.iframes_counter <= 0)) {
                my.sprite.arrow_side.isMoving = false;
                my.sprite.arrow_side.setVelocity(0, 0);
                my.sprite.arrow_side.visible = false;
                my.sprite.arrow_up.isMoving = false;
                my.sprite.arrow_up.setVelocity(0, 0);
                my.sprite.arrow_up.visible = false;
                if(my.sprite.player.element == enemy.weakness) enemy.health -= 2;
                else enemy.health--;
                enemy.iframes_counter = 20;
                let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, enemy.x, enemy.y);
                enemy.dir = angle;
                if(enemy.health <= 0) {
                    let prob = Math.random();
                    enemy.delete = true;
                    if(enemy.key && this.enemies.length == 1) {
                        const key_obj = new Key(this, enemy.x, enemy.y);
                        this.add.existing(key_obj);
                        this.keys.push(key_obj);
                        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
                        this.spawn_locations.forEach((spawn) =>{
                            if(spawn.screen == enemy.s) spawn.key = false;
                        })
                    }
                    else {
                        if(prob < 0.25) {
                            const heart_obj = new Heart(this, enemy.x, enemy.y); 
                            this.add.existing(heart_obj); 
                            this.hearts.push(heart_obj); 
                            this.physics.world.enable(this.hearts, Phaser.Physics.Arcade.STATIC_BODY);
                        }
                        else if(prob > .25 && prob < .5) {
                            const rupee_obj = new Blue_Rupee(this, enemy.x, enemy.y); 
                            this.add.existing(rupee_obj); 
                            this.blue_rupees.push(rupee_obj); 
                            this.physics.world.enable(this.blue_rupees, Phaser.Physics.Arcade.STATIC_BODY);
                        }
                        else if(prob > .5 && prob < .75) {
                            const rupee_obj = new Yellow_Rupee(this, enemy.x, enemy.y); 
                            this.add.existing(rupee_obj); 
                            this.yellow_rupees.push(rupee_obj); 
                            this.physics.world.enable(this.yellow_rupees, Phaser.Physics.Arcade.STATIC_BODY);
                        }
                    }
                }
            }
            let prob = 1/5;
            //console.log(enemy.x - enemy.targetX, enemy.y - enemy.targetY)
            if(Math.random() < prob && !enemy.isMoving && enemy.iframes_counter <= 0) {
                enemy.dir = null;
                enemy.isMoving = true;
                this.e_move(enemy);
            }
            else if(enemy.isMoving && enemy.iframes_counter <= 0) {
                enemy.dir = null;
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
            else if(enemy.dir) {
                let tx = this.playerVelocity * Math.cos(enemy.dir);
                let ty = this.playerVelocity * Math.sin(enemy.dir);
                enemy.body.setVelocity(tx, ty);
            }

            if(this.collides(enemy, my.sprite.link) && this.iframes_counter == 0){
                let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, my.sprite.player.x, my.sprite.player.y);
                my.sprite.player.dir = angle;
                my.playerVal.health--;
                this.actionable = false;
                this.actionable_timer = 7;
                this.iframes_counter = 20;
                this.move = false;
            }

            if(enemy.delete == true) {
                this.enemies.splice(i, 1);
                enemy.destroy(1);
            }
        }

//PLAYER CHECKS=========================================================================================================================
        //if(my.sprite.player.dir)console.log(this.actionable_timer)
        if(my.sprite.player.element == 'light') {this.darkLayer.visible = false;}
        else this.darkLayer.visible = true;
        my.sprite.link.body.x = my.sprite.player.body.x;
        my.sprite.link.body.y = my.sprite.player.body.y;
        if(my.sprite.player.dir == 0) this.move = true;
        if(this.iframes_counter > 0) this.iframes_counter--;
        if(this.actionable_offset > 0) this.actionable_offset--;
        if(this.actionable_timer > 0 ) this.actionable_timer--;
        else { //not actionable yet, but not active
            if(this.actionable_offset <= 0) {this.actionable = true; this.sailing = false;}
            let anim = null;

            //item or pickup anim or hitstun ended, so walk anim must be restored
            if(my.sprite.link.anims.currentAnim && (my.sprite.link.anims.currentAnim.key.includes("item")  || (my.sprite.link.texture.key.includes("pickup")) || my.sprite.player.dir)){ 
                my.sprite.player.dir = null;
                my.sprite.link.setVelocity(0, 0);
                if(!this.mapCamera.isMoving)this.move = true;
                switch (my.sprite.player.facing) {
                case 'up':
                    anim = my.sprite.player.element+'_walk_up';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("up");
                    my.sprite.sword_up.visible = false;
                    my.sprite.ice_wand_up.visible = false;
                    my.sprite.boat.visible = false;
                    my.sprite.boat.body.enable = false;
                    break;
                case 'down':
                    anim = my.sprite.player.element+'_walk_down';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("down");
                    my.sprite.sword_up.visible = false;
                    my.sprite.ice_wand_up.visible = false;
                    my.sprite.boat.visible = false;
                    my.sprite.boat.body.enable = false;
                    break;
                case 'right':
                    anim = my.sprite.player.element+'_walk_side';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("right");
                    my.sprite.link.resetFlip();
                    my.sprite.sword_side.visible = false;
                    my.sprite.ice_wand_side.visible = false; 
                    my.sprite.boat.visible = false;
                    my.sprite.boat.body.enable = false;
                    break;
                case 'left':
                    anim = my.sprite.player.element+'_walk_side';
                    my.sprite.link.anims.play(anim, true);
                    my.sprite.link.anims.stop();
                    this.updatePlayerHitbox("left");
                    my.sprite.link.setFlip(true, false);
                    my.sprite.sword_side.visible = false;
                    my.sprite.ice_wand_side.visible = false;
                    my.sprite.boat.visible = false;
                    my.sprite.boat.body.enable = false;
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
                        my.sprite.sword_up.setPosition(3, 12);
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.setFlip(false, true);
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.setPosition(14, 1);
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.resetFlip(); 
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.setPosition(-12, 1);
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.setFlip(true, false);
                        break;
                }
                my.sprite.link.anims.play(anim, true);
            } else if(Phaser.Input.Keyboard.JustDown(this.zKey) && my.gameState.items.length > 0) { //item button pressed
                my.sprite.player.x = Phaser.Math.Snap.To(my.sprite.player.x, this.tileSize);
                my.sprite.player.y = Phaser.Math.Snap.To(my.sprite.player.y, this.tileSize);
                switch(my.playerVal.item) {
                    case 'ice':
                        my.sprite.player.element = 'ice';
                        break
                    case 'fire':
                        my.sprite.player.element = 'fire';
                        break
                    case 'lightning':
                        my.sprite.player.element = 'lightning';
                        break
                    case 'dark':
                        my.sprite.player.element = 'dark';
                        break
                    case 'light':
                        my.sprite.player.element = 'light';
                        break
                }
                this.actionable = false;
                this.actionable_timer = 8;
                this.actionable_offset = this.actionable_timer + 4;
                let anim = null;
                this.move = false;
                switch (my.sprite.player.facing) {
                    case 'up':
                        anim = my.sprite.player.element+'_item_up';
                        if(my.playerVal.item != "bow" && my.playerVal.item != "boat") {
                            my.sprite.ice_wand_up.setPosition(0, -11);
                            my.sprite.ice_wand_up.setTexture(my.sprite.player.element + "_wand_up");
                            my.sprite.ice_wand_up.visible = true;
                            my.sprite.ice_wand_up.body.enable = true;
                            my.sprite.ice_wand_up.resetFlip(); 
                        }
                        else if(my.playerVal.item == "bow" && !my.sprite.arrow_up.isMoving) {
                            my.sprite.arrow_up.setPosition(my.sprite.player.x, my.sprite.player.y);
                            my.sprite.arrow_up.visible = true;
                            my.sprite.arrow_up.body.enable = true;
                            my.sprite.arrow_up.resetFlip();
                            my.sprite.arrow_up.isMoving = true;
                            my.sprite.arrow_up.dir = 'up';
                        } 
                        else if(my.playerVal.item == "boat") {
                            my.sprite.boat.setPosition(0, -11);
                            my.sprite.boat.visible = true;
                            my.sprite.boat.body.enable = true;
                        }
                        break;
                    case 'down':
                        anim = my.sprite.player.element+'_item_down';
                        if(my.playerVal.item != "bow" && my.playerVal.item != "boat") {
                            my.sprite.ice_wand_up.setPosition(0, 11);
                            my.sprite.ice_wand_up.setTexture(my.sprite.player.element + "_wand_up");
                            my.sprite.ice_wand_up.visible = true;
                            my.sprite.ice_wand_up.body.enable = true;
                            my.sprite.ice_wand_up.setFlip(false, true);
                        }
                        else if(my.playerVal.item == "bow" && !my.sprite.arrow_up.isMoving){
                            my.sprite.arrow_up.setPosition(my.sprite.player.x, my.sprite.player.y);
                            my.sprite.arrow_up.visible = true;
                            my.sprite.arrow_up.body.enable = true;
                            my.sprite.arrow_up.setFlip(false, true);
                            my.sprite.arrow_up.isMoving = true;
                            my.sprite.arrow_up.dir = 'down';
                        }
                        else if(my.playerVal.item == "boat") {
                            my.sprite.boat.setPosition(2, 13);
                            my.sprite.boat.visible = true;
                            my.sprite.boat.body.enable = true;
                        }
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        if(my.playerVal.item != "bow" && my.playerVal.item != "boat") {
                            my.sprite.ice_wand_side.setPosition(12, 1);
                            my.sprite.ice_wand_side.setTexture(my.sprite.player.element + "_wand_side");
                            my.sprite.ice_wand_side.visible = true;
                            my.sprite.ice_wand_side.body.enable = true;
                            my.sprite.ice_wand_side.resetFlip();
                        }
                        else if (my.playerVal.item == "bow" && !my.sprite.arrow_side.isMoving){
                            my.sprite.arrow_side.setPosition(my.sprite.player.x, my.sprite.player.y);
                            my.sprite.arrow_side.visible = true;
                            my.sprite.arrow_side.body.enable = true;
                            my.sprite.arrow_side.resetFlip();
                            my.sprite.arrow_side.isMoving = true;
                            my.sprite.arrow_side.dir = 'right';
                        }
                        else if(my.playerVal.item == "boat") {
                            my.sprite.boat.setPosition(16, 1);
                            my.sprite.boat.visible = true;
                            my.sprite.boat.body.enable = true;
                        }
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        if(my.playerVal.item != "bow" && my.playerVal.item != "boat") {
                            my.sprite.ice_wand_side.setPosition(-12, 1);
                            my.sprite.ice_wand_side.setTexture(my.sprite.player.element + "_wand_side");
                            my.sprite.ice_wand_side.visible = true;
                            my.sprite.ice_wand_side.body.enable = true;
                            my.sprite.ice_wand_side.setFlip(true, false);
                        }
                        else if(my.playerVal.item == "bow" && !my.sprite.arrow_side.isMoving){
                            my.sprite.arrow_side.setPosition(my.sprite.player.x, my.sprite.player.y);
                            my.sprite.arrow_side.visible = true;
                            my.sprite.arrow_side.body.enable = true;
                            my.sprite.arrow_side.setFlip(true, false);
                            my.sprite.arrow_side.isMoving = true;
                            my.sprite.arrow_side.dir = 'left';
                        }
                        else if(my.playerVal.item == "boat") {
                            my.sprite.boat.setPosition(-12, 1);
                            my.sprite.boat.visible = true;
                            my.sprite.boat.body.enable = true;
                        }
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

class Heart extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'heart')
      scene.add.existing(this)
    }
  }

  class Yellow_Rupee extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'yellow_rupee')
      scene.add.existing(this)
    }
  }

  class Blue_Rupee extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'blue_rupee')
      scene.add.existing(this)
    }
  }

  class Key extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'key')
      scene.add.existing(this)
    }
  }