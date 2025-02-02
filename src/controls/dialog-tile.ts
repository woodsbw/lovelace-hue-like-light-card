import { HomeAssistant } from 'custom-card-helpers';
import { css, nothing, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { IdLitElement } from '../core/id-lit-element';
import { Consts } from '../types/consts';
import { nameof } from '../types/extensions';

export interface ITileEventDetail {
    tileElement: HueDialogTile;
}

/**
 * Base for tile element in HueDialog
 */
export abstract class HueDialogTile extends IdLitElement {

    /**
     * Name of this Element
     */
    protected static readonly ElementName = 'hue-dialog-tile' + Consts.ElementPostfix;

    protected _hass: HomeAssistant;

    @property() public cardTitle:string;

    public set hass(hass:HomeAssistant) {
        const oldHass = this._hass;

        this._hass = hass;
        this.updateHassDependentProps();

        // custom @property() implementation
        this.requestUpdate(nameof(this, 'hass'), oldHass);
    }

    protected constructor() {
        super('HueDialogTile');
    }

    protected updateHassDependentProps() {}

    protected static readonly padding = 5; // px
    protected static readonly height = 90; // px
    protected static readonly width = 85; // px
    protected static readonly titleHeight = 35; // px
    protected static readonly clickTransition = 'transform .15s';

    protected static hueDialogStyle = css`
    :host{
        -webkit-tap-highlight-color: transparent;
    }
    .hue-tile{
        background: ${unsafeCSS(Consts.TileOffColor)};
        width: ${HueDialogTile.width}px;
        height: ${HueDialogTile.height}px;
        padding: ${HueDialogTile.padding}px;
        border-radius: ${Consts.HueBorderRadius}px;
        box-shadow: ${unsafeCSS(Consts.HueShadow)};
        overflow:hidden;
        user-select: none;
        transition: ${unsafeCSS(HueDialogTile.clickTransition)};
    }
    .hue-tile:not(.no-click):active:hover{
        transform: scale(0.95);
    }
    .title {
        color:${unsafeCSS(Consts.LightColor)};
        font-size: 12px;
        line-height: 15px;
        font-weight:400;
        height:${HueDialogTile.titleHeight}px;
        text-align: center;
        display: flex;
        flex-flow: column;
        justify-content: center;
        transition: ${unsafeCSS(Consts.TransitionDefault)};
    }
    .title span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    `;

    protected disableClickEffect():void {
        const tile = <Element>this.renderRoot.querySelector('.hue-tile');
        tile.classList.add('no-click');
    }

    protected enableClickEffect():void {
        const tile = <Element>this.renderRoot.querySelector('.hue-tile');
        tile.classList.remove('no-click');
    }

    protected abstract override updated(changedProps: PropertyValues): void;

    protected abstract override render(): TemplateResult | typeof nothing;
}