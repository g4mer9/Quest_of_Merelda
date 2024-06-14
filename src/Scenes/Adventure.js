class Adventure extends Phaser.Scene {
    constructor() {
        super("AdventureScene");
    }

    init(data) {
        //passed in checkpoint values
        this.gameActive = data.gameActive || false;
        this.linkActive = data.linkActive || false;
        this.killed_bosses = 0;
        this.spawn_x =  data.spawn_x || 480;
        this.spawn_y =  data.spawn_y || 694;
        this.c_x =  data.c_x || 320;
        this.c_y =  data.c_y || 576;
        // this.spawn_x =  data.spawn_x || 160;
        // this.spawn_y =  data.spawn_y || 120;
        // this.c_x =  data.c_x || 0;
        // this.c_y =  data.c_y || 0;
        this.x_coord = data.x_coord || 1;
        this.y_coord = data.y_coord || 4;
        if(data.overworld != null) this.overworld = data.overworld; else this.overworld = true;
        if(data.title != null) this.title = data.title; else this.title = true;
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
        my.gameState.title = this.title;

        //console.log(my.playerVal.max, my.playerVal.health)
        // variables and settings
        this.move = true; // can move
        this.sailing = false;
        this.lastDock = '';
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
        this.map_coords = [['A0',   'B0',  'C0', '', 'sub'], //MUST BE ACCESSED VIA map_coords[y][x]
                            ['A1', 'B1', 'C1', 'D1', 'sub',  '',  'ldG1',  ''],
                            ['A2', 'B2', 'C2', 'D2', 'sub',  '',  'ldG2',  '',    'ddI2'],
                            ['A3', 'B3', 'C3', 'D3', 'E3', '',    'ldG3', 'ldH3', 'ddI3', 'ddJ3'],
                            ['A4', 'B4', 'C4', 'D4',  '', 'ldF4', 'ldG4', 'ldH4', 'ddI4', 'ddJ4', 'ddK4', 'ddL4'],
                            ['',    '',   '',  'D5',  '', 'ldF5', 'ldG5', 'ldH5', 'ddI5', 'ddJ5', 'ddK5', 'ddL5']];
        this.spawn_locations = [{screen: 'C4', item: false, key: false, type: 'octo', weakness: 'ice', health: 4, damage: 1, speed: this.playerVelocity / 2, x: 720, y: 650}, 
            {screen: 'C4', item: false, key: false, type: 'octo', weakness: 'ice', health: 4, speed: this.playerVelocity / 2, damage: 1, x: 800, y: 650},
            {screen: 'A3', item: false, key: false, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 76, y: 550}, 
            {screen: 'A3', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 88, y: 504},
            {screen: 'A3', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 232, y: 504},
            {screen: 'C4', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 866, y: 650}, 
            {screen: 'A4', item: false, key: false, type: 'armos', weakness: 'ice', health: 5, speed: this.playerVelocity / 2, damage: 1, x: 96, y: 648},
            {screen: 'A4', item: false, key: false, type: 'armos', weakness: 'ice', health: 5, speed: this.playerVelocity / 2, damage: 1, x: 224, y: 648},
            {screen: 'B3', item: false, key: false, type: 'armos', weakness: 'ice', health: 5, speed: this.playerVelocity / 2, damage: 1, x: 376, y: 504},
            {screen: 'B3', item: false, key: false, type: 'armos', weakness: 'ice', health: 5, speed: this.playerVelocity / 2, damage: 1, x: 450, y: 504},
            {screen: 'B3', item: false, key: false, type: 'armos', weakness: 'ice', health: 5, speed: this.playerVelocity / 2, damage: 1, x: 616, y: 504},
            //{screen: 'D4', item: false, key: false, type: 'peahat', weakness: 'fire', health: 6, speed: this.playerVelocity / 1.5, damage: 2, x: 1120, y: 616},
            {screen: 'D4', item: false, key: false, type: 'peahat', weakness: 'fire', health: 6, speed: this.playerVelocity / 1.5, damage: 2, x: 1016, y: 616},
            {screen: 'D3', item: false, key: false, type: 'peahat', weakness: 'fire', health: 6, speed: this.playerVelocity / 1.5, damage: 2, x: 1152, y: 504},
            //{screen: 'D3', item: false, key: false, type: 'peahat', weakness: 'fire', health: 6, speed: this.playerVelocity / 1.5, damage: 2, x: 1048, y: 480},
            {screen: 'D3', item: false, key: false, type: 'peahat', weakness: 'fire', health: 6, speed: this.playerVelocity / 1.5, damage: 2, x: 1016, y: 520},
            {screen: 'C2', item: false, key: false, type: 'armos', weakness: 'ice', health: 5, speed: this.playerVelocity / 2, damage: 1, x: 744, y: 344},
            {screen: 'C3', item: false, key: false, type: 'wizrobe', weakness: 'fire', health: 6, speed: this.playerVelocity / 2, damage: 2, x: 800, y: 520},
            {screen: 'C3', item: false, key: false, type: 'wizrobe', weakness: 'fire', health: 6, speed: this.playerVelocity / 2, damage: 2, x: 800, y: 488},
            {screen: 'C3', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 696, y: 520},
            {screen: 'C3', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 936, y: 520},
            {screen: 'D1', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 1056, y: 216},
            {screen: 'D1', item: false, key: false, type: 'octo', weakness: 'ice', health: 3, speed: this.playerVelocity / 2, damage: 1, x: 1192, y: 216}, 
            {screen: 'B2', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 552, y: 376}, 
            {screen: 'B2', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 520, y: 312},
            {screen: 'B2', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 408, y: 392},
            {screen: 'B2', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 392, y: 408},
            {screen: 'B2', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 568, y: 325},
            {screen: 'B1', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 376, y: 264},
            {screen: 'B1', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 584, y: 224},
            {screen: 'B1', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 456, y: 200},
            {screen: 'A2', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 232, y: 312},
            {screen: 'A2', item: false, key: true, type: 'ghini', weakness: 'dark', health: 7, damage: 2, speed: this.playerVelocity / 2, x: 152, y: 360},
            {screen: 'A2', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 184, y: 408},
            {screen: 'A2', item: false, key: false, type: 'lynel', weakness: 'lightning', health: 10, damage: 4, speed: this.playerVelocity / 2, x: 216, y: 352},
            {screen: 'A2', item: false, key: false, type: 'lynel', weakness: 'lightning', health: 10, damage: 4, speed: this.playerVelocity / 2, x: 56, y: 328},
            {screen: 'C1', item: false, key: false, type: 'lynel', weakness: 'lightning', health: 10, damage: 4, speed: this.playerVelocity / 2, x: 720, y: 215},
            {screen: 'C0', item: false, key: false, type: 'lynel', weakness: 'lightning', health: 10, damage: 4, speed: this.playerVelocity / 2, x: 920, y: 24},
            {screen: 'ldF5', item: false, key: true, type: 'armos', weakness: 'ice', health: 5, damage: 1, speed: this.playerVelocity / 2,  x: 1760, y: 760}, 
            {screen: 'ldF5', item: false, key: true, type: 'armos', weakness: 'ice', health: 5, damage: 1, speed: this.playerVelocity / 2, x: 1700, y: 760}, 
            {screen: 'ldF5', item: false, key: true, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 1730, y: 820}, 
            {screen: 'ldF5', item: false, key: true, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 1760, y: 820},
            {screen: 'ldH5', item: false, key: true, type: 'octo', weakness: 'ice', health: 3, damage: 1, speed: this.playerVelocity / 2,  x: 2460, y: 760}, 
            {screen: 'ldH5', item: false, key: true, type: 'octo', weakness: 'ice', health: 3, damage: 1, speed: this.playerVelocity / 2, x: 2400, y: 760}, 
            {screen: 'ldH5', item: false, key: true, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2430, y: 820}, 
            {screen: 'ldH5', item: false, key: true, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2460, y: 820},
            {screen: 'ldG3', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2000, y: 496}, 
            {screen: 'ldG3', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2000, y: 496},
            {screen: 'ldG3', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2160, y: 496}, 
            {screen: 'ldG4', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2050, y: 640}, 
            {screen: 'ldG4', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2050, y: 660},
            {screen: 'ldG4', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2160, y: 640}, 
            {screen: 'ldG4', item: false, key: false, type: 'ghini', weakness: 'dark', health: 6, damage: 2, speed: this.playerVelocity / 2, x: 2160, y: 660},
            
            {screen: 'ddJ5', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3128, y: 768},
            {screen: 'ddJ5', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3080, y: 832},
            {screen: 'ddJ5', item: false, key: false, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3060, y: 820},
            {screen: 'ddJ4', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3128, y: 624},
            {screen: 'ddJ4', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3080, y: 688},
            {screen: 'ddJ4', item: false, key: false, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3060, y: 688},
            {screen: 'ddJ3', item: false, key: true, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3000, y: 480},
            {screen: 'ddJ3', item: false, key: true, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3032, y: 480},
            {screen: 'ddJ3', item: false, key: true, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3064, y: 480},
            {screen: 'ddI4', item: false, key: false, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 2776, y: 656},
            {screen: 'ddI4', item: false, key: false, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 2664, y: 656},
            
            {screen: 'ddK5', item: false, key: true, type: 'lynel', weakness: 'lightning', health: 8, damage: 2, speed: this.playerVelocity / 2, x: 3400, y: 768},
            {screen: 'ddK5', item: false, key: true, type: 'lynel', weakness: 'lightning', health: 8, damage: 2, speed: this.playerVelocity / 2, x: 3320, y: 768},
            {screen: 'ddK5', item: false, key: true, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3320, y: 816},
            {screen: 'ddK5', item: false, key: true, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3400, y: 816},

            {screen: 'ddL5', item: false, key: false, type: 'lynel', weakness: 'lightning', health: 8, damage: 2, speed: this.playerVelocity / 2, x: 3720, y: 768},
            {screen: 'ddL5', item: false, key: false, type: 'lynel', weakness: 'lightning', health: 8, damage: 2, speed: this.playerVelocity / 2, x: 3640, y: 768},
            {screen: 'ddL5', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3640, y: 816},
            {screen: 'ddL5', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 3, speed: this.playerVelocity / 2, x: 3720, y: 816},

            {screen: 'ddL4', item: false, key: true, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3640, y: 624},
            {screen: 'ddL4', item: false, key: true, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3672, y: 624},
            {screen: 'ddL4', item: false, key: true, type: 'keese', weakness: 'lightning', health: 6, damage: 2, speed: this.playerVelocity / 1.5, x: 3704, y: 624},





            {screen: 'ldH4', item: false, key: false, type: 'darknut', weakness: 'light', health: 10, damage: 2, speed: this.playerVelocity / 2, x: 2400, y: 680}];
            

        this.xKey = this.input.keyboard.addKey('X');
        this.zKey = this.input.keyboard.addKey('Z');
        // this.aKey = this.input.keyboard.addKey('A');
        // this.sKey = this.input.keyboard.addKey('S');
        this.enemies = [];
        this.hearts = [];
        this.yellow_rupees = [];
        this.blue_rupees = [];
        this.keys = [];
        this.e_bullets = [];
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
//CREATING MAP/TILESETS===================================================================================================================
        this.map = this.add.tilemap("overworld", 8, 8, 0, 0);
        this.overworld_theme = this.sound.add('tal_tal', {
            loop: true,
            volume: .5
        })
        this.dungeon_theme = this.sound.add('dungeon', {
            loop: true,
            volume:.5
        })
        this.overworld_tileset = this.map.addTilesetImage("zelda_overworld_tileset", "overworld_tileset");
        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset","mountain_tileset");
        this.graveyard_tileset = this.map.addTilesetImage("zelda_graveyard_tileset","graveyard_tileset");
        this.teal_tileset = this.map.addTilesetImage("teal_dungeon", "teal_dungeon_tileset");
        this.teal_dark_tileset = this.map.addTilesetImage("teal_dungeon_dark", "teal_dungeon_dark_tileset");
        this.teal_light_tileset = this.map.addTilesetImage("teal_dungeon_light", "teal_dungeon_light_tileset")
        this.frozen_tileset = this.map.addTilesetImage("FrozenWaterTiles", "frozen_water");
        this.cave_tileset = this.map.addTilesetImage("cave", "cave");
        this.old_man_tileset = this.map.addTilesetImage("old_man", "old_man");
        this.title_tileset = this.map.addTilesetImage("title", "title");

        this.groundLayer = this.map.createLayer("basic-geometry-layer", [this.forest_tileset, this.mountain_tileset, this.graveyard_tileset, this.teal_dark_tileset, this.teal_light_tileset, this.overworld_tileset, this.teal_tileset, this.frozen_tileset, this.cave_tileset], 0, 0);
        this.enemyBoundary = this.map.createLayer("boundaries", this.forest_tileset, 0, 0);
        this.darkLayer = this.map.createLayer("dark-layer", [this.teal_dark_tileset, this.teal_light_tileset, this.old_man_tileset], 0, 0);
        this.transitionsLayer = this.map.createLayer("transitions", [this.forest_tileset, this.mountain_tileset, this.graveyard_tileset, this.overworld_tileset], 0, 0);
        this.foregroundLayer = this.map.createLayer("foreground", [this.forest_tileset, this.mountain_tileset, this.graveyard_tileset, this.overworld_tileset, this.teal_tileset, this.old_man_tileset], 0, 0).setDepth(100000);
        this.titleLayer = this.map.createLayer("title", [this.title_tileset, this.graveyard_tileset], 0, 0).setDepth(10);
        this.creditsLayer = this.map.createLayer("credits", [this.graveyard_tileset], 0, 0).setDepth(5)
        this.winLayer = this.map.createLayer("win", [this.graveyard_tileset], 0, 0).setDepth(2);
        this.winLayer.visible = false;
        this.enemyBoundary.visible = false;
        this.transitionsLayer.visible = false;
        this.titleLayer.visible = my.gameState.title;
        this.creditsLayer.visible = my.gameState.title;

        
        this.enemyBoundary.setCollisionByProperty({//collision with geometry layer
            collides: true
        }); 
        this.groundLayer.setCollisionByProperty({//collision with geometry layer
            collides: true
        }); 
        this.darkLayer.setCollisionByProperty({//collision with geometry layer
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
        my.sprite.sword_up.body.setSize(my.sprite.sword_up.body.width * 1.2, my.sprite.sword_up.height);
        my.sprite.player.add(my.sprite.sword_up);
        my.sprite.sword_up.visible = false;
        my.sprite.sword_up.body.enable = false;
        my.sprite.sword_side = this.physics.add.sprite(0, 0, "sword_side").setDepth(99);
        my.sprite.sword_side.setScale(.75);
        my.sprite.sword_side.body.setSize(my.sprite.sword_side.body.width, my.sprite.sword_side.height * 1.2);
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

        this.dark_wand_obj_prop = this.map.createFromObjects("objects", {
            name: "dark_wand_1",
            key: "dark_wand_up"
        });


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
        my.sprite.link.visible= this.linkActive;
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
        this.physics.add.collider(my.sprite.player, this.darkLayer);
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
                this.sound.play('sfx_freeze');

            }
        }, this);

        // dock boat
        this.groundLayer.setTileIndexCallback(this.forest_tileset.firstgid + 154, (sprite, tile) => {
            if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 1120 && my.sprite.player.y === 680 && my.sprite.player.facing === 'down')) {
                this.dockBoat('down', 'D4');
            } else if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 1192 && my.sprite.player.y === 504 && my.sprite.player.facing === 'right')) {
                this.dockBoat('right', 'D3');
            } else if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 1384 && my.sprite.player.y === 504 && my.sprite.player.facing === 'left')) {
                this.dockBoat('left ', 'E3');
            }
        }, this);
        this.groundLayer.setTileIndexCallback(this.forest_tileset.firstgid + 136, (sprite, tile) => {
            if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 1120 && my.sprite.player.y === 744 && my.sprite.player.facing === 'up')) {
                this.dockBoat('up', 'D5');
            }
        }, this);
        this.groundLayer.setTileIndexCallback(this.mountain_tileset.firstgid + 154, (sprite, tile) => {
            if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 816 && my.sprite.player.y === 352 && my.sprite.player.facing === 'up')) {
                this.dockBoat('up', 'C2');
            } else if (sprite === my.sprite.boat && my.sprite.boat.visible === true && (my.sprite.player.x === 816 && my.sprite.player.y === 72 && my.sprite.player.facing === 'down')) {
                this.dockBoat('down', 'C0');
            }
        }, this);  

        //burn tree
        this.groundLayer.setTileIndexCallback(this.overworld_tileset.firstgid + 210, (sprite, tile) => {
            //console.log(my.sprite.player.x, my.sprite.player.y)
            if (sprite === my.sprite.ice_wand_up && my.sprite.ice_wand_up.visible === true && my.sprite.player.element == "fire" && ((my.sprite.player.x >=  672 && my.sprite.player.x <= 688 && my.sprite.player.y ==  472) || (my.sprite.player.x ==  1512 && my.sprite.player.y == 464))) {
                let tiles = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                this.sound.play('sfx_fire')
                this.createStairs(tiles, this.forest_tileset);
            }
        }, this);

        //blow up rock
        this.groundLayer.setTileIndexCallback(this.mountain_tileset.firstgid + 190, (sprite, tile) => {
            //console.log(my.sprite.player.x, my.sprite.player.y)

            if (sprite === my.sprite.ice_wand_side && my.sprite.ice_wand_side.visible === true && my.sprite.player.element == "lightning" && my.sprite.player.x == 920 && my.sprite.player.y == 24) {
                
                let tiles = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                this.sound.play('sfx_bomb');
                this.createStairs(tiles, this.mountain_tileset);
            }
        }, this);

        //blow up rock
        this.groundLayer.setTileIndexCallback(this.overworld_tileset.firstgid + 190, (sprite, tile) => {
            //console.log(my.sprite.player.x, my.sprite.player.y)

            if (sprite === my.sprite.ice_wand_side && my.sprite.ice_wand_side.visible === true && my.sprite.player.element == "lightning" && my.sprite.player.x == 1240 && my.sprite.player.y == 808) {
                
                let tiles = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                this.sound.play('sfx_bomb');
                this.createStairs(tiles, this.mountain_tileset);
            }
        }, this);

