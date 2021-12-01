import { defs, tiny } from './common.js';
import { Shape_From_File } from './obj-file.js';
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;



let ok = true;
export class Christmas extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            sky: new defs.Square(),
            snow_terrain: new Shape_From_File("assets/snow_terrain.obj"),
            cabin_frame: new Shape_From_File("assets/cabin/walls.obj"),
            cabin_door: new Shape_From_File("assets/cabin/door.obj"),
            snow_roof: new Shape_From_File("assets/cabin/snow_roof.obj"),
            garland: new Shape_From_File("assets/cabin/garland.obj"),
            chris_tree_body: new Shape_From_File("assets/christmas_tree/body.obj"),
            chris_tree_stump: new Shape_From_File("assets/christmas_tree/stump.obj"),
            chris_tree_ornament: new Shape_From_File("assets/christmas_tree/ornament.obj"),
            chris_tree_star: new Shape_From_File("assets/christmas_tree/star.obj"),
            present1_box: new Shape_From_File("assets/presents/box1.obj"),
            present1_ribbon: new Shape_From_File("assets/presents/ribbon1.obj"),
            present2_box: new Shape_From_File("assets/presents/box2.obj"),
            present2_ribbon: new Shape_From_File("assets/presents/ribbon2.obj"),
            present3_box: new Shape_From_File("assets/presents/box3.obj"),
            present3_ribbon: new Shape_From_File("assets/presents/ribbon3.obj"),
            snowman_body: new Shape_From_File("assets/snowman/snow_spheres.obj"),
            snowman_arms: new Shape_From_File("assets/snowman/arms.obj"),
            snowman_eyes: new Shape_From_File("assets/snowman/eyes.obj"),
            snowman_buttons: new Shape_From_File("assets/snowman/buttons.obj"),
            snowman_mouth: new Shape_From_File("assets/snowman/mouth.obj"),
            snowman_nose: new Shape_From_File("assets/snowman/nose.obj"),
            snowman_scarf: new Shape_From_File("assets/snowman/scarf.obj"),
            snowman_hat: new Shape_From_File("assets/snowman/hat.obj"),
            music_symbol: new Shape_From_File("assets/music_symbol.obj"),
            santa: new Shape_From_File("assets/santa.obj"),
            snow: new defs.Subdivision_Sphere(4)
        };

        // *** Materials
        this.materials = {
            sky: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.5, specularity: 0, color: hex_color("#A7C7E7")}),
            snow_terrain: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ffffff") }),
            tree: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#798978")}),
            cabin_frame: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, color: hex_color("#6F4E37")}),
            cabin_door: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, color: hex_color("#3a2713") }),
            snow_roof: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ffffff") }),
            garland: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#4F7942") }),
            chris_tree_body: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#355E3B")}),
            chris_tree_stump: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#3a2713")}),
            chris_tree_ornament_red: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#A93226") }),
            chris_tree_ornament_yellow: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#FBEC5D")}),
            chris_tree_star: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#FFEA00") }),
            ribbon: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#A93226") }),
            green_present: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#50C878") }),
            blue_present: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#6495ED") }),
            purple_present: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#C3B1E1") }),
            snowman_body: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ECF0F1") }),
            snowman_arms: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#5C4033") }),
            snowman_eyes: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#1B1212") }),
            snowman_buttons: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#1B1212") }),
            snowman_mouth: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#1B1212") }),
            snowman_nose: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#EC5800") }),
            snowman_scarf: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#A93226") }),
            snowman_hat: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#1B1212") }),
            snow: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#FFFFFF")}
            ),
            music_symbol: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#000000") }
            ),
            santa: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#000000") }
            )

        }

        this.canvas;
        // AUDIO
        this.music = new Audio();
        this.activated = false;
        this.snowLocations = [];
        this.hasListener = false;

        // TODO: adjust object positions to match any perspective
        let start_loc = Mat4.translation(-0.84, -4.17, -28.75);
        this.initial_camera_location = start_loc;

        // Flags
        this.is_day = true;
        this.snowing = false;
        this.gradual = false;
        this.pause_sky = false;

        // Ornament colors
        this.red_ornament_colors = ["#A93226", "#A93226", "#A93226", "#A93226", "#A93226", "#A93226", "#A93226", "#A93226"];
        this.yellow_ornament_colors = ["#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D"];

        // Sky color
        this.sky_color;

        //Santa
        this.activate_santa = false;
        this.santa_angle = 0;
        this.santa_translation = -25;
    }

    play_music() {
        this.music.src = "assets/let_it_snow.mp3";
        this.music.volume = 0.1;
        this.music.play();
    }

    pause_music() {
        this.music.pause();
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        // this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => this.initial_camera_location);
        // this.new_line();
        // this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
        // this.key_triggered_button("Attach to planet 2", ["Control", "2"], () => this.attached = () => this.planet_2);
        // this.new_line();
        // this.key_triggered_button("Attach to planet 3", ["Control", "3"], () => this.attached = () => this.planet_3);
        // this.key_triggered_button("Attach to planet 4", ["Control", "4"], () => this.attached = () => this.planet_4);
        // this.new_line();
        // this.key_triggered_button("Attach to moon", ["Control", "m"], () => this.attached = () => this.moon);

        this.key_triggered_button("Toggle day/night", ["Control", "0"], () => { this.is_day = !this.is_day; this.gradual = false; });
        this.key_triggered_button("Set ornament colors", ["Control", "1"], this.set_ornament_colors);
        this.key_triggered_button("Toggle snow", ["Control", "2"], this.addSnow);
        this.key_triggered_button("Toggle gradual", ["Control", "3"], () => { this.gradual = true; this.pause_sky = !this.pause_sky; });
        this.key_triggered_button("Activate Santa", ["Control", "4"], () => { this.activate_santa = !this.activate_santa });
    }

    set_ornament_colors() {
        for (let k = 0; k < 8; k++) {
            let min = 0;
            let max = 256;

            let new_red_color = this.toHex(this.getRandomInt(min,max)) + this.toHex(this.getRandomInt(min,max)) + this.toHex(this.getRandomInt(min,max));
            let new_yellow_color = this.toHex(this.getRandomInt(min,max)) + this.toHex(this.getRandomInt(min,max)) + this.toHex(this.getRandomInt(min,max));
            
            this.red_ornament_colors[k] = new_red_color;
            this.yellow_ornament_colors[k] = new_yellow_color;
        }
    }

    toHex(val) {
        let hex = Number(val).toString(16);
        if (hex.length < 2)
            hex = "0" + hex;
        return hex;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min) + min);
    }

    addSnow() {
        this.snowing = !this.snowing;
        if (this.snowing) {
            for (var i = 0; i < 300; i++) {
                var x = this.getRandomInt(-50, 50);
                var z = this.getRandomInt(-50, 50);
                var y = this.getRandomInt(0, 80);
                this.snowLocations.push(vec3(x, y, z));
        //this.snowLocations.push(vec3(x, 100, z));
            }
        }
        else {
            this.snowLocations = [];
        }

    }


    display(context, program_state) {
        this.canvas = context.canvas;
        let left_bound = -0.68;
        let right_bound = -0.64;
        let top_bound = 0.43; 
        let bottom_bound = 0.25; 

        const mouse_position = (e, rect = this.canvas.getBoundingClientRect()) =>
            vec((e.clientX - (rect.left + rect.right) / 2) / ((rect.right - rect.left) / 2),
                (e.clientY - (rect.bottom + rect.top) / 2) / ((rect.top - rect.bottom) / 2));

        if(!this.hasListener){
        this.hasListener = true;
        this.canvas.addEventListener("click", e => {
            e.preventDefault();
            let pos = mouse_position(e);
            let pos_x = pos[0];
            let pos_y = pos[1];
            let inside_x = ( (pos_x >= left_bound) && (pos_x <= right_bound) );
            let inside_y = ( (pos_y >= bottom_bound) && (pos_y <= top_bound) );
            if(inside_x && inside_y){
                if (!this.activated){
                    this.activated = true;
                    console.log("Playing music!");
                    this.play_music();
                }
                else{
                    this.activated = false;
                    console.log("Pausing music!");
                    this.pause_music();
                }
            }

        });
    }

        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        
        // Transformations
        let snow_terrain_scale = Mat4.scale(10, 10, 10);
        let snow_terrain_pos = Mat4.translation(0, 0, 1, 1);
        let snow_terrain_transform = Mat4.identity().times(snow_terrain_scale).times(snow_terrain_pos);

        let sky_pos = Mat4.translation(-2.50, -6.25, -30);
        let sky_scale = Mat4.scale(60, 60, 0.2);
        let sky_transform = Mat4.identity().times(sky_pos).times(sky_scale);
        
        let tree_pos = Mat4.translation(-24, -1, -8);
        let tree_transform = Mat4.identity().times(tree_pos).times(Mat4.scale(2, 2, 2));
           
        let cabin_frame_scale = Mat4.scale(2, 2, 2);
        let cabin_frame_pos = Mat4.translation(0, 0.45, 6);
        let cabin_frame_rot = Mat4.rotation(Math.PI, 0, 1 ,0);
        let cabin_frame_transform = Mat4.identity().times(cabin_frame_scale).times(cabin_frame_pos).times(cabin_frame_rot);
        
        let cabin_door_scale = Mat4.scale(0.36, 0.35, 0.3);
        let cabin_door_rot = Mat4.rotation(Math.PI, 0, 1, 0);
        let cabin_door_pos = Mat4.translation(-0.9, 1, -42);
        let cabin_door_transform = Mat4.identity().times(cabin_door_scale).times(cabin_door_rot).times(cabin_door_pos);
        
        let garland_scale = Mat4.scale(0.2, 0.2, 0.2);
        let garland_pos = Mat4.translation(1.3, 3, 65);
        let garland_transform = Mat4.identity().times(garland_scale).times(garland_pos);
        let garl_orn_transform = garland_transform.times(Mat4.translation(0, -0.6, 2)).times(Mat4.scale(0.2, 0.2, 0.2));
        // TODO: Rename transformations later
        let garl_orn_transform2 = garl_orn_transform.times(Mat4.translation(-4, 2, 0));
        let garl_orn_transform3 = garl_orn_transform.times(Mat4.translation(4, 2, 0));
        let garl_orn_transform4 = garl_orn_transform2.times(Mat4.translation(0, 5, 0));
        let garl_orn_transform5 = garl_orn_transform3.times(Mat4.translation(0, 5, 0));
        let garl_orn_transform6 = garl_orn_transform.times(Mat4.translation(0, 10, 0));

        let snow_roof_scale = Mat4.scale(2, 2, 2);
        let snow_roof_pos = Mat4.translation(0.15, 1.15, 6);
        let snow_roof_transform = Mat4.identity().times(snow_roof_scale).times(snow_roof_pos);
        
        let chris_tree_body_pos = Mat4.translation(-6, 2.9, 15);
        let chris_tree_body_scale = Mat4.scale(1.5, 1.5, 1.5)
        let chris_tree_body_transform = Mat4.identity().times(chris_tree_body_pos).times(chris_tree_body_scale);
            
        let chris_tree_stump_pos = Mat4.translation(-6.1, 0.6, 15);
        let chris_tree_stump_scale = Mat4.scale(0.4, 0.4, 0.4);
        let chris_tree_stump_transform = Mat4.identity().times(chris_tree_stump_pos).times(chris_tree_stump_scale);
        
        // Ornaments
        let ornament_scale = Mat4.scale(0.1, 0.1, 0.1);
        
        // Place ornaments bottom-up
        let red_ornaments = [
            Mat4.translation(-63, 15, 165),
            Mat4.translation(10, 2, 0),
            Mat4.translation(10, 1, 0),
            Mat4.translation(-4, 12, 0),
            Mat4.translation(-10, 0, 0),
            Mat4.translation(-2, 6, 0),
            Mat4.translation(10, 2, 0),
            Mat4.translation(-4, 10, 0)
        ];
        
        let yellow_ornaments = [
            Mat4.translation(-58, 18, 165),
            Mat4.translation(10, -2, 0),
            Mat4.translation(4 , 5, 0),
            Mat4.translation(-7, 2, 0),
            Mat4.translation(-9, 1, 0),
            Mat4.translation(7, 7, 0),
            Mat4.translation(-3, 7, 0),
            Mat4.translation(7, 5, 0)
        ]

        
        let chris_tree_star_scale = Mat4.scale(0.85, 0.85, 0.85);
        let chris_tree_star_pos = Mat4.translation(-20.8, 10.8, -10);
        let chris_tree_star_rot = Mat4.rotation(Math.PI / 2, 1, 0, 0);
        let chris_tree_star_transform = Mat4.identity().times(chris_tree_star_scale).times(chris_tree_star_pos).times(chris_tree_star_rot);

        // Presents
        let present1_pos = Mat4.translation(-4, 1.7, 20.5);
        let present1_scale = Mat4.scale(0.3, 0.3, 0.3);
        let present1_transform = Mat4.identity().times(present1_pos).times(present1_scale);
        let ribbon1_transform = present1_transform.times(Mat4.translation(0, 0.5, 0));

        let present2_pos = Mat4.translation(-2.5, 1.5, 20);
        let present2_scale = Mat4.scale(0.3, 0.3, 0.3);
        let present2_transform = Mat4.identity().times(present2_pos).times(present2_scale);
        let ribbon2_transform = present2_transform.times(Mat4.translation(0, 1.1, 0));

        let present3_pos = Mat4.translation(-4, 1, 18);
        let present3_scale = Mat4.scale(0.3, 0.3, 0.3);
        let present3_transform = Mat4.identity().times(present3_pos).times(present3_scale);
        let ribbon3_transform = present3_transform.times(Mat4.translation(0, 1.1, 0));

        // Snowman 
        let snowman_body_pos = Mat4.translation(5, 1.9, 18);
        let snowman_body_scale = Mat4.scale(0.4, 0.4, 0.4);
        let snowman_body_transform = Mat4.identity().times(snowman_body_pos).times(snowman_body_scale);

        let snowman_arms_rot = Mat4.rotation(Math.PI/2, 0, 1, 0);
        let snowman_arms_scale = Mat4.scale(1.1, 1.1, 1.1);
        let snowman_arms_transform = snowman_body_transform.times(snowman_arms_rot).times(snowman_arms_scale);

        let snowman_eyes_rot = Mat4.rotation(Math.PI/2, 0, 1, 0);
        let snowman_eyes_scale = Mat4.scale(0.2, 0.2, 0.2);
        let snowman_eyes_pos = Mat4.translation(-0.2, 1.5, 0.5);
        let snowman_eyes_transform = snowman_body_transform.times(snowman_eyes_pos).times(snowman_eyes_rot).times(snowman_eyes_scale);

        let snowman_buttons_scale = Mat4.scale(0.2, 0.2, 0.2);
        let snowman_buttons_pos = Mat4.translation(-0.1, 0.2, 0.7);
        let snowman_buttons_transform = snowman_body_transform.times(snowman_buttons_pos).times(snowman_buttons_scale);

        let snowman_mouth_rot = Mat4.rotation(Math.PI/2, 0, 1, 0);
        let snowman_mouth_scale = Mat4.scale(0.15, 0.15, 0.15);
        let snowman_mouth_pos = Mat4.translation(-0.2, 1, 0.6);
        let snowman_mouth_transform = snowman_body_transform.times(snowman_mouth_pos).times(snowman_mouth_rot).times(snowman_mouth_scale);

        let snowman_nose_rot = Mat4.rotation(-Math.PI/2, 0, 1, 0);
        let snowman_nose_scale = Mat4.scale(0.3, 0.3, 0.3);
        let snowman_nose_pos = Mat4.translation(0, 1.3, 0.4);
        let snowman_nose_transform = snowman_body_transform.times(snowman_nose_pos).times(snowman_nose_rot).times(snowman_nose_scale);

        let snowman_scarf_rot = Mat4.rotation(Math.PI/2, 0, 1, 0);
        let snowman_scarf_scale = Mat4.scale(0.55, 0.55, 0.55);
        let snowman_scarf_pos = Mat4.translation(-0.2, 0.7, 0);
        let snowman_scarf_transform = snowman_body_transform.times(snowman_scarf_pos).times(snowman_scarf_rot).times(snowman_scarf_scale);

        //TODO: Find a hat object that's not hollow on the top (glitches)
        let snowman_hat_scale = Mat4.scale(0.5, 0.5, 0.5);
        let snowman_hat_pos = Mat4.translation(0, 1.8, 0);
        let snowman_hat_transform = snowman_body_transform.times(snowman_hat_pos).times(snowman_hat_scale);

        // // Music Symbol
        let music_scale = Mat4.scale(0.14, 0.14, 0.14);
        let music_pos = Mat4.translation(-4.5, 5.565, 18);
        let music_transform = Mat4.identity().times(music_pos).times(music_scale);

        // Santa
//         let santa_pos;
//         if((-20 + t) >= 25) {
//             santa_pos = Mat4.translation(25, 11, 0);
//         }else{
//             santa_pos = Mat4.translation(-20 + 3*t, 11, 0);
//         }
//         let santa_pos = Mat4.translation(-20 + 2.25*t, 11 + 0.5*Math.sin(0.05*Math.PI*t), 0);
       
        if(this.activate_santa){
            this.santa_translation += 3*dt;
            this.santa_angle += Math.sin(0.005*Math.PI*(dt));
        }
        if(this.santa_translation >= 30 && this.activate_santa == true) {
            this.activate_santa = false;
            this.santa_translation = -25;
            this.santa_angle = 0;
        }
        //console.log(this.santa_translation);
        let santa_pos = Mat4.translation(this.santa_translation, 11, 0);
        let santa_rot = Mat4.rotation(Math.PI/2.2, 0, 1,0).times(Mat4.rotation(Math.PI/8,0,0,1)).times(Mat4.rotation(this.santa_angle,1,0,0));
        let santa_scale = Mat4.scale(2,2,2);
        let santa_transform = Mat4.identity().times(santa_pos).times(santa_rot).times(santa_scale);


        // Lighting
        let white_light = vec4(1, 1, 1, 1);
        let snow_terrain_ctr = vec4(0, 0, 0, 1);
        program_state.lights = [new Light(snow_terrain_ctr, white_light, 1)];


        // Drawing
        let day_color = color(0.654, 0.780, 0.905, 1);
        let night_color = color(0.164, 0.164, 0.207, 1);
        
        if (!this.gradual && this.is_day)
            this.sky_color = day_color;
        else if (!this.gradual && !this.is_day)
            this.sky_color = night_color;

        if (this.gradual) {
            let scale_factor = (Math.sin(t/4)+1)/2;

            let red, green, blue;

            if (this.is_day) {
                red = scale_factor*day_color[0] + (1-scale_factor)*night_color[0];
                green = scale_factor*day_color[1] + (1-scale_factor)*night_color[1];
                blue = scale_factor*day_color[2] + (1-scale_factor)*night_color[2];
            } else {
                red = (1-scale_factor)*day_color[0] + (scale_factor)*night_color[0];
                green = (1-scale_factor)*day_color[1] + (scale_factor)*night_color[1];
                blue = (1-scale_factor)*day_color[2] + (scale_factor)*night_color[2];
            }

            this.sky_color = color(red, green, blue, 1);
        }

        this.shapes.sky.draw(context, program_state, sky_transform, this.materials.sky.override((this.sky_color)));
        this.shapes.snow_terrain.draw(context, program_state, snow_terrain_transform, this.materials.snow_terrain);

        let total_background_trees = 14;

        let right_shift = Mat4.translation(2, 0, 0);

        for(let i = 0; i < total_background_trees; i++){
            if(i == 1 || i == 4 || i == 9 || i == 13) {
                this.shapes.chris_tree_body.draw(context, program_state, tree_transform, this.materials.tree);
            } else if (i % 2 == 0) {
                this.shapes.chris_tree_body.draw(context, program_state, tree_transform, this.materials.tree.override({color: hex_color("#a7b9bd")}));
            } else {
                this.shapes.chris_tree_body.draw(context, program_state, tree_transform, this.materials.tree.override({color: hex_color("#809ea6")}));
            }
            
            tree_transform = tree_transform.times(right_shift);
        }

        this.shapes.cabin_frame.draw(context, program_state, cabin_frame_transform, this.materials.cabin_frame);
        this.shapes.cabin_door.draw(context, program_state, cabin_door_transform, this.materials.cabin_door);
        this.shapes.snow_roof.draw(context, program_state, snow_roof_transform, this.materials.snow_roof);

        this.shapes.garland.draw(context, program_state, garland_transform, this.materials.garland);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform, this.materials.chris_tree_ornament_red);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform2, this.materials.chris_tree_ornament_red);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform3, this.materials.chris_tree_ornament_red);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform4, this.materials.chris_tree_ornament_red);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform5, this.materials.chris_tree_ornament_red);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform6, this.materials.chris_tree_ornament_red);

        this.shapes.chris_tree_body.draw(context, program_state, chris_tree_body_transform, this.materials.chris_tree_body);
        this.shapes.chris_tree_stump.draw(context, program_state, chris_tree_stump_transform, this.materials.chris_tree_stump);

        let prev_transform = Mat4.identity().times(ornament_scale);
        let k = 0;
        red_ornaments.forEach((pos_change) => { 
            let orn_transform = prev_transform.times(pos_change);
            this.shapes.chris_tree_ornament.draw(context, program_state, orn_transform, this.materials.chris_tree_ornament_red.override(hex_color(this.red_ornament_colors[k])));
            prev_transform = orn_transform;
            k++;
        } )
        
        k = 0;
        prev_transform = Mat4.identity().times(ornament_scale);
        yellow_ornaments.forEach((pos_change) => {
            let orn_transform = prev_transform.times(pos_change);
            this.shapes.chris_tree_ornament.draw(context, program_state, orn_transform, this.materials.chris_tree_ornament_yellow.override(hex_color(this.yellow_ornament_colors[k])));
            prev_transform = orn_transform;
            k++;
        })
        
        this.shapes.chris_tree_star.draw(context, program_state, chris_tree_star_transform, this.materials.chris_tree_star);
        this.shapes.present1_box.draw(context, program_state, present1_transform, this.materials.green_present);
        this.shapes.present1_ribbon.draw(context, program_state, ribbon1_transform, this.materials.ribbon);
        this.shapes.present2_box.draw(context, program_state, present2_transform, this.materials.blue_present);
        this.shapes.present2_ribbon.draw(context, program_state, ribbon2_transform, this.materials.ribbon);    
        this.shapes.present3_box.draw(context, program_state, present3_transform, this.materials.purple_present);
        this.shapes.present3_ribbon.draw(context, program_state, ribbon3_transform, this.materials.ribbon);

        this.shapes.snowman_body.draw(context, program_state, snowman_body_transform, this.materials.snowman_body);
        this.shapes.snowman_arms.draw(context, program_state, snowman_arms_transform, this.materials.snowman_arms);
        this.shapes.snowman_eyes.draw(context, program_state, snowman_eyes_transform, this.materials.snowman_eyes);
        this.shapes.snowman_buttons.draw(context, program_state, snowman_buttons_transform, this.materials.snowman_buttons);
        this.shapes.snowman_mouth.draw(context, program_state, snowman_mouth_transform, this.materials.snowman_mouth);
        this.shapes.snowman_nose.draw(context, program_state, snowman_nose_transform, this.materials.snowman_nose);
        this.shapes.snowman_scarf.draw(context, program_state, snowman_scarf_transform, this.materials.snowman_scarf);
        this.shapes.snowman_hat.draw(context, program_state, snowman_hat_transform, this.materials.snowman_hat);
        
        this.shapes.music_symbol.draw(context, program_state, music_transform, this.materials.music_symbol);

        this.shapes.santa.draw(context, program_state, santa_transform, this.materials.santa);
        //Draw Falling Snow


        //this.animateSnow(program_state, context);
   
     
        
        //this.addSnow(0);

        
       
        for (let i = 0; i < this.snowLocations.length; i++) {
            if (dt > 0) {
                this.snowLocations[i][1] = this.snowLocations[i][1] - 0.1;
            }
            if (this.snowLocations[i][1] < 0) {
                this.snowLocations[i][1] = 80;
            }
            //snowLocations[i].y-=dt;
            //document.write(this.snowLocactions[i].x);
            //document.write("*****");
            let snow_transform = Mat4.identity().times(Mat4.translation(this.snowLocations[i][0], this.snowLocations[i][1], this.snowLocations[i][2])).times(Mat4.scale(0.3, 0.3, 0.3));
            this.shapes.snow.draw(context, program_state, snow_transform, this.materials.snow);
        }
        

    }


}