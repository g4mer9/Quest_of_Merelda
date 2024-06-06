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
                    break;
                } else if (((i*12)+(j*2)) <= my.playerVal.health) {
                    this.top_layer.putTileAt(748, j+31, i+3);
                } else if (((i*12)+(j*2)-1) <= my.playerVal.health) {
                    this.top_layer.putTileAt(629, j+31, i+3);
                } else {
                    this.top_layer.putTileAt(614, j+31, i+3);
                }
            }
        }
    }

    update(){
        this.updateHealth();
    }
}