/**
 * 扩展 cc 模块，声明一些 creator.d.ts 中没有声明（但实际上有）的东西~
 * @author 陈皮皮（ifaswind）
 * @version 20210127
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/declarations/cc.d.ts
 */
declare module cc {

    interface Node {

        _widget: cc.Widget;

        _renderComponent: RenderComponent;

        _touchListener?: TouchOneByOne;

        _mouseListener?: Mouse;

        _matrix: cc.Mat4;

        _worldMatrix: cc.Mat4;

        _localMatDirty: boolean;

        _worldMatDirty: boolean;

        _renderFlag: number;

    }

    interface Component {

        __preload(): void;

    }

    interface TouchOneByOne {

        _claimedTouches: Array;

        swallowTouches: boolean;

        onTouchBegan: Function;

        onTouchMoved: Function;

        onTouchEnded: Function;

        onTouchCancelled: Function;

        setSwallowTouches(needSwallow: boolean): void;

        isSwallowTouches(): boolean;

        clone(): TouchOneByOne;

        checkAvailable(): boolean;

    }

    interface Color {

        _val: number;

    }

    interface RenderComponent {

        _materials: Material[],

        _assembler: Assembler;

        _vertsDirty: boolean;

        _resetAssembler(): void;

        setVertsDirty(): void;

        _on3DNodeChanged(): void;

        _validateRender(): void;

        markForValidate(): void;

        markForRender(enable: boolean): void;

        disableRender(): void;

        _getDefaultMaterial(): Material;

        _activateMaterial(): void;

        _updateMaterial(): void;

        _updateColor(): void;

        _checkBacth(renderer: ModelBatcher, cullingMask: number): void;

    }

    class Assembler {

        /** 渲染数据 */
        _renderData: RenderData;

        /** 渲染组件 */
        _renderComp: RenderComponent;

        register(renderCompCtor, assembler): void;

        init(renderComp): void;

        updateRenderData(comp): void;

        fillBuffers(comp, renderer): void;

        getVfmt(): gfx.VertexFormat;

    }

    class Assembler2D extends Assembler {

        /** 每个顶点的数据数量 */
        floatsPerVert: number = 5;

        /** 顶点数量 */
        verticesCount: number = 4;

        /** 索引数量 */
        indicesCount: number = 6;

        /** UV 偏移 */
        uvOffset: number = 2;

        /** 颜色偏移 */
        colorOffset: number = 4;

        /** 所有顶点的数据总数量 */
        get verticesFloats(): number;

        initData(): void;

        initLocal(): void;

        updateColor(comp: RenderComponent, color: Color): void;

        getBuffer(): MeshBuffer;

        updateWorldVerts(comp: RenderComponent): void;

        packToDynamicAtlas(comp: RenderComponent, frame: SpriteFrame): void;

    }

    class RenderData {

        vDatas: Float32Array[];

        uintVDatas: Uint32Array[];

        iDatas: Uint16Array[];

        meshCount: number;

        _infos: any[];

        _flexBuffer: FlexBuffer;

        init(assembler: Assembler): void;

        clear(): void;

        updateMesh(index: number, vertices: number, indices: number): void;

        updateMeshRange(verticesCount: number, indicesCount: number): void;

        createData(index: number, verticesFloats: number, indicesCount: number): void;

        createQuadData(index: number, verticesFloats: number, indicesCount: number): void;

        createFlexData(index: number, verticesFloats: number, indicesCount: number, vfmt: gfx.VertexFormat): void;

        initQuadIndices(indices): void;

    }

    class FlexBuffer {

        _handler: any;

        _index: any;

        _vfmt: gfx.VertexFormat;

        _verticesBytes: any;

        _initVerticesCount: number;

        _initIndicesCount: number;

        _reallocVData(floatsCount, oldData): void;

        _reallocIData(indicesCount, oldData): void;

        reserve(verticesCount, indicesCount): void;

        used(verticesCount, indicesCount): void;

        reset(): void;

    }

