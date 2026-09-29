/* Result artwork is independent of the jailbreak payloads. */
(function () {
  function ready() {
    var message = document.getElementById("msgs");
    if (!message || !window.MutationObserver) return;
    var shown = false;
    var overlay = document.createElement("div");
    overlay.id = "result-image-overlay";
    var picture = document.createElement("img");
    picture.alt = "Jailbreak result";
    overlay.appendChild(picture);
    var caption = document.createElement("p");
    caption.className = "result-caption";
    overlay.appendChild(caption);
    var visible = false;
    var padTimer = null;
    var previousButtons = {};
    function dismiss(event) {
      if (!visible) return;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      visible = false;
      overlay.style.display = "none";
      if (padTimer !== null) window.clearInterval(padTimer);
      padTimer = null;
    }
    function pollPads(initial) {
      var getter = navigator.getGamepads || navigator.webkitGetGamepads;
      if (!getter) return;
      var pads;
      try { pads = getter.call(navigator) || []; } catch (e) { return; }
      for (var i = 0; i < pads.length; i++) {
        if (!pads[i]) continue;
        for (var j = 0; j < pads[i].buttons.length; j++) {
          var button = pads[i].buttons[j];
          var pressed = typeof button === "number" ? button > 0.5 : button.pressed || button.value > 0.5;
          var key = i + ":" + j;
          if (!initial && pressed && previousButtons[key] === false) {
            dismiss();
            return;
          }
          previousButtons[key] = !!pressed;
        }
      }
    }
    document.addEventListener("keydown", dismiss, true);
    document.addEventListener("click", dismiss, true);
    document.body.appendChild(overlay);

    function show(kind) {
      if (shown) return;
      shown = true;
      overlay.className = kind === "feil" ? "result-failure" : "result-success";
      caption.textContent = kind === "feil" ? "Jailbreak Failed" : "GoldHEN Loaded Successfully";
      var count = 20;
      var number = Math.floor(Math.random() * count) + 1;
      picture.onload = function () {
        overlay.style.display = "flex";
        visible = true;
        previousButtons = {};
        pollPads(true);
        padTimer = window.setInterval(function () { pollPads(false); }, 80);
      };
      picture.onerror = function () { shown = false; };
      picture.src = "result-images/" + kind + "/" + number + ".jpg";
    }
    function inspect() {
      var t = message.textContent || "";
      if (/GoldHEN\s+(?:v[\w.]+\s+)?Loaded(?:\s+Successfully)?/i.test(t)) {
        show("susec");
      } else if (/Failed to Load|Content not Found/i.test(t)) {
        show("feil");
      }
    }
    var observer = new window.MutationObserver(inspect);
    observer.observe(message, { childList:true, characterData:true, subtree:true });
    inspect();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
