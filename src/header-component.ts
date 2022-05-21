import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("header-component")
export class HeaderComponent extends LitElement {
  render() {
    return html`
      <h1>Question Game<br /></h1>
      <p>Only available in Chrome</p>
    `;
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
  `;
}
