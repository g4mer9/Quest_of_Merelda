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
        this.ice_wand = this.map.addTilesetImage("ice_wand_up", "ice_wand_up");
        this.sword = this.map.addTilesetImage("sword_up", "sword_up");
        this.swap = this.map.addTilesetImage("HUD_arrow", "HUD_arrow");
        this.bottom_layer = this.map.createLayer("Tile Layer 1", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset, this.graveyard_tileset, this.ice_wand, this.sword, this.map_cursor, this.swap], 0, 0);
        this.top_layer = this.map.createLayer("Tile Layer 2", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset, this.graveyard_tileset, this.ice_wand, this.sword, this.map_cursor], 0, 0);
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
                    this.top_layer.putTileAt(748, j+31, i+3);
                } else if (((i*12)+(j*2)-1) <= my.playerVal.health) {
                    // current heart half full
                    this.top_layer.putTileAt(629, j+31, i+3);
                } else {
                    // current heart empty
                    this.top_layer.putTileAt(614, j+31, i+3);
                }
            }
        }
    }

    updateMap() {
        // clear previous map cursors
        this.top_layer.forEachTile(tile => {
            if (tile.index === 514) {
                this.top_layer.removeTileAt(tile.x, tile.y);
            }
        })
        // calculate and place next cursors
        let x = my.playerVal.pos.charCodeAt(0)-59;
        let y = Number(my.playerVal.pos[1]);
        let left = this.top_layer.putTileAt(514, x-1, y);
        left.rotation = Math.PI/2;
        let right = this.top_layer.putTileAt(514, x+1, y);
        right.rotation = 3*Math.PI/2
        let up = this.top_layer.putTileAt(514, x, y-1);
        up.flipY = true;
        this.top_layer.putTileAt(514, x, y+1);
    }

    updateRupees() {
        let num = my.playerVal.rupees;
        if (num < 10) {
            // convert single digit to tile
            if (num % 2 === 0){
                this.top_layer.putTileAt((num/2)+1, 16, 2);
            } else {
                this.top_layer.putTileAt(((num+1)/2)+16, 16, 2);
            }
        } else {
            // extract digits
            num = String(num);
            let tens = Number(num[0]);
            let ones = Number(num[1]);
            // convert tens to tile
            if (tens % 2 === 0){
                this.top_layer.putTileAt((tens/2)+1, 16, 2);
            } else {
                this.top_layer.putTileAt(((tens+1)/2)+16, 16, 2);
            }
            // convert ones to tile
            if (ones % 2 === 0){
                this.top_layer.putTileAt((ones/2)+1, 17, 2);
            } else {
                this.top_layer.putTileAt(((ones+1)/2)+16, 17, 2);
            }
        }
    }

    updateKeys(){
        let num = my.playerVal.keys;
        if (num % 2 === 0){
            this.top_layer.putTileAt((num/2)+1, 16, 4);
        } else {
            this.top_layer.putTileAt(((num+1)/2)+16, 16, 4);
        }
    }

    update(){
        this.updateHealth();
        events.on('mapCursor', this.updateMap, this);
        this.updateRupees();
        this.updateKeys();
    }
}