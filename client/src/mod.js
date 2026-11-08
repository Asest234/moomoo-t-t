console.log("Mod yuklendi");)
window.__modExecuted = true;
console.log("MOD DOSYASI BASARIYLA CALISTI!");
(function () {
    "use strict";

    window.__modExecuted = true;

    // Karartma katmanını hemen ekleyelim
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

    let storage = {
        keys: ["Q", "F", "V", "1", "2", "3"],
        cps: true,
        maxCps: true,
        mouse: 100,
        space: 7,
        container: 270
    };

    const DIV = `
        <div id="show_key_container" style="position: absolute; left: 15px; bottom: 210px; z-index: 99; pointer-events: none;">
            <div id="cpsDisplay" style="color: white; text-shadow: 2px 2px 2px rgba(0,0,0,0.5); margin-bottom: 5px;">CPS: 0</div>
            <div id="maxCpsDisplay" style="color: white; text-shadow: 2px 2px 2px rgba(0,0,0,0.5);">MAX CPS: 0</div>
        </div>
    `;

    // Elementlerin yüklenmesi için küçük bir gecikme verip ekrana basalım
    setTimeout(() => {
        if (!document.getElementById("show_key_container")) {
            const container = document.createElement("div");
            container.innerHTML = DIV;
            document.body.appendChild(container);
        }

        // Metinleri ve gereksiz elementleri temizleme
        const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
        setHTML('enterGame', 'Play');

        const elementsToRemove = ["#adCard", "#errorNotification", "#promoImg", "#youtuberOf", "#followText"];
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        console.log("MOD ELEMANLARI BAŞARIYLA YÜKLENDİ!");
    }, 500);

})();
