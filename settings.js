/**
 * SKILLX - Account Settings JavaScript (settings.js)
 * Loads/saves user identity, notification preferences, password changes, and JSON exports.
 */

function syncHeaderIdentity() {
  const userName = getCurrentUserName();
  const profile = getProfile();

  const chipNameEl = document.getElementById('chipUserName');
  const chipRoleEl = document.getElementById('chipUserRole');
  const chipAvatarEl = document.getElementById('chipUserAvatar');
  const badgeBatchEl = document.getElementById('sidebarBadgeSub');

  if (chipNameEl) chipNameEl.textContent = userName;
  if (chipRoleEl) chipRoleEl.textContent = profile.role || 'Student';
  if (badgeBatchEl) badgeBatchEl.textContent = profile.batch || "Batch of '26";
  if (chipAvatarEl) {
    chipAvatarEl.src = profile.avatar || getDefaultAvatar(userName);
  }
}

function populateSettingsForms() {
  const profile = getProfile();
  const settings = getSettings();

  const fullNameEl = document.getElementById('settingFullName');
  const emailEl = document.getElementById('settingEmail');
  const headlineEl = document.getElementById('settingHeadline');
  const collegeEl = document.getElementById('settingCollege');
  const batchEl = document.getElementById('settingBatch');
  const locationEl = document.getElementById('settingLocation');

  if (fullNameEl) fullNameEl.value = profile.name || '';
  if (emailEl) emailEl.value = profile.email || '';
  if (headlineEl) headlineEl.value = profile.headline || '';
  if (collegeEl) collegeEl.value = profile.college || '';
  if (batchEl && profile.batch) batchEl.value = profile.batch;
  if (locationEl) locationEl.value = profile.location || '';

  const emailNotifEl = document.getElementById('prefEmailNotifications');
  const projectAlertsEl = document.getElementById('prefProjectAlerts');
  const messageAlertsEl = document.getElementById('prefMessageAlerts');
  const profilePublicEl = document.getElementById('prefProfilePublic');
  const digestEl = document.getElementById('prefDigestFrequency');

  if (emailNotifEl) emailNotifEl.checked = Boolean(settings.emailNotifications);
  if (projectAlertsEl) projectAlertsEl.checked = Boolean(settings.projectAlerts);
  if (messageAlertsEl) messageAlertsEl.checked = Boolean(settings.messageAlerts);
  if (profilePublicEl) profilePublicEl.checked = Boolean(settings.profilePublic);
  if (digestEl && settings.digestFrequency) digestEl.value = settings.digestFrequency;
}

