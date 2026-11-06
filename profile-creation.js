/**
 * SKILLX - Profile Creation Step 1 JavaScript (profile-creation.js)
 * Handles avatar upload/preview, experience tabs, skill tag selection, and form validation.
 */

let uploadedAvatarDataUrl = '';

function updateBioCounter() {
  const bioInput = document.getElementById('bioInput');
  const bioHint = document.getElementById('bioHint');
  if (!bioInput || !bioHint) return;

  const len = bioInput.value.trim().length;
  bioHint.textContent = `${len} / 150 minimum characters`;
  bioHint.style.color = len >= 150 ? 'var(--brand-green-dark)' : '#ef4444';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileStep1Form');
  const fullNameInput = document.getElementById('fullName');
  const titleInput = document.getElementById('titleHeadline');
  const locationInput = document.getElementById('locationInput');
  const bioInput = document.getElementById('bioInput');
  const photoInput = document.getElementById('photoInput');
  const avatarPreview = document.getElementById('avatarPreview');
  const uploadBtn = document.getElementById('uploadPicBtn');
  const deleteBtn = document.getElementById('deletePicBtn');

  // 1. Restore saved profile data if user returns to Step 1
  const saved = getProfile();
  if (saved.name && fullNameInput) fullNameInput.value = saved.name;
  if (saved.headline && titleInput) titleInput.value = saved.headline;
  if (saved.location && locationInput) locationInput.value = saved.location;
  if (saved.bio && bioInput) bioInput.value = saved.bio;
  if (saved.avatar && avatarPreview) {
    uploadedAvatarDataUrl = saved.avatar;
    avatarPreview.innerHTML = `<img src="${saved.avatar}" alt="Profile Preview" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
  }
  if (saved.experienceLevel) {
    document.querySelectorAll('.exp-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === saved.experienceLevel);
    });
  }
  if (Array.isArray(saved.skills) && saved.skills.length > 0) {
    document.querySelectorAll('.tag-btn-selectable').forEach(btn => {
      btn.classList.toggle('selected', saved.skills.includes(btn.textContent.trim()));
    });
  }

  updateBioCounter();
  if (bioInput) {
    bioInput.addEventListener('input', updateBioCounter);
  }

  // 2. Photo Upload & Delete
  if (uploadBtn && photoInput) {
    uploadBtn.addEventListener('click', () => photoInput.click());
  }

  if (photoInput && avatarPreview) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid JPG, PNG, or GIF image.', 'error');
        photoInput.value = '';
        return;
      }
      if (file.size > 800 * 1024) {
        showToast('Profile image must be smaller than 800 KB.', 'error');
        photoInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        uploadedAvatarDataUrl = evt.target.result;
        avatarPreview.innerHTML = `<img src="${uploadedAvatarDataUrl}" alt="Profile Preview" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
        showToast('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  if (deleteBtn && photoInput && avatarPreview) {
    deleteBtn.addEventListener('click', () => {
      photoInput.value = '';
      uploadedAvatarDataUrl = '';
      avatarPreview.innerHTML = '<span class="material-symbols-outlined">photo_camera</span>';
      showToast('Profile photo removed.', 'info');
    });
  }

  // 3. Experience Level Tabs
  document.querySelectorAll('.exp-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.exp-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 4. Skill Tags Selection
  document.querySelectorAll('.tag-btn-selectable').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  // 5. Form Validation & Save before continuing to Step 2
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = fullNameInput.value.trim();
      const headline = titleInput.value.trim();
      const locationVal = locationInput.value.trim();
      const bio = bioInput.value.trim();

      const activeExpBtn = document.querySelector('.exp-tab-btn.active');
      const experienceLevel = activeExpBtn ? activeExpBtn.textContent.trim() : 'Junior';
      const selectedSkills = Array.from(document.querySelectorAll('.tag-btn-selectable.selected'))
        .map(btn => btn.textContent.trim());

      let isValid = true;
      clearFieldError(fullNameInput);
      clearFieldError(titleInput);
      clearFieldError(locationInput);
      clearFieldError(bioInput);

      if (fullName.length < 2) {
        setFieldError(fullNameInput, 'Please enter your full name (min 2 characters).');
        isValid = false;
      }
      if (headline.length < 5) {
        setFieldError(titleInput, 'Please enter a descriptive professional headline.');
        isValid = false;
      }
      if (!locationVal) {
        setFieldError(locationInput, 'Please enter your city or campus location.');
        isValid = false;
      }
      if (bio.length < 150) {
        setFieldError(bioInput, `Bio must be at least 150 characters (currently ${bio.length}).`);
        isValid = false;
      }
      if (selectedSkills.length === 0) {
        showToast('Please select at least one technical skill.', 'error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please complete all required profile details.', 'error');
        return;
      }

      saveProfile({
        name: fullName,
        headline: headline,
        location: locationVal,
        bio: bio,
        experienceLevel: experienceLevel,
        skills: selectedSkills,
        avatar: uploadedAvatarDataUrl
      });

      showToast('Step 1 saved! Moving to Portfolio & Links...', 'success');
      setTimeout(() => {
        window.location.href = 'profile-creation-step-2.html';
      }, 500);
    });
  }
});
