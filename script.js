const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voice");
const btn = document.getElementById("btn");

let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  if (!voices.length) {
    const option = document.createElement("option");
    option.textContent = "Ovozlar yuklanmoqda...";
    option.disabled = true;
    option.selected = true;
    voiceSelect.appendChild(option);
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  const preferredIndex = voices.findIndex((voice) =>
    ["uz-UZ", "tr-TR", "ru-RU", "en-US"].includes(voice.lang)
  );

  voiceSelect.selectedIndex = preferredIndex >= 0 ? preferredIndex : 0;
}

loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

btn.addEventListener("click", () => {
  const text = textInput.value.trim();

  if (!text) {
    textInput.focus();
    return;
  }

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const speech = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];

  if (selectedVoice) {
    speech.voice = selectedVoice;
    speech.lang = selectedVoice.lang;
  }

  speech.rate = 1;
  speech.pitch = 1;

  speech.onstart = () => {
    btn.textContent = "Gapiryapti...";
    btn.disabled = true;
  };

  speech.onend = () => {
    btn.textContent = "Ovoz chiqarish";
    btn.disabled = false;
  };

  speech.onerror = () => {
    btn.textContent = "Ovoz chiqarish";
    btn.disabled = false;
  };

  speechSynthesis.speak(speech);
});
