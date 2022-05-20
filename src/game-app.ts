import { LitElement, html, css, CSSResultGroup, CSSResultOrNative } from "lit";
import { property, customElement } from "lit/decorators.js";

import "./header-component";
import "./round-component";
import "./play-component";
@customElement("game-app")
export class GameApp extends LitElement {
  render() {
    return html` <section>
      <header-component></header-component>
      <round-component></round-component>
      <play-component></play-component>
    </section>`;
  }

  static get styles() {
    return [
      css`
        section {
          min-height: 100vh;
          width: 100%;
          /* display: flex; */
          align-items: flex-start;
          background-color: rgb(97, 81, 81);
          flex-direction: column;
          padding: 50px 0;
          align-items: center;
          text-align: center;
        }
      `,
    ];
  }
}