//Dungeon doors========================================================================================================================

        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 156], (sprite, tile) => { //up door
            //console.log(my.playerVal.keys, my.gameState.keys)
            if(my.playerVal.keys > 0) {
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                my.playerVal.keys--;
                //my.gameState.keys--;
                this.sound.play('sfx_use_key');
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
                //my.gameState.keys--;
                this.sound.play('sfx_use_key');
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
                this.sound.play('sfx_use_key');
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
                this.sound.play('sfx_use_key');
                this.unlockDoor(tiles);
            }
        }, this)

        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 180], (sprite, tile) => { //up door
            if(sprite === my.sprite.player){
                //console.log("callback")
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y - 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y - 1));
                let non_bosses_active = false;
                this.enemies.forEach((enemy) =>{
                    //console.log(enemy.type, !enemy.type.includes("manhandla"), enemy.type != "digdogger", !enemy.type.includes("gleeok"))
                    if(!enemy.type.includes("manhandla") && enemy.type != "digdogger" && !enemy.type.includes("gleeok") && enemy.type != "lh2" && enemy.type != "rh2") {
                        non_bosses_active = true;
                    } 
                });
                //console.log(my.playerVal.pos, non_bosses_active)
                if(my.playerVal.pos == "ldG2"){
                    //console.log(my.sprite.digdogger.visible)
                    if(my.sprite.digdogger.visible == false) this.unlockDoor(tiles);
                }
                else if(my.playerVal.pos == "ddI3"){
                    let heads = 0;
                    this.enemies.forEach((enemy) =>{
                        if(enemy.type.includes("manhandla") && enemy.visible == true) heads++;
                    })
                    if(heads == 0) this.unlockDoor(tiles);
                }//PUT FINAL DUNGEON BOSS ROOM DOOR CODE HERE
                else if(non_bosses_active == false) this.unlockDoor(tiles);
            }
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 164], (sprite, tile) => { //down door
            if(sprite === my.sprite.player){
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y + 1));
                let non_bosses_active = false;
                this.enemies.forEach((enemy) =>{
                    //console.log(enemy.type, !enemy.type.includes("manhandla"), enemy.type != "digdogger", !enemy.type.includes("gleeok"))
                    if(!enemy.type.includes("manhandla") && enemy.type != "digdogger" && !enemy.type.includes("gleeok") && enemy.type != "lh2" && enemy.type != "rh2") {
                        non_bosses_active = true;
                    } 
                });
                //console.log(my.playerVal.pos, non_bosses_active)
                if(my.playerVal.pos == "ldG2"){
                    //console.log(my.sprite.digdogger.visible)
                    if(my.sprite.digdogger.visible == false) this.unlockDoor(tiles);
                }
                else if(my.playerVal.pos == "ddI3"){
                    let heads = 0;
                    this.enemies.forEach((enemy) =>{
                        if(enemy.type.includes("manhandla") && enemy.visible == true) heads++;
                    })
                    if(heads == 0) this.unlockDoor(tiles);
                }//PUT FINAL DUNGEON BOSS ROOM DOOR CODE HERE
                else if(non_bosses_active == false) this.unlockDoor(tiles);
            }
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 167], (sprite, tile) => { //left door
            if(sprite === my.sprite.player){
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
                tiles.push(this.groundLayer.getTileAt(tile.x - 1, tile.y + 1));
                let non_bosses_active = false;
                this.enemies.forEach((enemy) =>{
                    //console.log(enemy.type, !enemy.type.includes("manhandla"), enemy.type != "digdogger", !enemy.type.includes("gleeok"))
                    if(!enemy.type.includes("manhandla") && enemy.type != "digdogger" && !enemy.type.includes("gleeok") && enemy.type != "lh2" && enemy.type != "rh2") {
                        non_bosses_active = true;
                    } 
                });
                //console.log(my.playerVal.pos, non_bosses_active)
                if(my.playerVal.pos == "ldG2"){
                    //console.log(my.sprite.digdogger.visible)
                    if(my.sprite.digdogger.visible == false) this.unlockDoor(tiles);
                }
                else if(my.playerVal.pos == "ddI3"){
                    let heads = 0;
                    this.enemies.forEach((enemy) =>{
                        if(enemy.type.includes("manhandla") && enemy.visible == true) heads++;
                    })
                    if(heads == 0) this.unlockDoor(tiles);
                }//PUT FINAL DUNGEON BOSS ROOM DOOR CODE HERE
                else if(non_bosses_active == false) this.unlockDoor(tiles);
            }
        }, this)
        this.groundLayer.setTileIndexCallback([this.teal_tileset.firstgid + 166], (sprite, tile) => { //right door
            if(sprite === my.sprite.player){
                let tiles  = [tile];
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y));
                tiles.push(this.groundLayer.getTileAt(tile.x, tile.y + 1));
                tiles.push(this.groundLayer.getTileAt(tile.x + 1, tile.y + 1));
                let non_bosses_active = false;
                this.enemies.forEach((enemy) =>{
                    //console.log(enemy.type, !enemy.type.includes("manhandla"), enemy.type != "digdogger", !enemy.type.includes("gleeok"))
                    if(!enemy.type.includes("manhandla") && enemy.type != "digdogger" && !enemy.type.includes("gleeok") && enemy.type != "lh2" && enemy.type != "rh2") {
                        non_bosses_active = true;
                    } 
                });
                //console.log(my.playerVal.pos, non_bosses_active)
                if(my.playerVal.pos == "ldG2"){
                    //console.log(my.sprite.digdogger.visible)
                    if(my.sprite.digdogger.visible == false) this.unlockDoor(tiles);
                }
                else if(my.playerVal.pos == "ddI3"){
                    let heads = 0;
                    this.enemies.forEach((enemy) =>{
                        if(enemy.type.includes("manhandla") && enemy.visible == true) heads++;
                    })
                    if(heads == 0) this.unlockDoor(tiles);
                }//PUT FINAL DUNGEON BOSS ROOM DOOR CODE HERE
                else if(non_bosses_active == false) this.unlockDoor(tiles);
            }
        }, this)

