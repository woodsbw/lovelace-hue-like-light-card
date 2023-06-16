[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration) [![Tests](https://github.com/Gh61/lovelace-hue-like-light-card/actions/workflows/jest.yml/badge.svg)](https://github.com/Gh61/lovelace-hue-like-light-card/actions/workflows/jest.yml) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/paygh61/) ![Downloads](https://img.shields.io/github/downloads/Gh61/lovelace-hue-like-light-card/total.svg)


# Hue-Like Light Card for Home Assistant

This [dashboard](https://www.home-assistant.io/getting-started/concepts-terminology/#dashboards) card is providing light control. It is inspired by original Philips Hue app.

<p>
  <img alt="Screen1" src="https://github.com/Gh61/lovelace-hue-like-light-card/raw/main/doc/screen1.png" height="360" />
  <img alt="Hue-Screen2" src="https://github.com/Gh61/lovelace-hue-like-light-card/raw/main/doc/hue-screen2.png" height="360" />
  <img alt="Hue-Screen-Detail1" src="https://github.com/Gh61/lovelace-hue-like-light-card/raw/main/doc/hue-screen-detail-1.png" height="360" />
</p>

\* *intensity of color, shadow and other UI properties may be subject of change*

### Basic configuration
```yaml
type: custom:hue-like-light-card
entity: light.livingroom_color
```
Where **livingroom_color** is the [entity](https://www.home-assistant.io/getting-started/concepts-terminology/#devices--entities) id of some existing light.

For more options see [Configuration](#configuration) or let yourself inspire in [Examples of configuration](#examples-of-configuration)

## Installation

### HACS

- Open HACS
- Go to "Frontend" section
- Click button with "+" icon
- Search for "Hue-Like Light Card"
- Install repository in HACS
- Refresh your browser

### Manual

- Download `hue-like-light-card.js` file from the [latest release](https://github.com/Gh61/lovelace-hue-like-light-card/releases/latest)
- Save downloaded file somewhere in `<ha config>/www/` directory, e.g. `/config/www/custom_lovelace/hue-like-light-card.js`
- Add saved file to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/)
  ```yaml
  url: /local/custom_lovelace/hue-like-light-card.js
  type: module
  ```
- Restart HA if you had to create `www` directory
- Refresh your browser

## Configuration
<table>
  <tr>
    <th>Key</th>
    <th>Type</th>
    <th>Required</th>
    <th>Since</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>entity</code></td>
    <td>string</td>
    <td>yes*</td>
    <td>1.0.0</td>
    <td>-</td>
    <td><b>Light</b> entity name (eg. <code>light.my_light</code>)</td>
  </tr>
  <tr>
    <td><code>entities</code></td>
    <td>list of strings</td>
    <td>yes*</td>
    <td>1.0.0</td>
    <td>-</td>
    <td>Multiple <b>Light</b> entity names</td>
  </tr>
  <tr>
    <td><code>title</code></td>
    <td>string</td>
    <td>no</td>
    <td>1.0.0</td>
    <td><i>Lights name</i></td>
    <td>Card title</td>
  </tr>
  <tr>
    <td><code>icon</code></td>
    <td>string</td>
    <td>no</td>
    <td>1.0.0</td>
    <td><i><a href="#automatic-icon">automatic icon</a></i></td>
    <td>Card icon</td>
  </tr>
  <tr>
    <td><code>showSwitch</code></td>
    <td>boolean</td>
    <td>no</td>
    <td>1.2.1</td>
    <td><code>true</code></td>
    <td>When set to <code>false</code>, toggle switch will not be visible on card. This will give more space for <code>title</code>.<br/>
    (You can then use <code>offClickAction</code> and <code>onClickAction</code> to turn the lights on/off.)</td>
  </tr>
  <tr>
    <td><code>offClickAction</code></td>
    <td><a href="#click-action">Click Action</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td><a href="#automatic-click-action"><i>automatic</i></a> (<code>hue-screen</code>)</td>
    <td>Action when tile is clicked and all <b>lights are off</b></td>
  </tr>
  <tr>
    <td><code>offClickData</code></td>
    <td><a href="#click-action-data">Click Action Data</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td>-</td>
    <td><a href="#click-action-data">Data</a> for <code>offClickAction</code></td>
  </tr>
  <tr>
    <td><code>onClickAction</code></td>
    <td><a href="#click-action">Click Action</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td><a href="#automatic-click-action"><i>automatic</i></a> (<code>hue-screen</code>)</td>
    <td>Action when tile is clicked and any of <b>lights is on</b></td>
  </tr>
  <tr>
    <td><code>onClickData</code></td>
    <td><a href="#click-action-data">Click Action Data</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td>-</td>
    <td><a href="#click-action-data">Data</a> for <code>onClickAction</code></td>
  </tr>
  <tr>
    <td><code>scenes</code></td>
    <td>list of <a href="#scenes-configuration">Scenes</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td><i><a href="#scenes-detection">automatic detection</a></i></td>
    <td>Scenes shown in <a href="#hue-screen">Hue screen</a></td>
  </tr>
  <tr>
    <td><code>allowZero</code></td>
    <td>boolean</td>
    <td>no</td>
    <td>1.0.0</td>
    <td><code>false</code></td>
    <td>If turned on, the slider can be moved to and from value 0.<br/>(turning off/on the the lights)</td>
  </tr>
  <tr>
    <td><code>defaultColor</code></td>
    <td><a href="#color">Color</a></td>
    <td>no</td>
    <td>1.0.0</td>
    <td><code>'warm'</code></td>
    <td>
      If selected light (or lights) doesn't have RGB mode,<br/>this value is used as color when the light is on.
  </tr>
  <tr>
    <td><code>offColor</code></td>
    <td><a href="#colorextended">ColorExtended</a></td>
    <td>no</td>
    <td>1.0.0</td>
    <td><code>'#666'</code><br/>(<code>'#363636'</code> for <a href="#hue-screen">Hue Screen</a>)</td>
    <td>
      The color of the pane, when all lights are off.
      When set, also used in <a href="#hue-screen">Hue Screen</a> header (recommended setting also <code>hueScreenBgColor</code> accordingly).
    </td>
  </tr>
  <tr>
    <td><code>hueScreenBgColor</code></td>
    <td><a href="#colorextended">ColorExtended</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td><code>'#171717'</code></td>
    <td>
      Background color of <a href="#hue-screen">Hue Screen</a>
    </td>
  </tr>
  <tr>
    <td><code>theme</code></td>
    <td><i>Installed theme name</i></td>
    <td>no</td>
    <td>1.2.1</td>
    <td><i>Global HA theme</i></td>
    <td>Will use specific theme for this single card. Other than the current selected globally in Home Assistant.</td>
  </tr>
  <tr>
    <td><s><code>disableOffShadow</code></s></td>
    <td>boolean</td>
    <td>no</td>
    <td><i>deprecated in 1.3.0</i></td>
    <td><code>false</code></td>
    <td><s>If turned on, the card will not have inner shadow, when all lights are off.</s></td>
  </tr>
  <tr>
    <td><code>offShadow</code></td>
    <td>boolean</td>
    <td>no</td>
    <td>1.3.0</td>
    <td><code>true</code></td>
    <td>If turned off, the card will not have inner shadow, when all lights are off.</td>
  </tr>
  <tr>
    <td><code>hueBorders</code></td>
    <td>boolean</td>
    <td>no</td>
    <td>1.0.0</td>
    <td><code>true</code></td>
    <td>If turned off, the card will take border settings from current Home Assistant theme.</td>
  </tr>
  <tr>
    <td><code>resources</code></td>
    <td><a href="resources-object">Resources object</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td>-</td>
    <td>Can change (localize) texts on this card</td>
  </tr>
  <tr>
    <td><code>style</code></td>
    <td></td>
    <td>no</td>
    <td>1.4.0</td>
    <td>-</td>
    <td>Support for the <a href="https://github.com/thomasloven/lovelace-card-mod">card-mod</a>.</td>
  </tr>
  <tr>
    <td><code>card_mod</code></td>
    <td></td>
    <td>no</td>
    <td>1.4.0</td>
    <td>-</td>
    <td>Support for the <a href="https://github.com/thomasloven/lovelace-card-mod">card-mod</a>.</td>
  </tr>
  <tr>
    <td colspan="6">
      <i>* At least one of this two must be filled in. <b>Only entities of <code>light</code> domain are supported.</b></i>
    </td>
  </tr>
</table>

### Automatic Icon
- If the card has one light entity attached, the icon is taken from entity.
    - If the entity has no icon, `mdi:lightbulb` (![lightbulb](https://user-images.githubusercontent.com/10837736/171443813-5e0dc16c-de15-43a1-9e96-0917c038e0a9.svg)) is used.
- If the card has two lights `mdi:lightbulb-multiple` (![lightbulb-multiple](https://user-images.githubusercontent.com/10837736/171444016-4b571fcf-0e30-4eca-9baf-61a710c17c05.svg)) is used.
- If the card has three or more lights attached, `mdi:lightbulb-group` (![lightbulb-group](https://user-images.githubusercontent.com/10837736/171444069-639d41d5-1dc7-4bd7-8104-b77f52df86fb.svg)) is used.

## Text template
*Since version 1.2.0*

The text supports showing entity states and attributes using double curly `{{` brackets `}}`.
When you insert entity name inside these brackets, entity status will be resolved and shown on given place. You can also show attribute on this entity.

#### Simple state
```yaml
type: custom:hue-like-light-card
title: TV - {{ light.tv_backlight }}
entity: light.tv_backlight
```

![Template usage](/doc/template-screen1.png)

#### Attribute ussage
```yaml
type: custom:hue-like-light-card
title: Kitchen - desk ({{ light.kitchen_desk1.brightness }}, {{light.kitchen_desk2.brightness}})
icon: mdi:wall-sconce-flat
offColor: '#363636'
entities:
  - light.kitchen_desk1
  - light.kitchen_desk2
```
![Template attribute usage](/doc/template-screen2.png)

*When attribute is not available (or is empty) on entity, state of the entity will be shown instead.*


## Color
The color can be defined in following ways:
<ul>
  <li>HEX: <code>'#fff'</code>, <code>'#ffffff'</code></li>
  <li>HEX (with alpha): <code>'#fffa'</code>, <code>'#ffffffaa'</code> <i>(since version 1.4.0)</i></li>
  <li>RGB: <code>'rgb(255,255,255)'</code></li>
  <li>RGBA: <code>'rgba(255,255,255,0.9)'</code> <i>(since version 1.4.0)</i></li>
  <li>WEB name: <code>'red'</code>,<code>'salmon'</code>,<code>'DarkSeaGreen'</code>, etc.</li>
  <li>predefined: <code>'warm'</code> or <code>'cold'</code> (in places where it does make sense)</td></li>
</ul>

## ColorExtended
*Since version 1.2.0*

Same as [Color](#color) and can also be defined as
<ul>
  <li><code>theme-color</code></li>
</ul>
This will pick the color from currently used Home Assistant theme.

## Click action
When the card is clicked, something can happen. This can be configured through configuration.
```yaml
type: custom:hue-like-light-card
...
offClickAction: turn-on
onClickAction: turn-off
```
*Simple example to toggle lights on click.*

### Possible actions
<table>
  <tr>
    <th width="120">Key</th>
    <th><a href="#action-data">Possible data*</a></th>
    <th>Data required</th>
    <th>Since</th>
    <th>Action on click</th>
  </tr>
  <tr>
    <td><code>default</code></td>
    <td>yes</td>
    <td>no</td>
    <td>1.1.0</td>
    <td><a href="#automatic-click-action">automatic action</a> (<code>hue-screen</code>)</td>
  </tr>
  <tr>
    <td><code>none</code></td>
    <td>no</td>
    <td>no</td>
    <td>1.1.0</td>
    <td>nothing</td>
  </tr>
  <tr>
    <td><code>turn-on</code></td>
    <td>no</td>
    <td>no</td>
    <td>1.1.0</td>
    <td>turn on all lights</td>
  </tr>
  <tr>
    <td><code>turn-off</code></td>
    <td>no</td>
    <td>no</td>
    <td>1.1.0</td>
    <td>turn off all lights</td>
  </tr>
  <tr>
    <td><code>more-info</code></td>
    <td>yes (<code>entity</code>)</td>
    <td>no</td>
    <td>1.1.0</td>
    <td>
      Shows system more-info dialog of one light.<br/>
      If any light is on, the first lit light will be selected.<br/>
      If all light are off, first light will be selected.<br/>
      When action data are used, any entity can be selected.
    </td>
  </tr>
  <tr>
    <td><code>scene</code></td>
    <td>yes (<code>scene</code>)</td>
    <td>yes</td>
    <td>1.1.0</td>
    <td>activate selected scene</td>
  </tr>
  <tr>
    <td><code>hue-screen</code></td>
    <td>no<br/>(is using general <a href="#scenes-configuration"><code>scenes</code></a> config)</td>
    <td>no</td>
    <td>1.1.0</td>
    <td>show <a href="#hue-screen">Hue Screen</a></td>
  </tr>
</table>

### Action data
Some actions can be configured using action data. Action data parameter can have name (as defined in table above) but it is not mandatory. Both styles are possible.

*Action data without name:*
```yaml
type: custom:hue-like-light-card
...
onClickAction: more-info
onClickData: media_player.television
```

*Action data with name:*
```yaml
type: custom:hue-like-light-card
...
offClickAction: scene
offClickData:
  scene: scene.tv_citron
```

### Automatic click action
Since version 1.4.0 automatic click action is always `hue-screen`.

## Scenes configuration
To enable switching between scenes, you can configure scenes, that can be activated in [Hue Screen](#hue-screen).<br/>
When no scenes are defined, scenes will be detected [automatically](#scenes-detection).
### Scene parameters
<table>
  <tr>
    <th>Key</th>
    <th>Type</th>
    <th>Required</th>
    <th>Since</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>entity</code></td>
    <td>string</td>
    <td>yes</td>
    <td>1.1.0</td>
    <td>-</td>
    <td>Scene entity name (eg. <code>scene.tv_orange</code>)</td>
  </tr>
  <tr>
    <td><code>title</code></td>
    <td>string</td>
    <td>no</td>
    <td>1.1.0</td>
    <td><i>Scene name*</i></td>
    <td>Text on scene-button</td>
  </tr>
  <tr>
    <td><code>icon</code></td>
    <td>string</td>
    <td>no</td>
    <td>1.1.0</td>
    <td><i>Icon of scene</i> or <code>'mdi:palette'</code></td>
    <td>Icon on scene-button</td>
  </tr>
  <tr>
    <td><code>color</code></td>
    <td><a href="#color">Color</a></td>
    <td>no</td>
    <td>1.1.0</td>
    <td><code>'darkgoldenrod'</code></td>
    <td>Accent color current scene (shown on scene-button)</td>
  </tr>
  <tr>
    <td><code>activation</code></td>
    <td><a href="https://www.home-assistant.io/docs/scripts/service-calls/">Service name</a></td>
    <td>no</td>
    <td>1.2.0</td>
    <td><code>'scene.turn_on'</code></td>
    <td>Service called when scene is activated</td>
  </tr>
  <tr>
    <td><code>activationData</code></td>
    <td>object</td>
    <td>no</td>
    <td>1.2.0</td>
    <td>-</td>
    <td>Data for <code>activation</code> service.**</td>
  </tr>
  <tr>
    <td colspan="6">
      <i>* If the scene name begins with the same text as the card title is, this text is removed.</i>
    </td>
  </tr>
  <tr>
    <td colspan="6">
      <i>** Data always have <code>entity_id</code> parameter filled with <code>entity</code> name. You can change this value, when another value is supplied with this name.</i>
    </td>
  </tr>
</table>

#### Example of scenes configuration
```yaml
type: custom:hue-like-light-card
...
scenes:
  - scene.colors_bluered            # if only entity is used, it can be written directly
  - entity: scene.colors_cyan
    title: My really favorite scene
    color: cyan
  - entity: scene.colors_blue_xmass
    icon: mdi:tree-outline
  - entity: scene.colors_white
    color: white
    icon: ''                        # when you don't want the icon, you can set it to empty string
```
For the best experience, please fill in both `icon` and `color` for all scenes.

### Scenes detection
Automatic scene detection will take place, when no scenes are configured.

Scenes are detected from areas where lights are placed.<br/>
All scenes from all areas, where configured lights are placed, are taken.

**Icon** of detected scenes is taken from your Home Assistant settings. You can change the icon in entity settings.

**Color** of scene cannot be detected automatically, for the best experience fill scenes and respective colors manually.

### Custom activation example (Hue dynamic scene)
```yaml
type: custom:hue-like-light-card
...
scenes:
  ...
  - entity: scene.colors_tokio
    color: rgb(168, 25, 255)
    icon: mdi:home-city
    title: Tokio (dynamic)
    activation: hue.activate_scene
    activationData:
      dynamic: true
      brightness: 180
      speed: 40
```

## Hue Screen
Hue screen will allow you to activate [scenes](#scenes-configuration), set light colors, temp and brightness (same functionality as official Hue App).
*Function of effects activation will come in the future.*

![Hue-Screen](/doc/hue-screen1.png)
<img alt="Hue-Screen2" src="https://github.com/Gh61/lovelace-hue-like-light-card/raw/main/doc/hue-screen2.png" height="540" />
![Hue-Screen-Detail](/doc/hue-screen-detail-2.png)
<img alt="Hue-Screen-Detail1" src="https://github.com/Gh61/lovelace-hue-like-light-card/raw/main/doc/hue-screen-detail-1.png" height="540" />

## Resources object
Using the configuration option `resources`, you can change all static texts used in this component.
### Texts to change
<table>
  <tr>
    <th>Key</th>
    <th>Since</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>scenes</code></td>
    <td>1.1.0</td>
    <td>My scenes</td>
    <td>Title of Scenes tiles in <a href="#hue-screen">Hue Screen</a></td>
  </tr>
  <tr>
    <td><code>lights</code></td>
    <td>1.3.0</td>
    <td>Lights</td>
    <td>Title of Light tiles in <a href="#hue-screen">Hue Screen</a></td>
  </tr>
</table>

### Example of configuration
```yaml
type: custom:hue-like-light-card
...
resources:
  scenes: My scenes
```

## Examples of configuration
#### Multiple lights
![Screen2](/doc/screen2.png)
```yaml
type: custom:hue-like-light-card
title: TV colors
entities:
  - light.tvlight_color1
  - light.tvlight_color2
  - light.tvlight_color3
  - light.tvlight_color4
```

#### Custom title and icon
![Screen3](/doc/screen3.png)
```yaml
type: custom:hue-like-light-card
entity: light.livingroom_lamp
title: Reading light
icon: mdi:floor-lamp
```

#### No toggle switch
![Screen7](/doc/screen7.png)
```yaml
type: custom:hue-like-light-card-test
title: '[ TV - {{ light.tv_backlight }} ] No switch = more space for title'
entity: light.tv_backlight
icon: mdi:television
showSwitch: false
offClickAction: turn-on
onClickAction: turn-off
offColor: rgb(28,28,28)

```

#### Home Assistant-like
![Screen4](/doc/screen4.png)
```yaml
type: custom:hue-like-light-card
title: TV colors
entities:
  - light.tvlight_color1
  - light.tvlight_color2
  - light.tvlight_color3
  - light.tvlight_color4
offColor: theme-color
hueScreenBgColor: theme-color
offShadow: false
hueBorders: false
```

#### Custom theme
![Screen8](/doc/screen8.png)
```yaml
type: custom:hue-like-light-card-test
title: Living room
icon: mdi:sofa
offColor: theme-color
hueScreenBgColor: theme-color
offShadow: false
hueBorders: false
allowZero: true
entities:
  - light.livingroom_light
  - light.livingroom_color
offClickAction: hue-screen
onClickAction: hue-screen
theme: synthwave
```

#### Turnable with slider
![Screen5](/doc/screen5.png)
```yaml
type: custom:hue-like-light-card
title: Living room
entity: light.livingroom_light
allowZero: true
```

#### Non-RGB Light
![Screen6](/doc/screen6.png)
```yaml
type: custom:hue-like-light-card
title: Living room
entity: light.livingroom_light
defaultColor: 'rgb(230,230,255)'
```


## Coming soon features
- reactions on sliding event instead of on change (value will be changed in the moment of sliding, not after)
- faster reactions between multiple cards (instant change of value on other cards)
- subtext under the main text (how many lights are on, ...)
- ui editor?
