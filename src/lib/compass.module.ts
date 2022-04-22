import {
    BuilderView,
    Flux,
    Schema,
    PluginFlux,
    SideEffects,
} from '@youwol/flux-core'
import { pack } from './main'
import { ModuleViewer } from '@youwol/flux-three'
import { combineLatest, fromEvent, Observable, Subscription } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'
import { CubeTexture, CubeTextureLoader, Scene, Vector3 } from 'three'
import { getUrlBase } from '@youwol/cdn-client'
import { AUTO_GENERATED } from '../auto_generated'

export namespace ModuleCompass {
    let icon = `
<g xmlns="http://www.w3.org/2000/svg">
<path d="M289.018,163.679l-97.761,49.231c-1.436,0.724-2.602,1.889-3.325,3.325L138.7,313.997   c-1.456,2.891-0.893,6.389,1.396,8.677c1.44,1.44,3.36,2.197,5.306,2.197c1.145,0,2.3-0.262,3.371-0.801l97.761-49.231   c1.436-0.724,2.602-1.889,3.325-3.325l49.231-97.761c1.456-2.891,0.893-6.389-1.396-8.677   C295.406,162.787,291.91,162.224,289.018,163.679z M196.662,232.248l33.858,33.858l-68.206,34.348L196.662,232.248z M241.127,255.5   l-33.858-33.858l68.206-34.348L241.127,255.5z"/>
<path d="M337.428,164.604c2.765,1.82,6.47,1.643,9.004-0.508c2.33-1.978,3.243-5.268,2.246-8.16   c-0.987-2.863-3.684-4.891-6.708-5.049c-3.189-0.166-6.203,1.79-7.364,4.759C333.343,158.873,334.525,162.692,337.428,164.604z"/>
<path d="M363.301,181.197c-1.647-3.799-6.062-5.544-9.865-3.896c-3.8,1.648-5.544,6.065-3.896,9.865   c6.809,15.7,10.67,32.332,11.546,49.208h-26.993c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h26.977   c-0.322,6.023-1.002,12.051-2.092,18.055c-5.181,28.548-18.807,54.525-39.404,75.123c-25.853,25.853-59.257,39.66-93.178,41.433   v-26.912c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v26.912c-33.922-1.773-67.326-15.58-93.179-41.433   c-25.116-25.116-39.689-57.965-41.505-93.178h26.985c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5H76.711   c1.815-35.213,16.388-68.062,41.505-93.18c25.073-25.073,57.97-39.673,93.179-41.499v26.98c0,4.142,3.358,7.5,7.5,7.5   s7.5-3.358,7.5-7.5v-26.983c33.993,1.751,65.938,15.455,90.741,39.121c2.997,2.859,7.745,2.748,10.604-0.249   c2.859-2.997,2.748-7.745-0.249-10.604c-29.85-28.481-69.046-43.92-110.344-43.46c-41.374,0.457-80.275,16.824-109.538,46.086   c-61.363,61.363-61.363,161.208,0,222.57c30.681,30.681,70.983,46.022,111.285,46.022c40.302,0,80.604-15.341,111.285-46.022   c22.767-22.767,37.828-51.485,43.557-83.051C379.332,241.275,375.723,209.839,363.301,181.197z"/>
<path d="M245.037,51.727c3.98-5.391,6.338-12.048,6.338-19.248C251.375,14.57,236.804,0,218.895,0   c-17.91,0-32.48,14.57-32.48,32.479c0,7.2,2.358,13.857,6.338,19.248C98.147,64.533,24.979,145.814,24.979,243.874   c0,106.925,86.99,193.916,193.916,193.916s193.915-86.99,193.915-193.916C412.81,145.814,339.643,64.533,245.037,51.727z    M201.415,32.479c0-9.638,7.841-17.479,17.48-17.479c9.638,0,17.479,7.841,17.479,17.479s-7.841,17.479-17.479,17.479   C209.256,49.959,201.415,42.118,201.415,32.479z M218.895,422.79c-98.654,0-178.916-80.261-178.916-178.916   S120.241,64.959,218.895,64.959S397.81,145.22,397.81,243.874S317.549,422.79,218.895,422.79z"/>
</g>`

    @Schema({
        pack,
    })
    export class PersistentData {
        constructor(params = {}) {
            Object.assign(this, params)
        }
    }

    @Flux({
        pack: pack,
        namespace: ModuleCompass,
        id: 'ModuleCompass',
        displayName: '3D compass',
        description: '3D compass for viewer of flux-three',
        compatibility: {
            'Parent module needs to be a flux-three Viewer': (module) =>
                module instanceof ModuleViewer.Module,
        },
    })
    @BuilderView({
        namespace: ModuleCompass,
        icon: icon,
    })
    export class Module
        extends PluginFlux<ModuleViewer.Module>
        implements SideEffects
    {
        public readonly keyEvents: Observable<(KeyboardEvent) => void>
        public readonly subscriptions: Subscription[]
        public readonly boxTexture: CubeTexture
        public readonly viewer3D: ModuleViewer.Module
        public readonly background = {
            urlBase: getUrlBase(AUTO_GENERATED.name, AUTO_GENERATED.version),
            folder: '/dist/assets/images/skybox/compass/',
            names: ['left', 'right', 'back', 'front', 'top', 'bottom'],
            urls: () =>
                this.background.names.map(
                    (name) =>
                        `${this.background.urlBase}/${this.background.folder}/${name}.png`,
                ),
        }

        static lookTo(controls, [x0, y0, z0], [x1, y1, z1]) {
            controls.target.copy(new Vector3(0, 0, 0))
            controls.object.position.copy(new Vector3(x0, y0, z0))
            controls.object.up.copy(new Vector3(x1, y1, z1))
            controls.rotateCamera()
        }

        static shortCuts = {
            D: (controls) => Module.lookTo(controls, [0, 0, -1], [0, -1, 0]),
            U: (controls) => Module.lookTo(controls, [0, 0, 1], [0, 1, 0]),
            W: (controls) => Module.lookTo(controls, [1, 0, 0], [0, 0, 1]),
            E: (controls) => Module.lookTo(controls, [-1, 0, 0], [0, 0, 1]),
            N: (controls) => Module.lookTo(controls, [0, -1, 0], [0, 0, 1]),
            S: (controls) => Module.lookTo(controls, [0, 1, 0], [0, 0, 1]),
        }

        constructor(params) {
            super(params)
            this.viewer3D = this.parentModule
            this.keyEvents = combineLatest([
                this.viewer3D.pluginsGateway.scene$,
                this.viewer3D.pluginsGateway.renderingDiv$,
            ]).pipe(
                mergeMap(() => fromEvent(window, 'keypress')),
                filter((event: KeyboardEvent) => Module.shortCuts[event.key]),
                map((event: KeyboardEvent) => Module.shortCuts[event.key]),
            )
            this.boxTexture = new CubeTextureLoader().load(
                this.background.urls(),
            )
            this.subscriptions = [
                this.keyEvents.subscribe((fct) => {
                    fct(this.viewer3D.controls)
                }),
                this.viewer3D.pluginsGateway.scene$.subscribe(
                    (scene: Scene) => {
                        scene.background = this.boxTexture
                    },
                ),
            ]
        }

        apply() {
            //No op
        }

        dispose() {
            this.subscriptions.forEach((s) => s.unsubscribe())
            this.boxTexture.dispose()
            this.parentModule.scene.background = undefined
        }
    }
}
