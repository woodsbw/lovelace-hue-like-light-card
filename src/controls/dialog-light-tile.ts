import { html, css, unsafeCSS, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Background } from '../core/colors/background';
import { Color } from '../core/colors/color';
import { ViewUtils } from '../core/view-utils';
import { Consts } from '../types/consts';
import { nameof } from '../types/extensions';
import { ILightContainer } from '../types/types';
import { HueDialogSceneTile } from './dialog-scene-tile';
import { HueDialogTile } from './dialog-tile';

/**
 * Represents Scene tile element in HueDialog.
 */
@customElement(HueDialogLightTile.ElementName)
export class HueDialogLightTile extends HueDialogTile {

    /**
     * Name of this Element
     */
    public static override readonly ElementName = HueDialogTile.ElementName + '-light';

    @property() public lightContainer: ILightContainer | null = null;
    @property() public defaultColor: Color | null = null;

    private static readonly titlePadding = 10;
    private static readonly switchHeight = 45;

    public static override get styles() {
        return [
            HueDialogTile.hueDialogStyle,
            css`
    .hue-tile.light{
        height: ${HueDialogTile.height + HueDialogLightTile.switchHeight}px;
        background:var(--hue-light-background, ${unsafeCSS(Consts.TileOffColor)});
        box-shadow:var(--hue-light-box-shadow), ${unsafeCSS(Consts.HueShadow)};
        transition:${unsafeCSS(Consts.TransitionDefault)};
    }

    .title{
        color: var(--hue-light-text-color, ${unsafeCSS(Consts.LightColor)});
        padding-bottom: ${HueDialogLightTile.titlePadding}px;
    }

    .icon-slot{
        display: flex;
        flex-flow: column;
        text-align: center;
        height: calc(100% - ${HueDialogLightTile.titleHeight}px - ${HueDialogLightTile.titlePadding}px - ${HueDialogLightTile.switchHeight}px);
        justify-content: center;
    }
    .icon-slot ha-icon {
        color: var(--hue-light-text-color, ${unsafeCSS(Consts.LightColor)});
        transform: scale(${HueDialogSceneTile.iconScale});
    }

    .switch{
        display:flex;
        flex-flow:column;

        height: ${HueDialogLightTile.switchHeight + HueDialogTile.padding}px;
        justify-content: center;
        background: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
        border-top: 1px solid rgba(80, 80, 80, 0.1);
        box-sizing: content-box;
        margin: 0 -${HueDialogTile.padding}px;
    }
    .switch ha-switch{
        justify-content:center;
    }

    `];
    }

    protected updated(changedProps: PropertyValues): void {

        // register for changes on light
        if (changedProps.has(nameof(this, 'lightContainer'))) {
            const oldValue = changedProps.get(nameof(this, 'lightContainer')) as ILightContainer | null;
            if (oldValue) {
                oldValue.unregisterOnPropertyChanged(this._id);
            }
            if (this.lightContainer) {
                this.lightContainer.registerOnPropertyChanged(this._id, () => this.lightUpdated());
            }
        }

        if (this.lightContainer) {
            if (this.lightContainer.isOn()) {
                const defaultColorBg = this.defaultColor ? new Background([this.defaultColor]) : null;
                const bfg = ViewUtils.calculateBackAndForeground(this.lightContainer, null, true, defaultColorBg);

                if (bfg.background) {
                    this.style.setProperty(
                        '--hue-light-background',
                        bfg.background.toString()
                    );
                }

                if (bfg.foreground) {
                    this.style.setProperty(
                        '--hue-light-text-color',
                        bfg.foreground.toString()
                    );
                }
            } else {
                this.style.removeProperty(
                    '--hue-light-background'
                );
                this.style.removeProperty(
                    '--hue-light-text-color'
                );
            }

            const shadow = ViewUtils.calculateDefaultShadow(this, this.lightContainer, false);
            this.style.setProperty(
                '--hue-light-box-shadow',
                shadow
            );
        }
    }

    private lightUpdated() {
        this.requestUpdate();
    }

    protected override render() {
        if (!this.lightContainer)
            return html``;

        const title = this.lightContainer.getTitle().resolveToString(null);
        const icon = this.lightContainer.getIcon() ?? Consts.DefaultOneIcon;
        const onChange = () => { };

        /*eslint-disable */
        return html`
        <div class='hue-tile light' title='${title}'>
            <div class='icon-slot'>
                <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class='title'>
                <span>${title}</span>
            </div>
            <div class='switch'>
                ${ViewUtils.createSwitch(this.lightContainer, onChange)}
            </div>
        </div>
        `;
        /*eslint-enable */
    }
}