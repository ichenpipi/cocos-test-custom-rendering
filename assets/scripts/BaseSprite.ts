import BaseAssembler from "./BaseAssembler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseSprite extends cc.RenderComponent {

    @property()
    protected _texture: cc.Texture2D = null;
    @property({ type: cc.Texture2D })
    public get texture() {
        return this._texture;
    }
    public set texture(value) {
        this._texture = value;
        this._activateMaterial();
    }

    /**
     * 装配器
     */
    public _assembler: BaseAssembler = null;

    /**
     * 生命周期
     */
    protected onEnable() {
        super.onEnable();
        // 节点
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
    }

    /**
     * 生命周期
     */
    protected onDisable() {
        super.onDisable();
        // 节点
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
    }

    /**
     * 初始化装配器
     */
    public _resetAssembler() {
        // cc.log('[BaseSprite]', '_resetAssembler');
        // 装配器
        this._assembler = new BaseAssembler();
        this._assembler.init(this);
        // 标记更新顶点数据
        this.setVertsDirty();
    }

    /**
     * 初始化材质
     */
    public _activateMaterial() {
        // cc.log('[BaseSprite]', '_activateMaterial');
        const materials = this._materials;
        if (!materials[0]) {
            materials[0] = this._getDefaultMaterial();
        }
        for (let i = 0; i < materials.length; i++) {
            materials[i] = cc.MaterialVariant.create(materials[i], this);
        }
        this._updateMaterial();
    }

    /**
     * 更新材质属性
     */
    public _updateMaterial() {
        // cc.log('[BaseSprite]', '_updateMaterial');
        const texture = this._texture;
        if (texture) {
            const material = this.getMaterial(0)
            if (material) {
                if (material.getDefine('USE_TEXTURE') !== undefined) {
                    material.define('USE_TEXTURE', true);
                }
                material.setProperty('texture', texture);
                // 标记渲染状态
                this.markForRender(true);
                return;
            }
        }
        // 禁用渲染
        this.disableRender();
    }

    /**
     * 验证渲染状态
     */
    public _validateRender() {
        if (!this._texture) {
            this.disableRender();
        }
    }

}
