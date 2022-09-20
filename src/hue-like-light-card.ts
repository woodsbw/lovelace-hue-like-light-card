import { LovelaceCard, HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ClickHandler } from './core/click-handler';
import { Background } from './core/colors/background';
import { LightController } from './core/light-controller';
import { ViewUtils } from './core/view-utils';
import { HueLikeLightCardConfig } from './types/config';
import { Consts } from './types/consts';
import { HueLikeLightCardConfigInterface, WindowWithCards } from './types/types';

/* eslint no-console: 0 */
console.info(
    `%cHUE-%cLIKE%c LIGHT%c CARD %c${Consts.Version}`,
    'font-weight:bold;color:white;background:#0046FF',
    'font-weight:bold;color:white;background:#9E00FF',
    'font-weight:bold;color:white;background:#FF00F3',
    'font-weight:bold;color:white;background:#FF0032',
    'font-weight:bold;color:white;background:#FF8B00'
);

// This puts card into the UI card picker dialog
(window as WindowWithCards).customCards = (window as WindowWithCards).customCards || [];
(window as WindowWithCards).customCards!.push({
    type: Consts.CardElementName,
    name: Consts.CardName,
    description: Consts.CardDescription
});

@customElement(Consts.CardElementName)
export class HueLikeLightCard extends LitElement implements LovelaceCard {
    private _config: HueLikeLightCardConfig;
    private _ctrl: LightController;
    private _clickHandler: ClickHandler;
    private _offBackground: Background;

    @property() hass: HomeAssistant;

    setConfig(plainConfig: HueLikeLightCardConfigInterface | LovelaceCardConfig) {
        this._config = new HueLikeLightCardConfig(plainConfig);

        this._ctrl = new LightController(this._config.getEntities(), this._config.getDefaultColor());
        this._offBackground = new Background([this._config.getOffColor()]);
        this._clickHandler = new ClickHandler(this._config, this._ctrl, this);
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize(): number {
        return 3;
    }

    private cardClicked() : void {
        // handle the click
        this._clickHandler.handleClick();

        // update styles
        this.updateStyles();
    }

    // #### UI:

    static styles = css`
    ha-card
    {
        height:80px;
        background:var(--hue-background);
        position:relative;
        box-shadow:var(--hue-box-shadow),
            var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) /* default_ha_shadows */
        );
    }
    ha-card.hue-borders
    {
        border-radius:10px;
        box-shadow:var(--hue-box-shadow), 0px 2px 3px rgba(0,0,0,0.85);
    }
    ha-card div.tap-area
    {
        height:48px; /* card(80) - slider(32) */
        cursor: pointer;
    }
    ha-icon
    {
        position:absolute;
        left:22px;
        top:17px;
        transform:scale(2);
        color:var(--hue-text-color);
        transition:all 0.3s ease-out 0s;
    }
    h2
    {
        padding-top:0.5em;
        margin:0px 60px 0px 70px;
        min-height:22px;
        vertical-align:top;
        font-weight:400;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        color:var(--hue-text-color);
        transition:all 0.3s ease-out 0s;
    }
    ha-switch
    {
        position:absolute;
        right:14px;
        top:22px;
    }
    ha-slider
    {
        position:absolute;
        bottom:0;
        width:100%;
    }
    `;

    private calculateCurrentShadow(): string {
        if (this._ctrl.isOff())
            return this._config.disableOffShadow ? '0px 0px 0px white' : 'inset 0px 0px 10px rgba(0,0,0,0.2)';

        const card = <Element>this.renderRoot.querySelector('ha-card');
        if (!card)
            return '';
        const darkness = 100 - this._ctrl.value;
        const coef = (card.clientHeight / 100);
        const spread = 20;
        const position = spread + (darkness * 0.95) * coef;
        let width = card.clientHeight / 2;
        if (darkness > 70) {
            width -= (width - 20) * (darkness - 70) / 30; // width: 20-clientHeight/2
        }
        let shadowDensity = 0.65;
        if (darkness > 60) {
            shadowDensity -= (shadowDensity - 0.5) * (darkness - 60) / 40; // shadowDensity: 0.5-0.65
        }

        return `inset 0px -${position}px ${width}px -${spread}px rgba(0,0,0,${shadowDensity})`;
    }

    private updateStyles(): void {
        const bfg = ViewUtils.calculateBackAndForeground(this._ctrl, this._offBackground);

        this.style.setProperty(
            '--hue-background',
            bfg.background.toString()
        );
        this.style.setProperty(
            '--hue-box-shadow',
            this.calculateCurrentShadow()
        );
        this.style.setProperty(
            '--hue-text-color',
            bfg.foreground
        );
    }

    protected render() {
        this._ctrl.hass = this.hass;

        const title = this._config.title || this._ctrl.getTitle();
        const onChangeCallback = () => {
            this.requestUpdate();
            this.updateStyles();
        };

        return html`<ha-card>
            <div class="tap-area" @click="${(): void => this.cardClicked()}">
                <ha-icon icon="${this._config.icon || this._ctrl.getIcon()}"></ha-icon>
                <h2>${title}</h2>
            </div>
            ${ViewUtils.createSwitch(this._ctrl, onChangeCallback)}

            ${ViewUtils.createSlider(this._ctrl, this._config, onChangeCallback)}
        </ha-card>`;
    }

    //#region updateStyles hooks

    protected firstUpdated() {
        // CSS
        if (this._config.hueBorders) {
            (this.renderRoot.querySelector('ha-card') as Element).className = 'hue-borders';
        }

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