//NON CUTSCENE ITEMS==========================================================================================================================
        this.physics.add.overlap(my.sprite.player, this.hearts, (obj1, obj2) => {
            this.hearts.pop();
            obj2.destroy();
            this.sound.play('sfx_heart');

            if(my.playerVal.health >= my.playerVal.max - 1) my.playerVal.health = my.playerVal.max;
            else my.playerVal.health+=2;
            
        });     

        this.physics.add.overlap(my.sprite.player, this.yellow_rupees, (obj1, obj2) => {
            this.yellow_rupees.pop();
            obj2.destroy();
            this.sound.play('sfx_rupee');

            if(my.playerVal.rupees >= 98) my.playerVal.rupees = 99;
            else my.playerVal.rupees += 1;
            my.gameState.rupees = my.playerVal.rupees;
            
        });     

        this.physics.add.overlap(my.sprite.player, this.blue_rupees, (obj1, obj2) => {
            this.blue_rupees.pop();
            
            obj2.destroy();
            this.sound.play('sfx_rupee');

            if(my.playerVal.rupees >= 94) my.playerVal.rupees = 99;
            else my.playerVal.rupees += 5;
            my.gameState.rupees = my.playerVal.rupees;

            
        }); 
        
        this.physics.add.overlap(my.sprite.player, this.keys, (obj1, obj2) => {
            this.keys.pop();
            obj2.destroy();
            this.sound.play('sfx_key');

            if(my.playerVal.keys >= 8) my.playerVal.keys = 9;
            else my.playerVal.keys++;
            my.gameState.keys = my.playerVal.keys;

            
        }); 

        // this.physics.add.overlap(my.sprite.player, this.e_bullets, (obj1, obj2) => {
        //     console.log("collision!!!")
        // })

