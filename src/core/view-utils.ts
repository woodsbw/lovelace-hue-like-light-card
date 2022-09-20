import { html, TemplateResult } from 'lit';
import { HueLikeLightCardConfig } from '../types/config';
import { Consts } from '../types/consts';
import { Action } from '../types/functions';
import { Background } from './colors/background';
import { LightController } from './light-controller';

export class ViewUtils {

    /**
     * Creates switch for given lightController.
     * @param onChange Be careful - this function is called on different scope, better pack your function to arrow call.
     */
    public static createSwitch(ctrl: LightController, onChange: Action, attributes: TemplateResult<1> = html``) {
        return html`<ha-switch .checked=${ctrl.isOn()} .disabled=${ctrl.isUnavailable()} .haptic=true @change=${(ev:Event) => this.changed(ctrl, onChange, false, ev)}
        ${attributes}
        ></ha-switch>`;
    }

    /**
     * Creates slider for given lightController and config.
     * @param onChange Be careful - this function is called on different scope, better pack your function to arrow call.
     */
    public static createSlider(ctrl: LightController, config: HueLikeLightCardConfig, onChange: Action, attributes: TemplateResult<1> = html``) {
        const min = config.allowZero ? 0 : 1;
        const max = 100;
        const step = 1;

        return html`<ha-slider .min=${min} .max=${max} .step=${step} .disabled=${config.allowZero ? ctrl.isUnavailable() : ctrl.isOff()} .value=${ctrl.value}
        pin @change=${(ev:Event) => this.changed(ctrl, onChange, true, ev)}
        ignore-bar-touch
        ${attributes}
        ></ha-slider>`;
    }

    private static changed(ctrl: LightController, onChange: Action, isSlider: boolean, ev:Event) {

        // TODO: try to update on sliding (use debounce) not only on change. (https://www.webcomponents.org/element/@polymer/paper-slider/elements/paper-slider#events)

        const target = ev.target;
        if (!target)
            return;

        if (isSlider) {
            const value = (target as HTMLInputElement).value;
            if (value != null) {
                ctrl.value = parseInt(value);
            }
        } else { // isToggle
            const checked = (target as HTMLInputElement).checked;
            if (checked) {
                ctrl.turnOn();
            } else {
                ctrl.turnOff();
            }
        }

        // update styles
        onChange();
        //this.updateStyles();
    }

    /**
     * Calculates and returns background and foregound color (for actual light brightness).
     * Creates readable text on background with shadow based on current brightness.
     * @param assumeShadow If turned off, calculates foreground for max brightness (noShadow).
     */
    public static calculateBackAndForeground(ctrl: LightController, offBackground:Background, assumeShadow = true) {
        const currentBackground = ctrl.isOff() ? offBackground : (ctrl.getBackground() || offBackground);
        const foreground = this.calculateForeground(ctrl, currentBackground, assumeShadow);

        return {
            background: currentBackground,
            foreground: foreground
        };
    }

    /**
     * Calculates and returns foregound color for given background (and actual light brightness).
     * Creates readable text on background with shadow based on current brightness.
     * @param assumeShadow If turned off, calculates foreground for max brightness (noShadow).
     */
    public static calculateForeground(ctrl: LightController, currentBackground:Background, assumeShadow = true) {

        let currentValue = ctrl.value;
        // if the shadow is not present, act like the value is on max.
        if (!assumeShadow) {
            currentValue = 100;
        }

        const offset = ctrl.isOn() && currentValue > 50
            ? -(10 - ((currentValue - 50) / 5)) // offset: -10-0
            : 0;
        const foreground = ctrl.isOn() && currentValue <= 50 
            ? Consts.LightColor // is on and under 50 => Light
            : currentBackground.getForeground(
                Consts.LightColor, // should be light
                ctrl.isOn() // should be dark
                    ? Consts.DarkColor
                    : Consts.DarkOffColor // make it little lighter, when isOff
                ,
                offset // offset for darker brightness
            );

        return foreground;
    }
}