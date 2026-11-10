/**
 * SKILLX - Direct Client Messaging JavaScript (messages.js)
 * Manages conversation switching, persistent message history, live search, and chat replies.
 */

const DEFAULT_THREADS = {
  'Robotics Club': {
    status: 'Online • Verified Campus Organizer',
    projectId: 'proj-1',
    messages: [
      {
        type: 'incoming',
        text: 'Hi Tanish! Thanks for applying to the Campus Club Event Registration Web App project. We checked your portfolio link and were impressed by your previous React experience.',
        time: '10:42 AM'
      },
      {
        type: 'incoming',
        text: 'Are you able to start next Monday and deliver the QR check-in feature within the 2-week timeframe?',
        time: '10:45 AM'
      },
      {
        type: 'outgoing',
        text: 'Hi team! Yes, absolutely. I already have a reusable QR scanning component built with React & HTML5-QRCode that can integrate directly with Firebase. Happy to begin this Monday!',
        time: '10:48 AM'
      }
    ]
  },
  'Tech Summit Lead': {
    status: 'Offline • Active 1h ago',
    projectId: 'proj-2',
    messages: [
      {
        type: 'incoming',
        text: 'Hello! Can you provide your Figma link or previous landing page demo for our Tech Summit team to review?',
        time: 'Yesterday'
      }
    ]
  },
  'College Fest Core': {
    status: 'Online',
    projectId: 'proj-3',
    messages: [
      {
        type: 'incoming',
        text: 'We loved your UI mockups! Are you free for a quick milestone kickoff chat later today?',
        time: 'Oct 28'
      }
    ]
  }
};

let activePartner = 'Robotics Club';

function getStoredThreads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback below
  }
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_THREADS));
  return JSON.parse(JSON.stringify(DEFAULT_THREADS));
}

function saveStoredThreads(threads) {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(threads));
}

function renderActiveThread() {
  const threads = getStoredThreads();
  const thread = threads[activePartner] || DEFAULT_THREADS['Robotics Club'];

  const headerName = document.getElementById('activeChatName');
  const headerStatus = document.getElementById('activeChatStatus');
  const projectLink = document.getElementById('viewBriefLink');
  const chatInput = document.getElementById('chatInput');
  const container = document.getElementById('chatContainer');

  if (headerName) headerName.textContent = activePartner;
  if (headerStatus) headerStatus.textContent = `● ${thread.status}`;
  if (projectLink) projectLink.href = `project-details.html?id=${encodeURIComponent(thread.projectId)}`;
  if (chatInput) chatInput.placeholder = `Type a message to ${activePartner}...`;

  if (container) {
    container.innerHTML = thread.messages.map(msg => `
      <div class="message-bubble ${msg.type === 'outgoing' ? 'outgoing' : 'incoming'}">
        ${escapeHtml(msg.text)}
        <div class="message-time">${escapeHtml(msg.time)}</div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  }
}

function updateSidebarPreview(partnerName, snippet, timeLabel) {
  const item = document.querySelector(`.conv-item[data-partner="${partnerName}"]`);
  if (!item) return;
  const snippetEl = item.querySelector('.conv-snippet');
  const timeEl = item.querySelector('.time');
  if (snippetEl) snippetEl.textContent = snippet;
  if (timeEl) timeEl.textContent = timeLabel;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Switch Conversation Handlers
  const convItems = document.querySelectorAll('.conv-item[data-partner]');
  convItems.forEach(item => {
    item.addEventListener('click', () => {
      convItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activePartner = item.getAttribute('data-partner');
      renderActiveThread();
    });
  });

  // 2. Live Filter Conversations
  const searchInput = document.getElementById('searchConvInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      convItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // 3. Send Message Handler with Validation
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) {
        showToast('Please type a message before sending.', 'error');
        chatInput.focus();
        return;
      }

      const partnerAtSend = activePartner;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const threads = getStoredThreads();
      if (!threads[partnerAtSend]) {
        threads[partnerAtSend] = { status: 'Online', projectId: 'proj-1', messages: [] };
      }

      threads[partnerAtSend].messages.push({ type: 'outgoing', text: text, time: timeStr });
      saveStoredThreads(threads);
      updateSidebarPreview(partnerAtSend, text, timeStr);

      chatInput.value = '';
      renderActiveThread();

      // Simulated client response after 1s
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replyText = `Thanks for updating us! We have noted your message for ${partnerAtSend} and will confirm the next milestone shortly.`;

        const latestThreads = getStoredThreads();
        latestThreads[partnerAtSend].messages.push({
          type: 'incoming',
          text: replyText,
          time: replyTime
        });
        saveStoredThreads(latestThreads);
        updateSidebarPreview(partnerAtSend, replyText, replyTime);

        if (activePartner === partnerAtSend) {
          renderActiveThread();
        }
        showToast(`New reply from ${partnerAtSend}`, 'info');
      }, 1000);
    });
  }

  // 4. Footer Toast Links
  document.querySelectorAll('.footer-nav a[data-toast]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(link.getAttribute('data-toast'), 'info');
    });
  });

  renderActiveThread();
});
