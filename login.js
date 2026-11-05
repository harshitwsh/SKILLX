/**
 * SKILLX - Authentication Page JavaScript (login.js)
 * Handles Sign In / Create Account tabs, form validation, password visibility, and demo sign in.
 */

function switchAuthTab(tab) {
  const signinBtn = document.getElementById('tabSignInBtn');
  const signupBtn = document.getElementById('tabSignUpBtn');
  const signinBody = document.getElementById('signinBody');
  const signupBody = document.getElementById('signupBody');

  if (!signinBtn || !signupBtn || !signinBody || !signupBody) return;

  if (tab === 'signin') {
    signinBtn.classList.add('active');
    signupBtn.classList.remove('active');
    signinBody.style.display = 'block';
    signupBody.style.display = 'none';
  } else {
    signupBtn.classList.add('active');
    signinBtn.classList.remove('active');
    signupBody.style.display = 'block';
    signinBody.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tab Switching Buttons & Links
  document.getElementById('tabSignInBtn')?.addEventListener('click', () => switchAuthTab('signin'));
  document.getElementById('tabSignUpBtn')?.addEventListener('click', () => switchAuthTab('signup'));

  document.querySelectorAll('[data-switch-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthTab(link.getAttribute('data-switch-tab'));
    });
  });

  // 2. Password Visibility Toggles
  document.querySelectorAll('[data-toggle-password]').forEach(iconEl => {
    iconEl.addEventListener('click', () => {
      const targetId = iconEl.getAttribute('data-toggle-password');
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        iconEl.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        iconEl.textContent = 'visibility';
      }
    });
  });

  // 3. Forgot Password Link
  document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('signinEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    const msg = email && isValidEmail(email)
      ? `Password reset instructions sent to ${email}`
      : 'Password reset link sent to registered college email';
    showToast(msg, 'info');
  });

  // 4. Quick Demo Login Buttons
  document.querySelectorAll('[data-demo-user]').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('data-demo-user');
      const shortName = label.split(' ')[0];
      const fullName = shortName === 'Tanish' ? 'Tanish Mehlawat'
        : shortName === 'Harshit' ? 'Harshit Yadav'
        : shortName;
      const roleMatch = label.match(/\(([^)]+)\)/);
      const role = roleMatch ? roleMatch[1] : 'Student';
      const email = `${shortName.toLowerCase()}@campus.edu`;

      saveAccount({
        name: fullName,
        email: email,
        role: role,
        batch: "Batch of '26",
        loggedInAt: new Date().toISOString()
      });
      saveProfile({ name: fullName, email: email, role: role });
      showToast(`Logged in as ${label}. Redirecting to Dashboard...`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    });
  });

  // 5. Sign In Form Validation & Submission
  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('signinEmail');
      const passwordInput = document.getElementById('signinPassword');
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let isValid = true;

      clearFieldError(emailInput);
      clearFieldError(passwordInput);

      if (!isValidEmail(email)) {
        setFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!password || password.length < 6) {
        setFieldError(passwordInput, 'Password must be at least 6 characters.');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the highlighted login fields.', 'error');
        return;
      }

      const storedAccount = getAccount();
      const currentProfile = getProfile();
      const displayName = storedAccount && storedAccount.email === email
        ? storedAccount.name
        : (currentProfile.email === email && currentProfile.name)
          ? currentProfile.name
          : email.split('@')[0].replace(/^\w/, c => c.toUpperCase());

      const userRole = currentProfile.email === email ? (currentProfile.role || 'Student') : 'Student';
      const userBatch = currentProfile.email === email ? (currentProfile.batch || "Batch of '26") : "Batch of '26";

      saveAccount({
        name: displayName,
        email: email,
        role: userRole,
        batch: userBatch,
        loggedInAt: new Date().toISOString()
      });

      if (currentProfile.email !== email) {
        saveProfile({ name: displayName, email: email, role: userRole });
      }

      showToast(`Welcome back, ${displayName}! Loading your Dashboard...`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    });
  }

  // 6. Create Account Form Validation & Submission
  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('signupName');
      const emailInput = document.getElementById('signupEmail');
      const passwordInput = document.getElementById('signupPassword');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let isValid = true;

      clearFieldError(nameInput);
      clearFieldError(emailInput);
      clearFieldError(passwordInput);

      if (name.length < 2) {
        setFieldError(nameInput, 'Full name must be at least 2 characters.');
        isValid = false;
      }

      if (!isValidEmail(email)) {
        setFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (password.length < 8) {
        setFieldError(passwordInput, 'Password must be at least 8 characters long.');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please check your registration details.', 'error');
        return;
      }

      const userData = {
        name: name,
        email: email,
        batch: "Batch of '26",
        role: 'Student Freelancer',
        created: new Date().toISOString()
      };
      saveAccount(userData);
      saveProfile({ name: name, email: email });

      showToast(`Account created for ${name}! Continuing to profile setup...`, 'success');
      setTimeout(() => {
        window.location.href = 'profile-creation.html';
      }, 800);
    });
  }

  // 7. Activate ?tab=signup if present in URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'signup') {
    switchAuthTab('signup');
  }
});
