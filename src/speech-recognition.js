export default function init(language) {
  if ("webkitSpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition();
    let final_transcript = "";

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = language;

    return speechRecognition;
  } else {
    alert("Speech Recognition Not Available In Your Browser");
  }
}
