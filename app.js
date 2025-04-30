(function () {
  console.log("PoE Trade Auto-Whisper extension loaded 2.0");

  const whisperCooldown = 3000;
  const localStorageKey = "poe_auto_whisper_last_click";
  const whisperedListings = new Set();

  function getLastWhisperTime() {
    return parseInt(localStorage.getItem(localStorageKey) || "0", 10);
  }

  function updateLastWhisperTime() {
    localStorage.setItem(localStorageKey, Date.now().toString());
  }

  function checkAndClickButtons() {
    const now = Date.now();
    const lastWhisperTime = getLastWhisperTime();
    if (now - lastWhisperTime < whisperCooldown) {
      return;
    }

    const whisperButtons = document.querySelectorAll("button.direct-btn");
    const plusSpan = document.querySelector("span.plus");

    if (plusSpan) {
      const textSpan = plusSpan.nextElementSibling;
      if (textSpan && textSpan.textContent === "Activate Live Search") return;
    }

    for (const button of whisperButtons) {
      const listingId = button.closest("[data-id]")?.dataset.id;
      const isScriptEnabled = localStorageKey.getItem('is_script_enabled') 

      if (!button.dataset.autoClicked && listingId && !whisperedListings.has(listingId) && isScriptEnabled === 'true') {
        button.click();
        button.dataset.autoClicked = "true";
        whisperedListings.add(listingId);
        updateLastWhisperTime();
        console.log(`✅ Whispered listing ${listingId}`);
        break; 
      }
    }
  }

  const observer = new MutationObserver(() => {
    checkAndClickButtons();
  });

  function startObserver() {
    const container = document.querySelector("#trade");
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
      console.log("✅ Observer is watching #trade...");
    } else {
      console.error("❌ Could not find the #trade container");
      setTimeout(startObserver, 2000);
    }
  }

  startObserver();
  setInterval(checkAndClickButtons, 1000);
})();
