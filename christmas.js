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
            cabin: new Shape_From_File("assets/cabin.obj"),
            sky: new defs.Square(),
            snow_terrain: new Shape_From_File("assets/snow_terrain.obj")
        };

        // *** Materials
        this.materials = {
            cabin: new Material(new defs.Phong_Shader(),
                { ambient: 0.5, color: hex_color("#6F4E37")}),
            sky: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: 0.5, specularity: 0, color: hex_color("#A7C7E7") }),
            snow_terrain: new Material(new defs.Phong_Shader(),
                { ambient: 1, color: hex_color("#ffffff") })
        }

        //this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.initial_camera_location = Mat4.translation(-2.50,-6.25,-33.89);
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


        // BAD CODE: WAS JUST TESTING TO SEE IF IT WORKS :)
        let snow_terrain_pos = vec4(0,0,0,1);
        let white_light = vec4(1,1,1,1);
        let snow_terrain_transform = Mat4.identity().times(Mat4.translation(0,0,10)).times(Mat4.scale(10,10,10));
        //temporary light 
        program_state.lights = [new Light(snow_terrain_pos, white_light, 1)];

        let sky_transform = Mat4.identity().times(Mat4.translation(-2.50,-6.25,-30)).times(Mat4.scale(100,100,0.2));

        let cabin_transform = Mat4.identity().times(Mat4.scale(1.3,1.3,1.3)).times(Mat4.translation(0, 2, 12)).times(Mat4.rotation(Math.PI,0,1,0));

        this.shapes.sky.draw(context, program_state, sky_transform, this.materials.sky);
        this.shapes.snow_terrain.draw(context, program_state, snow_terrain_transform, this.materials.snow_terrain);
        this.shapes.cabin.draw(context, program_state, cabin_transform, this.materials.cabin);
        // if (this.attached) {
        //     program_state.camera_inverse = this.attached().map((x, i) =>
        //         Vector.from(program_state.camera_inverse[i]).mix(x, 0.1));
        // }
    }
}