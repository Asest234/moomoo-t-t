window.__modExecuted = true;
console.log("MOD DOSYASI BASARIYLA CALISTI!");

(function () {
    "use strict";

    // Karartma katmanını canvas yerine saf CSS (GPU hızlandırmalı) ile yapıyoruz, böylece MS/ping artmaz.
    if (!document.getElementById("customVignette")) {
        const vignette = document.createElement("div");
        vignette.id = "customVignette";
        vignette.innerHTML = `
            <style>
                #customVignette {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    pointer-events: none !important;
                    z-index: 999998 !important;
                    background: radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.9) 100%) !important;
                }
            </style>
        `;
        document.body.appendChild(vignette);
    }

    // Elementlerin yüklenmesi için küçük bir gecikme verip ekrana basalım
    setTimeout(() => {
        if (!document.getElementById("show_key_container")) {
            const container = document.createElement("div");
            container.id = "show_key_container";
            container.style.cssText = "position: absolute; left: 15px; bottom: 210px; z-index: 99; pointer-events: none;";
            container.innerHTML = `
                <div id="cpsDisplay" style="color: white; text-shadow: 2px 2px 2px rgba(0,0,0,0.5); margin-bottom: 5px;">CPS: 0</div>
                <div id="maxCpsDisplay" style="color: white; text-shadow: 2px 2px 2px rgba(0,0,0,0.5);">MAX CPS: 0</div>
            `;
            document.body.appendChild(container);
        }

        const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
        setHTML('enterGame', 'Play');

        const elementsToRemove = ["#adCard", "#errorNotification", "#promoImg", "#youtuberOf", "#followText"];
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        console.log("MOD ELEMANLARI BAŞARIYLA YÜKLENDİ!");
    }, 500);

})();
