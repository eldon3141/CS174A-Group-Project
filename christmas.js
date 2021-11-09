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
            garland: new Shape_From_File("assets/cabin/garland.obj")
        };

        // *** Materials
        this.materials = {
            sky: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.5, specularity: 0, color: hex_color("#A7C7E7") }),
            snow_terrain: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ffffff") }),
            cabin_frame: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, color: hex_color("#6F4E37")}),
            cabin_door: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, color: hex_color("#3a2713") }),
            snow_roof: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ffffff") }),
            garland: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#4F7942") })
        }

        let start_loc = Mat4.translation(-0.56, -4.59, -30.00);
        this.initial_camera_location = start_loc;
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
    }

    toHex(val) {
        let hex = Number(val).toString(16);
        if (hex.length < 2)
            hex = "0" + hex;
        return hex;
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000;

        
        // Transformations
        let snow_terrain_scale = Mat4.scale(10, 10, 10);
        let snow_terrain_pos = Mat4.translation(0, 0, 1, 1);
        let snow_terrain_transform = Mat4.identity().times(snow_terrain_scale).times(snow_terrain_pos);

        let sky_pos = Mat4.translation(-2.50, -6.25, -30);
        let sky_scale = Mat4.scale(60, 60, 0.2);
        let sky_transform = Mat4.identity().times(sky_pos).times(sky_scale);
        
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

        let snow_roof_scale = Mat4.scale(2, 2, 2);
        let snow_roof_pos = Mat4.translation(0.15, 1.15, 6);
        let snow_roof_transform = Mat4.identity().times(snow_roof_scale).times(snow_roof_pos);

        // Lighting
        let white_light = vec4(1, 1, 1, 1);
        let snow_terrain_ctr = vec4(0, 0, 0, 1);
        program_state.lights = [new Light(snow_terrain_ctr, white_light, 1)];


        // Drawing
        this.shapes.sky.draw(context, program_state, sky_transform, this.materials.sky);
        this.shapes.snow_terrain.draw(context, program_state, snow_terrain_transform, this.materials.snow_terrain);
        this.shapes.cabin_frame.draw(context, program_state, cabin_frame_transform, this.materials.cabin_frame);
        this.shapes.cabin_door.draw(context, program_state, cabin_door_transform, this.materials.cabin_door);
        this.shapes.snow_roof.draw(context, program_state, snow_roof_transform, this.materials.snow_roof);
        this.shapes.garland.draw(context, program_state, garland_transform, this.materials.garland);
        // Camera Options 
        // if (this.attached) {
        //     program_state.camera_inverse = this.attached().map((x, i) =>
        //         Vector.from(program_state.camera_inverse[i]).mix(x, 0.1));
        // }
    }
}