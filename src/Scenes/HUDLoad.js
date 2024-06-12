class HUDLoad extends Phaser.Scene {
    constructor() {
        super("HUDloadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("map_cursor", "small_assets/map_cursor_bottom.png");
        this.load.image("HUD_arrow", "small_assets/HUD_arrow.png")
        this.load.image("sword_hud", "small_assets/sword_hud.png");
        this.load.image("bow", "small_assets/bow.png");
        this.load.image("boat_HUD", "small_assets/boat_HUD.png");
        this.load.image("ice_wand_up", "small_assets/ice_wand_up.png");
        this.load.image("fire_wand_up", "small_assets/fire_wand_up.png");
        this.load.image("lightning_wand_up", "small_assets/lightning_wand_up.png");
        this.load.image("light_wand_up", "small_assets/light_wand_up.png");
        this.load.image("dark_wand_up", "small_assets/dark_wand_up.png");


        // Load tilemap information
        this.load.image("graveyard_tileset", "zelda_graveyard_tileset.png");
        this.load.image("overworld_tileset", "zelda_overworld_tileset.png");
        this.load.image("forest_tileset", "zelda_forest_tileset.png");
        this.load.image("mountain_tileset", "zelda_mountain_tileset.png");  // Packed tilemap
        this.load.tilemapTiledJSON("HUD", "HUD.tmj"); 
    }

    create() {
         // ...and pass to the next Scene
         this.scene.start("HudScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}