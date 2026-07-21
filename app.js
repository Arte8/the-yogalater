const CRITERIA = [
  "Is this non-harming? (ahimsa)",
  "Is this true? (satya)",
  "Is this not stealing? (asteya)",
  "Is this wise energy? (brahmacharya)",
  "Is this not materialistically possessive? (aparigraha)",
  "Is this clean? (saucha)",
  "Does it practice contentment? (santosha)",
  "Is this disciplined action? (tapas)",
  "Does it practice self study? (svadhyaya)",
  "Does this show devotion to God? (ishvara pranidhana)"
];

const THRESHOLD = 10;

const startButton = document.querySelector("#startButton");
const cancelButton = document.querySelector("#cancelButton");
const closeResultsButton = document.querySelector("#closeResultsButton");
const assessmentForm = document.querySelector("#assessmentForm");
const criteriaList = document.querySelector("#criteriaList");
const criteriaModal = document.querySelector("#criteriaModal");
const resultsModal = document.querySelector("#resultsModal");
const formWarning = document.querySelector("#formWarning");
const scoreText = document.querySelector("#scoreText");
const statusText = document.querySelector("#statusText");
const explanationText = document.querySelector("#explanationText");
const failedCriteria = document.querySelector("#failedCriteria");

function buildCriteria() {
  criteriaList.innerHTML = CRITERIA.map((criterion, index) => `
    <fieldset class="criterion">
      <legend class="criterion-question">
        ${index + 1}. ${criterion}
      </legend>

      <div class="answer-options">
        <label>
          <input type="radio" name="criterion-${index}" value="yes">
          Yes
        </label>

        <label>
          <input type="radio" name="criterion-${index}" value="no">
          No
        </label>
      </div>
    </fieldset>
  `).join("");
}

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add("modal-open");

  const firstFocusable = modal.querySelector("button, input");
  firstFocusable?.focus();
}

function closeModal(modal) {
  modal.hidden = true;

  if (criteriaModal.hidden && resultsModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function resetAssessment() {
  assessmentForm.reset();
  formWarning.hidden = true;
  formWarning.textContent = "";
  criteriaList.scrollTop = 0;
}

function getAnswers() {
  return CRITERIA.map((_, index) => {
    const selected = document.querySelector(
      `input[name="criterion-${index}"]:checked`
    );

    return selected ? selected.value : "";
  });
}

function submitAssessment(event) {
  event.preventDefault();

  const answers = getAnswers();
  const unanswered = answers
    .map((answer, index) => answer === "" ? index + 1 : null)
    .filter(Boolean);

  if (unanswered.length > 0) {
    formWarning.textContent =
      `Please answer every criterion. Unanswered questions: ${unanswered.join(", ")}`;
    formWarning.hidden = false;
    formWarning.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  const booleanAnswers = answers.map(answer => answer === "yes");
  const score = booleanAnswers.filter(Boolean).length;

  const failed = CRITERIA.filter(
    (_, index) => !booleanAnswers[index]
  );

  showResults(score, failed);
}

function showResults(score, failed) {
  const approved = score >= THRESHOLD;

  scoreText.textContent = `Criteria fulfilled: ${score}/${CRITERIA.length}`;
  statusText.textContent = approved ? "WISE ✅" : "UNWISE ❌";
  statusText.className = `status-text ${approved ? "approved" : "rejected"}`;

  explanationText.textContent = approved
    ? "Very wise. Go in peace."
    : "Questionable decision. Be cautious.";

  if (failed.length > 0) {
    failedCriteria.innerHTML = `
      <ul>
        ${failed.map(criterion => `<li>${criterion}</li>`).join("")}
      </ul>
    `;
  } else {
    failedCriteria.innerHTML = "<p>None — no faults or bad vibe.</p>";
  }

  closeModal(criteriaModal);
  openModal(resultsModal);
}

startButton.addEventListener("click", () => {
  resetAssessment();
  openModal(criteriaModal);
});

cancelButton.addEventListener("click", () => {
  closeModal(criteriaModal);
  startButton.focus();
});

closeResultsButton.addEventListener("click", () => {
  closeModal(resultsModal);
  startButton.focus();
});

assessmentForm.addEventListener("submit", submitAssessment);

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") {
    return;
  }

  if (!resultsModal.hidden) {
    closeModal(resultsModal);
    startButton.focus();
  } else if (!criteriaModal.hidden) {
    closeModal(criteriaModal);
    startButton.focus();
  }
});

buildCriteria();
