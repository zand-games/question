import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";
import boot from "./bootstrap";
import languages from "./languages.js";

import speechrecognition from "./speech-recognition.js";
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
const { webkitSpeechRecognition }: IWindow = window as any;

@customElement("play-component")
export class PlayComponent extends LitElement {
  @property()
  questions: Array<string> = [];

  @property()
  language!: string;

  @property()
  speechRecognition: any;

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
  }

  voice_to_text(event) {
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        console.log(this.questions);
        this.questions = [...this.questions, event.results[i][0].transcript];
      } else {
        interim_transcript += event.results[i][0].transcript;
        console.log(event.results[i][0].transcript);
      }
    }
    //document.querySelector("#final").innerHTML = final_transcript;
    this.shadowRoot.querySelector("#interim").innerHTML = interim_transcript;
  }

  render() {
    return html`
      <button @click="${this.record}" id="btnPlay">Play!</button>
      <!-- <label id="lbltalk">Please Talk!</label>
      <div class="texts"></div> -->

      <body class="container pt-5 bg-dark">
        <div class="mt-4" id="div_language">
          <h2 class="mb-3 text-light">Select Language</h2>
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
        <h2 class="mt-4 text-light">Questions</h2>
      </body>
      <div class="questions">
        ${this.questions.map((item) => html`<p class="qitem">${item}</p>`)}
        <span id="final" class="text-light"></span>
        <span id="interim" class="text-secondary"></span>
      </div>
    `;
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

  record() {
    //print("hi there");

    this.speechRecognition.start();
    return;

    const speechRecognition = new webkitSpeechRecognition();
    //  debugger;
    if (speechRecognition) {
      // let speechRecognition: any = new webkitSpeechRecognition();
      let final_transcript = "";

      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      // speechRecognition.lang = (
      //   this.shadowRoot.querySelector("#select_dialect") as HTMLSelectElement
      // ).value;

      speechRecognition.onstart = () => {
        // document.querySelector("#status").style.display = "block";
        console.log("started..");
      };
      speechRecognition.onerror = () => {
        // document.querySelector("#status").style.display = "none";
        console.log("Speech Recognition Error");
      };
      speechRecognition.onend = () => {
        // document.querySelector("#status").style.display = "none";
        console.log("Speech Recognition Ended");
      };

      speechRecognition.onresult = (event) => {
        let interim_transcript = "";
        console.log(event);
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        this.shadowRoot.querySelector("#final").innerHTML = final_transcript;
        this.shadowRoot.querySelector("#interim").innerHTML =
          interim_transcript;
      };

      alert(123);
      //
      // (this.shadowRoot.querySelector("#start") as HTMLButtonElement).onclick =
      //   () => {
      //     console.log("start");
      //     speechRecognition.start();
      //   };
      // document.querySelector("#stop").onclick = () => {
      //   speechRecognition.stop();
      // };
    } else {
      console.log("Speech Recognition Not Available");
    }
  }

  static get styles() {
    return [
      boot,
      css`
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
          border: 1px solid gray;
          height: 300px;
          border-radius: 8px;
        }

        .qitem {
          color: black;
          text-align: left;
          width: 100%;
          background-color: white;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 10px;
        }
      `,
    ];
  }
}
