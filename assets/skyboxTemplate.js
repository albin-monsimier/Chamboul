var skybox = BABYLON.Mesh.CreateBox("skybox", 1000.0, scene);
var material = new BABYLON.StandardMaterial("pbrMaterial", scene);
material.backFaceCulling = false;
material.microSurface = 1.0;
material.cameraExposure = 0.6;
material.cameraContrast = 1.6;
material.disableLighting = true;
skybox.material = material;
material.infiniteDistance = true;

var texture = new BABYLON.HDRCubeTexture("../assets/environment.babylon.hdr", scene);
material.reflectionTexture = texture;
material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


// Cube
            var cube = this.scene.getMeshByID("cube");
            cube.isPickable = true;
            cube.actionManager = new ActionManager(this.scene);

            var clickAction = new SwitchBooleanAction(ActionManager.OnLeftPickTrigger, cube, "showBoundingBox");
            cube.actionManager.registerAction(clickAction);

            var reClickAction = clickAction.then(new SwitchBooleanAction(ActionManager.OnLeftPickTrigger, cube.material, "wireframe"));

            // Ground
            var ground = this.scene.getMeshByID("ground");
            ground.isPickable = true;
            ground.actionManager = new ActionManager(this.scene);

            var physicsAction = new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, (evt: ActionEvent) => {
                var mesh: Mesh = null;
                var random = Math.random();

                if (random >= 0.5) {
                    mesh = Mesh.CreateSphere("sphere", 32, 5, this.scene);
                    mesh.setPhysicsState(PhysicsEngine.SphereImpostor, { mass: 1 });
                }
                else {
                    mesh = Mesh.CreateBox("box", 5, this.scene);
                    mesh.setPhysicsState(PhysicsEngine.BoxImpostor, { mass: 1 });
                }

                mesh.position.y = 20;
                mesh.position.x += Math.random();
                mesh.position.z += Math.random();
                mesh.checkCollisions = true;
            });

            ground.actionManager.registerAction(physicsAction);