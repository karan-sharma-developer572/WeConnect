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

// submitting form
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop the page from reloading instantly

    // Grab the inputs (make sure your HTML elements have these exact IDs or update them here)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send data over to your Node.js endpoint
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('🎉 Registration successful! You can now log in.');
            // Optional: redirect them or clear form inputs here
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please check your backend terminal connection.');
    }
});

// login feature
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Check if your button or form state represents logging in or signing up
    // Update 'Continue' or 'Login' based on what your button text actually says!
    const isLogin = event.target.querySelector('button').textContent.trim() === 'Login';
    
    // Dynamic endpoint depending on the action
    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (isLogin) {
                alert('🔓 Login successful! Welcome back to your dashboard.');
                // Soon we will redirect them here: window.location.href = '/dashboard.html';
            } else {
                alert('🎉 Registration successful! You can now log in.');
            }
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred connecting to the backend server.');
    }
});