//HEART CONTAINERS===========================================================================================================================
        this.physics.add.overlap(my.sprite.player, this.heart_containers_group, (obj1, obj2) => {
            if(obj2.index == 6) {

                if(my.playerVal.rupees >= 50 && this.move) {
                    my.playerVal.rupees -= 50;
                    my.gameState.rupees -= 50;
                    obj2.x = my.sprite.player.x + 2;
                    obj2.y = my.sprite.player.y - 18;
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
                this.sound.play('sfx_heart_container');
                    
                }
            }
            else {
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
                this.sound.play('sfx_heart_container');

                }
            }
            
        });

//WANDS======================================================================================================================================

        if(!my.gameState.items.includes("ice")) this.physics.add.overlap(my.sprite.player, this.ice_wand_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
            

            if(this.move) {
                this.sound.play('sfx_item');
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
            
            if(this.move) {
                obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
                this.sound.play('sfx_item');
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
            
            if(this.move) {
                this.sound.play('sfx_item');
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
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
            
            if(this.move) {
                this.sound.play('sfx_item');
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
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
            
            if(this.move) {
                this.sound.play('sfx_item');
            //this.sound.play('sfx_gem');
            obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
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

//BOSS SPAWNS======================================================================================================================================
        this.spawnMan();
        this.spawnDig();
        this.SpawnGle();

//OTHER ITEMS======================================================================================================================================

        if(!my.gameState.items.includes("bow")) this.physics.add.overlap(my.sprite.player, this.bow_obj, (obj1, obj2) => {
            //this.sound.play('sfx_gem');
           
            
            if(my.playerVal.rupees >= 30 && this.move) {
                this.sound.play('sfx_item');
                my.playerVal.rupees -= 30;
                my.gameState.rupees -= 30;
                obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
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

           


            if(my.playerVal.rupees >= 15 && this.move) {
                this.sound.play('sfx_item');
                my.playerVal.rupees -= 15;
                my.gameState.rupees -= 15;
                obj2.x = my.sprite.player.x + 2;
                obj2.y = my.sprite.player.y - 18;
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
        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();
        
//DEUBG====================================================================================================================================
        // this.input.keyboard.on('keydown-D', () => {
        //     this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        //     this.physics.world.debugGraphic.clear()
        // }, this);
    
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
                if (spawn.type != "peahat" || spawn.type != "keese") my.sprite.enemy = this.physics.add.sprite(spawn.x, spawn.y, spawn.type+"_front");
                else my.sprite.enemy = this.physics.add.sprite(spawn.x, spawn.y, spawn.type+"-0.png");
                my.sprite.enemy.type = spawn.type;
                if(spawn.type == "peahat" || spawn.type == "keese") {my.sprite.enemy.body.setSize(my.sprite.enemy.width / 2, my.sprite.enemy.height / 2);  my.sprite.enemy.body.setOffset(0, 0);}
                my.sprite.enemy.weakness = spawn.weakness;
                my.sprite.enemy.health = spawn.health;
                my.sprite.enemy.damage = spawn.damage;
                my.sprite.enemy.speed = spawn.speed;
                my.sprite.enemy.map_pos = my.playerVal.pos;
                my.sprite.enemy.iframes_counter = 0;
                my.sprite.enemy.key = spawn.key;
                my.sprite.enemy.s = spawn.screen;
                if(spawn.type != 'ghini') this.physics.add.collider(my.sprite.enemy, this.groundLayer);
                this.physics.add.collider(my.sprite.enemy, this.enemyBoundary);
                this.enemies.forEach((enemy) =>{
                    this.physics.add.collider(my.sprite.enemy, enemy);
                })
                this.enemies.push(my.sprite.enemy);
            }
        })
        if (my.playerVal.pos == "ldG2") my.sprite.digdogger.visible = true; // digdogger spawn
        if (my.playerVal.pos == "ddI3") my.sprite.manhandla.visible = true; // manhandla spawn
    }

    screenStart() {
        // console.log("in screenStart!");
        if(!this.sailing) {
            this.actionable_timer = 0;
            this.move = true;
        }
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
            
            this.sound.play('sfx_stairs');
            if (tile.properties['overworld'] == false) {
                my.gameState.spawn_x = tile.properties['tx'];
                my.gameState.spawn_y= tile.properties['ty'];
                my.gameState.c_x= tile.properties['cx'];
                my.gameState.c_y= tile.properties['cy'];
                my.gameState.x_coord = tile.properties['x_coord'];
                my.gameState.y_coord = tile.properties['y_coord'];
                my.gameState.overworld = tile.properties['overworld'];
            } else {
                my.gameState.spawn_x = 480;
                my.gameState.spawn_y= 694;
                my.gameState.c_x= 320;
                my.gameState.c_y= 576;
                my.gameState.x_coord = 1;
                my.gameState.y_coord = 4;
                my.gameState.overworld = true;
            }

            
            player.x = tile.properties['tx'];
            player.y = tile.properties['ty'];
            this.mapCamera.scrollX = tile.properties['cx'];
            this.mapCamera.scrollY = tile.properties['cy'];
            player.x_coord = tile.properties['x_coord'];
            player.y_coord = tile.properties['y_coord'];
            my.playerVal.pos = this.map_coords[player.y_coord][player.x_coord];
            this.overworld = tile.properties['overworld'];
            if(this.overworld){
                this.dungeon_theme.stop();
                this.overworld_theme.play();
            }
            else{
                this.overworld_theme.stop();
                this.dungeon_theme.play();
            }
            if (my.playerVal.pos == "B0") {my.sprite.gleeok.visible = true; } // gleeok spawn
        }
    }


//BOSS FUNCTIONS=========================================================================================================================
    spawnMan() {
        my.sprite.manhandla = this.add.container(2720, 505).setDepth(90); // container for manhandla sprites
        my.sprite.manhandla.isMoving = false;
        //my.sprite.manhandla.body.setSize(my.sprite.manhandla_body.width, my.sprite.link.height, true);
        this.physics.world.enable(my.sprite.manhandla);
        my.sprite.manhandla.body.setSize(48, 48);  
        my.sprite.manhandla.body.setOffset(-24, -24);

        my.sprite.manhandla_body = this.physics.add.sprite(0, 0, "manhandla", "Manhandla-4.png").setDepth(90); // body
        my.sprite.manhandla_body.flipY = true;
        //my.sprite.manhandla_body.visible = false;
        my.sprite.manhandla.add(my.sprite.manhandla_body);
        my.sprite.manhandla_body.container = my.sprite.manhandla;

        my.sprite.manhandla_top = this.physics.add.sprite(0, -16, "manhandla", "Manhandla-2.png").setDepth(90); // top head
        my.sprite.manhandla_top.x_offset = 0;
        my.sprite.manhandla_top.y_offset = -16;
        my.sprite.manhandla_top.anims.play('manhandla_front', true);
        my.sprite.manhandla.add(my.sprite.manhandla_top);
        my.sprite.manhandla_top.container = my.sprite.manhandla;

        my.sprite.manhandla_left = this.physics.add.sprite(-16, 0, "manhandla", "Manhandla-1.png").setDepth(90); // left head
        my.sprite.manhandla_left.x_offset = -16;
        my.sprite.manhandla_left.y_offset = 0;
        my.sprite.manhandla_left.anims.play('manhandla_side', true);
        my.sprite.manhandla.add(my.sprite.manhandla_left);
        my.sprite.manhandla_left.container = my.sprite.manhandla;

        my.sprite.manhandla_right = this.physics.add.sprite(16, 0, "manhandla", "Manhandla-1.png").setDepth(90); // right head
        my.sprite.manhandla_right.x_offset = 16;
        my.sprite.manhandla_right.y_offset = 0;
        my.sprite.manhandla_right.anims.play('manhandla_side', true);
        my.sprite.manhandla_right.flipX = true;
        my.sprite.manhandla.add(my.sprite.manhandla_right);
        my.sprite.manhandla_right.container = my.sprite.manhandla;

        my.sprite.manhandla_bottom = this.physics.add.sprite(0, 16, "manhandla", "Manhandla-2.png").setDepth(90); // bottom head
        my.sprite.manhandla_bottom.x_offset = 0;
        my.sprite.manhandla_bottom.y_offset = 16;
        my.sprite.manhandla_bottom.anims.play('manhandla_front', true);
        my.sprite.manhandla_bottom.flipY = true;
        my.sprite.manhandla.add(my.sprite.manhandla_bottom);
        my.sprite.manhandla_bottom.container = my.sprite.manhandla;

        my.sprite.manhandla.visible = false;
        my.sprite.manhandla_top.type = 'manhandla_top'
        my.sprite.manhandla_top.weakness = 'light';
        my.sprite.manhandla_top.health = 7;
        //my.sprite.manhandla_top.speed = this.playerVelocity / 2;
        my.sprite.manhandla_top.delete = false;
        my.sprite.manhandla_top.map_pos = 'ddI3';
        my.sprite.manhandla_top.iframes_counter = 0;
        my.sprite.manhandla_top.key = false;
        my.sprite.manhandla_left.s = 'ddI3';

        my.sprite.manhandla_left.type = 'manhandla_left'
        my.sprite.manhandla_left.weakness = 'light';
        my.sprite.manhandla_left.health = 7;
        //my.sprite.manhandla_left.speed = this.playerVelocity / 2;
        my.sprite.manhandla_left.delete = false;
        my.sprite.manhandla_left.map_pos = 'ddI3';
        my.sprite.manhandla_left.iframes_counter = 0;
        my.sprite.manhandla_left.key = false;
        my.sprite.manhandla_left.s = 'ddI3';

        my.sprite.manhandla_right.type = 'manhandla_right'
        my.sprite.manhandla_right.weakness = 'light';
        my.sprite.manhandla_right.health = 7;
        //my.sprite.manhandla_right.speed = this.playerVelocity / 2;
        my.sprite.manhandla_right.delete = false;
        my.sprite.manhandla_right.map_pos = 'ddI3';
        my.sprite.manhandla_right.iframes_counter = 0;
        my.sprite.manhandla_right.key = false;
        my.sprite.manhandla_right.s = 'ddI3';


        my.sprite.manhandla_bottom.type = 'manhandla_bottom'
        my.sprite.manhandla_bottom.weakness = 'light';
        my.sprite.manhandla_bottom.health = 7;
        //my.sprite.manhandla_bottom.speed = this.playerVelocity / 2;
        my.sprite.manhandla_bottom.delete = false;
        my.sprite.manhandla_bottom.map_pos = 'ddI3';
        my.sprite.manhandla_bottom.iframes_counter = 0;
        my.sprite.manhandla_bottom.key = false;
        my.sprite.manhandla_bottom.s = 'ddI3';

        my.sprite.manhandla.type = 'manhandla'
        //y.sprite.manhandla_top.weakness = 'light';
        my.sprite.manhandla.speed = this.playerVelocity /2;
        my.sprite.manhandla.delete = false;
        my.sprite.manhandla.map_pos = 'ddI3';
        //my.sprite.manhandla_top.iframes_counter = 0;
        //my.sprite.manhandla_top.key = false;
        my.sprite.manhandla.s = 'ddI3';
        this.physics.add.collider(my.sprite.manhandla, this.groundLayer); 
        this.physics.add.collider(my.sprite.manhandla, this.enemyBoundary);
        
        this.enemies.push(my.sprite.manhandla_top);
        this.enemies.push(my.sprite.manhandla_left);
        this.enemies.push(my.sprite.manhandla_right);
        this.enemies.push(my.sprite.manhandla_bottom);
        //console.log(this.enemies)
    }

    spawnDig() {
        my.sprite.digdogger = this.physics.add.sprite(2078, 350, "digdogger_right", "DigdoggerRight-0.png").setDepth(90);
        my.sprite.digdogger.isMoving = false;
        this.physics.world.enable(my.sprite.digdogger);
        my.sprite.digdogger.anims.play('digdogger_right', true);
        my.sprite.digdogger.visible = false;
        my.sprite.digdogger.type = 'digdogger';
        my.sprite.digdogger.weakness = 'dark'; 
        my.sprite.digdogger.health = 20;
        my.sprite.digdogger.speed = this.playerVelocity / 2;
        my.sprite.digdogger.delete = false;
        my.sprite.digdogger.map_pos = 'ldG2';
        my.sprite.digdogger.iframes_counter = 0;
        my.sprite.digdogger.key = false;
        my.sprite.digdogger.s = 'ldG2';
        this.physics.add.collider(my.sprite.digdogger, this.groundLayer);
        this.physics.add.collider(my.sprite.digdogger, this.enemyBoundary);
        this.enemies.push(my.sprite.digdogger);
    }

    SpawnGle(){
        my.sprite.gleeok = this.add.container(480, 40).setDepth(90); // container for gleeok sprites
        my.sprite.gleeok.isMoving = false;
        this.physics.world.enable(my.sprite.gleeok);

        my.sprite.gleeok_body = this.physics.add.sprite(0, 0, "gleeok", "Gleeok-0.png").setDepth(90); // body
        my.sprite.gleeok_body.anims.play('gleeok_body', true);
        my.sprite.gleeok.add(my.sprite.gleeok_body);
        my.sprite.gleeok_body.container = my.sprite.gleeok;
    
        my.sprite.gleeok_ln = this.physics.add.sprite(6, 24, "gleeok", "Gleeok-3.png").setDepth(90); // left neck
        my.sprite.gleeok.add(my.sprite.gleeok_ln);
        my.sprite.gleeok_ln.container = my.sprite.gleeok;
        my.sprite.gleeok_ln.body.enable = false;

        my.sprite.gleeok_ln2 = this.physics.add.sprite(2, 30, "gleeok", "Gleeok-3.png").setDepth(90); // left neck 2
        my.sprite.gleeok.add(my.sprite.gleeok_ln2);
        my.sprite.gleeok_ln2.container = my.sprite.gleeok;
        my.sprite.gleeok_ln2.body.enable = false;

        my.sprite.gleeok_lh = this.physics.add.sprite(-2, 40, "gleeok", "Gleeok-4.png").setDepth(90); // left head
        my.sprite.gleeok_lh.x_offset = -2;
        my.sprite.gleeok_lh.y_offset = 40;
        my.sprite.gleeok.add(my.sprite.gleeok_lh);
        my.sprite.gleeok_lh.container = my.sprite.gleeok;
        my.sprite.gleeok_lh.body.setSize(10, 16);  
        my.sprite.gleeok_lh.body.setOffset(0, 0);

        my.sprite.gleeok_lh2 = this.physics.add.sprite(480, 40, "gleeok", "Gleeok-5.png").setDepth(90); // left head 2
        this.physics.add.collider(my.sprite.gleeok_lh2, this.groundLayer); 
        this.physics.add.collider(my.sprite.gleeok_lh2, this.enemyBoundary);
        my.sprite.gleeok_lh2.anims.play('gleeok_lh2', true);
        my.sprite.gleeok_lh2.body.setSize(10, 16);  
        my.sprite.gleeok_lh2.body.setOffset(3, 0);

        my.sprite.gleeok_rn = this.physics.add.sprite(10, 26, "gleeok", "Gleeok-7.png").setDepth(90); // right neck
        my.sprite.gleeok.add(my.sprite.gleeok_rn);
        my.sprite.gleeok_rn.container = my.sprite.gleeok;
        my.sprite.gleeok_rn.body.enable = false;

        my.sprite.gleeok_rn2 = this.physics.add.sprite(14, 32, "gleeok", "Gleeok-7.png").setDepth(90); // right neck 2
        my.sprite.gleeok.add(my.sprite.gleeok_rn2);
        my.sprite.gleeok_rn2.container = my.sprite.gleeok;
        my.sprite.gleeok_rn2.body.enable = false;

        my.sprite.gleeok_rh = this.physics.add.sprite(18, 40, "gleeok", "Gleeok-8.png").setDepth(90); // right head
        my.sprite.gleeok_rh.x_offset = 18;
        my.sprite.gleeok_rh.y_offset = 40;
        my.sprite.gleeok.add(my.sprite.gleeok_rh);
        my.sprite.gleeok_rh.container = my.sprite.gleeok;
        my.sprite.gleeok_rh.body.setSize(10, 16);  
        my.sprite.gleeok_rh.body.setOffset(0, 0);

        my.sprite.gleeok_rh2 = this.physics.add.sprite(520, 40, "gleeok", "Gleeok-9.png").setDepth(90); // right head 2
        this.physics.add.collider(my.sprite.gleeok_rh2, this.groundLayer); 
        this.physics.add.collider(my.sprite.gleeok_rh2, this.enemyBoundary);
        my.sprite.gleeok_rh2.anims.play('gleeok_rh2', true);
        my.sprite.gleeok_rh2.body.setSize(10, 16);  
        my.sprite.gleeok_rh2.body.setOffset(3, 0);

        my.sprite.gleeok.visible = false;  // container traits
        my.sprite.gleeok.type = 'gleeok'
        my.sprite.gleeok.speed = this.playerVelocity / 2;
        my.sprite.gleeok.delete = false;
        my.sprite.gleeok.map_pos = 'B0';
        my.sprite.gleeok.s = 'B0';
        my.sprite.gleeok.body.setSize(my.sprite.gleeok_body.width, my.sprite.gleeok_body.height);  
        my.sprite.gleeok.body.setOffset(-my.sprite.gleeok_body.width/2, -my.sprite.gleeok_body.height/2);
        this.physics.add.collider(my.sprite.gleeok, this.groundLayer); 
        this.physics.add.collider(my.sprite.gleeok, this.enemyBoundary);

        my.sprite.gleeok_lh.type = 'gleeok_lh'  // left head traits
        my.sprite.gleeok_lh.weakness = 'dark';
        my.sprite.gleeok_lh.health = 7;
        my.sprite.gleeok_lh.delete = false;
        my.sprite.gleeok_lh.map_pos = 'B0';
        my.sprite.gleeok_lh.iframes_counter = 0;
        my.sprite.gleeok_lh.key = false;
        my.sprite.gleeok_lh2.s = 'B0';

        my.sprite.gleeok_lh2.type = 'lh2'  // left head 2 traits
        my.sprite.gleeok_lh2.weakness = 'dark';
        my.sprite.gleeok_lh2.health = 7;
        my.sprite.gleeok_lh2.speed = this.playerVelocity / 1.5;
        my.sprite.gleeok_lh2.delete = false;
        my.sprite.gleeok_lh2.map_pos = 'B0';
        my.sprite.gleeok_lh2.iframes_counter = 0;
        my.sprite.gleeok_lh2.key = false;
        my.sprite.gleeok_lh2.s = 'B0';
        my.sprite.gleeok_lh2.visible = false;

        my.sprite.gleeok_rh.type = 'gleeok_rh'  // right head traits
        my.sprite.gleeok_rh.weakness = 'light';
        my.sprite.gleeok_rh.health = 7;
        my.sprite.gleeok_rh.delete = false;
        my.sprite.gleeok_rh.map_pos = 'B0';
        my.sprite.gleeok_rh.iframes_counter = 0;
        my.sprite.gleeok_rh.key = false;
        my.sprite.gleeok_rh.s = 'B0';

        my.sprite.gleeok_rh2.type = 'rh2'  // right head 2 traits
        my.sprite.gleeok_rh2.weakness = 'light';
        my.sprite.gleeok_rh2.health = 7;
        my.sprite.gleeok_rh2.speed = this.playerVelocity / 1.5;
        my.sprite.gleeok_rh2.delete = false;
        my.sprite.gleeok_rh2.map_pos = 'B0';
        my.sprite.gleeok_rh2.iframes_counter = 0;
        my.sprite.gleeok_rh2.key = false;
        my.sprite.gleeok_rh2.s = 'B0';
        my.sprite.gleeok_rh2.visible = false;

        this.enemies.push(my.sprite.gleeok_lh);
        this.enemies.push(my.sprite.gleeok_rh);
        this.enemies.push(my.sprite.gleeok_lh2);
        this.enemies.push(my.sprite.gleeok_rh2);
    }

//MISC FUNCTIONS=========================================================================================================================

    // Function to update player hitbox based on animation
    updatePlayerHitbox(animation) {
        if (animation === 'side'|| animation === 'down') {
            my.sprite.link.body.setSize(14, 14)
            my.sprite.link.body.setOffset(1, 1)
        } else if (animation === 'up') {
            my.sprite.link.body.setSize(12, 13)
            my.sprite.link.body.setOffset(0, 0)
        }
    }

    e_shoot(enemy) {
        if(this.e_bullets.length < 3 && this.gameActive) {
            let angle = null;
            if(enemy.container){
                my.sprite.bullet = this.add.sprite(enemy.container.x + enemy.x_offset, enemy.container.y + enemy.y_offset, "fireball"); 
                angle = Phaser.Math.Angle.Between(enemy.container.x + enemy.x_offset, enemy.container.y + enemy.y_offset, my.sprite.player.x, my.sprite.player.y);
                console.log(enemy.type, enemy.container.x, enemy.x_offset)
            }
            else {
                my.sprite.bullet = this.add.sprite(enemy.x, enemy.y, "fireball"); 
                angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, my.sprite.player.x, my.sprite.player.y);
            }
            my.sprite.bullet.dir = angle;
            //my.sprite.bullet.setScale(.5);
            my.sprite.bullet.rotation = angle;
            this.physics.world.enable(my.sprite.bullet);
            this.e_bullets.push(my.sprite.bullet);
            this.sound.play('sfx_fireball');
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
            if(enemy.type != "manhandla" && enemy.type != "digdogger" && enemy.type != "gleeok" && enemy.type != "lh2" && enemy.type != "rh2") {
                if(enemy.type == "octo" || enemy.type == "darknut" || enemy.type == "lynel") anim = enemy.type+'_side';
                else if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
                else anim = enemy.type + "_front";
                enemy.anims.play(anim, true);
                if(enemy.type != "wizrobe" && enemy.type != "darknut" && enemy.type != "lynel") enemy.resetFlip();
                else enemy.setFlip(true, false);
                enemy.setVelocity(-enemy.speed, 0);
            }
            else if(enemy.type == "digdogger") {
                enemy.setVelocity(-enemy.speed, 0);
            }
            else enemy.body.setVelocity(-enemy.speed, 0);
        }
        else if(rand >= .25 && rand < .5) {//move up
            let targetY = enemy.y - (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetY = targetY;
            enemy.facing = 'up';
            let anim = null;
            if(enemy.type != "manhandla" && enemy.type != "digdogger"  && enemy.type != "gleeok" && enemy.type != "lh2" && enemy.type != "rh2") {
                if(enemy.type == "armos" || enemy.type == "darknut" || enemy.type == "lynel" || enemy.type == "wizrobe" ||enemy.type == "ghini") anim = enemy.type+"_back"
                else if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
                else {anim = enemy.type+"_front"; enemy.setFlip(false, true);}
                enemy.anims.play(anim, true);
                enemy.setVelocity(0, -enemy.speed);
            }
            else if(enemy.type == "digdogger") {
                enemy.setVelocity(0, -enemy.speed);
            }
            else enemy.body.setVelocity(0, -enemy.speed);
        }
        else if(rand >= .5 && rand < .75) { //move right
            let targetX = enemy.x + (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetX = targetX;
            enemy.facing = 'right';
            let anim = null;
            if(enemy.type != "manhandla" && enemy.type != "digdogger"  && enemy.type != "gleeok" && enemy.type != "lh2" && enemy.type != "rh2") {
                if(enemy.type == "octo" || enemy.type == "darknut" || enemy.type == "lynel") anim = enemy.type+'_side';
                else if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
                else anim = enemy.type + "_front";
                enemy.anims.play(anim, true);
                if(enemy.type != "wizrobe" && enemy.type != "darknut" && enemy.type != "lynel") enemy.setFlip(true, false);
                else enemy.resetFlip();
                enemy.setVelocity(enemy.speed, 0);
            }
            else if(enemy.type == "digdogger"){
                enemy.setVelocity(enemy.speed, 0);
            }
            else enemy.body.setVelocity(enemy.speed, 0);
        }
        else if(rand > .75) {//move down
            let targetY = enemy.y + (Math.floor(Math.random() * (6 - 1) + 1) * 8);
            enemy.targetY = targetY;
            enemy.facing = 'down';
            let anim = null;
            if(enemy.type != "manhandla" && enemy.type != "digdogger"  && enemy.type != "gleeok" && enemy.type != "lh2" && enemy.type != "rh2") {
                if(enemy.type == "peahat" || enemy.type == "keese") anim = enemy.type;
                else anim = enemy.type+'_front';
                enemy.anims.play(anim, true);
                enemy.resetFlip();
                enemy.setVelocity(0, enemy.speed);
            }
            else if(enemy.type == "digdogger"){
                enemy.setVelocity(0, enemy.speed);
            }
            else enemy.body.setVelocity(0, enemy.speed);
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
            this.sound.play('sfx_error');
            this.overworld_theme.stop();
            this.dungeon_theme.stop();

        this.scene.restart(my.gameState);
    }

    
//MAP CHANGE FUNCTIONS=========================================================================================================================
    freezeFountain() {
        if(this.frozen == false) {
        //console.log("in freeze!");
        this.frozen = true;
        let id = this.frozen_tileset.firstgid;
        
        let gid = this.overworld_tileset.firstgid;
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+154) { this.groundLayer.putTileAt(id + 3, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+136) { this.groundLayer.putTileAt(id + 6, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+151) { this.groundLayer.putTileAt(id + 1, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+151) { this.groundLayer.putTileAt(id + 1, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+152) { this.groundLayer.putTileAt(id + 2, tile.x, tile.y);}
        })
        this.groundLayer.forEachTile(tile => {
            if(tile.index == gid+150) { this.groundLayer.putTileAt(id, tile.x, tile.y);}
        })
    }   
    }
    dockBoat(facing, pos) {
        this.lastDock = pos;
        //console.log("docking! "+facing+' '+pos);
        if(!this.sailing) {
            this.move = false;
            this.actionable = false;
            switch(pos) {
                case 'C0':
                    this.actionable_timer = 103; break;
                case 'C2':
                    this.actionable_timer = 103; break;
                case 'D3':
                    this.actionable_timer = 70; break;
                case 'E3':
                    this.actionable_timer = 70; break;
                case 'D4':
                    this.actionable_timer = 28; break;
                case 'D5':
                    this.actionable_timer = 28; break;
            }
        }
        this.sailing = true;
        my.sprite.boat.visible = true;
        my.sprite.boat.body.enable = true;
        switch(facing) {
            case 'down':
                my.sprite.boat.setPosition(0, 0);
                if (pos === 'C0') {if (my.sprite.player.y < 352 && this.actionable_timer % 3 === 0) {my.sprite.player.y += 8; break;} }
                if (pos === 'D4') {if (my.sprite.player.y < 744 && this.actionable_timer % 3 === 0) {my.sprite.player.y += 8; break;} }
            case 'right':
                my.sprite.boat.setPosition(0, 0);
                if (pos === 'D3') {if (my.sprite.player.x < 1384 && this.actionable_timer % 3 === 0) {my.sprite.player.x += 8; break;} }
            case 'up':
                my.sprite.boat.setPosition(0, 0);
                if (pos === 'C2') {if (my.sprite.player.y > 72 && this.actionable_timer % 3 === 0) {my.sprite.player.y -= 8; break;} }
                if (pos === 'D5') {if (my.sprite.player.y > 680 && this.actionable_timer % 3 === 0) {my.sprite.player.y -= 8; break;} }
            case 'left':
                my.sprite.boat.setPosition(2, 0);
                if (pos === 'E3') { if (my.sprite.player.x > 1192 && this.actionable_timer % 3 === 0) {my.sprite.player.x -= 8; break;} }
        }
    }
    unlockDoor(tiles) {
        tiles.forEach(tile => {
            this.groundLayer.putTileAt(this.teal_tileset.firstgid + 249, tile.x, tile.y);
        })
        this.sound.play('sfx_door_open');
        
    }
    createStairs(tiles, tileset) {
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 120, tiles[0].x, tiles[0].y);
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 121, tiles[1].x, tiles[1].y);
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 104, tiles[2].x, tiles[2].y);
        this.groundLayer.putTileAt(this.forest_tileset.firstgid + 105, tiles[3].x, tiles[3].y);
    }
    

    update() {
        if(this.gameActive){
            console.log(my.playerVal.rupees
            );
            if(this.killed_bosses >= 2) {
                this.gameActive = false;
                this.winLayer.visible = true;
                this.foregroundLayer.visible = false;
                this.groundLayer.visible = false;
                my.sprite.sword_side.visible = false;
                my.sprite.sword_up.visible = false;
                my.sprite.link.visible = false;
            }
            
        ///console.log("x: "+my.sprite.player.x+", y: "+my.sprite.player.y);
        //console.log(my.playerVal.item)
        //console.log(this.move, this.actionable_timer)
        my.playerVal.pos = this.map_coords[my.sprite.player.y_coord][my.sprite.player.x_coord]
        //console.log(/*this.overworld, */my.playerVal.pos, my.sprite.player.x_coord, my.sprite.player.y_coord)
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

        if(this.e_bullets.length != 0) for (let i = this.e_bullets.length - 1; i >= 0; i--) {
            let b = this.e_bullets[i];
            //console.log(b.x, b.y);
            const boundsWidth = 320;
            const boundsHeight = 144;
            b.x += 2 * Math.cos(b.dir);
            b.y += 2 * Math.sin(b.dir);
            const playerScreenX = b.x - this.mapCamera.scrollX;
            const playerScreenY = b.y - this.mapCamera.scrollY;

            if(playerScreenX > boundsWidth || playerScreenX < 0 || playerScreenY > boundsHeight || playerScreenY < 0 || (this.collides(b, my.sprite.sword_up) && my.sprite.sword_up.visible == true) || (this.collides(b, my.sprite.sword_side)  && my.sprite.sword_side.visible == true)) {
                
                this.e_bullets.splice(i, 1);
                b.destroy(1);
            }

            if(this.collides(b, my.sprite.player)) {
                this.e_bullets.splice(i, 1);
                b.destroy(1);
                my.playerVal.health--;
                let angle = Phaser.Math.Angle.Between(b.x, b.y, my.sprite.player.x, my.sprite.player.y);
                my.sprite.player.dir = angle;
                this.actionable = false;
                this.actionable_timer = 7;
                this.iframes_counter = 20;
                this.move = false;
                this.sound.play("sfx_hurt")
            }
            
        }

//ENEMY CHECKS==========================================================================================================================
        if(this.enemies.length != 0) for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            if(enemy.iframes_counter >0) enemy.iframes_counter--;
            if((!enemy.type.includes("manhandla") && enemy.type != "digdogger" &&!enemy.type.includes("gleeok") && enemy.type != "lh2" && enemy.type != "rh2") && enemy.map_pos != my.playerVal.pos && !this.mapCamera.isMoving) {enemy.delete = true; } //kill when out of bounds
            
            if(((enemy.type.includes("manhandla") || enemy.type.includes("gleeok"))  && enemy.container.visible == true ) || ((enemy.type == "wizrobe" || enemy.type == "lynel" || enemy.type == "digdogger" || enemy.type == "lh2"|| enemy.type == "rh2") && enemy.visible)){
                //console.log(enemy.type, enemy.map_pos, my.playerVal.pos, !this.mapCamera.isMoving)
                let prob1 = 1/90;
                    if(Math.random() < prob1 && enemy.map_pos == my.playerVal.pos && !this.mapCamera.isMoving) {
                        this.e_shoot(enemy)
                    }
            }
            if((this.collides(enemy, my.sprite.sword_side) && my.sprite.sword_side.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.sword_up) && my.sprite.sword_up.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.arrow_side) && my.sprite.arrow_side.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.arrow_up) && my.sprite.arrow_up.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.ice_wand_side) && my.sprite.ice_wand_side.visible && enemy.iframes_counter <= 0) || (this.collides(enemy, my.sprite.ice_wand_up) && my.sprite.ice_wand_up.visible && enemy.iframes_counter <= 0)) {
                my.sprite.arrow_side.isMoving = false;
                my.sprite.arrow_side.setVelocity(0, 0);
                my.sprite.arrow_side.visible = false;
                my.sprite.arrow_up.isMoving = false;
                my.sprite.arrow_up.setVelocity(0, 0);
                my.sprite.arrow_up.visible = false;
                if(my.sprite.player.element == enemy.weakness) enemy.health -= 3;
                else enemy.health--;
                this.sound.play('sfx_enemy_hit');

                if((!enemy.type.includes("manhandla") && enemy.type != "digdogger" &&!enemy.type.includes("gleeok"))){
                    
                    let angle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, enemy.x, enemy.y);
                    enemy.dir = angle;
                }
                enemy.iframes_counter = 40;
                if(enemy.health <= 0) {
                this.sound.play('sfx_enemy_dies');

                    let prob = Math.random();
                    enemy.delete = true;
                    if(enemy.type == 'lh2' || enemy.type == 'rh2') this.killed_bosses++;
                    let non_bosses_active = 0;
                    this.enemies.forEach((enemy) =>{
                    //console.log(enemy.type, !enemy.type.includes("manhandla"), enemy.type != "digdogger", !enemy.type.includes("gleeok"))
                        if(!enemy.type.includes("manhandla") && enemy.type != "digdogger" && !enemy.type.includes("gleeok") && enemy.type != "lh2"&& enemy.type != "rh2") {
                            non_bosses_active++;
                        } 
                    });
                    if(enemy.key && non_bosses_active == 1) {
                        const key_obj = new Key(this, enemy.x, enemy.y);
                        this.sound.play('sfx_key_appears')
                        this.add.existing(key_obj);
                        this.keys.push(key_obj);
                        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
                        this.spawn_locations.forEach((spawn) =>{
                            if(spawn.screen == enemy.s) spawn.key = false;
                        })
                    }
                    else {
                        if(prob < 0.5) {
                            const heart_obj = new Heart(this, enemy.x, enemy.y); 
                            this.add.existing(heart_obj); 
                            this.hearts.push(heart_obj); 
                            this.physics.world.enable(this.hearts, Phaser.Physics.Arcade.STATIC_BODY);
                        }
                        else if(prob > .5 && prob < .75) {
                            const rupee_obj = new Blue_Rupee(this, enemy.x, enemy.y); 
                            this.add.existing(rupee_obj); 
                            this.blue_rupees.push(rupee_obj); 
                            this.physics.world.enable(this.blue_rupees, Phaser.Physics.Arcade.STATIC_BODY);
                        }
                        else if(prob > .75 && prob < 1) {
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
            //if(enemy.type.includes('manhandla') && enemy.container) console.log(enemy.container.isMoving)
            if(Math.random() < prob && (!enemy.isMoving|| (enemy.container && !enemy.container.isMoving)) && (enemy.iframes_counter <= 0 || enemy.type.includes("manhandla") || enemy.type == "digdogger" || enemy.type == "lh2"|| enemy.type == "rh2"|| enemy.type.includes("gleeok"))) {
                enemy.dir = null;
                
                //console.log("move called")
                if(!enemy.type.includes('manhandla') && !enemy.type.includes("gleeok")) {this.e_move(enemy); enemy.isMoving = true;}
                else if(enemy.container && !enemy.container.isMoving) {enemy.container.isMoving = true; this.e_move(enemy.container);}
            }
            else if((enemy.isMoving|| (enemy.container && enemy.container.isMoving)) && (enemy.iframes_counter <= 0 || enemy.type.includes("manhandla") || enemy.type == "digdogger" || enemy.type.includes("gleeok") || enemy.type == "lh2"|| enemy.type == "rh2")) {
                enemy.dir = null;
                //stopping code
                if((enemy.type.includes('manhandla')|| enemy.type.includes('gleeok')) && enemy.container && enemy.container.body.deltaX() == 0 && enemy.container.body.deltaY() == 0)  enemy.container.isMoving = false;
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
                    if(!enemy.type.includes('manhandla') && enemy.type != "digdogger" && !enemy.type.includes("gleeok") && enemy.type != "lh2" && enemy.type != "rh2") enemy.anims.stop();
                }
            }
            else if(enemy.dir) {
                let tx = this.playerVelocity * Math.cos(enemy.dir);
                let ty = this.playerVelocity * Math.sin(enemy.dir);
                enemy.body.setVelocity(tx, ty);
            }

            if(this.collides(enemy, my.sprite.link) && this.iframes_counter == 0 && enemy.visible == true){
                let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, my.sprite.player.x, my.sprite.player.y);
                my.sprite.player.dir = angle;
                my.playerVal.health -= enemy.damage;
            this.sound.play('sfx_hurt');

                this.actionable = false;
                this.actionable_timer = 7;
                this.iframes_counter = 20;
                this.move = false;
            }
            //console.log(enemy, enemy.delete)
            if(enemy.delete == true) {
                if(enemy.container) enemy.container.remove(enemy);
                this.enemies.splice(i, 1);
                enemy.destroy(1);
            }
        }

//PLAYER CHECKS=========================================================================================================================
        //if(my.sprite.player.dir)console.log(this.actionable_timer)
        //console.log(my.sprite.player.element, this.darkLayer.visible)
        
        if(my.sprite.player.element == 'light' && my.playerVal.pos.includes('dd')) {this.darkLayer.visible = false;}
        else if(my.sprite.player.element == 'dark' && my.playerVal.pos == 'ldG3') {this.darkLayer.visible = false;}
        else this.darkLayer.visible = true;
        my.sprite.link.body.x = my.sprite.player.body.x;
        my.sprite.link.body.y = my.sprite.player.body.y;
        if(my.sprite.player.dir == 0) this.move = true;
        if(this.iframes_counter > 0) this.iframes_counter--;
        if(this.actionable_offset > 0) this.actionable_offset--;
        if(this.actionable_timer > 0 ) {
            this.actionable_timer--;
            if(this.sailing) {this.dockBoat(my.sprite.player.facing, this.lastDock)}
        }
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
                this.sound.play('sfx_sword');
                this.actionable = false;
                this.actionable_timer = 8;
                this.actionable_offset = this.actionable_timer + 4;
                let anim = null;
                this.move = false;
                switch (my.sprite.player.facing) {
                    case 'up':
                        anim = my.sprite.player.element+'_item_up';
                        my.sprite.sword_up.setPosition(0, -14);
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.resetFlip(); 
                        break;
                    case 'down':
                        anim = my.sprite.player.element+'_item_down';
                        my.sprite.sword_up.setPosition(1, 14);
                        my.sprite.sword_up.visible = true;
                        my.sprite.sword_up.body.enable = true;
                        my.sprite.sword_up.setFlip(false, true);
                        break;
                    case 'right':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.setPosition(16, 1);
                        my.sprite.sword_side.visible = true;
                        my.sprite.sword_side.body.enable = true;
                        my.sprite.sword_side.resetFlip(); 
                        break;
                    case 'left':
                        anim = my.sprite.player.element+'_item_side';
                        my.sprite.sword_side.setPosition(-14, 1);
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
                        this.sound.play('sfx_rod')
                        my.sprite.player.element = 'ice';
                        break
                    case 'fire':this.sound.play('sfx_rod')
                        my.sprite.player.element = 'fire';
                        break
                    case 'lightning':
                        this.sound.play('sfx_rod')
                        my.sprite.player.element = 'lightning';
                        break
                    case 'dark':
                        this.sound.play('sfx_rod')
                        my.sprite.player.element = 'dark';
                        break
                    case 'light':
                        this.sound.play('sfx_rod')
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
                            this.sound.play('sfx_arrow')
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
        if(my.sprite.gleeok_lh.visible == false && my.sprite.gleeok_rh.visible == false) {my.sprite.gleeok.visible = false; my.sprite.gleeok_lh2.visible = true; my.sprite.gleeok_rh2.visible = true} 

        if(my.sprite.manhandla_bottom.visible == false && my.sprite.manhandla_top.visible == false && my.sprite.manhandla_left.visible == false && my.sprite.manhandla_right.visible == false) my.sprite.manhandla_body.visible = false;
    }
    else {
        if(Phaser.Input.Keyboard.JustDown(this.xKey)) {
            this.gameActive = true;
            my.gameState.title = false;
            this.linkActive = true;
            my.gameState.linkActive = true;
            my.gameState.gameActive = true;
            this.titleLayer.visible = false;
            this.creditsLayer.visible = false;
            my.sprite.link.visible = true;
            if(this.overworld){
                this.dungeon_theme.stop();
                this.overworld_theme.play();
            }
            else{
                this.overworld_theme.stop();
                this.dungeon_theme.play();
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.zKey)) {
            this.titleLayer.visible = false;
        }
    }
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