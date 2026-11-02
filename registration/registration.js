const stepButtons = document.querySelectorAll(".step-btn");
const stepPanels  = document.querySelectorAll(".step-panel");
 
// Show panel number `index` (0, 1 or 2) and hide the others
function showStep(index) {
  stepButtons.forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle("active", isActive);          // yellow fill on the chosen button
    btn.setAttribute("aria-selected", String(isActive)); // tells screen readers which tab is chosen
    btn.tabIndex = isActive ? 0 : -1;                  // only the active button is in the Tab order
  });
  stepPanels.forEach((panel, i) => {
    panel.hidden = i !== index;                        // pressing 2 hides panel 1 and shows panel 2
  });
}
 
stepButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => showStep(i));
 
  // Arrow Up/Down moves between steps for keyboard users
  btn.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowDown") next = (i + 1) % stepButtons.length;
    if (e.key === "ArrowUp")   next = (i - 1 + stepButtons.length) % stepButtons.length;
    if (next !== null) {
      e.preventDefault();
      showStep(next);
      stepButtons[next].focus();
    }
  });
});

// This function switches visibility between the Family Caregiver configuration 
// and the Elder Patient emergency/dementia stage setup fields on the registration form.
function toggleRolePath(role) {
  const familySec = document.getElementById('familySection');
  const elderSec = document.getElementById('elderSection');

  if (role === 'family') {
    familySec.style.display = 'block';
    elderSec.style.display = 'none';
  } else if (role === 'elder') {
    elderSec.style.display = 'block';
    familySec.style.display = 'none';
  }
}