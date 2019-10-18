module BABYLON {
    export interface IInteractions {
        run(): void;
    }

    export class Interactions implements IInteractions {
        public engine: Engine;
        public scene: Scene;
        public camera: FreeCamera;
        public sphere: Mesh;
        public cylinders: Array<Array<Mesh>> = [];
        public ground: Mesh;
        public shootTry: int;

        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        public constructor(private _canvas: HTMLCanvasElement) {
            this.shootTry = 0;
            this._init();
            this._initLights();
            this._initGeometries();
            this._initBoule();
            this._initCylinderPhysics();
            this._initBoulePhysics();
            this._initInteractions();

            this.camera.setTarget(this.cylinders[1][1].position);


            this.assign(this.sphere, {
                maki: 1
            });
        }

        public assign<T extends any, U extends any>(target: T, source: U): T & U {
            for (const key in source) {
                target[key] = source[key];
            }

            return target as T & U;
        }

        /**
         * Runs the interactions game.
         */
        public run(): void {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }

        /**
         * Inits the interactions.
         */
        private _init(): void {
            this.engine = new Engine(this._canvas);
            this.scene = new Scene(this.engine);

            this.camera = new FreeCamera('freeCamera', new Vector3(-60,15, 15), this.scene);
            this.camera.attachControl(this._canvas);
        }

        private _initLights(): void {
            const light = new PointLight('pointLight', new Vector3(15, 15, 15), this.scene);
        }

        private _initBoule() : void {
            this.sphere = Mesh.CreateSphere('box', 32, 8, this.scene);
            this.sphere.position.y = 40;
            this.sphere.position.x = -20;
            this.sphere.position.z = 14;
            this.sphere.isPickable = true;

            const std = new StandardMaterial('std', this.scene);
            std.diffuseTexture = new Texture('../assets/maki.jpg', this.scene);
            this.sphere.material = std;
        }

        private _initGeometries(): void {
            this.ground = Mesh.CreateGround('ground', 512, 512, 1, this.scene);
         
            this.ground.isPickable = true;
           
            var height = 5;
            var width = 5;
            for( var i= 0; i< height; i++ ) {
                this.cylinders[i] = new Array<Mesh>();
                for(var y = 0; y<width; y++){
                    this.cylinders[i][y] = Mesh.CreateBox('box',  5, this.scene);
                    this.cylinders[i][y].position.x = 50;
                    this.cylinders[i][y].position.z= 5.5*(y+1);
                    this.cylinders[i][y].position.y= 6*(i);
                    this.cylinders[i][y].isPickable= true;
                }
            }

            const std = new StandardMaterial('std', this.scene);
            std.diffuseTexture = new Texture('../assets/maki.jpg', this.scene);
            this.ground.material = std;

            const skybox = Mesh.CreateBox('skybox', 500, this.scene);
            const skyboxMaterial = new StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture('../assets/stars', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;

            std.reflectionTexture = new CubeTexture('../assets/stars', this.scene);
            std.reflectionTexture.coordinatesMode = Texture.INVCUBIC_MODE;
        }

        private _initCylinderPhysics(): void {
            this.scene.enablePhysics(new Vector3(0, -100, 0), new CannonJSPlugin());

            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            this.cylinders.forEach( a =>{
                a.forEach( b =>{
                    b.physicsImpostor = new PhysicsImpostor(b, PhysicsImpostor.CylinderImpostor, {
                        mass: 0.01                    
                    })
                })
            })
        }

        private _initBoulePhysics() : void {
            this.sphere.physicsImpostor = new PhysicsImpostor(this.sphere, PhysicsImpostor.SphereImpostor, {
                mass: 1
            });
        }

        private _initInteractions(): void {
            this.scene.onPointerObservable.add((data) => {
                if (data.type !== PointerEventTypes.POINTERUP)
                    return;
                
                if (data.pickInfo.pickedMesh === this.sphere) {
                    this.shootTry ++;
                    this.sphere.applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(150, 150, 150), data.pickInfo.pickedPoint);
                    if(this.shootTry < 3){
                    this._initBoule();
                    this._initBoulePhysics();
                    }
                }
            });
        }
    }
}