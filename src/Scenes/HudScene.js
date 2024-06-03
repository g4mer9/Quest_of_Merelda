class HudScene extends Phaser.Scene {
    constructor() {
        super("HudScene");
    }
    create(){
        this.cameras.main.setBackgroundColor('#000000');
        this.map = this.add.tilemap("HUD", 8, 8, 0, 0);
        this.overworld_tileset = this.map.addTilesetImage("overworld_tileset", "overworld_tileset");
        this.forest_tileset = this.map.addTilesetImage("zelda_forest_tileset", "forest_tileset");
        this.mountain_tileset = this.map.addTilesetImage("zelda_mountain_tileset","mountain_tileset");
        this.graveyard_tileset = this.map.addTilesetImage("zelda_graveyard_tileset","graveyard_tileset");
        this.rupee_HUD = this.map.addTilesetImage("rupee_HUD", "rupee_HUD");
        this.map_cursor = this.map.addTilesetImage("map_cursor", "map_cursor");
        this.ice_wand = this.map.addTilesetImage("ice_wand_up", "ice_wand_up");
        this.sword = this.map.addTilesetImage("sword_up", "sword_up");
        this.bottom_layer = this.map.createLayer("Tile Layer 1", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset, this.graveyard_tileset, this.rupee_HUD, this.ice_wand, this.sword, this.map_cursor], 0, 0);
        this.top_layer = this.map.createLayer("Tile Layer 2", [this.forest_tileset, this.mountain_tileset, this.overworld_tileset, this.graveyard_tileset, this.rupee_HUD, this.ice_wand, this.sword, this.map_cursor], 0, 0);
    }   
    update(){}
}