import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import languages from "./languages.js";
import speechrecognition from "./speech-recognition.js";
import { GameStore } from "./store";
import { StoreSubscriber } from "lit-svelte-stores";
@customElement("play-component")
export class PlayComponent extends LitElement {
  @property()
  questions: Array<string> = [];

  @property()
  language!: string;

  @property()
  speechRecognition: any;

  game = new StoreSubscriber(this, () => GameStore);

  firstUpdated() {
    var select_dialect = this.shadowRoot.querySelector(
      "#select_dialect"
    ) as HTMLSelectElement;

    var select_language = this.shadowRoot.querySelector(
      "#select_language"
    ) as HTMLSelectElement;

    for (var i = 0; i < languages.length; i++) {
      select_language.options[i] = new Option(
        languages[i][0].toString(),
        i.toString()
      );
    }

    select_language.selectedIndex = 6;
    this.updateCountry();
    select_dialect.selectedIndex = 6;
    this.language = select_dialect.value;
    this.speechRecognition = speechrecognition(this.language);
    this.speechRecognition.addEventListener("result", (event) =>
      this.voice_to_text(event)
    );

    this.speechRecognition.addEventListener(
      "start",
      (event) => (this.game.value.play = true)
    );
    this.speechRecognition.addEventListener("error", (event) => {
      this.game.value.play = false;
      console.log(event);
    });
    this.speechRecognition.addEventListener(
      "end",
      (event) => (this.game.value.play = false)
    );
  }

  voice_to_text(event) {
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        this.questions = [...this.questions, event.results[i][0].transcript];
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    this.shadowRoot.querySelector("#interim").innerHTML = interim_transcript;
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    return html`
      <div class="container" disabled=${this.disabled()}>
        <div class="lang">
          <h2>Select Language</h2>
          <select
            class="form-select bg-secondary text-light"
            id="select_language"
            @change="${this.updateCountry}"
          ></select>
          <select
            class="form-select bg-secondary text-light mt-2"
            id="select_dialect"
          ></select>
        </div>
        <div class="controls">
          <div disabled="${this.disabled()}">
            <button @click="${this.play}" id="btnPlay">Play!</button>
            ${this.game.value.play == true
              ? html`<label id="lbltalk">Recording...</label>`
              : ""}
          </div>
        </div>
      </div>

      <div class="questions">
        ${this.questions.map((item) => html`<p class="qitem">${item}</p>`)}
        <span id="final" class="text-light"></span>
        <span id="interim" class="text-secondary"></span>
      </div>
    `;
  }
  gameInterval = null;
  disabled() {
    return this.game.value.play || this.game.value.round == 0 ? "disabled" : "";
  }
  updateCountry() {
    var select_dialect = this.shadowRoot.querySelector(
      "#select_dialect"
    ) as HTMLSelectElement;

    var select_language = this.shadowRoot.querySelector(
      "#select_language"
    ) as HTMLSelectElement;

    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
      select_dialect.remove(i);
    }
    var list = languages[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
      select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility =
      list[1].length == 1 ? "hidden" : "visible";

    this.language = select_dialect.value;
  }

  play() {
    this.questions = [];
    this.speechRecognition.start();
    this.gameInterval = setInterval(() => {
      if (this.game.value.round > 0) {
        GameStore.update((val) => {
          val.round = Number(val.round) - 1;
          return val;
        });
      } else {
        clearInterval(this.gameInterval);
        this.speechRecognition.stop();
        GameStore.update((val) => {
          val.play = false;
          return val;
        });
        alert("Round is finished!");
      }
    }, 1000);
  }

  static get styles() {
    return [
      css`
        div[disabled="disabled"] {
          pointer-events: none;
          opacity: 0.4;
        }
        .container {
          /* display: grid;
          grid-template-columns: repeat(2, auto, auto); */
        }
        select {
          background-color: #197764;
          color: #fff;
          font-size: inherit;
          padding: 0.5em;
          padding-right: 2.5em;
          border: 0;
          margin: 0;
          border-radius: 3px;
          text-indent: 0.01px;
          text-overflow: "";
          -webkit-appearance: button;
        }
        button {
          color: #08233e;
          font: 1.4em Futura, ‘Century Gothic’, AppleGothic, sans-serif;
          padding: 14px;

          background-color: #34b3b3;
          border: 1px solid 34b3b3;
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

        .controls {
          margin-top: 0.8em;
        }
        #lbltalk {
          text-align: right;
          color: rgb(255, 255, 255);
          width: 100%;
          margin-bottom: 10px;
          margin-left: 50px;
          font-size: 1.5em;
          animation: animate 1.5s linear infinite;
        }

        @keyframes animate {
          0% {
            opacity: 0;
          }

          50% {
            opacity: 0.7;
          }

          100% {
            opacity: 0;
          }
        }

        .questions {
          /* border: 1px solid gray;
          height: 300px;
          border-radius: 8px; */
          align-items: center;
          text-align: center;
        }
        #interim {
          font-family: "Montserrat";
          font-size: 1.5em;
        }
        .qitem {
          color: black;
          text-align: left;
          width: 98%;
          font-family: "Montserrat";
          font-size: 1.1em;
          background-color: #cfdfdd;
          padding: 10px;
          border-radius: 8px;
          margin: 0.9em;
        }
      `,
    ];
  }
}