document.addEventListener('DOMContentLoaded', () => {
  syncHeaderIdentity();
  populateSettingsForms();

  // 1. Account Identity Form Validation & Save
  const accountForm = document.getElementById('accountSettingsForm');
  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullNameInput = document.getElementById('settingFullName');
      const emailInput = document.getElementById('settingEmail');
      const headlineInput = document.getElementById('settingHeadline');
      const collegeInput = document.getElementById('settingCollege');
      const batchInput = document.getElementById('settingBatch');
      const locationInput = document.getElementById('settingLocation');

      const nameVal = fullNameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const headlineVal = headlineInput.value.trim();
      const collegeVal = collegeInput.value.trim();
      const batchVal = batchInput ? batchInput.value : "Batch of '26";
      const locationVal = locationInput ? locationInput.value.trim() : '';

      let isValid = true;
      clearFieldError(fullNameInput);
      clearFieldError(emailInput);
      clearFieldError(headlineInput);
      clearFieldError(collegeInput);

      if (nameVal.length < 2) {
        setFieldError(fullNameInput, 'Please enter your full name (at least 2 characters).');
        isValid = false;
      }
      if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, 'Please enter a valid campus email address.');
        isValid = false;
      }
      if (headlineVal.length < 5) {
        setFieldError(headlineInput, 'Please enter a short headline (at least 5 characters).');
        isValid = false;
      }
      if (collegeVal.length < 2) {
        setFieldError(collegeInput, 'Please enter your college or institute name.');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the highlighted account fields.', 'error');
        return;
      }

      const updatedProfile = saveProfile({
        name: nameVal,
        email: emailVal,
        headline: headlineVal,
        college: collegeVal,
        batch: batchVal,
        location: locationVal
      });

      syncHeaderIdentity();
      trySyncToServer('/api/save-profile', updatedProfile);
      showToast('Account settings saved cleanly!', 'success');
    });
  }

  // 2. Notification & Privacy Preferences Form
  const prefsForm = document.getElementById('preferencesSettingsForm');
  if (prefsForm) {
    prefsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      saveSettings({
        emailNotifications: Boolean(document.getElementById('prefEmailNotifications')?.checked),
        projectAlerts: Boolean(document.getElementById('prefProjectAlerts')?.checked),
        messageAlerts: Boolean(document.getElementById('prefMessageAlerts')?.checked),
        profilePublic: Boolean(document.getElementById('prefProfilePublic')?.checked),
        digestFrequency: document.getElementById('prefDigestFrequency')?.value || 'Weekly'
      });

      showToast('Notification and privacy preferences updated!', 'success');
    });
  }

  // 3. Password Toggle & Validation
  document.querySelectorAll('.toggle-password-btn[data-toggle-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  });

  const passwordForm = document.getElementById('passwordSettingsForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const currentInput = document.getElementById('currentPasswordInput');
      const newInput = document.getElementById('newPasswordInput');
      const confirmInput = document.getElementById('confirmPasswordInput');

      const currentVal = currentInput.value;
      const newVal = newInput.value;
      const confirmVal = confirmInput.value;

      let isValid = true;
      clearFieldError(currentInput);
      clearFieldError(newInput);
      clearFieldError(confirmInput);

      if (currentVal.length < 6) {
        setFieldError(currentInput, 'Enter your current password (min 6 characters).');
        isValid = false;
      }
      if (newVal.length < 8) {
        setFieldError(newInput, 'New password must be at least 8 characters long.');
        isValid = false;
      }
      if (confirmVal !== newVal || !confirmVal) {
        setFieldError(confirmInput, 'Passwords do not match.');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please check your password fields.', 'error');
        return;
      }

      saveSettings({ passwordUpdatedAt: new Date().toISOString() });
      passwordForm.reset();
      showToast('Password updated successfully!', 'success');
    });
  }

  // 4. Local JSON Downloads & Two-Step Demo Reset
  document.getElementById('downloadProfileJsonBtn')?.addEventListener('click', () => {
    downloadJSON(getProfile(), 'skillx_profile.json');
    showToast('Downloaded skillx_profile.json!', 'success');
  });

  document.getElementById('downloadSettingsJsonBtn')?.addEventListener('click', () => {
    downloadJSON(getSettings(), 'skillx_settings.json');
    showToast('Downloaded skillx_settings.json!', 'success');
  });

  const resetBtn = document.getElementById('resetDemoDataBtn');
  if (resetBtn) {
    let resetTimer = null;
    resetBtn.addEventListener('click', () => {
      if (resetBtn.dataset.confirming !== 'true') {
        resetBtn.dataset.confirming = 'true';
        resetBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">warning</span> Click Again to Confirm Reset';
        resetTimer = setTimeout(() => {
          resetBtn.dataset.confirming = 'false';
          resetBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">restart_alt</span> Reset Demo Data';
        }, 4000);
        return;
      }

      if (resetTimer) clearTimeout(resetTimer);
      resetBtn.dataset.confirming = 'false';
      resetBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">restart_alt</span> Reset Demo Data';

      resetDemoData();
      syncHeaderIdentity();
      populateSettingsForms();
      showToast('Demo data restored to defaults.', 'info');
    });
  }

  // 5. Shared Header Search, Profile Chip & Notifications
  document.querySelectorAll('[data-href]').forEach(el => {
    el.addEventListener('click', () => {
      const targetUrl = el.getAttribute('data-href');
      if (targetUrl) window.location.href = targetUrl;
    });
  });

  document.getElementById('notificationBtn')?.addEventListener('click', () => {
    showToast('All caught up! Your SKILLX settings are synced locally.', 'info');
  });

  document.getElementById('topbarSearchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      window.location.href = q ? `find-work.html?q=${encodeURIComponent(q)}` : 'find-work.html';
    }
  });
});
