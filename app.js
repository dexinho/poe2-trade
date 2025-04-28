(function () {
  console.log("PoE Trade Auto-Whisper extension loaded 1.3");

  function checkAndClickButtons() {
    let clickCounter = 0;
    const whisperButtons = document.querySelectorAll("button.direct-btn");
    const plusSpan = document.querySelector("span.plus");

    if (plusSpan) {
      const textSpan = plusSpan.nextElementSibling;

      if (textSpan.textContent === "Activate Live Search") return;
    }

    whisperButtons.forEach((button) => {
      if (clickCounter > 2) return;

      if (!button.dataset.autoClicked) {
        button.click();
        button.dataset.autoClicked = "true";
        clickCounter++;
      }
    });
  }

  checkAndClickButtons();

  const observer = new MutationObserver(() => {
    checkAndClickButtons();
  });

  const container = document.querySelector("#trade");
  if (container) {
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
    console.log("Observer is watching v1.2 #trade...");
  } else {
    console.error("Could not find the #trade container");
    setTimeout(() => {
      const retryContainer = document.querySelector("#trade");
      if (retryContainer) {
        observer.observe(retryContainer, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false,
        });
        console.log("✅ Observer started on retry");
      }
    }, 2000);
  }

  setInterval(checkAndClickButtons, 1000);
})();
