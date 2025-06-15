(function () {
  console.log("PoE Trade Auto-Whisper");
  console.log(
    "poe_trade_direct_whisper = ",
    localStorage.getItem("poe_trade_direct_whisper")
  );
  console.log(
    "poe_trade_copy_whisper = ",
    localStorage.getItem("poe_trade_copy_whisper")
  );

  const whisperCooldown = 3000;

  const whisperLimits = {
    perMinute: 15,
    per10Minutes: 75,
    perHour: 150,
    per12Hours: 600,
  };

  function getWhisperLog() {
    try {
      const log = JSON.parse(
        localStorage.getItem("poe_trade_whisper_log") || "[]"
      );
      const now = Date.now();
      return log.filter((ts) => now - ts < 12 * 60 * 60 * 1000);
    } catch (e) {
      return [];
    }
  }

  function canWhisper() {
    const now = Date.now();
    const log = getWhisperLog();

    const countLastMinute = log.filter((ts) => now - ts < 60 * 1000).length;
    const countLast10Min = log.filter((ts) => now - ts < 10 * 60 * 1000).length;
    const countLastHour = log.filter((ts) => now - ts < 60 * 60 * 1000).length;
    const countLast12Hours = log.length;

    return (
      countLastMinute < whisperLimits.perMinute &&
      countLast10Min < whisperLimits.per10Minutes &&
      countLastHour < whisperLimits.perHour &&
      countLast12Hours < whisperLimits.per12Hours
    );
  }

  function logWhisperTime() {
    const log = getWhisperLog();
    log.push(Date.now());
    localStorage.setItem("poe_trade_whisper_log", JSON.stringify(log));
  }

  function getLastWhisperTime() {
    return parseInt(localStorage.getItem("poe_trade_last_click") || "0", 10);
  }

  function updateLastWhisperTime() {
    localStorage.setItem("poe_trade_last_click", Date.now().toString());
  }

  function checkAndClickButtons() {
    const toDirectWhisper = localStorage.poe_trade_direct_whisper;

    if (!canWhisper()) return;

    const whisperButtons = document.querySelectorAll("button.direct-btn");
    const plusSpan = document.querySelector("span.plus");

    if (plusSpan) {
      const textSpan = plusSpan.nextElementSibling;
      if (textSpan && textSpan.textContent === "Activate Live Search") return;
    }

    for (const whisperButton of whisperButtons) {
      const now = Date.now();
      const lastWhisperTime = getLastWhisperTime();
      if (now - lastWhisperTime < whisperCooldown) return;

      const toCopyWhisper =
        localStorage.getItem("poe_trade_copy_whisper") || false;

      if (toCopyWhisper === "true") {
        const dropdownButton = document.querySelector(
          'button.btn.btn-xs.btn-default.dropdown-toggle.dropdown-toggle-split[data-bs-toggle="dropdown"]'
        );

        if (dropdownButton) {
          const copyWhisperButton = document.querySelector(
            "button.dropdown-item.btn.btn-xs.btn-default.whisper-btn"
          );

          if (copyWhisperButton) {
            copyWhisperButton.click();
            copyWhisperButton.parentElement.parentElement.remove();
            updateLastWhisperTime();
            console.log(copyWhisperButton);
          } else {
            console.log("Copy Whisper button not found.");
          }
        } else {
          console.log("Dropdown menu not visible.");
        }
      }

      if (toDirectWhisper !== "true") continue;

      whisperButton.click();
      whisperButton.parentElement.remove();
      updateLastWhisperTime();
      logWhisperTime();
      break;
    }
  }

  setInterval(checkAndClickButtons, 1000);
})();
