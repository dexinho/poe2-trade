(function () {
  console.log("PoE Trade Auto-Whisper extension loaded 2.0");

  const whisperCooldown = 3000;
  const localStorageKey = "poe_auto_whisper_last_click";

  function getLastWhisperTime() {
    return parseInt(localStorage.getItem(localStorageKey) || "0", 10);
  }

  function updateLastWhisperTime() {
    localStorage.setItem(localStorageKey, Date.now().toString());
  }

  function checkAndClickButtons() {
    const isScriptEnabled = localStorage.getItem("is_script_enabled");
    if (isScriptEnabled !== "true") return;

    const now = Date.now();
    const lastWhisperTime = getLastWhisperTime();
    if (now - lastWhisperTime < whisperCooldown) {
      return;
    }

    const whisperButtons = document.querySelectorAll("button.direct-btn");
    const plusSpan = document.querySelector("span.plus");
    let maxWhisperClicks = 2;

    if (plusSpan) {
      const textSpan = plusSpan.nextElementSibling;
      if (textSpan && textSpan.textContent === "Activate Live Search") return;
    }

    for (const button of whisperButtons) {
      if (typeof button.dataset.clickCount !== "number")
        button.dataset.clickCount = 1;

      if (Number(button.dataset.clickCount) === maxWhisperClicks) break;
      if (Number(button.dataset.clickCount) < maxWhisperClicks) {
        
        try {
          button.click();
          button.dataset.clickCount++;
          updateLastWhisperTime();
          break;
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  setInterval(checkAndClickButtons, 2000);
})();
