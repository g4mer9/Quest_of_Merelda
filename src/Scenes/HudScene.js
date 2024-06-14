class HudScene extends Phaser.Scene {
    constructor() {
        super("HudScene");
    }
    create(){
        // Tileset initialization
        this.cameras.main.setBackgroundColor('#000000');
        this.map = this.add.tilemap("HUD", 8, 8, 0, 0);
        this.overworld_tileset = this.map.addTilesetImage("zelda_overworld_tileset", "overworld_tileset");
        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset", "mountain_tileset");
        this.graveyard_tileset = this.map.addTilesetImage("zelda_graveyard_tileset", "graveyard_tileset");
        this.map_cursor = this.map.addTilesetImage("map_cursor_bottom", "map_cursor");
        this.sword = this.map.addTilesetImage("sword_hud", "sword_hud");
        this.bow = this.map.addTilesetImage("bow", "bow");
        this.boat = this.map.addTilesetImage("boat_HUD", "boat_HUD");
        
        this.ice_wand = this.map.addTilesetImage("ice_wand_up", "ice_wand_up");
        this.fire_wand = this.map.addTilesetImage("fire_wand_up", "fire_wand_up");
        this.lightning_wand = this.map.addTilesetImage("lightning_wand_up", "lightning_wand_up");
        this.dark_wand = this.map.addTilesetImage("dark_wand_up", "dark_wand_up");
        this.light_wand = this.map.addTilesetImage("light_wand_up", "light_wand_up");
        this.swap = this.map.addTilesetImage("HUD_arrow", "HUD_arrow");
        this.bottom_layer = this.map.createLayer("Tile Layer 1", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset, this.graveyard_tileset, this.map_cursor, this.swap, this.bow], 0, 0);
        this.top_layer = this.map.createLayer("Tile Layer 2", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset, this.graveyard_tileset, this.map_cursor, this.sword, this.ice_wand, this.fire_wand, this.lightning_wand, this.dark_wand, this.light_wand, this.bow, this.boat], 0, 0);
        //this.object_layer = 
    }

    // Value updates
    updateHealth() {
        for (let i = 0; i < 2; i++) {
            for (let j = 1; j <= 6; j++) {
                if (((i*12)+(j*2)) > my.playerVal.max) {
                    // current heart above max health
                    break;
                } else if (((i*12)+(j*2)) <= my.playerVal.health) {
                    // current heart full
                    this.top_layer.putTileAt(this.mountain_tileset.firstgid + 233, j+31, i+3);
                } else if (((i*12)+(j*2)-1) <= my.playerVal.health) {
                    // current heart half full
                    this.top_layer.putTileAt(this.mountain_tileset.firstgid + 114, j+31, i+3);
                } else {
                    // current heart empty
                    this.top_layer.putTileAt(this.mountain_tileset.firstgid + 99, j+31, i+3);
                }
            }
        }
    }

    updateMap() {
        // clear previous map cursors
        this.top_layer.forEachTile(tile => {
            if (tile.index === this.map_cursor.firstgid) {
                this.top_layer.removeTileAt(tile.x, tile.y);
            }
        })
        // calculate and place next cursors
        let x = my.playerVal.pos.charCodeAt(0)-59;
        let y = Number(my.playerVal.pos[1]);
        if (x >= 6 && x <= 9 && y >= 1 && y <= 4) {
            let left = this.top_layer.putTileAt(this.map_cursor.firstgid, x-1, y);
            left.rotation = Math.PI/2;
            let right = this.top_layer.putTileAt(this.map_cursor.firstgid, x+1, y);
            right.rotation = 3*Math.PI/2
            let up = this.top_layer.putTileAt(this.map_cursor.firstgid, x, y-1);
            up.flipY = true;
            this.top_layer.putTileAt(this.map_cursor.firstgid, x, y+1);
        }
    }

    updateRupees() {
        let num = my.playerVal.rupees;
        if (num < 10) {
            // convert single digit to tile
            if (num % 2 === 0){
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + (num/2), 16, 2);
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + 34, 17, 2);
            } else {
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + ((num-1)/2)+16, 16, 2);
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + 34, 17, 2);
            }
        } else {
            // extract digits
            num = String(num);
            let tens = Number(num[0]);
            let ones = Number(num[1]);
            // convert tens to tile
            if (tens % 2 === 0){
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + (tens/2), 16, 2);
            } else {
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + ((tens-1)/2)+16, 16, 2);
            }
            // convert ones to tile
            if (ones % 2 === 0){
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + (ones/2), 17, 2);
            } else {
                this.top_layer.putTileAt(this.graveyard_tileset.firstgid + ((ones-1)/2)+16, 17, 2);
            }
        }
    }

    updateKeys(){
        let num = my.playerVal.keys;
        if (num % 2 === 0){
            this.top_layer.putTileAt(this.graveyard_tileset.firstgid + (num/2), 16, 4);
        } else {
            this.top_layer.putTileAt(this.graveyard_tileset.firstgid + ((num-1)/2)+16, 16, 4);
        }
    }

    updateItem() {
        let item = my.playerVal.item;
        //console.log(item)
        switch(item) {
            case 'ice':
                item = this.ice_wand;
                break
            case 'fire':
                item = this.fire_wand;
                break
            case 'lightning':
                item = this.lightning_wand;
                break
            case 'dark':
                item = this.dark_wand;
                break
            case 'light':
                item = this.light_wand;
                break
            case 'bow':
                item = this.bow;
                break
            case 'boat':
                item = this.boat;
                break
            default:
                item = null;
                break
        }
        if (item) {this.top_layer.putTileAt(item.firstgid, 21, 2);}
    }

    update(){
        this.updateHealth();
        events.on('mapCursor', this.updateMap, this);
        this.updateRupees();
        this.updateKeys();
        this.updateItem();
    }
}