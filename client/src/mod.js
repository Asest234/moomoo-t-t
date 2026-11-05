console.log("MOD DOSYASI YÜKLENDİ VE ÇALIŞIYOR!");
(function () {
    "use strict";

    function runMod() {
        if (window.__modExecuted) return;
        
        // Isuzuma ry'aho umukino ugeze kugira ngo utegereze ko ufunguka neza
        if (!document.body || (!document.getElementById("gameUI") && !document.getElementById("enterGame"))) {
            setTimeout(runMod, 50);
            return;
        }

        window.__modExecuted = true;
 // Karartma katmanını body'ye bağımsız olarak ekleyelim ki menüde de kalsın
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

        if (document.getElementById("show_key_container")) return;

        let storage = null;
        try {
            storage = JSON.parse(localStorage.getItem("showKeys&Mouse"));
        } catch (e) {}

        if (!storage) {
            storage = {
                keys: ["Q", "F", "V", "1", "2", "3"],
                cps: true,
                maxCps: true,
                mouse: 100,
                space: 7,
                container: 270
            };
            try { localStorage.setItem("showKeys&Mouse", JSON.stringify(storage)); } catch(e){}
        }

        const DIV = `
            <style>
                #show_key_menu {
                    background-color: rgba(0, 0, 0, 0.85);
                    width: fit-content;
                    height: fit-content;
                    pointer-events: all;
                    color: white;
                    padding: 20px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 999999;
                    border-radius: 8px;
                }
                .show_key_inputs {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-end;
                    margin-bottom: 10px;
                }
                .show_key_inputs > * { font-size: 24px; }
                .show_key_inputs > input[type="number"], .show_key_inputs > input[type="text"] {
                    width: 100px;
                    padding: 6px;
                    border: none;
                    outline: none;
                    box-sizing: border-box;
                    color: #4A4A4A;
                    background-color: #e5e3e3;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .show_key_inputs > input[type="checkbox"] { align-self: center; }
                .show_key_inputs > label { margin-left: 10px; }
                .show_key_inputs > div {
                    margin-left: 10px;
                    text-align: center;
                    padding: 6px 10px;
                    box-sizing: border-box;
                    width: fit-content;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #add_key { background-color: #8ecc51; }
                #remove_key { background-color: #cc5151; }
                #add_key:hover { background-color: #6a983f; }
                #remove_key:hover { background-color: #983f3f; }
                #show_key_container {
                    position: absolute;
                    left: 15px;
                    bottom: 210px;
                    z-index: 99;
                    pointer-events: none;
                }
                .keys {
                    width: 50px;
                    height: 45px;
                    margin: 5px;
                    padding: 2px 10px;
                    border: 2px solid white;
                    color: white;
                    text-align: center;
                    font-size: 25px;
                    line-height: 45px;
                    box-sizing: border-box;
                }
                .keys.active { color: black; background: white; }
                #keys { display: flex; flex-wrap: wrap; align-content: start; width: ${storage.container}px; }
                #fast { display: flex; margin-bottom: 10px; margin-left: 5px; align-items: center; }
                
                #mouseContainer {
                    width: 65px;
                    height: 94px;
                    display: ${storage.mouse > 0 ? "block" : "none"};
                    position: relative;
                }
                #mouse {
                    display: flex;
                    width: 65px;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    transform-origin: top left;
                    transform: scale(${storage.mouse / 100});
                }
                #mouse_0 { flex-basis: 24px; height: 50px; border-radius: 100px 10px 10px 10px; border: 2px solid white; }
                #mouse_1 { flex-basis: 4px; height: 50px; border-radius: 10px; border: 2px solid white; }
                #mouse_2 { flex-basis: 24px; height: 50px; border-radius: 10px 100px 10px 10px; border: 2px solid white; }
                #mouse_bottom { margin-top: 1px; flex-basis: 100%; height: 34px; border-radius: 10px 10px 100px 100px; border: 2px solid white; }
                .active2 { background: white; }

                #cpsDisplay, #maxCpsDisplay {
                    position: initial;
                    padding-right: 10px;
                    width: fit-content;
                    height: fit-content;
                    text-align: left;
                    margin-bottom: 10px;
                    margin-left: 5px;
                    color: white;
                    text-shadow: 2px 2px 2px rgba(0,0,0,0.5);
                }
            </style>
            
            <div id="show_key_menu" style="display: none">
                <div class="show_key_inputs">
                    <input id="mouse_size" type="number" value="${storage.mouse}" min="0" onchange="window.changeShowKeyMouseProperty('mouse', parseFloat(this.value))">
                    <label for="mouse_size">Mouse Size</label>
                </div>
                <div class="show_key_inputs">
                    <input id="spacebar_size" type="number" value="${storage.space}" onchange="window.changeShowKeyMouseProperty('space', parseInt(this.value))" max="20" min="0">
                    <label for="spacebar_size">Spacebar Size</label>
                </div>
                <div class="show_key_inputs">
                    <input id="container_size" type="number" value="${storage.container}" min="0" onchange="window.changeShowKeyMouseProperty('container', parseFloat(this.value))">
                    <label for="container_size">Container Size</label>
                </div>
                <div class="show_key_inputs">
                    <input id="show_cps" type="checkbox" ${storage.cps ? "checked" : ""} onchange="window.changeShowKeyMouseProperty('cps', this.checked)">
                    <label for="show_cps">CPS</label>
                </div>
                <div class="show_key_inputs">
                    <input id="show_maxcps" type="checkbox" ${storage.maxCps ? "checked" : ""} onchange="window.changeShowKeyMouseProperty('maxCps', this.checked)">
                    <label for="show_maxcps">MAX CPS</label>
                </div>
                <div class="show_key_inputs">
                    <input id="enter_key" type="text" maxlength="1" placeholder="Enter Key" style="width: 200px; text-align: center;">
                    <div id="add_key" onclick="window.addKey_ShowKeyMouse()"><span>Add</span></div>
                    <div id="remove_key" onclick="window.removeKey_ShowKeyMouse()"><span>Remove</span></div>
                </div>
            </div>
            <div id="show_key_container">
                <div id="fast">
                    <div id="mouseContainer">
                        <div id="mouse">
                            <div id="mouse_0"></div>
                            <div id="mouse_1"></div>
                            <div id="mouse_2"></div>
                            <div id="mouse_bottom"></div>
                        </div>
                    </div>
                    <div class="keys" id="key_Space" style="margin-left: ${storage.mouse > 0 ? 10 : 0}px; width: fit-content; display: ${storage.space > 0 ? "block" : "none"}">_______</div>
                </div>
                <div id="cpsDisplay" class="resourceDisplay" style="display: ${storage.cps ? "block" : "none"}">CPS: 0</div>
                <div id="maxCpsDisplay" class="resourceDisplay" style="display: ${storage.maxCps ? "block" : "none"}">MAX CPS: 0</div>
                <div id="keys" style="display: ${storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex"}; width: ${storage.container}px"></div>
            </div>
        `;

        const targetParent = document.getElementById("gameUI") || document.body;
        const container = document.createElement("div");
        container.innerHTML = DIV;
        targetParent.appendChild(container);

        storage.keys.forEach((key) => {
            const element = document.createElement("div");
            element.id = `key_${key}`;
            element.className = "keys";
            element.textContent = key;
            const keysContainer = document.getElementById("keys");
            if (keysContainer) keysContainer.appendChild(element);
        });

        window.changeShowKeyMouseProperty = (id, value) => {
            storage[id] = value;
            try { localStorage.setItem("showKeys&Mouse", JSON.stringify(storage)); } catch(e){}
            const mC = document.getElementById("mouseContainer");
            const kS = document.getElementById("key_Space");
            const mE = document.getElementById("mouse");
            const cD = document.getElementById("cpsDisplay");
            const mcD = document.getElementById("maxCpsDisplay");
            const kE = document.getElementById("keys");

            if (mC) mC.style.display = storage.mouse > 0 ? "block" : "none";
            if (kS) {
                kS.style.marginLeft = `${storage.mouse > 0 ? 10 : 0}px`;
                kS.textContent = "_".repeat(storage.space);
                kS.style.display = storage.space > 0 ? "block" : "none";
            }
            if (mE) mE.style.transform = `scale(${storage.mouse / 100})`;
            if (cD) cD.style.display = storage.cps ? "block" : "none";
            if (mcD) mcD.style.display = storage.maxCps ? "block" : "none";
            if (kE) {
                kE.style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex";
                kE.style.width = `${storage.container}px`;
            }
        };

        window.addKey_ShowKeyMouse = () => {
            const input = document.getElementById("enter_key");
            if (!input || !input.value) return;
            const key = input.value.toUpperCase();
            let element = document.getElementById(`key_${key}`);
            if (element == null) {
                element = document.createElement("div");
                element.id = `key_${key}`;
                element.className = "keys";
                element.textContent = key;
                const keysContainer = document.getElementById("keys");
                if (keysContainer) keysContainer.appendChild(element);
                storage.keys.push(key);
                try { localStorage.setItem("showKeys&Mouse", JSON.stringify(storage)); } catch(e){}
            }
        };

        window.removeKey_ShowKeyMouse = () => {
            const input = document.getElementById("enter_key");
            if (!input || !input.value) return;
            const key = input.value.toUpperCase();
            const element = document.getElementById(`key_${key}`);
            if (element != null) {
                element.remove();
                const index = storage.keys.indexOf(key);
                if (index > -1) {
                    storage.keys.splice(index, 1);
                    try { localStorage.setItem("showKeys&Mouse", JSON.stringify(storage)); } catch(e){}
                }
                const kE = document.getElementById("keys");
                if (kE) kE.style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex";
            }
        };

        let currentCps = 0;
        let maxCps = 0;
        let spaceDown = false;

        function addCPS() {
            currentCps++;
            const cpsEl = document.getElementById("cpsDisplay");
            if (cpsEl) cpsEl.innerText = `CPS: ${currentCps}`;
            if (currentCps > maxCps) {
                maxCps = currentCps;
                const maxCpsEl = document.getElementById("maxCpsDisplay");
                if (maxCpsEl) maxCpsEl.innerText = `MAX CPS: ${maxCps}`;
            }
            setTimeout(() => {
                currentCps--;
                if (cpsEl) cpsEl.innerText = `CPS: ${currentCps}`;
            }, 1000);
        }

        window.addEventListener("keydown", (event) => {
            if (event.code === "Backslash") {
                const menu = document.getElementById("show_key_menu");
                if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
            } else if (event.code === "Space") {
                if (!spaceDown) {
                    spaceDown = true;
                    const keyDiv = document.getElementById(`key_Space`);
                    if (keyDiv && !keyDiv.classList.contains("active")) keyDiv.classList.add("active");
                    addCPS();
                }
            } else {
                if (event.key && document.activeElement.tagName !== "INPUT") {
                    const keyDiv = document.getElementById(`key_${event.key.toUpperCase()}`);
                    if (keyDiv && !keyDiv.classList.contains("active")) keyDiv.classList.add("active");
                }
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.code === "Space") {
                spaceDown = false;
                const keyDiv = document.getElementById(`key_Space`);
                if (keyDiv && keyDiv.classList.contains("active")) keyDiv.classList.remove("active");
            } else {
                if (event.key) {
                    const keyDiv = document.getElementById(`key_${event.key.toUpperCase()}`);
                    if (keyDiv && keyDiv.classList.contains("active")) keyDiv.classList.remove("active");
                }
            }
        });

        window.addEventListener("mousedown", (event) => {
            if ([0, 1, 2].includes(event.button)) addCPS();
            let mouseDiv = document.getElementById(`mouse_${event.button}`);
            if (mouseDiv && !mouseDiv.classList.contains("active2")) {
                mouseDiv.classList.add("active2");
            }
        });

        window.addEventListener("mouseup", (event) => {
            let mouseDiv = document.getElementById(`mouse_${event.button}`);
            if (mouseDiv && mouseDiv.classList.contains("active2")) {
                mouseDiv.classList.remove("active2");
            }
        });

        // Dark Visuals Theme
        const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
        const setPlaceholder = (id, val) => { const el = document.getElementById(id); if (el) el.placeholder = val; };

        setHTML('enterGame', 'Play');
        setHTML('loadingText', '');
        setHTML('gameName', '');
        setPlaceholder('nameInput', '');
        setPlaceholder('chatBox', '');

        const elementsToRemove = [
            "#adCard", "#errorNotification", "#promoImg", "#youtuberOf", "#followText",
            "#promoImgHolder", "#twitterFollow", "#joinPartyButton", "#linksContainer2",
            "#partyButton", "#youtubeFollow", "#adBlock", "#mobileInstructions",
            "#downloadButtonContainer", "#mobileDownloadButtonContainer", ".downloadBadge",
            "#ot-sdk-btn-floating", "#pre-content-container", "#diedText", "#desktopInstructions",
            ".menuText", ".menuHeader", ".menuLink"
        ];
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        const chatBtn = document.getElementById('chatButton');
        if (chatBtn) chatBtn.style.display = 'none';

        const setupCard = document.getElementById('setupCard');
        if (setupCard) setupCard.style.cssText += "box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4); background-color: #181818;";

        const guideCard = document.getElementById('guideCard');
        if (guideCard) guideCard.style.cssText += "box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4); background-color: #181818;";
    }

    // Otomatik tetikleyici: Oyun arayüzü veya body geldiği an hatasız çalıştırır
    const watchdog = setInterval(() => {
        if (document.body || document.getElementById("gameUI")) {
            clearInterval(watchdog);
            if (document.readyState === "complete" || document.readyState === "interactive") {
                setTimeout(initMod, 50);
            } else {
                window.addEventListener("DOMContentLoaded", initMod);
                window.addEventListener("load", initMod);
            }
        }
    }, 10);
})();

    }

    // Uburyo bwo gukurikirana niba umukino wamaze kwikingura (bituma ikora itiriwe isaba F12)
    const watchdog = setInterval(() => {
        if (document.body) {
            clearInterval(watchdog);
            setTimeout(runMod, 100);
        }
    }, 10);
})();
