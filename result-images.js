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
    document.body.appendChild(overlay);

    function show(kind) {
      if (shown) return;
      shown = true;
      var count = 20;
      var number = Math.floor(Math.random() * count) + 1;
      picture.onload = function () { overlay.style.display = "flex"; };
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
