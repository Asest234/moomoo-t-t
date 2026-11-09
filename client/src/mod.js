window.__modExecuted = true;
console.log("MOD DOSYASI BASARIYLA CALISTI!");

(function () {
    "use strict";

    // 1. Karartma katmanı (GPU hızlandırmalı saf CSS - MS / ping artırmaz)
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

    // 2. Tuş ve Mouse CPS Overlay & Ayarlar Menüsü
    window.showKeys = true;

    let storage = JSON.parse(localStorage.getItem("showKeys&Mouse"));
    if (storage == null) {
        storage = {
            keys: ["Q", "F", "V", "1", "2", "3"],
            cps: true,
            maxCps: true,
            mouse: 100,
            space: 7,
            container: 270
        };
        localStorage.setItem("showKeys&Mouse", JSON.stringify(storage));
    }

    function initKeysAndMouse() {
        const gameUI = document.getElementById("gameUI") || document.body;
        if (!gameUI || document.getElementById("show_key_container")) return;

        const DIV = `
            <style>
                #show_key_menu {
                    background-color: rgba(0, 0, 0, 0.4);
                    width: fit-content;
                    height: fit-content;
                    pointer-events: all;
                    color: white;
                    padding: 20px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 99999;
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

                /* İSTEDİĞİN KALINLIKTA ÇİZGİLER (4px) */
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
                    border: 4px solid rgba(255, 255, 255, 0.85);
                    color: white;
                    text-align: center;
                    font-size: 25px;
                    line-height: 41px;
                    box-sizing: border-box;
                    text-shadow: 2px 2px 2px rgba(0,0,0,0.5);
                }
                .keys.active {
                    color: black;
                    background: white;
                    border-color: white;
                }
                #keys {
                    display: flex;
                    flex-wrap: wrap;
                    align-content: start;
                    width: 300px;
                }
                #fast {
                    display: flex;
                    margin-bottom: 10px;
                    margin-left: 5px;
                    align-items: center;
                }

                /* MOUSE ÇİZGİLERİ (4px) */
                #mouseContainer {
                    width: 65px;
                    height: 94px;
                }
                #mouse {
                    display: flex;
                    width: 65px;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    transform-origin: 0 0;
                }
                #mouse_0 {
                    flex-basis: 24px;
                    height: 50px;
                    border-radius: 100px 10px 10px 10px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                }
                #mouse_1 {
                    flex-basis: 6px;
                    height: 50px;
                    border-radius: 10px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                }
                #mouse_2 {
                    flex-basis: 24px;
                    height: 50px;
                    border-radius: 10px 100px 10px 10px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                }
                #mouse_bottom {
                    margin-top: 1px;
                    flex-basis: 100%;
                    height: 34px;
                    border-radius: 10px 10px 100px 100px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                }
                .active2 {
                    background: white;
                }

                /* CPS VE MAX CPS */
                #cpsDisplay, #maxCpsDisplay {
                    position: initial;
                    padding-right: 10px;
                    width: fit-content;
                    height: fit-content;
                    text-align: left;
                    margin-bottom: 10px;
                    margin-left: 5px;
                    color: white;
                    background-color: rgba(0, 0, 0, 0.35);
                    text-shadow: 2px 2px 2px rgba(0,0,0,0.5);
                }
            </style>
            <div id="show_key_menu" style="display: none">
                <div class="show_key_inputs">
                    <input id="mouse_size" type="number" value="${storage.mouse}" min="0" onchange="changeShowKeyMouseProperty('mouse', parseFloat(this.value))">
                    <label for="mouse_size">Mouse Size</label>
                </div>
                <div class="show_key_inputs">
                    <input id="spacebar_size" type="number" value="${storage.space}" oninput="this.value = Math.round(this.value)" onchange="changeShowKeyMouseProperty('space', parseInt(this.value))" max="20" min="0">
                    <label for="spacebar_size">Spacebar Size</label>
                </div>
                <div class="show_key_inputs">
                    <input id="container_size" type="number" value="${storage.container}" min="0" onchange="changeShowKeyMouseProperty('container', parseFloat(this.value))">
                    <label for="container_size">Container Size</label>
                </div>
                <div class="show_key_inputs">
                    <input id="show_cps" type="checkbox" ${storage.cps ? "checked" : ""} onchange="changeShowKeyMouseProperty('cps', this.checked)">
                    <label for="show_cps">CPS</label>
                </div>
                <div class="show_key_inputs">
                    <input id="show_maxcps" type="checkbox" ${storage.maxCps ? "checked" : ""} onchange="changeShowKeyMouseProperty('maxCps', this.checked)">
                    <label for="show_maxcps">MAX CPS</label>
                </div>
                <div class="show_key_inputs">
                    <input id="enter_key" type="text" maxlength="1" placeholder="Enter Key" style="width: 200px; text-align: center;">
                    <div id="add_key" onclick="addKey_ShowKeyMouse()"><span>Add</span></div>
                    <div id="remove_key" onclick="removeKey_ShowKeyMouse()"><span>Remove</span></div>
                </div>
            </div>
            <div id="show_key_container">
                <div id="fast">
                    <div id="mouseContainer" style="display: ${storage.mouse > 0 ? "block" : "none"}; width: ${65 * (storage.mouse / 100)}px; height: ${94 * (storage.mouse / 100)}px">
                        <div id="mouse" style="transform: scale(${storage.mouse}%)">
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

        const container = document.createElement("div");
        container.innerHTML = DIV;
        gameUI.appendChild(container);

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
            localStorage.setItem("showKeys&Mouse", JSON.stringify(storage));
            document.getElementById("mouseContainer").style.width = `${65 * (storage.mouse / 100)}px`;
            document.getElementById("mouseContainer").style.height = `${94 * (storage.mouse / 100)}px`;
            document.getElementById("mouseContainer").style.display = storage.mouse > 0 ? "block" : "none";
            document.getElementById("key_Space").style.marginLeft = `${storage.mouse > 0 ? 10 : 0}px`;
            document.getElementById("mouse").style.transform = `scale(${storage.mouse}%)`;
            document.getElementById("key_Space").textContent = "_".repeat(storage.space);
            document.getElementById("key_Space").style.display = storage.space > 0 ? "block" : "none";
            document.getElementById("cpsDisplay").style.display = storage.cps ? "block" : "none";
            document.getElementById("maxCpsDisplay").style.display = storage.maxCps ? "block" : "none";
            document.getElementById("keys").style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex";
            document.getElementById("keys").style.width = `${storage.container}px`;
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
                document.getElementById("keys").appendChild(element);
                storage.keys.push(key);
                localStorage.setItem("showKeys&Mouse", JSON.stringify(storage));
            }
        };

        window.removeKey_ShowKeyMouse = async () => {
            const input = document.getElementById("enter_key");
            if (!input || !input.value) return;
            const key = input.value.toUpperCase();
            const element = document.getElementById(`key_${key}`);
            if (element != null) {
                element.remove();
                const index = storage.keys.indexOf(key);
                if (index > -1) {
                    storage.keys.splice(index, 1);
                    localStorage.setItem("showKeys&Mouse", JSON.stringify(storage));
                }
                document.getElementById("keys").style.display = storage.container <= 0 || storage.keys.length == 0 ? "none" : "flex";
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

        function keysActive() {
            const allianceMenu = document.getElementById("allianceMenu");
            const chatHolder = document.getElementById("chatHolder");
            const isAllianceOpen = allianceMenu && allianceMenu.style.display === "block";
            const isChatOpen = chatHolder && chatHolder.style.display === "block";
            return !isAllianceOpen && !isChatOpen;
        }

        window.addEventListener("keydown", (event) => {
            if (keysActive()) {
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
                const keyDiv = document.getElementById(`key_${event.key.toUpperCase()}`);
                if (keyDiv && keyDiv.classList.contains("active")) keyDiv.classList.remove("active");
            }
        });

        const touchControls = document.getElementById("touch-controls-fullscreen") || document;
        touchControls.addEventListener("mousedown", (event) => {
            if ([0, 1, 2].includes(event.button)) {
                addCPS();
            }
            let mouseDiv = document.getElementById(`mouse_${event.button}`);
            if (mouseDiv && !mouseDiv.classList.contains("active2")) {
                mouseDiv.classList.add("active2");
            }
        });

        touchControls.addEventListener("mouseup", (event) => {
            let mouseDiv = document.getElementById(`mouse_${event.button}`);
            if (mouseDiv && mouseDiv.classList.contains("active2")) {
                mouseDiv.classList.remove("active2");
            }
        });
    }

    // 3. Oyun elementlerinin yüklenmesini bekleyip otomatik başlatma
    setTimeout(() => {
        initKeysAndMouse();

        const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
        setHTML('enterGame', 'Play');

        const elementsToRemove = ["#adCard", "#errorNotification", "#promoImg", "#youtuberOf", "#followText"];
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        console.log("MOD ELEMANLARI BAŞARIYLA YÜKLENDİ!");
    }, 500);

})();
