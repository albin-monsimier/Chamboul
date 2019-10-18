var BABYLON;
(function (BABYLON) {
    var Interactions = /** @class */ (function () {
        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        function Interactions(_canvas) {
            this._canvas = _canvas;
            this.cylinders = [];
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
        Interactions.prototype.assign = function (target, source) {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        };
        /**
         * Runs the interactions game.
         */
        Interactions.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        /**
         * Inits the interactions.
         */
        Interactions.prototype._init = function () {
            this.engine = new BABYLON.Engine(this._canvas);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('freeCamera', new BABYLON.Vector3(-60, 15, 15), this.scene);
            this.camera.attachControl(this._canvas);
        };
        Interactions.prototype._initLights = function () {
            var light = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(15, 15, 15), this.scene);
        };
        Interactions.prototype._initBoule = function () {
            this.sphere = BABYLON.Mesh.CreateSphere('box', 32, 8, this.scene);
            this.sphere.position.y = 40;
            this.sphere.position.x = -20;
            this.sphere.position.z = 14;
            this.sphere.isPickable = true;
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/maki.jpg', this.scene);
            this.sphere.material = std;
        };
        Interactions.prototype._initGeometries = function () {
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;
            var height = 5;
            var width = 5;
            for (var i = 0; i < height; i++) {
                this.cylinders[i] = new Array();
                for (var y = 0; y < width; y++) {
                    this.cylinders[i][y] = BABYLON.Mesh.CreateBox('box', 5, this.scene);
                    this.cylinders[i][y].position.x = 50;
                    this.cylinders[i][y].position.z = 5.5 * (y + 1);
                    this.cylinders[i][y].position.y = 6 * (i);
                    this.cylinders[i][y].isPickable = true;
                }
            }
            var std = new BABYLON.StandardMaterial('std', this.scene);
            std.diffuseTexture = new BABYLON.Texture('../assets/maki.jpg', this.scene);
            this.ground.material = std;
            var skybox = BABYLON.Mesh.CreateBox('skybox', 500, this.scene);
            var skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/stars', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
            std.reflectionTexture = new BABYLON.CubeTexture('../assets/stars', this.scene);
            std.reflectionTexture.coordinatesMode = BABYLON.Texture.INVCUBIC_MODE;
        };
        Interactions.prototype._initCylinderPhysics = function () {
            this.scene.enablePhysics(new BABYLON.Vector3(0, -100, 0), new BABYLON.CannonJSPlugin());
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.cylinders.forEach(function (a) {
                a.forEach(function (b) {
                    b.physicsImpostor = new BABYLON.PhysicsImpostor(b, BABYLON.PhysicsImpostor.CylinderImpostor, {
                        mass: 0.01
                    });
                });
            });
        };
        Interactions.prototype._initBoulePhysics = function () {
            this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(this.sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 1
            });
        };
        Interactions.prototype._initInteractions = function () {
            var _this = this;
            this.scene.onPointerObservable.add(function (data) {
                if (data.type !== BABYLON.PointerEventTypes.POINTERUP)
                    return;
                if (data.pickInfo.pickedMesh === _this.sphere) {
                    _this.shootTry++;
                    _this.sphere.applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(150, 150, 150), data.pickInfo.pickedPoint);
                    if (_this.shootTry < 3) {
                        _this._initBoule();
                        _this._initBoulePhysics();
                    }
                }
            });
        };
        return Interactions;
    }());
    BABYLON.Interactions = Interactions;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=interactions.js.map