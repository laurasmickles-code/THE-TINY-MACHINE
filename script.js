const machine = document.getElementById("machine");
const screenText = document.getElementById("screenText");
const screenSub = document.getElementById("screenSub");
const statusLight = document.getElementById("statusLight");
const clock = document.getElementById("clock");
const log = document.getElementById("log");
const coinsDisplay = document.getElementById("coins");
const mood = document.getElementById("mood");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");

const slots = [...document.querySelectorAll(".slot")];

let powered = false;
let hour = 8;
let day = 1;
let coins = 0;
let dial = 0;
let experiments = 0;

let slotContents = [null, null, null];
let discoveries = [];

const objects = {
  gear: {
    symbol: "⚙",
    name: "GEAR",
    description: "A small gear. It still turns."
  },
  star: {
    symbol: "✦",
    name: "STAR",
    description: "It isn't really a star. Probably."
  },
  key: {
    symbol: "⚿",
    name: "KEY",
    description: "A key to something."
  },
  orb: {
    symbol: "●",
    name: "ORB",
    description: "Warm to the touch."
  },
  paper: {
    symbol: "▱",
    name: "PAPER",
    description: "There is writing on the other side."
  }
};

const combinations = {
  "gear-star": {
    title: "A LITTLE CONSTELLATION",
    text: "The machine makes a tiny metallic chime. Something appears on the screen.",
    result: "CONSTELLATION",
    reward: 5
  },
  "gear-key": {
    title: "UNLOCKED",
    text: "The machine accepts the key without having a keyhole.",
    result: "ACCESS",
    reward: 8
  },
  "gear-orb": {
    title: "POWER",
    text: "The orb begins glowing. The machine hums.",
    result: "ENERGY",
    reward: 10
  },
  "gear-paper": {
    title: "OLD INSTRUCTIONS",
    text: "The machine prints a message: KEEP GOING.",
    result: "INSTRUCTIONS",
    reward: 4
  },
  "star-key": {
    title: "A DOOR?",
    text: "For half a second, the screen displays a place you don't recognize.",
    result: "DOOR",
    reward: 12
  },
  "star-orb": {
    title: "NIGHT LIGHT",
    text: "The machine creates a tiny artificial moon.",
    result: "MOON",
    reward: 15
  },
  "star-paper": {
    title: "A MESSAGE",
    text: "New words appear on the paper.",
    result: "MESSAGE",
    reward: 6
  },
  "key-orb": {
    title: "SOMETHING OPENED",
    text: "You hear a click from somewhere inside the machine.",
    result: "LOCK",
    reward: 20
  },
  "key-paper": {
    title: "THE OTHER SIDE",
    text: "The writing on the paper suddenly makes sense.",
    result: "SECRET",
    reward: 15
  },
  "orb-paper": {
    title: "MEMORY",
    text: "The machine shows a picture of somewhere it remembers.",
    result: "MEMORY",
    reward: 18
  }
};

