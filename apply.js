/**
 * SKILLX - Application Form JavaScript (apply.js)
 * Handles live character count, file upload/drop validation, form validation, and JSON export.
 */

let activeProject = null;
let selectedFileObject = null;

function applyUploadedFile(file) {
  const fileInput = document.getElementById('workSampleFile');
  if (!file) return;

  const allowedExt = ['.pdf', '.png', '.jpg', '.jpeg'];
  const fileNameLower = file.name.toLowerCase();
  if (!allowedExt.some(ext => fileNameLower.endsWith(ext))) {
    showToast('Work sample must be PDF, PNG, or JPG.', 'error');
    if (fileInput) fileInput.value = '';
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('File size must be under 10 MB.', 'error');
    if (fileInput) fileInput.value = '';
    return;
  }

  selectedFileObject = file;
  document.getElementById('fileNameLabel').textContent = file.name;
  document.getElementById('filePreviewPill').style.display = 'inline-flex';
  showToast('Work sample attached!', 'success');
}

function clearUploadedFile() {
  selectedFileObject = null;
  const fileInput = document.getElementById('workSampleFile');
  const previewPill = document.getElementById('filePreviewPill');
  if (fileInput) fileInput.value = '';
  if (previewPill) previewPill.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load Project details from ?id=
  const params = new URLSearchParams(window.location.search);
  const projId = params.get('id') || 'proj-1';
  activeProject = getProjectById(projId);

  if (activeProject) {
    document.getElementById('backToProjectLink').href = `project-details.html?id=${encodeURIComponent(activeProject.id)}`;
    document.getElementById('applyHeaderSubtitle').textContent = `Tell ${activeProject.client.name} how you'll bring their project to life.`;
    document.getElementById('agreementBudget').textContent = `₹${activeProject.budget}`;
    document.getElementById('formFooterClientName').textContent = activeProject.client.name;

    // Sidebar Summary
    document.getElementById('sideCategory').textContent = activeProject.category;
    document.getElementById('sideTitle').textContent = activeProject.title;
    document.getElementById('sideClientName').textContent = activeProject.client.name;
    document.getElementById('sideBudget').textContent = `₹${activeProject.budget}`;
    document.getElementById('sideDuration').textContent = activeProject.duration;
    document.getElementById('sideLevel').textContent = activeProject.level;
    document.getElementById('sideDeadline').textContent = activeProject.deadline;

    const skillsText = (activeProject.skills || []).join(', ');
    document.getElementById('tipText').textContent =
      `Keep it specific. Highlight your experience in ${skillsText} and explain your approach to project deliverables.`;
  }

  // 2. Live Cover Letter Character Counter
  const coverLetterInput = document.getElementById('coverLetterInput');
  const charCounter = document.getElementById('charCounter');
  if (coverLetterInput && charCounter) {
    coverLetterInput.addEventListener('input', () => {
      const len = coverLetterInput.value.length;
      charCounter.textContent = `${len} / 2000 characters`;
      charCounter.style.color = len >= 20 ? 'var(--brand-green-dark)' : 'var(--text-muted)';
    });
  }

  // 3. Work Sample File Upload & Drag-and-Drop
  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('workSampleFile');
  const removeBtn = document.getElementById('removeFileBtn');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) applyUploadedFile(e.target.files[0]);
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--primary-blue)';
      dropzone.style.background = '#f0f7ff';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '#cbd5e1';
      dropzone.style.background = '#f8fafc';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#cbd5e1';
      dropzone.style.background = '#f8fafc';
      if (e.dataTransfer.files.length > 0) applyUploadedFile(e.dataTransfer.files[0]);
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', clearUploadedFile);
  }

  // 4. Form Validation, Submission & Local JSON Save
  const form = document.getElementById('applicationForm');
  const portfolioInput = document.getElementById('portfolioLinkInput');
  const deliverySelect = document.getElementById('estimatedDeliverySelect');
  const agreementCheck = document.getElementById('budgetAgreementCheck');
  const submitBtn = document.getElementById('submitAppBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const coverLetter = coverLetterInput.value.trim();
      const portfolioLink = portfolioInput.value.trim();
      const estimatedDelivery = deliverySelect.value;
      const budgetAgreed = agreementCheck.checked;
      let isValid = true;

      clearFieldError(coverLetterInput);
      clearFieldError(portfolioInput);

      if (coverLetter.length < 20) {
        setFieldError(coverLetterInput, `Please write at least 20 characters (currently ${coverLetter.length}).`);
        isValid = false;
      }

      if (!isValidUrl(portfolioLink)) {
        setFieldError(portfolioInput, 'Please enter a valid portfolio URL starting with https:// or http://');
        isValid = false;
      }

      if (!budgetAgreed) {
        showToast('Please confirm the project budget agreement checkbox.', 'error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the highlighted proposal fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Saving...</span> <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>`;

      const account = getAccount();
      const newApplication = {
        id: 'app-' + Date.now(),
        projectId: activeProject ? activeProject.id : 'proj-1',
        projectTitle: activeProject ? activeProject.title : 'Campus Club Event Registration Web App',
        clientName: activeProject ? activeProject.client.name : 'Robotics Club',
        budget: activeProject ? `₹${activeProject.budget}` : '₹2000',
        submittedAt: new Date().toISOString(),
        status: 'Under Review',
        coverLetter: coverLetter,
        portfolioLink: portfolioLink,
        fileName: selectedFileObject ? selectedFileObject.name : 'No file attached',
        estimatedDelivery: estimatedDelivery,
        termsAgreed: budgetAgreed,
        applicant: {
          name: getCurrentUserName(),
          role: 'Student & Freelancer',
          email: account && account.email ? account.email : 'tanish@campus.edu'
        }
      };

      // 1. Save to localStorage
      saveApplication(newApplication);

      // 2. Download JSON file to local disk
      downloadJSON(newApplication, `application_${newApplication.id}.json`);

      // 3. Optional sync to local Node server
      await trySyncToServer('/api/save-application', newApplication);

      showToast('Application submitted & saved to local JSON successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'applications.html?submitted=true';
      }, 1000);
    });
  }

  // 5. Footer Toast Links
  document.querySelectorAll('.footer-nav a[data-toast]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(link.getAttribute('data-toast'), 'info');
    });
  });
});
