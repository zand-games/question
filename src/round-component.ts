import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("round-component")
export class RoundComponent extends LitElement {
  @property()
  round_time: number = 0;

  render() {
    return html`
      <div class="container">
        <button @click="${this.dice}" id="btnDice">Roll Dice!</button>
        <input
          type="number"
          name="round_time"
          id="round_time"
          placeholder="Round Time"
          class="Input-text"
          min="0"
          .value="${this.round_time.toString()}"
        />
      </div>
    `;
  }

  dice() {
    const r = Math.ceil(Math.random() * 6);
    this.round_time = r * 10 + r;
  }

  static styles = css`
    h1 {
      color: rgba(255, 255, 255, 0.322);
      text-align: center;
      width: 100%;
      font-size: 50px;
      margin-bottom: 10px;
    }

    p {
      text-align: center;
      color: rgba(255, 255, 255, 0.322);
      width: 100%;
      margin-bottom: 10px;
    }

    #lbltalk {
      text-align: right;
      color: rgb(255, 255, 255);
      width: 100%;
      margin-bottom: 10px;
      display: block;
      margin-left: 50px;
      font-size: 1.5em;
      animation: animate 1.5s linear infinite;
    }
    button {
      color: #08233e;
      font: 1.4em Futura, ‘Century Gothic’, AppleGothic, sans-serif;
      padding: 14px;
      background: url(overlay.png) repeat-x center #ffcc00;
      background-color: rgba(255, 204, 0, 1);
      border: 1px solid #ffcc00;
      -moz-border-radius: 10px;
      -webkit-border-radius: 10px;
      border-radius: 10px;
      border-bottom: 1px solid #9f9f9f;
      -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
      -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
      cursor: pointer;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .Input-text {
      display: inline;
      margin: 0;
      padding: var(--inputPaddingV) var(--inputPaddingH);
      color: inherit;
      width: 50%;
      font-family: inherit;
      font-size: var(--inputFontSize);
      font-weight: inherit;
      height: 3em;
      border: none;
      border-radius: 8px;
      transition: box-shadow var(--transitionDuration);
      text-align: center;
    }
  `;
}
