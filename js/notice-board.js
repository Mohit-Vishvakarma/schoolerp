document.addEventListener('DOMContentLoaded', async function() {
    if (window.ensureVmDataReady) {
        await window.ensureVmDataReady({ forceHydrate: true });
    }

    loadNotices();

    setTimeout(() => {
        const popup = document.getElementById('notice-popup');
        if (popup) popup.style.display = 'flex';
    }, 1200);
});

function loadNotices() {
    let notices = JSON.parse(localStorage.getItem('vm_notices') || '[]');

    if (!notices.length) {
        notices = [
            {
                id: 'NT001',
                title: 'School Holiday Notice',
                content: 'School will remain closed on Monday due to maintenance work.',
                date: '2026-04-05',
                type: 'important',
                author: 'Admin'
            }
        ];
        localStorage.setItem('vm_notices', JSON.stringify(notices));
    }

    notices = [...notices].sort((a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0));

    const noticesContainer = document.getElementById('notices-container');
    if (!noticesContainer) return;

    noticesContainer.innerHTML = notices.map(notice => `
        <div class="card notice-card ${notice.type || 'general'}">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:12px;">
                <h3>${notice.title}</h3>
                <span class="notice-type ${notice.type || 'general'}">${getNoticeTypeLabel(notice.type)}</span>
            </div>
            <p>${notice.content}</p>
            <small style="color:#666;">Posted on: ${formatDate(notice.date || notice.timestamp)} | By: ${notice.author || 'Admin'}</small>
        </div>
    `).join('');

    const latest = notices[0];
    if (latest) {
        const popupContent = document.getElementById('popup-notice-content');
        const popupDate = document.getElementById('popup-notice-date');
        if (popupContent) popupContent.textContent = latest.content;
        if (popupDate) popupDate.textContent = formatDate(latest.date || latest.timestamp);
    }
}

function getNoticeTypeLabel(type) {
    const labels = {
        important: 'Important',
        urgent: 'Urgent',
        general: 'General',
        event: 'Event',
        academic: 'Academic',
        info: 'Info'
    };
    return labels[type] || 'General';
}

function formatDate(dateString) {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function closeNoticePopup() {
    const popup = document.getElementById('notice-popup');
    if (popup) popup.style.display = 'none';
}

const style = document.createElement('style');
style.textContent = `
    .notice-card.important { border-left: 5px solid #ff6b6b; }
    .notice-card.urgent { border-left: 5px solid #ff4757; background: #ffeaea; }
    .notice-card.event { border-left: 5px solid #3742fa; }
    .notice-card.academic { border-left: 5px solid #ffa502; }
    .notice-card.info { border-left: 5px solid #2563eb; }
    .notice-type {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .notice-type.important { background: #ff6b6b; color: white; }
    .notice-type.urgent { background: #ff4757; color: white; }
    .notice-type.general { background: #7bed9f; color: white; }
    .notice-type.event { background: #3742fa; color: white; }
    .notice-type.academic { background: #ffa502; color: white; }
    .notice-type.info { background: #2563eb; color: white; }
`;
document.head.appendChild(style);