    class MeshBuffer {

        byteOffset: number;

        indiceOffset: number;

        indiceStart: number;

        vertexOffset: number;

        _arrOffset: number;

        _offsetInfo: { byteOffset: number, vertexOffset: number, indiceOffset: number };

        _vData: Float32Array;

        _iData: Uint16Array;

        _uintVData: Uint32Array;

        _batcher: any;

        _vb: gfx.VertexBuffer;

        _vbArr: [];

        _ib: gfx.IndexBuffer;

        _ibArr: [];

        _vertexFormat: gfx.VertexFormat;

        constructor(batcher, vertexFormat): MeshBuffer;

        init(batcher, vertexFormat): void;

        request(vertexCount, indiceCount): { byteOffset: number, vertexOffset: number, indiceOffset: number };

    }

    class QuadBuffer extends MeshBuffer {

    }

    class RenderFlow {

        static readonly FLAG_DONOTHING: number;

        static readonly FLAG_BREAK_FLOW: number;

        static readonly FLAG_LOCAL_TRANSFORM: number;

        static readonly FLAG_WORLD_TRANSFORM: number;

        static readonly FLAG_TRANSFORM: number;

        static readonly FLAG_OPACITY: number;

        static readonly FLAG_COLOR: number;

        static readonly FLAG_OPACITY_COLOR: number;

        static readonly FLAG_UPDATE_RENDER_DATA: number;

        static readonly FLAG_RENDER: number;

        static readonly FLAG_CHILDREN: number;

        static readonly FLAG_POST_RENDER: number;

        static readonly FLAG_FINAL: number;

        _doNothing(): void;

        _localTransform(): void;

        _worldTransform(): void;

        _opacity(): void;

        _color(): void;

        _updateRenderData(): void;

        _render(): void;

        _children(): void;

        _postRender(): void;

        static flows: RenderFlow[];

        static createFlow(): RenderFlow;

        static registerValidate(renderComp: RenderComponent): void;

        static validateRenderers(): void;

        static visitRootNode(): void;

        static render(rootNode, dt): void;

        static renderCamera(camera, rootNode): void;

        static init(batcher: ModelBatcher, forwardRenderer: ForwardRenderer): void;

        static getBachther(): ModelBatcher;

    }

    module gfx {

        const ATTR_POSITION: any;
        const ATTR_UV0: any;
        const ATTR_COLOR: any;

        const ATTR_TYPE_UINT8: any;
        const ATTR_TYPE_FLOAT32: any;

        class VertexFormat {

            constructor(infos): VertexFormat;

            element(attrName): string;

            getHash(): string;

        }

        class VertexBuffer {

            constructor(device, format, usage, data): VertexBuffer;

        }

        class IndexBuffer {

            constructor(device, format, usage, data): IndexBuffer;

        }

    }

    module renderer {

        const canvas: any;

        const device: any;

        const scene: any;

        const drawCalls: any;

        const InputAssembler: any;

        const _handle: ModelBatcher;

        const _cameraNode: any;

        const _camera: any;

        const _forward: any;

        const _flow: any;

        function render(ecScene, dt): void;

        function clear(): void;

    }

    /**
     * 资源库模块
     * @deprecated cc.AssetLibrary 已在 v2.4 中被移除
     */
    module AssetLibrary {

        function loadAsset(uuid: string, callback: (err, result) => void, options?: { existingAsset?: any }): void;

        function queryAssetInfo(uuid: string, callback: (err, result) => void): void;

        function getAssetByUuid(uuid: string): any;

    }

}

interface ModelBatcher {

    walking: boolean;

    material: cc.Material;

    cullingMask: number;

    _quadBuffer: cc.QuadBuffer;

    _meshBuffer: cc.MeshBuffer;

    _buffer: cc.MeshBuffer;

    _batchedModels: any[];

    _dummyNode: cc.Node;

    node: cc.Node;

    parentOpacity: number;

    parentOpacityDirty: number;

    worldMatDirty: number;

}
