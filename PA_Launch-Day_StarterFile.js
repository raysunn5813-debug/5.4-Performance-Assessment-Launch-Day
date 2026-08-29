/*/* Author: Raymond Cantey | Date: August 28, 2026 | Purpose: Local server detection, uplink telemetry synchronization, and lastUplink cookie management */

/* =========================================
     COOKIE ENGINE
========================================= */

function setUplinkCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	const expires = "expires=" + date.toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

function getUplinkCookie(name) {
	const cookieName = name + "=";
	const cookieArray = document.cookie.split(";");

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i].trim();
		if (cookie.indexOf(cookieName) === 0) {
			return decodeURIComponent(cookie.substring(cookieName.length));
		}
	}
	return "";
}

/* =========================================
     DOM SELECTION REFERENCES
========================================= */

const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const connectionStatus = document.getElementById("connectionStatus");
const lastOnline = document.getElementById("lastOnline");
const refreshButton = document.getElementById("refreshButton");
const hostInfo = document.getElementById("hostInfo");
const portInfo = document.getElementById("portInfo");
const protocolInfo = document.getElementById("protocolInfo");

/* =========================================
     PERSISTENT STORAGE RETRIEVAL
========================================= */

const previousUplink = getUplinkCookie("lastUplink");

if (previousUplink !== "") {
	lastOnline.textContent = previousUplink;
} else {
	lastOnline.textContent = "No uplink records found.";
}

/* =========================================
     TELEMETRY BINDINGS
========================================= */

const currentHost = window.location.hostname || "FILE SYSTEM (LOCAL)";
const currentPort = window.location.port ? window.location.port : "NONE / DEFAULT PROTOCOL PORT";
const currentProtocol = window.location.protocol.replace(":", "").toUpperCase();

hostInfo.textContent = `HOST IDENTIFIER: ${currentHost}`;
portInfo.textContent = `SOCKET PORT: ${currentPort}`;
protocolInfo.textContent = `COMM LINK: ${currentProtocol}`;

/* =========================================
     MANUAL REFRESH TRIGGER
========================================= */

refreshButton.addEventListener("click", function () {
	location.reload();
});

/* =========================================
     ENVIRONMENT DETECTION & THEME SWITCH
========================================= */

const isLiveUplink = (
	window.location.hostname === "localhost" ||
	window.location.hostname === "127.0.0.1" ||
	window.location.protocol === "http:" ||
	window.location.protocol === "https:"
);

if (isLiveUplink) {
	// Apply warm-toned Uplink Mode
	document.body.classList.add("uplink-mode");

	// Update hero messaging dynamically
	heroTitle.textContent = "ORBITAL UPLINK ESTABLISHED";
	heroText.textContent = "Telemetry stream locked. Satellite array transmitting on active local socket.";

	// Update connection indicator
	connectionStatus.textContent = "ACTIVE • 100% SIGNAL INTEGRITY";

	// Save launch timestamp to cookie
	const currentTimestamp = new Date().toLocaleString();
	setUplinkCookie("lastUplink", currentTimestamp, 14);
} else {
	// Fallback to Ground Standby Mode
	document.body.classList.remove("uplink-mode");
	heroTitle.textContent = "GROUND STANDBY";
	heroText.textContent = "Awaiting Uplink Authorization...";
	connectionStatus.textContent = "OFFLINE • STANDBY LOOP";
}
    