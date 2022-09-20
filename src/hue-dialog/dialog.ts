import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { Background } from '../core/colors/background';
import { Color } from '../core/colors/color';
import { LightController } from '../core/light-controller';
import { ViewUtils } from '../core/view-utils';
import { HueLikeLightCardConfig } from '../types/config';
import { Consts } from '../types/consts';

type Tab = 'colors' | 'scenes';

@customElement(Consts.HueDialogName)
export class HueDialog extends LitElement {

    /*
    Doc:
    https://material-components.github.io/material-components-web-catalog/#/component/dialog
    */

    private _isRendered = false;
    private _config:HueLikeLightCardConfig;
    private _ctrl:LightController;

    constructor(config:HueLikeLightCardConfig, lightController:LightController) {
        super();

        this._config = config;
        this._ctrl = lightController;
    }

    //#region Tabs

    private static readonly colorsTab:Tab = 'colors';
    private static readonly scenesTab:Tab = 'scenes';
    private static readonly tabs = [ HueDialog.colorsTab, HueDialog.scenesTab ]; //TODO: swap scenes view for color picker view when light clicked

    @state()
    private _currTab = HueDialog.scenesTab;

    //#endregion

    //#region show/hide

    /**
     * Insert and renders this dialog into <home-assistant>.
     */
    public show(): void {
        if (this._isRendered)
            throw new Error('Already rendered!');

        // append to DOM
        document.body.appendChild(this);
    }

    /** When the dialog is closed. Removes itself from the DOM. */
    private onDialogClose() {
        if (this._isRendered) {
            this.remove();
        }
    }

    //#endregion

    static get styles() {
        return css`
        /* icon centering */
        .mdc-icon-button i,
        .mdc-icon-button svg,
        .mdc-icon-button img,
        .mdc-icon-button ::slotted(*){
            height:auto;
        }

        /* same color header */
        .heading {
            color:var(--hue-text-color);
            background:var(--hue-background);
        }
        ha-header-bar {
            --mdc-theme-on-primary: var(--hue-text-color);
            --mdc-theme-primary: var(--hue-background);
            flex-shrink: 0;
            display: block;
        }
        .heading ha-switch {
            margin-right: 10px;
        }
        .heading ha-slider {
            width: 100%;
        }

        /* titles */
        .header{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .header .title{
            color: var(--mdc-dialog-content-ink-color);
            font-family: var(--paper-font-title_-_font-family);
            -webkit-font-smoothing: var( --paper-font-title_-_-webkit-font-smoothing );
            font-size: var(--paper-font-subhead_-_font-size);
            font-weight: var(--paper-font-title_-_font-weight);
            letter-spacing: var(--paper-font-title_-_letter-spacing);
            line-height: var(--paper-font-title_-_line-height);
        }
        `;
    }

    private updateStyles(): void {
        // TODO: somehow report changes to hass property on LovelaceCard, and update styles here - maybe part of big notify mechanizm?

        // default text-color: '--primary-text-color'
        // default background: '--mdc-theme-surface'

        const computedStyle = getComputedStyle(this);
        const cssBackground = computedStyle.getPropertyValue('--mdc-theme-surface');
        const cssForeground = computedStyle.getPropertyValue('--primary-text-color');

        const offBackground = new Background([new Color(cssBackground)]);
        const bfg = ViewUtils.calculateBackAndForeground(this._ctrl, offBackground, false);

        // default color if background is default
        if (bfg.background == offBackground) {
            bfg.foreground = cssForeground;
        }

        this.style.setProperty(
            '--hue-background',
            bfg.background.toString()
        );
        this.style.setProperty(
            '--hue-text-color',
            bfg.foreground
        );
    }

    protected render() {
        this._isRendered = true;

        // inspiration: https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/ha-more-info-dialog.ts

        const name = this._config.title || this._ctrl.getTitle();
        const mdiClose = 'mdi:close';

        const onChangeCallback = () => {
            this.requestUpdate();
            this.updateStyles();
        };

        /*eslint-disable */
        return html`
        <ha-dialog
          open
          @closed=${this.onDialogClose}
          .heading=${name}
          hideActions
        >
          <div slot="heading" class="heading">
            <ha-header-bar>
              <ha-icon-button
                slot="navigationIcon"
                dialogAction="cancel"
              >
                <ha-icon
                  icon=${mdiClose}
                  style="height:auto"
                >
                </ha-icon>
              </ha-icon-button>
              <div
                slot="title"
                class="main-title"
                .title=${name}
              >
                ${name}
              </div>
              <div slot="actionItems">
              ${ViewUtils.createSwitch(this._ctrl, onChangeCallback)}
              </div>
            </ha-header-bar>
            ${ViewUtils.createSlider(this._ctrl, this._config, onChangeCallback)}
          </div>
          <div class="content" tabindex="-1" dialogInitialFocus>
            ${cache(
              this._currTab === HueDialog.scenesTab
                ? html`
                    <div class='header'>
                        <div class='title'>${this._config.resources.scenes}</div>
                    </div>

                  `
                : html`
                    <h3>Here for Colors</h3>
                  `
            )}
            <div class='header'>
                <div class='title'>${this._config.resources.lights}</div>
            </div>
          </div>
        </ha-dialog>
        `;
        /*eslint-enable */
    }

    //#region updateStyles hooks

    protected firstUpdated() {
        this.updated();
    }

    protected updated() {
        this.updateStyles();
    }

    connectedCallback(): void {
        super.connectedCallback();
        // CSS
        this.updateStyles();
    }

    //#endregion
}