
let currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
let score = parseInt(localStorage.getItem("score")) || 0;
let badges = JSON.parse(localStorage.getItem("badges")) || [];


const quiz = [
  { q: "L&D improves employee skills", a: true },
  { q: "L&D is unrelated to growth", a: false }
];
let qi = 0;
let timerInterval = null;
let timeLeft = 30;


showLevel(currentLevel);
updatePoints();
updateProgress(currentLevel);
renderBadges();


function showLevel(level) {
  document.querySelectorAll(".level").forEach(l =>
    l.classList.remove("active")
  );

  const section = document.getElementById(`level-${level}`);
  if (section) {
    section.classList.add("active");

    if (level === 1) initTimelineDragDrop();
    if (level === 3) loadQuiz();
    if (level === 4) startTimer();
  }
}

function completeLevel(level) {
  score += 10;
  addBadge(`Level ${level} Completed`);

  currentLevel = level + 1;

  localStorage.setItem("currentLevel", currentLevel);
  localStorage.setItem("score", score);
  localStorage.setItem("badges", JSON.stringify(badges));

  updateProgress(level);
  updatePoints();
  showLevel(currentLevel);
}


function updateProgress(level) {
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = ((level - 1) / 4) * 100 + "%";
}

function updatePoints() {
  const el = document.getElementById("points");
  if (el) el.innerText = score;
}


function addBadge(name) {
  if (!badges.includes(name)) {
    badges.push(name);
    renderBadges();
  }
}

function renderBadges() {
  const ul = document.getElementById("badges-list");
  if (!ul) return;

  ul.innerHTML = "";
  badges.forEach(b => {
    const li = document.createElement("li");
    li.innerText = b;
    ul.appendChild(li);
  });
}


function initTimelineDragDrop() {
  let dragged = null;

  document.querySelectorAll(".timeline-item").forEach(item => {
    item.addEventListener("dragstart", () => dragged = item);
    item.addEventListener("dragover", e => e.preventDefault());
    item.addEventListener("drop", e => {
      e.preventDefault();
      if (dragged && dragged !== item) {
        item.parentNode.insertBefore(dragged, item);
        checkTimelineOrder();
      }
    });
  });
}

function checkTimelineOrder() {
  const items = document.querySelectorAll(".timeline-item");
  const correct = [...items].every(
    (i, idx) => parseInt(i.dataset.order) === idx + 1
  );

  const btn = document.getElementById("level1-next");
  if (btn) btn.disabled = !correct;
}


let selectedLeft = null;
let matchedCount = 0;

function selectLeft(btn) {
  document.querySelectorAll(".left").forEach(b =>
    b.classList.remove("selected")
  );
  selectedLeft = btn;
  btn.classList.add("selected");
}

function selectRight(btn) {
  if (!selectedLeft) {
    showModal("Select a technology first");
    return;
  }

  if (selectedLeft.dataset.value === btn.dataset.value) {
  selectedLeft.classList.add("correct");
  btn.classList.add("correct");
  selectedLeft.disabled = true;
  btn.disabled = true;
  matchedCount++;
} else {
  showModal("❌ This pairing is incorrect. Review the technology concept and try again.");
}

  selectedLeft.classList.remove("selected");
  selectedLeft = null;

  if (matchedCount === 2) {
    const next = document.getElementById("level2-next");
    if (next) next.disabled = false;
  }
}


function loadQuiz() {
  const el = document.getElementById("quiz-question");
  if (el) el.innerText = quiz[qi].q;
}

function answerQuiz(ans) {
  if (ans === quiz[qi].a) score += 5;
  qi++;

  qi < quiz.length ? loadQuiz() : completeLevel(3);
}




function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timeLeft = 30;
  document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      finishCourse();
    }
  }, 1000);
}

function submitFinal(ans) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (ans === true) {
    score += 10;
    addBadge("Final Challenge Completed");
  }

  finishCourse();
}
function finishCourse() {
  
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = "100%";

 
  const quizBox = document.getElementById("final-quiz");
  if (quizBox) quizBox.style.display = "none";

  
  const title = document.getElementById("final-title");
  if (title) title.innerText = "";

  
  const completeBox = document.getElementById("final-complete");
  if (completeBox) completeBox.style.display = "block";

  
  if (typeof completeSCORM === "function") {
    completeSCORM(score);
  }

  
  localStorage.setItem("currentLevel", 4);
  localStorage.setItem("score", score);
  localStorage.setItem("badges", JSON.stringify(badges));
}



function showModal(message) {
  document.getElementById("modal-message").innerText = message;
  document.getElementById("feedback-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("feedback-modal").classList.add("hidden");
}
function resetJourney() {
  localStorage.clear();
  location.reload();
}