function addLog(message) {
  const line = document.createElement("div");
  line.className = "logLine";

  const time = String(hour).padStart(2, "0") + ":00";

  line.innerHTML =
    `<span class="time">[DAY ${day} ${time}]</span>${message}`;

  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function showPopup(title, text) {
  popupTitle.textContent = title;
  popupText.textContent = text;
  popup.classList.add("show");
}

function updateClock() {
  clock.textContent =
    `DAY ${day} — ${String(hour).padStart(2, "0")}:00`;
}

function updateCoins() {
  coinsDisplay.textContent = `${coins} ✦`;
}

function updateSlots() {
  slots.forEach((slot, i) => {
    const item = slotContents[i];

    if (item) {
      slot.textContent = objects[item].symbol;
      slot.classList.add("filled");
      slot.title = objects[item].name;
    } else {
      slot.textContent = "?";
      slot.classList.remove("filled");
      slot.title = "";
    }
  });
}

function setScreen(main, sub) {
  screenText.textContent = main;
  screenSub.textContent = sub;
}

function combinationKey(a, b) {
  return [a, b].sort().join("-");
}

function currentCombination() {
  const filled = slotContents.filter(Boolean);

  if (filled.length !== 2) return null;

  return combinations[combinationKey(filled[0], filled[1])];
}

function activateMachine() {
  if (!powered) {
    setScreen("OFFLINE", "power required");
    return;
  }

  const combo = currentCombination();

  if (!combo) {
    setScreen("WAITING", "two objects required");
    return;
  }

  experiments++;

  machine.classList.remove("glow", "shake");
  void machine.offsetWidth;

  if (Math.random() < .15) {
    machine.classList.add("shake");
    setScreen("ERROR", "interesting...");

    addLog("The machine rejected the experiment.");

    setTimeout(() => {
      setScreen("READY", "try again");
    }, 900);

    return;
  }

  machine.classList.add("glow");

  setScreen(combo.result, "experiment successful");

  coins += combo.reward;
  updateCoins();

  addLog(
    `<strong>${combo.title}</strong> — ${combo.reward} ✦`
  );

  if (!discoveries.includes(combo.result)) {
    discoveries.push(combo.result);
    updateDiscoveries();
  }

  slotContents = [null, null, null];
  updateSlots();

  if (experiments === 3) {
    addLog("The machine seems to recognize you.");
  }

  if (experiments === 7) {
    showPopup(
      "THE MACHINE KNOWS",
      "You have used it enough times for it to start behaving differently."
    );

    setScreen("HELLO AGAIN", "...");
  }
}

document.getElementById("power").addEventListener("click", () => {
  powered = !powered;

  if (powered) {
    statusLight.textContent = "● ONLINE";
    statusLight.classList.add("online");

    setScreen("READY", "waiting for input");
    addLog("Machine powered on.");
  } else {
    statusLight.textContent = "● OFFLINE";
    statusLight.classList.remove("online");

    setScreen("GOODBYE", "power disconnected");
    addLog("Machine powered off.");
  }
});

document.getElementById("advance").addEventListener("click", () => {
  hour++;

  if (hour >= 24) {
    hour = 0;
    day++;
  }

  updateClock();

  const events = [
    "Nothing happened.",
    "A breeze moved through the room.",
    "The machine made a tiny clicking sound.",
    "You found a loose screw.",
    "Something outside made a strange noise.",
    "The room feels slightly different."
  ];

  const event = events[Math.floor(Math.random() * events.length)];

  addLog(event);

  if (hour === 0) {
    addLog("Midnight.");
    setScreen("00:00", "the machine is awake");
  }

  if (hour === 3 && powered) {
    showPopup(
      "3:00 AM",
      "The machine is displaying a symbol you haven't seen before."
    );

    setScreen("???", "03:00");
  }
});

document.getElementById("inspect").addEventListener("click", () => {
  if (!powered) {
    showPopup(
      "INSPECTION",
      "The machine is off. It looks surprisingly ordinary."
    );
    return;
  }

  const messages = [
    "There are scratches underneath the machine.",
    "One screw is newer than the others.",
    "The screen is not connected to anything you can see.",
    "The dial has no numbers.",
    "There is something moving inside.",
    "The machine appears to be older than it looks."
  ];

  const message =
    messages[Math.floor(Math.random() * messages.length)];

  addLog(`Inspection: ${message}`);
  showPopup("INSPECTION", message);
});

document.getElementById("experiment").addEventListener("click", () => {
  activateMachine();
});

document.getElementById("journalBtn").addEventListener("click", () => {
  document.getElementById("journal").classList.remove("hidden");
  document.getElementById("logPanel").classList.add("hidden");

  document.getElementById("journalText").textContent =
    `Day: ${day}
Experiments: ${experiments}
Stars collected: ${coins}

The machine doesn't seem to follow normal rules.
You should probably keep experimenting.`;
});

document.getElementById("closeJournal").addEventListener("click", () => {
  document.getElementById("journal").classList.add("hidden");
  document.getElementById("logPanel").classList.remove("hidden");
});

document.getElementById("clearLog").addEventListener("click", () => {
  log.innerHTML = "";
  addLog("Log cleared.");
});

document.getElementById("reset").addEventListener("click", () => {
  slotContents = [null, null, null];
  powered = false;
  experiments = 0;

  statusLight.textContent = "● OFFLINE";
  statusLight.classList.remove("online");

  updateSlots();
  setScreen("HELLO", "insert curiosity");

  addLog("Machine reset.");
});

document.getElementById("popupClose").addEventListener("click", () => {
  popup.classList.remove("show");
});

popup.addEventListener("click", event => {
  if (event.target === popup) {
    popup.classList.remove("show");
  }
});

/* DRAGGING */

document.querySelectorAll(".object").forEach(object => {
  object.addEventListener("dragstart", event => {
    event.dataTransfer.setData(
      "text/plain",
      object.dataset.item
    );
  });
});

slots.forEach(slot => {
  slot.addEventListener("dragover", event => {
    event.preventDefault();
    slot.style.borderColor = "var(--accent2)";
  });

  slot.addEventListener("dragleave", () => {
    slot.style.borderColor = "";
  });

  slot.addEventListener("drop", event => {
    event.preventDefault();

    const item = event.dataTransfer.getData("text/plain");
    const index = Number(slot.dataset.slot);

    if (!objects[item]) return;

    slotContents[index] = item;

    slot.style.borderColor = "";
    updateSlots();

    addLog(
      `Inserted <strong>${objects[item].name}</strong> into slot ${index + 1}.`
    );

    if (slotContents.filter(Boolean).length === 2) {
      setScreen("READY", "press EXPERIMENT");
    }
  });

  slot.addEventListener("click", () => {
    const index = Number(slot.dataset.slot);

    if (slotContents[index]) {
      const removed = objects[slotContents[index]].name;

      slotContents[index] = null;
      updateSlots();

      addLog(`Removed ${removed}.`);
    }
  });
});

/* DIAL */

document.getElementById("dial").addEventListener("click", () => {
  dial += 45;

  if (dial >= 360) {
    dial = 0;

    addLog("The dial completed one full rotation.");

    if (powered) {
      setScreen("???", "something shifted");

      setTimeout(() => {
        setScreen("READY", "waiting for input");
      }, 1000);
    }
  }

  document.getElementById("dialPointer").style.transform =
    `rotate(${dial}deg)`;
});

/* SECRET INTERACTION */

let clickCount = 0;

document.getElementById("screen").addEventListener("click", () => {
  clickCount++;

  if (clickCount === 5) {
    addLog("You tapped the screen five times.");

    if (powered) {
      showPopup(
        "HIDDEN INPUT",
        "The screen flickered. It seems to have noticed you."
      );

      setScreen("HELLO", "I SEE YOU");
    }
  }

  if (clickCount === 12) {
    addLog("The machine unlocked something.");

    if (!discoveries.includes("HELLO")) {
      discoveries.push("HELLO");
      updateDiscoveries();
    }

    coins += 25;
    updateCoins();

    showPopup(
      "SECRET DISCOVERY",
      "You found a hidden interaction. Have 25 ✦."
    );
  }
});

function updateDiscoveries() {
  const container = document.getElementById("discoveries");

  if (!discoveries.length) {
    container.textContent = "None.";
    return;
  }

  container.textContent =
    discoveries.map(x => `✦ ${x}`).join("　");
}

updateClock();
updateCoins();
updateSlots();
updateDiscoveries();

addLog("Machine initialized.");
addLog("Workbench initialized.");
addLog("Awaiting curiosity.");