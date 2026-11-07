/**
 * SKILLX - Profile Creation Step 3 JavaScript (profile-creation-step-3.js)
 * Handles availability card selection, rate range validation, contact channels, and JSON profile export.
 */

function selectAvailabilityCard(selectedCard) {
  document.querySelectorAll('.avail-status-card').forEach(card => {
    card.classList.remove('selected');
    const icon = card.querySelector('.status-radio-icon');
    if (icon) {
      icon.textContent = 'radio_button_unchecked';
      icon.style.color = '#cbd5e1';
    }
  });

  selectedCard.classList.add('selected');
  const activeIcon = selectedCard.querySelector('.status-radio-icon');
  if (activeIcon) {
    activeIcon.textContent = 'check_circle';
    activeIcon.style.color = 'var(--primary-blue)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileStep3Form');
  const minRateInput = document.getElementById('minRate');
  const maxRateInput = document.getElementById('maxRate');
  const timezoneSelect = document.getElementById('primaryTimezone');

  // 1. Restore saved availability/rate settings if present
  const saved = getProfile();
  if (saved.availability) {
    document.querySelectorAll('.avail-status-card').forEach(card => {
      const title = card.querySelector('h4')?.textContent.trim();
      if (title === saved.availability) selectAvailabilityCard(card);
    });
  }
  if (saved.hourlyRate) {
    if (minRateInput && saved.hourlyRate.min) minRateInput.value = saved.hourlyRate.min;
    if (maxRateInput && saved.hourlyRate.max) maxRateInput.value = saved.hourlyRate.max;
  }
  if (saved.timezone && timezoneSelect) {
    timezoneSelect.value = saved.timezone;
  }

  // 2. Bind availability status cards
  document.querySelectorAll('.avail-status-card').forEach(card => {
    card.addEventListener('click', () => selectAvailabilityCard(card));
  });

  // 3. Bind work preference & project type tag toggles
  document.querySelectorAll('.tag-btn-selectable').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('selected'));
  });

  // 4. Form validation, merge profile data, save & export JSON
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const minRate = Number(minRateInput.value);
      const maxRate = Number(maxRateInput.value);
      let isValid = true;

      clearFieldError(minRateInput);
      clearFieldError(maxRateInput);

      if (!minRate || minRate < 1) {
        setFieldError(minRateInput, 'Minimum rate must be at least $1.');
        isValid = false;
      }
      if (!maxRate || maxRate < 1) {
        setFieldError(maxRateInput, 'Maximum rate must be at least $1.');
        isValid = false;
      } else if (maxRate < minRate) {
        setFieldError(maxRateInput, 'Maximum rate must be greater than or equal to minimum rate.');
        isValid = false;
      }

      const selectedChannels = Array.from(document.querySelectorAll('input[name="contactChannel"]:checked'))
        .map(box => box.value);

      if (selectedChannels.length === 0) {
        showToast('Please select at least one preferred contact channel.', 'error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the highlighted availability details.', 'error');
        return;
      }

      const selectedCard = document.querySelector('.avail-status-card.selected');
      const statusTitle = selectedCard ? selectedCard.querySelector('h4').textContent.trim() : 'Available';

      const workPreferences = Array.from(document.querySelectorAll('#workPrefTags .tag-btn-selectable.selected'))
        .map(btn => btn.textContent.trim());

      const preferredProjectTypes = Array.from(document.querySelectorAll('#projectTypeTags .tag-btn-selectable.selected'))
        .map(btn => btn.textContent.trim());

      const completeProfile = saveProfile({
        name: getCurrentUserName(),
        role: 'Student Freelancer & Developer',
        batch: "Batch of '26",
        availability: statusTitle,
        hourlyRate: { min: minRate, max: maxRate, currency: 'USD' },
        workPreferences: workPreferences,
        preferredProjectTypes: preferredProjectTypes,
        timezone: timezoneSelect ? timezoneSelect.value : 'IST',
        contactChannels: selectedChannels,
        completedAt: new Date().toISOString()
      });

      // Download profile as local JSON file
      downloadJSON(completeProfile, 'skillx_profile.json');

      // Optional sync if local server.js is running
      await trySyncToServer('/api/save-profile', completeProfile);

      showToast('Profile setup complete! Saved & exported skillx_profile.json.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
});
