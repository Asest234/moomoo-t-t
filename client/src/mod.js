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

                /* 4px KALINLIĞINDA TUŞLAR */
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

                /* MOUSE ÇİZGİLERİ (DÜZELTİLMİŞ ORANLAR & 4px KALINLIK) */
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
                    flex-basis: 27px;
                    height: 50px;
                    border-radius: 100px 10px 10px 10px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                    box-sizing: border-box;
                }
                #mouse_1 {
                    flex-basis: 11px;
                    height: 50px;
                    border-radius: 10px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                    box-sizing: border-box;
                }
                #mouse_2 {
                    flex-basis: 27px;
                    height: 50px;
                    border-radius: 10px 100px 10px 10px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                    box-sizing: border-box;
                }
                #mouse_bottom {
                    margin-top: 1px;
                    flex-basis: 100%;
                    height: 34px;
                    border-radius: 10px 10px 100px 100px;
                    border: 4px solid rgba(255, 255, 255, 0.85);
                    box-sizing: border-box;
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
(function() {
    const textureReplacements = [
        { test: "shield_1_r.png", replaceWith: "https://i.imgur.com/SNFV2dc.png" },
        { test: "crossbow_1_r.png", replaceWith: "https://i.imgur.com/EVesBtw.png" },
        { test: "bow_1_r.png", replaceWith: "https://i.imgur.com/Oneg3oF.png" },
        { test: "musket_1_r.png", replaceWith: "https://i.imgur.com/jPE54IT.png" },
        { test: "crossbow_2_r.png", replaceWith: "https://i.imgur.com/z4CyaXk.png" },
        { test: "dagger_1_r.png", replaceWith: "https://i.imgur.com/CDAmjux.png" },
        { test: "spear_1_r.png", replaceWith: "https://i.imgur.com/UY7SV7j.png" },
        { test: "great_hammer_1_r.png", replaceWith: "https://i.imgur.com/tmUzurk.png" },
        { test: "hammer_1_r.png", replaceWith: "https://i.imgur.com/oRXUfW8.png" },
        { test: "bat_1_r.png", replaceWith: "https://i.imgur.com/6ayjbIz.png" },
        { test: "great_axe_1_r.png", replaceWith: "https://i.imgur.com/UZ2HcQw.png" },
        { test: "axe_1_r.png", replaceWith: "https://i.imgur.com/kr8H9g7.png" },
        { test: "sword_1_r.png", replaceWith: "https://i.imgur.com/V9dzAbF.png" },
        { test: "stick_1_r.png", replaceWith: "https://i.imgur.com/uTDGDDy.png" },
        { test: "grab_1_g.png", replaceWith: "https://i.imgur.com/DRzBdFX.png" },
        { test: "grab_1_d.png", replaceWith: "https://i.imgur.com/7kbtWfk.png" },
        { test: "grab_1_r.png", replaceWith: "https://i.imgur.com/wV42LEE.png" },
        { test: "crossbow_2_d.png", replaceWith: "https://i.imgur.com/DVjCdwI.png" },
        { test: "musket_1_d.png", replaceWith: "https://i.imgur.com/jwH99zm.png" },
        { test: "bow_1_d.png", replaceWith: "https://i.imgur.com/qu7HHT5.png" },
        { test: "spear_1_d.png", replaceWith: "https://i.imgur.com/HSWcyku.png" },
        { test: "crossbow_1_d.png", replaceWith: "https://i.imgur.com/TRqDlgX.png" },
        { test: "axe_1_d.png", replaceWith: "https://i.imgur.com/OU5os0h.png" },
        { test: "great_axe_1_d.png", replaceWith: "https://i.imgur.com/aAJyHBB.png" },
        { test: "hammer_1_d.png", replaceWith: "https://i.imgur.com/WPWU8zC.png" },
        { test: "great_hammer_1_d.png", replaceWith: "https://i.imgur.com/Fg93gj3.png" },
        { test: "shield_1_d.png", replaceWith: "https://i.imgur.com/hSqLP3t.png" },
        { test: "sword_1_d.png", replaceWith: "https://i.imgur.com/h5jqSRp.png" },
        { test: "sword_1_g.png", replaceWith: "https://i.imgur.com/wOTr8TG.png" },
        { test: "spear_1_g.png", replaceWith: "https://i.imgur.com/jKDdyvc.png" },
        { test: "stick_1_g.png", replaceWith: "https://i.imgur.com/NOaBBRd.png" },
        { test: "stick_1_d.png", replaceWith: "https://i.imgur.com/H5wGqQR.png" },
        { test: "dagger_1_d.png", replaceWith: "https://i.imgur.com/ROTb7Ks.png" },
        { test: "bat_1_g.png", replaceWith: "https://i.imgur.com/ivLPh10.png" },
        { test: "bat_1_d.png", replaceWith: "https://i.imgur.com/phXTNsa.png" },
        { test: "hat_40.png", replaceWith: "https://i.imgur.com/pe3Yx3F.png" },
        { test: "hat_12.png", replaceWith: "https://i.imgur.com/VSUId2s.png" },
        { test: "hat_6.png", replaceWith: "https://i.imgur.com/vM9Ri8g.png" },
        { test: "hat_18.png", replaceWith: "https://i.imgur.com/in5H6vw.png" },
        { test: "access_21.png", replaceWith: "https://i.imgur.com/4ddZert.png" },
        { test: "access_18.png", replaceWith: "https://i.imgur.com/0rmN7L9.png" },
        { test: "access_19.png", replaceWith: "https://i.imgur.com/sULkUZT.png" },
        { test: "hat_9.png", replaceWith: "https://i.imgur.com/gJY7sM6.png" },
        { test: "hat_16.png", replaceWith: "https://i.imgur.com/uYgDtcZ.png" },
        { test: "hat_31.png", replaceWith: "https://i.imgur.com/JPMqgSc.png" },
        { test: "hat_7.png", replaceWith: "https://i.imgur.com/vAOzlyY.png" },
        { test: "hat_15.png", replaceWith: "https://i.imgur.com/YRQ8Ybq.png" },
        { test: "hat_13.png", replaceWith: "https://i.imgur.com/EwkbsHN.png" },
        { test: "hat_11.png", replaceWith: "https://i.imgur.com/yfqME8H.png" },
        { test: "hat_20.png", replaceWith: "https://i.imgur.com/JbUPrtp.png" },
        { test: "hat_11_p.png", replaceWith: "https://i.imgur.com/yfqME8H.png" },
        { test: "hat_14_p.png", replaceWith: "https://i.imgur.com/V8JrIwv.png" },
        { test: "hat_14.png", replaceWith: "https://i.imgur.com/V8JrIwv.png" },
        { test: "hat_14_top.png", replaceWith: "https://i.imgur.com/s7Cxc9y.png" },
        { test: "hat_11_top.png", replaceWith: "https://i.imgur.com/s7Cxc9y.png" },
        { test: "hat_26.png", replaceWith: "https://i.imgur.com/2PsUgEL.png" },
        { test: "hat_52.png", replaceWith: "https://i.imgur.com/hmJrVQz.png" },
        { test: "bull_2.png", replaceWith: "https://i.imgur.com/Qq0ysR4.png" },
        { test: "bull_1.png", replaceWith: "https://i.imgur.com/3tsGyzZ.png" },
        { test: "wolf_1.png", replaceWith: "https://i.imgur.com/zLAZWOH.png" },
        { test: "wolf_2.png", replaceWith: "https://i.imgur.com/hKlpCVS.png" },
        { test: "cow_1.png", replaceWith: "https://i.imgur.com/FycnCNU.png" },
        { test: "pig_1.png", replaceWith: "https://i.imgur.com/QHtrTlY.png" },
        { test: "chicken_1.png", replaceWith: "https://i.imgur.com/UtBEmai.png" },
        { test: "enemy.png", replaceWith: "https://i.imgur.com/Ib6nqTa.png" }
    ];

    const orig = Object.getOwnPropertyDescriptor(Image.prototype, "src");
    Object.defineProperty(Image.prototype, "src", {
        set(l) {
            for (const { test, replaceWith } of textureReplacements) {
                if (l.includes(test)) {
                    l = replaceWith;
                    break;
                }
            }
            orig.set.call(this, l);
        },
        get: orig.get,
        configurable: true
    });
})();
// MooMoo.io Custom Store v1.9.3 Full Fixed & CORS Bypass
;(async () => {
	const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
	win.customStore = true;
	const elementID = (id) => document.getElementById(id);
	const myPlayer = {
		sid: null,
		tails: {},
		skins: {},
		tailIndex: 0,
		skinIndex: 0,
		team: null
	};
	var inGame = true; // Mağazanın ve hatlerin her zaman görünmesi için aktif edildi[cite: 11]
	var alliances = [];
	var alliancePlayers = [];
	var totalAllianceEle = 0;
	var currentAllianceEle = 0;
	let init = false;

	// CORS (cross-origin) hatasını önlemek için Image nesnesini güvenli hale getiriyoruz
	const OrigImage = win.Image;
	win.Image = function() {
		const img = new OrigImage();
		img.crossOrigin = "Anonymous";
		return img;
	};
	win.Image.prototype = OrigImage.prototype;

	await new Promise(async (resolve) => {
		let { send } = WebSocket.prototype;
		WebSocket.prototype.send = function (...x) {
			send.apply(this, x);
			this.send = send;
			if (!init) {
				init = true;
				this.addEventListener("message", (e) => {
					try {
						const [packet, data] = msgpack.decode(new Uint8Array(e.data));
						switch (packet) {
							case "us":
							case 14:
								if (data[2]) {
									if (!data[0]) { myPlayer.tails[data[1]] = 1; } 
									else { myPlayer.tailIndex = data[1]; }
								} else {
									if (!data[0]) { myPlayer.skins[data[1]] = 1; } 
									else { myPlayer.skinIndex = data[1]; }
								}
								if (elementID("storeMenu") && elementID("storeMenu").style.display == "block") {
									generateStoreList();
								}
								break;
							case "is":
							case 1:
								myPlayer.sid = data[0];
								inGame = true;
								break;
							case "pp":
							case 2:
								inGame = true;
								break;
							case "ac":
							case 5:
								alliances.push(data[0]);
								totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length;
								currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5);
								if (elementID("allianceMenu") && elementID("allianceMenu").style.display == "block") {
									showAllianceMenu();
								}
								break;
							case "st":
							case 6:
								myPlayer.team = data[0];
								myPlayer.isOwner = data[1];
								currentAllianceEle = 0;
								totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length;
								if (elementID("allianceMenu") && elementID("allianceMenu").style.display == "block") {
									showAllianceMenu();
								}
								break;
							case "sp":
							case 7:
								alliancePlayers = data[0];
								totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length;
								currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5);
								if (elementID("allianceMenu") && elementID("allianceMenu").style.display == "block") {
									showAllianceMenu();
								}
								break;
							case "dc":
							case 8:
								for (var i = alliances.length - 1; i >= 0; i--) {
									if (alliances[i].sid == data[0]) {
										alliances.splice(i, 1);
										break;
									}
								}
								totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length;
								currentAllianceEle = Math.min(totalAllianceEle - 5, currentAllianceEle + 5);
								if (elementID("allianceMenu") && elementID("allianceMenu").style.display == "block") {
									showAllianceMenu();
								}
								break;
							case "id":
								alliances = data[0].teams || [];
								totalAllianceEle = myPlayer.team != null ? alliancePlayers.length / 2 : alliances.length;
								break;
						}
					} catch (err) {}
				});
			}
			resolve(this);
		};
	});

	function waitForElm(selector) {
		return new Promise((resolve) => {
			if (document.querySelector(selector)) return resolve(document.querySelector(selector));
			const observer = new MutationObserver((mutations) => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		});
	}

	const customStoreHolder = document.createElement("div");
	customStoreHolder.id = "customStoreHolder";
	const customStoreScrollBar = document.createElement("div");
	customStoreScrollBar.id = "customStoreScrollBar";

	waitForElm("#storeHolder").then((storeHolder) => {
		const style = document.createElement("style");
		style.innerHTML = `
            #customStoreHolder {
                pointer-events: all; width: 400px; display: inline-block;
                background-color: rgba(0, 0, 0, 0.25); border-radius: 4px;
                color: #fff; padding: 10px; height: 200px; max-height: calc(100vh - 200px);
                overflow-y: scroll; -webkit-overflow-scrolling: touch;
            }
			.storeItem { font-size: 24px; }
			.hatPreview { width: 45px; height: 45px; }
			.joinAlBtn { font-size: 24px; }
			.itemPrice { font-size: 24px; }
			#customStoreScrollBar {
				display: none; position: absolute; width: 3px; background: white;
				left: calc(50% + 210px - 3px); border-radius: 10px;
			}
        `;
		document.head.appendChild(style);
		storeHolder.parentNode.insertBefore(customStoreHolder, storeHolder.nextSibling);
		storeHolder.parentNode.insertBefore(customStoreScrollBar, storeHolder.nextSibling);
		storeHolder.style.display = "none";
	});

	var currentStoreIndex = 0;
	var store = {
		hats: [
			{ id: 51, name: "Moo Cap", price: 0, scale: 120, desc: "coolest mooer around" },
			{ id: 50, name: "Apple Cap", price: 0, scale: 120, desc: "apple farms remembers" },
			{ id: 28, name: "Moo Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 29, name: "Pig Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 30, name: "Fluff Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 36, name: "Pandou Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 37, name: "Bear Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 38, name: "Monkey Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 44, name: "Polar Head", price: 0, scale: 120, desc: "no effect" },
			{ id: 35, name: "Fez Hat", price: 0, scale: 120, desc: "no effect" },
			{ id: 42, name: "Enigma Hat", price: 0, scale: 120, desc: "join the enigma army" },
			{ id: 43, name: "Blitz Hat", price: 0, scale: 120, desc: "hey everybody i'm blitz" },
			{ id: 49, name: "Bob XIII Hat", price: 0, scale: 120, desc: "like and subscribe" },
			{ id: 57, name: "Pumpkin", price: 50, scale: 120, desc: "Spooooky" },
			{ id: 8, name: "Bummle Hat", price: 100, scale: 120, desc: "no effect" },
			{ id: 2, name: "Straw Hat", price: 500, scale: 120, desc: "no effect" },
			{ id: 15, name: "Winter Cap", price: 600, scale: 120, desc: "allows you to move at normal speed in snow", coldM: 1 },
			{ id: 5, name: "Cowboy Hat", price: 1000, scale: 120, desc: "no effect" },
			{ id: 4, name: "Ranger Hat", price: 2000, scale: 120, desc: "no effect" },
			{ id: 18, name: "Explorer Hat", price: 2000, scale: 120, desc: "no effect" },
			{ id: 31, name: "Flipper Hat", price: 2500, scale: 120, desc: "have more control while in water", watrImm: true },
			{ id: 1, name: "Marksman Cap", price: 3000, scale: 120, desc: "increases arrow speed and range", aMlt: 1.3 },
			{ id: 10, name: "Bush Gear", price: 3000, scale: 160, desc: "allows you to disguise yourself as a bush" },
			{ id: 48, name: "Halo", price: 3000, scale: 120, desc: "no effect" },
			{ id: 6, name: "Soldier Helmet", price: 4000, scale: 120, desc: "reduces damage taken but slows movement", spdMult: 0.94, dmgMult: 0.75 },
			{ id: 23, name: "Anti Venom Gear", price: 4000, scale: 120, desc: "makes you immune to poison", poisonRes: 1 },
			{ id: 13, name: "Medic Gear", price: 5000, scale: 110, desc: "slowly regenerates health over time", healthRegen: 3 },
			{ id: 9, name: "Miners Helmet", price: 5000, scale: 120, desc: "earn 1 extra gold per resource", extraGold: 1 },
			{ id: 32, name: "Musketeer Hat", price: 5000, scale: 120, desc: "reduces cost of projectiles", projCost: 0.5 },
			{ id: 7, name: "Bull Helmet", price: 6000, scale: 120, desc: "increases damage done but drains health", healthRegen: -5, dmgMultO: 1.5, spdMult: 0.96 },
			{ id: 22, name: "Emp Helmet", price: 6000, scale: 120, desc: "turrets won't attack but you move slower", antiTurret: 1, spdMult: 0.7 },
			{ id: 12, name: "Booster Hat", price: 6000, scale: 120, desc: "increases your movement speed", spdMult: 1.16 },
			{ id: 26, name: "Barbarian Armor", price: 8000, scale: 120, desc: "knocks back enemies that attack you", dmgK: 0.6 },
			{ id: 21, name: "Plague Mask", price: 10000, scale: 120, desc: "melee attacks deal poison damage", poisonDmg: 5, poisonTime: 6 },
			{ id: 46, name: "Bull Mask", price: 10000, scale: 120, desc: "bulls won't target you unless you attack them", bullRepel: 1 },
			{ id: 14, name: "Windmill Hat", topSprite: true, price: 10000, scale: 120, desc: "generates points while worn", pps: 1.5 },
			{ id: 11, name: "Spike Gear", topSprite: true, price: 10000, scale: 120, desc: "deal damage to players that damage you", dmg: 0.45 },
			{ id: 53, name: "Turret Gear", topSprite: true, price: 10000, scale: 120, desc: "you become a walking turret", turret: { proj: 1, range: 700, rate: 2500 }, spdMult: 0.7 },
			{ id: 20, name: "Samurai Armor", price: 12000, scale: 120, desc: "increased attack speed and fire rate", atkSpd: 0.78 },
			{ id: 58, name: "Dark Knight", price: 12000, scale: 120, desc: "restores health when you deal damage", healD: 0.4 },
			{ id: 27, name: "Scavenger Gear", price: 15000, scale: 120, desc: "earn double points for each kill", kScrM: 2 },
			{ id: 40, name: "Tank Gear", price: 15000, scale: 120, desc: "increased damage to buildings but slower movement", spdMult: 0.3, bDmg: 3.3 },
			{ id: 52, name: "Thief Gear", price: 15000, scale: 120, desc: "steal half of a players gold when you kill them", goldSteal: 0.5 },
			{ id: 55, name: "Bloodthirster", price: 20000, scale: 120, desc: "Restore Health when dealing damage. And increased damage", healD: 0.25, dmgMultO: 1.2 },
			{ id: 56, name: "Assassin Gear", price: 20000, scale: 120, desc: "Go invisible when not moving. Can't eat. Increased speed", noEat: true, spdMult: 1.1, invisTimer: 1000 }
		],
		accessories: [
			{ id: 12, name: "Snowball", price: 1000, scale: 105, xOff: 18, desc: "no effect" },
			{ id: 9, name: "Tree Cape", price: 1000, scale: 90, desc: "no effect" },
			{ id: 10, name: "Stone Cape", price: 1000, scale: 90, desc: "no effect" },
			{ id: 3, name: "Cookie Cape", price: 1500, scale: 90, desc: "no effect" },
			{ id: 8, name: "Cow Cape", price: 2000, scale: 90, desc: "no effect" },
			{ id: 11, name: "Monkey Tail", price: 2000, scale: 97, xOff: 25, desc: "Super speed but reduced damage", spdMult: 1.35, dmgMultO: 0.2 },
			{ id: 17, name: "Apple Basket", price: 3000, scale: 80, xOff: 12, desc: "slowly regenerates health over time", healthRegen: 1 },
			{ id: 6, name: "Winter Cape", price: 3000, scale: 90, desc: "no effect" },
			{ id: 4, name: "Skull Cape", price: 4000, scale: 90, desc: "no effect" },
			{ id: 5, name: "Dash Cape", price: 5000, scale: 90, desc: "no effect" },
			{ id: 2, name: "Dragon Cape", price: 6000, scale: 90, desc: "no effect" },
			{ id: 1, name: "Super Cape", price: 8000, scale: 90, desc: "no effect" },
			{ id: 7, name: "Troll Cape", price: 8000, scale: 90, desc: "no effect" },
			{ id: 14, name: "Thorns", price: 10000, scale: 115, xOff: 20, desc: "no effect" },
			{ id: 15, name: "Blockades", price: 10000, scale: 95, xOff: 15, desc: "no effect" },
			{ id: 20, name: "Devils Tail", price: 10000, scale: 95, xOff: 20, desc: "no effect" },
			{ id: 16, name: "Sawblade", price: 12000, scale: 90, spin: true, xOff: 0, desc: "deal damage to players that damage you", dmg: 0.15 },
			{ id: 13, name: "Angel Wings", price: 15000, scale: 138, xOff: 22, desc: "slowly regenerates health over time", healthRegen: 3 },
			{ id: 19, name: "Shadow Wings", price: 15000, scale: 138, xOff: 22, desc: "increased movement speed", spdMult: 1.1 },
			{ id: 18, name: "Blood Wings", price: 20000, scale: 178, xOff: 26, desc: "restores health when you deal damage", healD: 0.2 },
			{ id: 21, name: "Corrupt X Wings", price: 20000, scale: 178, xOff: 26, desc: "deal damage to players that damage you", dmg: 0.25 }
		]
	};

	for (let i = 0; i < store.hats.length; ++i) {
		if (store.hats[i].price <= 0) myPlayer.skins[store.hats[i].id] = 1;
	}
	for (let i = 0; i < store.accessories.length; ++i) {
		if (store.accessories[i].price <= 0) myPlayer.tails[store.accessories[i].id] = 1;
	}

	var checkRealStore = JSON.parse(localStorage.getItem("realStore"));
	if (checkRealStore == null) localStorage.setItem("realStore", JSON.stringify(store));
	
	var customStore = JSON.parse(localStorage.getItem("customStore"));
	if (customStore == null) {
		customStore = store;
		localStorage.setItem("customStore", JSON.stringify(store));
	}

	var totalShopEle = customStore.hats.length;
	var currentShopEle = 0;

	function updateScroll() {
		if (customStoreButton.style.background == "red") return;
		const elements = document.querySelectorAll("#customStoreHolder > .storeItem");
		const storeArray = [];
		for (let i = 0; i < elements.length; i++) {
			if (currentShopEle <= i && i < currentShopEle + 4) {
				elements[i].style.display = null;
				storeArray.push(tmpArray[i].blank ? "blank" : tmpArray[i].id);
			} else {
				elements[i].style.display = "none";
			}
		}
		const elementHeight = 220 / (elements.length || 1);
		customStoreScrollBar.style.height = `${elementHeight * 4}px`;
		customStoreScrollBar.style.marginTop = `${elementHeight * currentShopEle}px`;
		customStoreScrollBar.style.display = elements.length <= 4 ? "none" : "block";
	}

	customStoreHolder.addEventListener("wheel", (event) => {
		if (event.wheelDelta > 0) {
			currentShopEle = Math.max(0, currentShopEle - 4);
		} else {
			currentShopEle = Math.min(Math.max(0, totalShopEle - 4), currentShopEle + 4);
		}
		updateScroll();
	});

	var sortable = null, tmpArray;
	function generateStoreList() {
		if (inGame) {
			while (customStoreHolder.hasChildNodes()) {
				customStoreHolder.removeChild(customStoreHolder.lastChild);
			}
			var index = currentStoreIndex;
			tmpArray = index ? customStore.accessories : customStore.hats;
			totalShopEle = tmpArray.length;
			if(elementID("addEdit")) addEdit.style.display = customStoreButton.style.background == "red" ? null : "none";
			if(elementID("reloadEdit")) reloadEdit.style.display = customStoreButton.style.background == "red" ? null : "none";
			if(elementID("importBut")) importBut.style.display = customStoreButton.style.background == "red" ? null : "none";
			if(elementID("exportBut")) exportBut.style.display = customStoreButton.style.background == "red" ? null : "none";
			customStoreHolder.style.overflowY = customStoreButton.style.background == "red" ? null : "hidden";
			
			Array.from(tmpArray).forEach((ele) => {
				let tmp = document.createElement("div");
				tmp.id = "storeDisplay" + ele.id;
				tmp.className = "storeItem";
				customStoreHolder.appendChild(tmp);

				let childtmp;
				if (!ele.blank) {
					tmp.onmouseout = () => { if(win.showItemInfo) win.showItemInfo(); };
					tmp.onmouseover = () => { if(win.showItemInfo) win.showItemInfo(ele, false, true); };

					childtmp = document.createElement("img");
					childtmp.className = "hatPreview";
					childtmp.src = "/img/" + (index ? "accessories/access_" : "hats/hat_") + ele.id + (ele.topSprite ? "_p" : "") + ".png";
					tmp.appendChild(childtmp);

					childtmp = document.createElement("span");
					childtmp.textContent = ele.name;
					tmp.appendChild(childtmp);
				} else {
					childtmp = document.createElement("div");
					childtmp.className = "hatPreview";
					tmp.appendChild(childtmp);
				}

				if (customStoreButton.style.background == "red") {
					childtmp = document.createElement("div");
					childtmp.className = "joinAlBtn";
					childtmp.style = "margin-top: 5px";
					childtmp.textContent = "Delete";
					tmp.appendChild(childtmp);
					childtmp.onclick = () => {
						let arr = index ? customStore.accessories : customStore.hats;
						const objWithIdIndex = arr.findIndex((obj) => obj.id === ele.id);
						if (objWithIdIndex > -1) arr.splice(objWithIdIndex, 1);
						localStorage.setItem("customStore", JSON.stringify(customStore));
						generateStoreList();
					};
				} else if (!ele.blank) {
					if (index ? !myPlayer.tails[ele.id] : !myPlayer.skins[ele.id]) {
						childtmp = document.createElement("div");
						childtmp.className = "joinAlBtn";
						childtmp.style = "margin-top: 5px";
						childtmp.textContent = "Buy";
						childtmp.onclick = () => { if(win.storeBuy) win.storeBuy(ele.id, index); };
						tmp.appendChild(childtmp);

						childtmp = document.createElement("span");
						childtmp.className = "itemPrice";
						childtmp.textContent = ele.price;
						tmp.appendChild(childtmp);
					} else if ((index ? myPlayer.tailIndex : myPlayer.skinIndex) == ele.id) {
						childtmp = document.createElement("div");
						childtmp.className = "joinAlBtn";
						childtmp.style = "margin-top: 5px";
						childtmp.textContent = "Unequip";
						childtmp.onclick = () => { if(win.storeEquip) win.storeEquip(0, index); };
						tmp.appendChild(childtmp);
					} else {
						childtmp = document.createElement("div");
						childtmp.className = "joinAlBtn";
						childtmp.style = "margin-top: 5px";
						childtmp.textContent = "Equip";
						childtmp.onclick = () => { if(win.storeEquip) win.storeEquip(ele.id, index); };
						tmp.appendChild(childtmp);
					}
				}
			});
			updateScroll();
		}
	}

	const customStoreButton = document.createElement("div");
	customStoreButton.id = "customStoreButton";
	customStoreButton.className = "uiElement gameButton";
	customStoreButton.innerHTML = `<i class="material-icons" style="font-size:40px; vertical-align:middle">store</i>`;
	customStoreButton.onclick = () => {
		const storeMenu = elementID("storeMenu");
		if (storeMenu && storeMenu.style.display != "block") {
			storeMenu.style.display = "block";
			if(elementID("allianceMenu")) elementID("allianceMenu").style.display = "none";
			generateStoreList();
		} else if (storeMenu) {
			storeMenu.style.display = "none";
			customStoreButton.style.background = null;
		}
	};
	customStoreButton.oncontextmenu = (event) => {
		event.preventDefault();
		const storeMenu = elementID("storeMenu");
		if (storeMenu && storeMenu.style.display != "block") {
			storeMenu.style.display = "block";
			if(elementID("allianceMenu")) elementID("allianceMenu").style.display = "none";
			if (customStoreButton.style.background != "red") {
				customStoreButton.style.background = "red";
			}
			generateStoreList();
		} else if (storeMenu) {
			storeMenu.style.display = "none";
			customStoreButton.style.background = null;
		}
	};

	waitForElm("#storeButton").then((storeButton) => {
		const style = document.createElement("style");
		style.innerHTML = `#customStoreButton { right: 330px; } @media only screen and (max-width: 896px) { #customStoreButton { top: inherit; right: 60px; } }`;
		document.head.appendChild(style);
		storeButton.parentNode.insertBefore(customStoreButton, storeButton.nextSibling);
		storeButton.hidden = true;
	});

	waitForElm("#storeMenu > div:nth-child(1) > div:nth-child(1)").then((storeTab1) => {
		storeTab1.addEventListener("click", () => {
			currentStoreIndex = 0;
			currentShopEle = 0;
			generateStoreList();
		});
	});

	const addEdit = document.createElement("div");
	addEdit.id = "addEdit";
	addEdit.className = "storeTab";
	addEdit.textContent = "Add Blank";
	addEdit.style.display = "none";
	addEdit.style.marginLeft = "10px";

	const reloadEdit = document.createElement("div");
	reloadEdit.id = "reloadEdit";
	reloadEdit.className = "storeTab";
	reloadEdit.textContent = "Reload";
	reloadEdit.style.display = "none";
	reloadEdit.style.marginLeft = "10px";

	const importBut = document.createElement("div");
	importBut.id = "importBut";
	importBut.className = "storeTab";
	importBut.textContent = "Import";
	importBut.style.marginLeft = "10px";

	const exportBut = document.createElement("div");
	exportBut.id = "exportBut";
	exportBut.className = "storeTab";
	exportBut.textContent = "Export";
	exportBut.style.marginLeft = "10px";

	waitForElm("#storeMenu > div:nth-child(1) > div:nth-child(2)").then((storeTab2) => {
		storeTab2.addEventListener("click", () => {
			currentStoreIndex = 1;
			currentShopEle = 0;
			generateStoreList();
		});

		storeTab2.parentNode.appendChild(addEdit);
		addEdit.onclick = () => {
			let arr = currentStoreIndex ? customStore.accessories : customStore.hats;
			let id = Math.max(...arr.map((el) => el.id)) + 1001;
			arr.splice(0, 0, { id: id, blank: true });
			localStorage.setItem("customStore", JSON.stringify(customStore));
			generateStoreList();
		};

		storeTab2.parentNode.appendChild(reloadEdit);
		reloadEdit.onclick = () => {
			let realStore = JSON.parse(localStorage.getItem("realStore"));
			if(realStore) {
				currentStoreIndex ? (customStore.accessories = realStore.accessories) : (customStore.hats = realStore.hats);
				localStorage.setItem("customStore", JSON.stringify(customStore));
			}
			currentShopEle = 0;
			generateStoreList();
		};

		storeTab2.parentNode.appendChild(importBut);
		importBut.onclick = () => {
			const tmpEle = document.createElement("input");
			tmpEle.type = "file";
			tmpEle.style.display = "none";
			document.body.appendChild(tmpEle);
			tmpEle.addEventListener("change", async () => {
				let data = await new Response(tmpEle.files[0]).json();
				customStore = data;
				localStorage.setItem("customStore", JSON.stringify(data));
				tmpEle.remove();
				currentShopEle = 0;
				generateStoreList();
			});
			tmpEle.click();
		};

		storeTab2.parentNode.appendChild(exportBut);
		exportBut.onclick = () => {
			let dataStr = JSON.stringify(customStore);
			let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
			let exportFileDefaultName = `customStore_${Date.now()}.json`;
			let linkElement = document.createElement("a");
			linkElement.setAttribute("href", dataUri);
			linkElement.setAttribute("download", exportFileDefaultName);
			linkElement.click();
		};
	});

	win.addEventListener("keydown", (event) => {
		if (event.code == "Escape") {
			customStoreButton.style.background = null;
		} else if (event.code == "KeyB" && document.activeElement && document.activeElement.tagName != "INPUT" && inGame) {
			const storeMenu = elementID("storeMenu");
			if (storeMenu && storeMenu.style.display != "block") {
				storeMenu.style.display = "block";
				if(elementID("allianceMenu")) elementID("allianceMenu").style.display = "none";
				generateStoreList();
			} else if (storeMenu) {
				storeMenu.style.display = "none";
				customStoreButton.style.background = null;
			}
		}
	});
})();
