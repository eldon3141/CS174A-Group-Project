import { defs, tiny } from './common.js';
// Pull these names into this module's scope for convenience:
const { vec3, vec4, vec, color, hex_color, Matrix, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Cube, Axis_Arrows, Textured_Phong, Phong_Shader, Basic_Shader, Subdivision_Sphere } = defs

import { Shape_From_File } from './obj-file.js'
import { Color_Phong_Shader, Shadow_Textured_Phong_Shader, Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE } from './shadow-shaders.js'

// 2D shape, to display the texture buffer
const Square = class Square extends tiny.Vertex_Buffer {
    constructor() {
        super("position", "normal", "texture_coord");
        this.arrays.position = [vec3(0, 0, 0), vec3(1, 0, 0), vec3(0, 1, 0), vec3(1, 1, 0), vec3(1, 0, 0), vec3(0, 1, 0)];
        this.arrays.normal = [vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),];
        this.arrays.texture_coord = [vec(0, 0), vec(1, 0), vec(0, 1), vec(1, 1), vec(1, 0), vec(0, 1)]
    }
}

// The scene
export class Christmas extends Scene {
    constructor() {
        super();
        // Load the model file:
        this.shapes = {
            //"teapot": new Shape_From_File("assets/teapot.obj"),
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
            present2_box: new Cube(),
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
            snow: new defs.Subdivision_Sphere(4),
            "sphere": new Subdivision_Sphere(6),
            "cube": new Cube(),
            "square_2d": new Square(),
        };

        this.materials = {
            sky: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.5, specularity: 0, color: hex_color("#A7C7E7") }),
            snow_terrain: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ffffff") }),
            cabin_frame: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 0.5, color: hex_color("#6F4E37") }),
            tree: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 0.2, color: hex_color("#798978") }),
            cabin_door: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, color: hex_color("#3a2713") }),
            snow_roof: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#ffffff") }),
            garland: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#4F7942") }),
            chris_tree_body: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#355E3B") }),
            chris_tree_stump: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#3a2713") }),
            chris_tree_ornament_red: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#A93226") }),
            chris_tree_ornament_yellow: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#FBEC5D") }),
            chris_tree_star: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#FFEA00") }),
            ribbon: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#A93226") }),
            green_present: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#50C878") }),
            blue_present: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#6495ED") }),
            santa_present: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/santa_img.png", "NEAREST")
            }),
            purple_present: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#C3B1E1") }),
            snowman_body: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#ECF0F1") }),
            snowman_arms: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#5C4033") }),
            snowman_eyes: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#1B1212") }),
            snowman_buttons: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#1B1212") }),
            snowman_mouth: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#1B1212") }),
            snowman_nose: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#EC5800") }),
            snowman_scarf: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#A93226") }),
            snowman_hat: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#1B1212") }),
            snow: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#FFFFFF") }
            ),
            music_symbol: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#000000") }
            ),
            santa: new Material(new Shadow_Textured_Phong_Shader(1),
                { ambient: 1, color: hex_color("#000000") }
            )
        };

        this.canvas;
        // AUDIO
        this.music = new Audio();
        this.activated = false;
        this.hasListener = false;
        
        this.red_ornament_colors = ["#A93226", "#A93226", "#A93226", "#A93226", "#A93226", "#A93226", "#A93226"];
        this.yellow_ornament_colors = ["#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D", "#FBEC5D"];

        // For the floor or other plain objects
        this.floor = new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(1, 1, 1, 1),
            ambient: 0.3,
            diffusivity: 0.7,
            specularity: 0.4,
            smoothness: 64,
            color_texture: null,
            light_depth_texture: null
        })
        // For the first pass
        this.pure = new Material(new Color_Phong_Shader(), {})
        // For light source
        this.light_src = new Material(new Phong_Shader(), {
            color: color(1, 1, 1, 1),
            ambient: 1,
            diffusivity: 0,
            specularity: 0
        });
        // For depth texture display
        this.depth_tex = new Material(new Depth_Texture_Shader_2D(), {
            color: color(0, 0, .0, 1),
            ambient: 1,
            diffusivity: 0,
            specularity: 0,
            texture: null
        });

        // To make sure texture initialization only does once
        this.init_ok = false;
    }

    make_control_panel() {
        this.key_triggered_button("Set ornament colors", ["Control", "1"], this.set_ornament_colors);
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
        return Math.floor(Math.random() * (max - min) + min);
    }

    set_ornament_colors() {
        for (let k = 0; k < 7; k++) {
            let min = 0;
            let max = 256;
            let new_red_color = this.toHex(this.getRandomInt(min, max)) + this.toHex(this.getRandomInt(min, max)) + this.toHex(this.getRandomInt(min, max));
            let new_yellow_color = this.toHex(this.getRandomInt(min, max)) + this.toHex(this.getRandomInt(min, max)) + this.toHex(this.getRandomInt(min, max));

            this.red_ornament_colors[k] = new_red_color;
            this.yellow_ornament_colors[k] = new_yellow_color;
        }
    }

    play_music() {
        this.music.src = "assets/let_it_snow.mp3";
        this.music.volume = 0.3;
        this.music.play();
    }

    pause_music() {
        this.music.pause();
    }

    texture_buffer_init(gl) {
        // Depth Texture
        this.lightDepthTexture = gl.createTexture();
        // Bind it to TinyGraphics
        this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
        this.materials.cabin_frame.light_depth_texture = this.light_depth_texture;
        this.floor.light_depth_texture = this.light_depth_texture;

        this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;
        gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
        gl.texImage2D(gl.TEXTURE_2D, // target
            0, // mip level
            gl.DEPTH_COMPONENT, // internal format
            this.lightDepthTextureSize, // width
            this.lightDepthTextureSize, // height
            0, // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT, // type
            null);
        // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Depth Texture Buffer
        this.lightDepthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, // target
            gl.DEPTH_ATTACHMENT, // attachment point
            gl.TEXTURE_2D, // texture target
            this.lightDepthTexture, // texture
            0);
        // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // create a color texture of the same size as the depth texture
        // see article why this is needed_
        this.unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.lightDepthTextureSize, this.lightDepthTextureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null,);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach it to the framebuffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, // target
            gl.COLOR_ATTACHMENT0, // attachment point
            gl.TEXTURE_2D, // texture target
            this.unusedTexture, // texture
            0);
        // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    render_scene(context, program_state, shadow_pass, draw_light_source = false, draw_shadow = false) {
        // shadow_pass: true if this is the second pass that draw the shadow.
        // draw_light_source: true if we want to draw the light source.
        // draw_shadow: true if we want to draw the shadow

        let light_position = this.light_position;
        let light_color = this.light_color;
        const t = program_state.animation_time;

        program_state.draw_shadow = draw_shadow;

        if (draw_light_source && shadow_pass) {
            this.shapes.sphere.draw(context, program_state, Mat4.translation(light_position[0], light_position[1], light_position[2]).times(Mat4.scale(.5, .5, .5)), this.light_src.override({
                color: light_color
            }));
        }

        // MUSIC CLICKING
        this.canvas = context.canvas;
        let left_bound = -0.5;
        let right_bound = -0.45;
        let top_bound = 0.24;
        let bottom_bound = -0.097;

        const mouse_position = (e, rect = this.canvas.getBoundingClientRect()) =>
            vec((e.clientX - (rect.left + rect.right) / 2) / ((rect.right - rect.left) / 2),
                (e.clientY - (rect.bottom + rect.top) / 2) / ((rect.top - rect.bottom) / 2));

        if (!this.hasListener) {
            this.hasListener = true;
            this.canvas.addEventListener("click", e => {
                e.preventDefault();
                let pos = mouse_position(e);
                let pos_x = pos[0];
                let pos_y = pos[1];
                let inside_x = ((pos_x >= left_bound) && (pos_x <= right_bound));
                let inside_y = ((pos_y >= bottom_bound) && (pos_y <= top_bound));
                if (inside_x && inside_y) {
                    if (!this.activated) {
                        this.activated = true;
                        console.log("Playing music!");
                        this.play_music();
                    }
                    else {
                        this.activated = false;
                        console.log("Pausing music!");
                        this.pause_music();
                    }
                }

            });
        }


        let sky_pos = Mat4.translation(-2.50, 0, -30);
        let sky_scale = Mat4.scale(40, 30, 0.2);
        let sky_transform = Mat4.identity().times(sky_pos).times(sky_scale);
        this.shapes.sky.draw(context, program_state, sky_transform, shadow_pass ? this.floor.override({ ambient: 1, diffusivity: 0, specularity: 0, color: this.materials.sky.color }) : this.pure);

        let snow_terrain_scale = Mat4.scale(7.6, 7.6, 7.6);
        let snow_terrain_pos = Mat4.translation(0, 0, 1, 1);
        let snow_terrain_transform = Mat4.identity().times(snow_terrain_scale).times(snow_terrain_pos);
        this.shapes.snow_terrain.draw(context, program_state, snow_terrain_transform, shadow_pass ? this.floor.override({ diffusivity: 1, smoothness: 10 }) : this.pure);


        // Background Trees
        let tree_pos = Mat4.translation(-14, 0, -8);
        let tree_transform = Mat4.identity().times(tree_pos).times(Mat4.scale(1.5, 1.5, 1.5));

        let total_background_trees = 10;
        let right_shift = Mat4.translation(2, 0, 0);

        for (let i = 0; i < total_background_trees; i++) {
            if (i == 1 || i == 4 || i == 9 || i == 13) {
                this.shapes.chris_tree_body.draw(context, program_state, tree_transform, shadow_pass ? this.floor.override({ color: this.materials.tree.color }) : this.pure);
            } else if (i % 2 == 0) {
                this.shapes.chris_tree_body.draw(context, program_state, tree_transform, shadow_pass ? this.floor.override({ color: hex_color("#a7b9bd") }) : this.pure);
            } else {
                this.shapes.chris_tree_body.draw(context, program_state, tree_transform, shadow_pass ? this.floor.override({ color: hex_color("#809ea6") }) : this.pure);
            }

            tree_transform = tree_transform.times(right_shift);
        }

        // Cabin
        let cabin_frame_scale = Mat4.scale(1, 1, 1);
        let cabin_frame_pos = Mat4.translation(0, 0, 3);
        let cabin_frame_rot = Mat4.rotation(Math.PI, 0, 1, 0);
        let cabin_frame_transform = Mat4.identity().times(cabin_frame_scale).times(cabin_frame_pos).times(cabin_frame_rot);
        this.shapes.cabin_frame.draw(context, program_state, cabin_frame_transform, shadow_pass ? this.floor.override({ ambient: 0.5, color: this.materials.cabin_frame.color }) : this.pure);

        let cabin_door_scale = Mat4.scale(0.2, 0.17, 0.29);
        let cabin_door_rot = Mat4.rotation(Math.PI, 0, 1, 0);
        let cabin_door_pos = Mat4.translation(-0.8, -0.76, -13);
        let cabin_door_transform = Mat4.identity().times(cabin_door_scale).times(cabin_door_rot).times(cabin_door_pos);
        this.shapes.cabin_door.draw(context, program_state, cabin_door_transform, shadow_pass ? this.floor.override({ color: this.materials.cabin_door.color }) : this.pure);

        let snow_roof_scale = Mat4.scale(1.1, 1.1, 1.1);
        let snow_roof_pos = Mat4.translation(0.13, 0.57, 2.55);
        let snow_roof_transform = Mat4.identity().times(snow_roof_scale).times(snow_roof_pos);
        this.shapes.snow_roof.draw(context, program_state, snow_roof_transform, shadow_pass ? this.floor.override({ color: this.materials.snow_roof.color }) : this.pure);

        let garland_scale = Mat4.scale(0.1, 0.1, 0.1);
        let garland_pos = Mat4.translation(1.3, -0.1, 38);
        let garland_transform = Mat4.identity().times(garland_scale).times(garland_pos);
        this.shapes.garland.draw(context, program_state, garland_transform, shadow_pass ? this.floor.override({ color: this.materials.garland.color }) : this.pure);

        let garl_orn_transform = garland_transform.times(Mat4.translation(0, -1.1, 0.5)).times(Mat4.scale(0.2, 0.2, 0.2));
        let garl_orn_transform2 = garl_orn_transform.times(Mat4.translation(-4, 2, 0));
        let garl_orn_transform3 = garl_orn_transform.times(Mat4.translation(4, 2, 0));
        let garl_orn_transform4 = garl_orn_transform2.times(Mat4.translation(0, 5, 0));
        let garl_orn_transform5 = garl_orn_transform3.times(Mat4.translation(0, 5, 0));
        let garl_orn_transform6 = garl_orn_transform.times(Mat4.translation(0, 10, 0));
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_ornament_red.color }) : this.pure);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform2, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_ornament_red.color }) : this.pure);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform3, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_ornament_red.color }) : this.pure);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform4, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_ornament_red.color }) : this.pure);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform5, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_ornament_red.color }) : this.pure);
        this.shapes.chris_tree_ornament.draw(context, program_state, garl_orn_transform6, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_ornament_red.color }) : this.pure);

        // Christmas Tree
        let chris_tree_body_pos = Mat4.translation(-2.5, 0, 5);
        let chris_tree_body_scale = Mat4.scale(.5, .5, .5)
        let chris_tree_body_transform = Mat4.identity().times(chris_tree_body_pos).times(chris_tree_body_scale);
        this.shapes.chris_tree_body.draw(context, program_state, chris_tree_body_transform, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_body.color }) : this.pure);

        let chris_tree_stump_pos = Mat4.translation(-2.5, -0.5, 5);
        let chris_tree_stump_scale = Mat4.scale(0.2, 0.4, 0.4);
        let chris_tree_stump_transform = Mat4.identity().times(chris_tree_stump_pos).times(chris_tree_stump_scale);
        this.shapes.chris_tree_stump.draw(context, program_state, chris_tree_stump_transform, shadow_pass ? this.floor.override({ color: this.materials.chris_tree_stump.color }) : this.pure);

        let chris_tree_star_scale = Mat4.scale(0.1, 0.1, 0.1);
        let chris_tree_star_pos = Mat4.translation(-25, 10.3, 50);
        let chris_tree_star_rot = Mat4.rotation(Math.PI / 2, 1, 0, 0);
        let chris_tree_star_transform = Mat4.identity().times(chris_tree_star_scale).times(chris_tree_star_pos).times(chris_tree_star_rot);
        this.shapes.chris_tree_star.draw(context, program_state, chris_tree_star_transform, shadow_pass ? this.floor.override({ ambient: 1, color: this.materials.chris_tree_star.color }) : this.pure);

        // Presents
        let present1_pos = Mat4.translation(-3, -0.65, 6);
        let present1_scale = Mat4.scale(0.2, 0.2, 0.2);
        let present1_transform = Mat4.identity().times(present1_pos).times(present1_scale);
        let ribbon1_transform = present1_transform.times(Mat4.translation(0, 0.5, 0));
        this.shapes.present1_box.draw(context, program_state, present1_transform, shadow_pass ? this.floor.override({ color: this.materials.green_present.color }) : this.pure);
        this.shapes.present1_ribbon.draw(context, program_state, ribbon1_transform, shadow_pass ? this.floor.override({ color: this.materials.ribbon.color }) : this.pure);

        let present2_pos = present1_pos.times(Mat4.translation(1.7, 0.23, 2.8));
        let present2_scale = Mat4.scale(0.05, 0.05, 0.05);
        let present2_transform = Mat4.identity().times(present2_pos).times(present2_scale);
        let ribbon2_transform = present2_transform.times(Mat4.translation(0, 1.3, 0));
        this.shapes.present2_box.draw(context, program_state, present2_transform, shadow_pass ? this.floor.override({ color: this.materials.blue_present.color }) : this.pure);
        this.shapes.present2_ribbon.draw(context, program_state, ribbon2_transform, shadow_pass ? this.floor.override({ color: this.materials.ribbon.color }) : this.pure);

        let present3_pos = present1_pos.times(Mat4.translation(1.8, 0.07, 1));
        let present3_scale = Mat4.scale(0.15, 0.15, 0.15);
        let present3_transform = Mat4.identity().times(present3_pos).times(present3_scale);
        let ribbon3_transform = present3_transform.times(Mat4.translation(0, 1.1, 0));
        this.shapes.present3_box.draw(context, program_state, present3_transform, shadow_pass ? this.floor.override({ color: this.materials.purple_present.color }) : this.pure);
        this.shapes.present3_ribbon.draw(context, program_state, ribbon3_transform, shadow_pass ? this.floor.override({ color: this.materials.ribbon.color }) : this.pure);


        // Ornaments 
        let ornament_scale = Mat4.scale(0.05, 0.05, 0.05);

        // Place ornaments
        let red_ornaments = [
            Mat4.translation(-58, -10, 108),
            Mat4.translation(10, 0, 2.5),
            Mat4.translation(9, 0, -4),
            Mat4.translation(-3, 5, -3),
            Mat4.translation(-10, 0, 5.5),
            Mat4.translation(4, 7, -3),
            Mat4.translation(-3, 7, 0)
        ];

        let yellow_ornaments = [
            Mat4.translation(-54, -10, 111),
            Mat4.translation(12, 0, -3),
            Mat4.translation(-4, 5, 0),
            Mat4.translation(-6, 6, -0.5),
            Mat4.translation(7.5, 5, -5),
            Mat4.translation(-3, 7, -2),
            Mat4.translation(4, -13, 5)
        ]

        let prev_transform = Mat4.identity().times(ornament_scale);
        let k = 0;
        red_ornaments.forEach((pos_change) => {
            let orn_transform = prev_transform.times(pos_change);
            this.shapes.chris_tree_ornament.draw(context, program_state, orn_transform, shadow_pass ? this.floor.override({ ambient: 1, color: hex_color(this.red_ornament_colors[k]) }) : this.pure);
            prev_transform = orn_transform;
            k++;
        })

        k = 0;
        prev_transform = Mat4.identity().times(ornament_scale);
        yellow_ornaments.forEach((pos_change) => {
            let orn_transform = prev_transform.times(pos_change);
            this.shapes.chris_tree_ornament.draw(context, program_state, orn_transform, shadow_pass ? this.floor.override({ ambient: 1, color: hex_color(this.yellow_ornament_colors[k]) }) : this.pure);
            prev_transform = orn_transform;
            k++;
        })

        // Music Symbol
        let music_scale = Mat4.scale(0.055, 0.055, 0.055);
        let music_pos = Mat4.translation(-2.49, 1, 5.05);
        let music_transform = Mat4.identity().times(music_pos).times(music_scale);
        this.shapes.music_symbol.draw(context, program_state, music_transform, shadow_pass ? this.floor.override({ color: this.materials.music_symbol.color }) : this.pure);


        // Snowman 
        let snowman_body_pos = Mat4.translation(4, 0.1, 3);
        let snowman_body_scale = Mat4.scale(0.4, 0.4, 0.4);
        let snowman_body_transform = Mat4.identity().times(snowman_body_pos).times(snowman_body_scale);
        this.shapes.snowman_body.draw(context, program_state, snowman_body_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_body.color }) : this.pure);

        let snowman_arms_rot = Mat4.rotation(Math.PI / 2, 0, 1, 0);
        let snowman_arms_scale = Mat4.scale(1.1, 1.1, 1.1);
        let snowman_arms_transform = snowman_body_transform.times(snowman_arms_rot).times(snowman_arms_scale);
        this.shapes.snowman_arms.draw(context, program_state, snowman_arms_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_arms.color }) : this.pure);

        let snowman_eyes_rot = Mat4.rotation(Math.PI / 2, 0, 1, 0);
        let snowman_eyes_scale = Mat4.scale(0.2, 0.2, 0.2);
        let snowman_eyes_pos = Mat4.translation(0, 1.35, 0.45);
        let snowman_eyes_transform = snowman_body_transform.times(snowman_eyes_pos).times(snowman_eyes_rot).times(snowman_eyes_scale);
        this.shapes.snowman_eyes.draw(context, program_state, snowman_eyes_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_eyes.color }) : this.pure);

        let snowman_buttons_scale = Mat4.scale(0.2, 0.2, 0.2);
        let snowman_buttons_pos = Mat4.translation(0, 0.13, 0.7);
        let snowman_buttons_transform = snowman_body_transform.times(snowman_buttons_pos).times(snowman_buttons_scale);
        this.shapes.snowman_buttons.draw(context, program_state, snowman_buttons_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_buttons.color }) : this.pure);

        let snowman_mouth_rot = Mat4.rotation(Math.PI / 2, 0, 1, 0);
        let snowman_mouth_scale = Mat4.scale(0.15, 0.15, 0.15);
        let snowman_mouth_pos = Mat4.translation(0, 1, 0.52);
        let snowman_mouth_transform = snowman_body_transform.times(snowman_mouth_pos).times(snowman_mouth_rot).times(snowman_mouth_scale);
        this.shapes.snowman_mouth.draw(context, program_state, snowman_mouth_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_mouth.color }) : this.pure);

        let snowman_nose_rot = Mat4.rotation(-Math.PI / 2, 0, 1, 0);
        let snowman_nose_scale = Mat4.scale(0.3, 0.3, 0.3);
        let snowman_nose_pos = Mat4.translation(0, 1.2, 0.4);
        let snowman_nose_transform = snowman_body_transform.times(snowman_nose_pos).times(snowman_nose_rot).times(snowman_nose_scale);
        this.shapes.snowman_nose.draw(context, program_state, snowman_nose_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_nose.color }) : this.pure);

        let snowman_scarf_rot = Mat4.rotation(Math.PI / 2, 0, 1, 0);
        let snowman_scarf_scale = Mat4.scale(0.4, 0.4, 0.4);
        let snowman_scarf_pos = Mat4.translation(-0.12, 0.7, 0);
        let snowman_scarf_transform = snowman_body_transform.times(snowman_scarf_pos).times(snowman_scarf_rot).times(snowman_scarf_scale);
        this.shapes.snowman_scarf.draw(context, program_state, snowman_scarf_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_scarf.color }) : this.pure);

        let snowman_hat_scale = Mat4.scale(0.5, 0.5, 0.5);
        let snowman_hat_pos = Mat4.translation(0, 1.65, 0);
        let snowman_hat_transform = snowman_body_transform.times(snowman_hat_pos).times(snowman_hat_scale);
        this.shapes.snowman_hat.draw(context, program_state, snowman_hat_transform, shadow_pass ? this.floor.override({ color: this.materials.snowman_hat.color }) : this.pure);


    }

    display(context, program_state) {
        const t = program_state.animation_time;
        const gl = context.context;

        if (!this.init_ok) {
            const ext = gl.getExtension('WEBGL_depth_texture');
            if (!ext) {
                return alert('need WEBGL_depth_texture');
                // eslint-disable-line
            }
            this.texture_buffer_init(gl);

            this.init_ok = true;
        }

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.look_at(vec3(0, 0, 12), vec3(0, 2, 0), vec3(0, 1, 0)));
            // Locate the camera here
        }

        // The position of the light
        this.light_position = vec4(8, 5, -1, 1);
        //this.light_position = Mat4.rotation(t / 1500, 0, 1, 0).times(vec4(3, 6, 0, 1));
        // The color of the light
        this.light_color = color(1, 1, 1, 1);

        // This is a rough target of the light.
        // Although the light is point light, we need a target to set the POV of the light
        this.light_view_target = vec4(0, 0, 0, 1);
        this.light_field_of_view = 130 * Math.PI / 180;
        // 130 degree

        program_state.lights = [new Light(this.light_position, this.light_color, 1000)];

        // Step 1: set the perspective and camera to the POV of light
        const light_view_mat = Mat4.look_at(vec3(this.light_position[0], this.light_position[1], this.light_position[2]), vec3(this.light_view_target[0], this.light_view_target[1], this.light_view_target[2]), vec3(0, 1, 0), // assume the light to target will have a up dir of +y, maybe need to change according to your case
        );
        const light_proj_mat = Mat4.perspective(this.light_field_of_view, 1, 0.5, 500);
        // Bind the Depth Texture Buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.viewport(0, 0, this.lightDepthTextureSize, this.lightDepthTextureSize);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Prepare uniforms
        program_state.light_view_mat = light_view_mat;
        program_state.light_proj_mat = light_proj_mat;
        program_state.light_tex_mat = light_proj_mat;
        program_state.view_mat = light_view_mat;
        program_state.projection_transform = light_proj_mat;
        this.render_scene(context, program_state, false, false, false);

        // Step 2: unbind, draw to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        program_state.view_mat = program_state.camera_inverse;
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.5, 500);
        this.render_scene(context, program_state, true, true, true);

        //         // Step 3: display the textures
        //         this.shapes.square_2d.draw(context, program_state, Mat4.translation(-.99, .08, 0).times(Mat4.scale(0.5, 0.5 * gl.canvas.width / gl.canvas.height, 1)), this.depth_tex.override({
        //             texture: this.lightDepthTexture
        //         }));
    }

    // show_explanation(document_element) {
    //     document_element.innerHTML += "<p>This demo loads an external 3D model file of a teapot.  It uses a condensed version of the \"webgl-obj-loader.js\" "
    //         + "open source library, though this version is not guaranteed to be complete and may not handle some .OBJ files.  It is contained in the class \"Shape_From_File\". "
    //         + "</p><p>One of these teapots is lit with bump mapping.  Can you tell which one?</p>";
    // }
}
