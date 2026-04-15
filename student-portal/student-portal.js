// ===================== STUDENT PORTAL JS =====================

// Get current student from localStorage
function getCurrentStudent() {
  const auth = localStorage.getItem('ssvm_auth');
  if (!auth) return null;
  return JSON.parse(auth).user;
}

// Initialize Student Portal
document.addEventListener('DOMContentLoaded', function() {
  const student = getCurrentStudent();
  
  if (!student) {
    window.location.href = '../pages/login.html';
    return;
  }

  // Update header with student name
  const headerName = document.getElementById('headerName');
  if (headerName) {
    headerName.textContent = student.name;
  }

  // Initialize sidebar navigation
  const navLinks = document.querySelectorAll('.portal-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSection = this.getAttribute('data-section');
      showSection(targetSection);
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // Initialize sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  const overlay = document.getElementById('portalSidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('portalSidebar');
    const toggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('portalSidebarOverlay');
    const clickedToggle = !!(toggle && toggle.contains(e.target));
    if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !clickedToggle) {
      if (overlay && overlay.contains(e.target)) return;
      closeSidebar();
    }
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  // Load student data
  loadStudentData(student.id);

  // Update today's schedule display
  updateTodaySchedule();

  // Show first section by default
  showSection('secDash');
  navLinks[0].classList.add('active');
});

// Show/Hide Sections
function showSection(sectionId) {
  document.querySelectorAll('[id^="sec"]').forEach(sec => {
    sec.style.display = 'none';
  });
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = 'block';
    
    // Load section-specific data
    if (sectionId === 'secLibrary') {
      loadLibraryData();
    } else if (sectionId === 'secTimetable') {
      loadStudentTimetable();
    }
  }
}

// Sidebar Toggle Functions
function toggleSidebar() {
  console.log('toggleSidebar called');
  const sidebar = document.getElementById('portalSidebar');
  const main = document.querySelector('.portal-main');
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  console.log('openSidebar called');
  const sidebar = document.getElementById('portalSidebar');
  const main = document.querySelector('.portal-main');
  const overlay = document.getElementById('portalSidebarOverlay');
  const toggle = document.getElementById('sidebarToggle');
  sidebar.classList.add('open');
  overlay?.classList.add('show');
  toggle?.setAttribute('aria-expanded', 'true');
  if (main) main.classList.remove('sidebar-hidden');
}

function closeSidebar() {
  const sidebar = document.getElementById('portalSidebar');
  const main = document.querySelector('.portal-main');
  const overlay = document.getElementById('portalSidebarOverlay');
  const toggle = document.getElementById('sidebarToggle');
  sidebar.classList.remove('open');
  overlay?.classList.remove('show');
  toggle?.setAttribute('aria-expanded', 'false');
  if (main) main.classList.add('sidebar-hidden');
}

// Modal Functions
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open');
  }
}

function openEditProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) {
    // Load current profile data
    const student = getCurrentStudent();
    if (student) {
      document.getElementById('profileInputName').value = student.name || '';
      document.getElementById('profileInputEmail').value = student.email || '';
      // Add more fields as needed
    }
    modal.style.display = 'flex';
  }
}

function saveProfile() {
  // Save profile logic here
  alert('Profile saved successfully!');
  closeModal('profileModal');
}

function composeMessage() {
  const modal = document.getElementById('messageModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function sendMessage() {
  // Send message logic here
  alert('Message sent successfully!');
  closeModal('messageModal');
}

// Quick Action Functions
function viewTimetable() {
  showSection('secTimetable');
  // Update navigation
  document.querySelectorAll('.portal-nav a').forEach(link => link.classList.remove('active'));
  document.querySelector('[data-section="secTimetable"]').classList.add('active');
}

function viewHomework() {
  showSection('secHomework');
  document.querySelectorAll('.portal-nav a').forEach(link => link.classList.remove('active'));
  document.querySelector('[data-section="secHomework"]').classList.add('active');
}

function viewResults() {
  showSection('secMarks');
  document.querySelectorAll('.portal-nav a').forEach(link => link.classList.remove('active'));
  document.querySelector('[data-section="secMarks"]').classList.add('active');
}

function downloadStudyMaterial() {
  alert('Study material download started. Check your downloads folder.');
}

function payFees() {
  showSection('secFees');
  document.querySelectorAll('.portal-nav a').forEach(link => link.classList.remove('active'));
  document.querySelector('[data-section="secFees"]').classList.add('active');
}

function downloadTimetable() {
  alert('Timetable downloaded successfully!');
}

function viewExamSyllabus(examId) {
  alert(`Syllabus for ${examId} opened in new tab.`);
}

function viewExamDetails(examId) {
  alert(`Exam details for ${examId} displayed.`);
}

function doLogout() {
  logoutStudent();
}

// Daily Schedule Functions
let dailyScheduleData = [];

function openDailyScheduleModal() {
  // Load existing daily schedule if available
  const student = getCurrentStudent();
  const today = new Date().toDateString();
  
  if (student && student.dailySchedules && student.dailySchedules[today]) {
    dailyScheduleData = [...student.dailySchedules[today]];
  } else {
    dailyScheduleData = [];
  }
  
  updateDailyTimeline();
  document.getElementById('dailyScheduleModal').style.display = 'flex';
  document.getElementById('dailyScheduleModal').classList.add('open');
}

function addDailyActivity() {
  const startTime = document.getElementById('dailyStartTime').value;
  const endTime = document.getElementById('dailyEndTime').value;
  const activity = document.getElementById('dailyActivity').value.trim();
  const category = document.getElementById('dailyCategory').value;
  const priority = document.getElementById('dailyPriority').value;
  
  if (!startTime || !endTime || !activity) {
    alert('Please fill in all required fields (Start Time, End Time, Activity)');
    return;
  }
  
  // Check for time conflicts
  const conflict = dailyScheduleData.some(item => {
    return (startTime >= item.startTime && startTime < item.endTime) ||
           (endTime > item.startTime && endTime <= item.endTime) ||
           (startTime <= item.startTime && endTime >= item.endTime);
  });
  
  if (conflict) {
    alert('Time conflict detected! Please choose a different time slot.');
    return;
  }
  
  const newActivity = {
    id: Date.now(),
    startTime,
    endTime,
    activity,
    category,
    priority
  };
  
  dailyScheduleData.push(newActivity);
  dailyScheduleData.sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  updateDailyTimeline();
  clearDailyForm();
}

function clearDailyForm() {
  document.getElementById('dailyStartTime').value = '';
  document.getElementById('dailyEndTime').value = '';
  document.getElementById('dailyActivity').value = '';
  document.getElementById('dailyCategory').value = 'study';
  document.getElementById('dailyPriority').value = 'medium';
}

function updateDailyTimeline() {
  const timeline = document.getElementById('dailyTimeline');
  
  if (dailyScheduleData.length === 0) {
    timeline.innerHTML = '<div class="timeline-empty">No activities planned for today. Add some activities to get started!</div>';
    return;
  }
  
  timeline.innerHTML = dailyScheduleData.map(activity => `
    <div class="timeline-activity">
      <div class="activity-time">${activity.startTime} - ${activity.endTime}</div>
      <div class="activity-content">
        <div class="activity-title">${activity.activity}</div>
        <div class="activity-meta">
          <span class="activity-category ${activity.category}">${getCategoryLabel(activity.category)}</span>
          <span class="activity-priority ${activity.priority}">${activity.priority}</span>
        </div>
      </div>
      <div class="activity-actions">
        <button class="activity-remove" onclick="removeDailyActivity(${activity.id})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function getCategoryLabel(category) {
  const labels = {
    study: 'Study',
    sports: 'Sports',
    homework: 'Homework',
    coaching: 'Coaching',
    personal: 'Personal',
    other: 'Other'
  };
  return labels[category] || 'Other';
}

function removeDailyActivity(activityId) {
  dailyScheduleData = dailyScheduleData.filter(activity => activity.id !== activityId);
  updateDailyTimeline();
}

function saveDailySchedule() {
  const student = getCurrentStudent();
  if (!student) {
    alert('Student not found. Please login again.');
    return;
  }
  
  const today = new Date().toDateString();
  
  // Initialize dailySchedules if it doesn't exist
  if (!student.dailySchedules) {
    student.dailySchedules = {};
  }
  
  // Save today's schedule
  student.dailySchedules[today] = [...dailyScheduleData];
  
  // Update localStorage
  const students = JSON.parse(localStorage.getItem('ssvm_students') || '{}');
  students[student.id] = student;
  localStorage.setItem('ssvm_students', JSON.stringify(students));
  
  // Update current auth
  const auth = JSON.parse(localStorage.getItem('ssvm_auth'));
  auth.user = student;
  localStorage.setItem('ssvm_auth', JSON.stringify(auth));
  
  // Update today's schedule display
  updateTodaySchedule();
  
  closeModal('dailyScheduleModal');
  alert('Daily schedule saved successfully!');
}

function updateTodaySchedule() {
  const student = getCurrentStudent();
  const today = new Date().toDateString();
  const todayContainer = document.getElementById('todaySchedule');
  
  if (student && student.dailySchedules && student.dailySchedules[today] && student.dailySchedules[today].length > 0) {
    const activities = student.dailySchedules[today];
    todayContainer.innerHTML = activities.map(activity => `
      <div class="schedule-item daily-activity">
        <div class="schedule-time">${activity.startTime} - ${activity.endTime}</div>
        <div class="schedule-content">
          <div class="schedule-subject">${activity.activity}</div>
          <div class="schedule-meta">
            <span class="activity-category ${activity.category}">${getCategoryLabel(activity.category)}</span>
            <span class="activity-priority ${activity.priority}">Priority: ${activity.priority}</span>
          </div>
        </div>
        <div class="schedule-type">${getCategoryIcon(activity.category)}</div>
      </div>
    `).join('');
  } else {
    // Show default schedule or empty state
    todayContainer.innerHTML = `
      <div class="schedule-item">
        <div class="schedule-time">8:00 - 8:45</div>
        <div class="schedule-content">
          <div class="schedule-subject">Mathematics</div>
          <div class="schedule-teacher">Mr. Sharma</div>
        </div>
        <div class="schedule-room">Room 101</div>
      </div>
      <div class="schedule-empty-notice">
        <i class="fas fa-calendar-plus"></i>
        <p>Click "Plan My Day" to add your personal activities and organize your schedule!</p>
      </div>
    `;
  }
}

function getCategoryIcon(category) {
  const icons = {
    study: '📚',
    sports: '⚽',
    homework: '📝',
    coaching: '🎓',
    personal: '👤',
    other: '📌'
  };
  return icons[category] || '📌';
}

// Manual Schedule Functions
let manualScheduleData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: []
};

function openManualScheduleModal() {
  // Load existing schedule if available
  const student = getCurrentStudent();
  if (student && student.customTimetable) {
    manualScheduleData = { ...student.customTimetable };
  } else {
    // Reset to empty schedule
    manualScheduleData = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };
  }
  
  updateSchedulePreview();
  const modal = document.getElementById('manualScheduleModal');
  modal.style.display = 'flex';
  modal.classList.add('open');
}

function addScheduleItem() {
  const day = document.getElementById('scheduleDay').value;
  const startTime = document.getElementById('scheduleStartTime').value;
  const endTime = document.getElementById('scheduleEndTime').value;
  const subject = document.getElementById('scheduleSubject').value.trim();
  const teacher = document.getElementById('scheduleTeacher').value.trim();
  const room = document.getElementById('scheduleRoom').value.trim();
  
  if (!day || !startTime || !endTime || !subject) {
    alert('Please fill in all required fields (Day, Start Time, End Time, Subject)');
    return;
  }
  
  const newClass = {
    id: Date.now(),
    startTime,
    endTime,
    subject,
    teacher: teacher || '',
    room: room || ''
  };
  
  manualScheduleData[day].push(newClass);
  manualScheduleData[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  updateSchedulePreview();
  clearScheduleForm();
}

function clearScheduleForm() {
  document.getElementById('scheduleDay').value = '';
  document.getElementById('scheduleStartTime').value = '';
  document.getElementById('scheduleEndTime').value = '';
  document.getElementById('scheduleSubject').value = '';
  document.getElementById('scheduleTeacher').value = '';
  document.getElementById('scheduleRoom').value = '';
}

function updateSchedulePreview() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  days.forEach(day => {
    const container = document.getElementById(day.toLowerCase() + 'Classes');
    const classes = manualScheduleData[day];
    
    if (classes.length === 0) {
      container.innerHTML = '<div class="schedule-empty">No classes scheduled</div>';
    } else {
      container.innerHTML = classes.map(cls => `
        <div class="schedule-class-item">
          <div class="schedule-class-time">${cls.startTime} - ${cls.endTime}</div>
          <div class="schedule-class-subject">${cls.subject}</div>
          ${cls.teacher ? `<div class="schedule-class-teacher">${cls.teacher}</div>` : ''}
          ${cls.room ? `<div class="schedule-class-room">${cls.room}</div>` : ''}
          <button class="schedule-class-remove" onclick="removeScheduleItem('${day}', ${cls.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
    }
  });
}

function removeScheduleItem(day, classId) {
  manualScheduleData[day] = manualScheduleData[day].filter(cls => cls.id !== classId);
  updateSchedulePreview();
}

function saveManualSchedule() {
  const student = getCurrentStudent();
  if (!student) {
    alert('Student not found. Please login again.');
    return;
  }
  
  // Save to student's custom timetable
  student.customTimetable = { ...manualScheduleData };
  
  // Update localStorage
  const students = JSON.parse(localStorage.getItem('ssvm_students') || '{}');
  students[student.id] = student;
  localStorage.setItem('ssvm_students', JSON.stringify(students));
  
  // Update current auth
  const auth = JSON.parse(localStorage.getItem('ssvm_auth'));
  auth.user = student;
  localStorage.setItem('ssvm_auth', JSON.stringify(auth));
  
  // Refresh timetable display
  loadStudentTimetable();
  
  closeModal('manualScheduleModal');
  alert('Manual schedule saved successfully!');
}

function resetTimetable() {
  if (confirm('Are you sure you want to reset to the default school timetable? This will remove your custom schedule.')) {
    const student = getCurrentStudent();
    if (student) {
      delete student.customTimetable;
      
      // Update localStorage
      const students = JSON.parse(localStorage.getItem('ssvm_students') || '{}');
      students[student.id] = student;
      localStorage.setItem('ssvm_students', JSON.stringify(students));
      
      // Update current auth
      const auth = JSON.parse(localStorage.getItem('ssvm_auth'));
      auth.user = student;
      localStorage.setItem('ssvm_auth', JSON.stringify(auth));
      
      // Refresh timetable display
      loadStudentTimetable();
      
      alert('Timetable reset to default successfully!');
    }
  }
}

function loadStudentTimetable() {
  const student = getCurrentStudent();
  let timetableData;
  
  if (student && student.customTimetable) {
    // Use custom timetable
    timetableData = student.customTimetable;
  } else {
    // Use default school timetable
    timetableData = {
      Monday: ['Mathematics', 'Science', 'English', 'History', 'Physical Education'],
      Tuesday: ['Science', 'Mathematics', 'Hindi', 'Geography', 'Art'],
      Wednesday: ['English', 'History', 'Mathematics', 'Computer Science', 'Music'],
      Thursday: ['Geography', 'Science', 'Hindi', 'Mathematics', 'Sports'],
      Friday: ['History', 'English', 'Science', 'Geography', 'Assembly'],
      Saturday: ['Revision', 'Extra Classes', 'Library', 'Activities']
    };
  }
  
  // Update the timetable display
  updateTimetable(timetableData);
}

// Load Student Data
function loadStudentData(studentId) {
  const studentData = JSON.parse(localStorage.getItem('ssvm_students') || '{}');
  const data = studentData[studentId];

  if (!data) return;

  // Dashboard
  updateDashboard(data);

  // Attendance
  updateAttendance(data.attendance);

  // Marks
  updateMarks(data.marks);

  // Fees
  updateFees(data.fees);

  // Timetable - will be loaded when section is shown
  // updateTimetable(data.timetable);
}

// Update Dashboard
function updateDashboard(data) {
  const attEl = document.getElementById('studentAttPct');
  const marksEl = document.getElementById('studentAvgMarks');
  const feeEl = document.getElementById('studentFeeStatus');
  const gradeEl = document.getElementById('studentGrade');

  if (attEl) {
    const attPct = ((data.attendance.present / data.attendance.total) * 100).toFixed(1);
    attEl.textContent = attPct + '%';
  }

  if (marksEl && data.marks) {
    const avgMarks = (Object.values(data.marks).reduce((a, b) => a + b, 0) / Object.keys(data.marks).length).toFixed(1);
    marksEl.textContent = avgMarks;
  }

  if (feeEl) {
    feeEl.textContent = data.fees.status;
    feeEl.style.color = data.fees.status === 'Paid' ? '#10b981' : '#ef4444';
  }

  if (gradeEl && data.marks) {
    const avgMarks = Object.values(data.marks).reduce((a, b) => a + b, 0) / Object.keys(data.marks).length;
    gradeEl.textContent = getGrade(avgMarks);
  }
}

// Update Attendance
function updateAttendance(attendance) {
  const container = document.getElementById('attendanceContent');
  if (!container) return;

  const attPct = ((attendance.present / attendance.total) * 100).toFixed(1);

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
      <div style="background: #dbeafe; padding: 16px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #1e40af;">${attendance.present}</div>
        <div style="font-size: 12px; color: #1e3a8a; margin-top: 4px;">Days Present</div>
      </div>
      <div style="background: #fee2e2; padding: 16px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #b91c1c;">${attendance.total - attendance.present}</div>
        <div style="font-size: 12px; color: #7f1d1d; margin-top: 4px;">Days Absent</div>
      </div>
    </div>
    <div style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 8px;">
      <div style="font-size: 32px; font-weight: 700; color: #059669;">${attPct}%</div>
      <div style="color: #166534; font-weight: 600; margin-top: 8px;">Attendance Percentage</div>
      <div style="width: 100%; height: 8px; background: #d1fae5; border-radius: 4px; margin-top: 12px; overflow: hidden;">
        <div style="height: 100%; background: #10b981; width: ${attPct}%;"></div>
      </div>
    </div>
  `;
}

// Update Marks
function updateMarks(marks) {
  const container = document.getElementById('marksContent');
  if (!container) return;

  let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
  html += '<tr style="background: #2563eb; color: white;"><th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Subject</th><th style="padding: 12px; text-align: center;">Marks</th><th style="padding: 12px; text-align: center;">Grade</th></tr>';

  let totalMarks = 0;
  for (const [subject, mark] of Object.entries(marks)) {
    totalMarks += mark;
    const grade = getGrade(mark);
    html += `<tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px;">${subject}</td><td style="padding: 12px; text-align: center; font-weight: 600;">${mark}/100</td><td style="padding: 12px; text-align: center; font-weight: 700; color: ${mark >= 90 ? '#10b981' : mark >= 75 ? '#2563eb' : '#f59e0b'};}">${grade}</td></tr>`;
  }

  const avgMarks = (totalMarks / Object.keys(marks).length).toFixed(1);
  html += `</table></div>`;
  html += `<div style="margin-top: 24px; padding: 16px; background: #f0f4f8; border-radius: 8px; text-align: center;"><div style="font-size: 24px; font-weight: 700; color: #1a3a6b;">Average: ${avgMarks}/100</div><div style="color: #64748b; margin-top: 4px;">Overall Performance</div></div>`;

  container.innerHTML = html;
}

// Update Fees
function updateFees(fees) {
  const container = document.getElementById('feesContent');
  if (!container) return;

  const remaining = fees.pending;
  const paidPct = (fees.paid / fees.total * 100).toFixed(1);

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px;">
        <div style="font-size: 12px; opacity: 0.9;">Paid</div>
        <div style="font-size: 28px; font-weight: 700; margin-top: 8px;">₹${fees.paid.toLocaleString()}</div>
      </div>
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px;">
        <div style="font-size: 12px; opacity: 0.9;">Pending</div>
        <div style="font-size: 28px; font-weight: 700; margin-top: 8px;">₹${remaining.toLocaleString()}</div>
      </div>
    </div>
    <div style="padding: 16px; background: #f0f4f8; border-radius: 8px; margin-bottom: 16px;">
      <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Total Fee: ₹${fees.total.toLocaleString()}</div>
      <div style="width: 100%; height: 10px; background: #cbd5e1; border-radius: 4px; overflow: hidden;">
        <div style="height: 100%; background: #10b981; width: ${paidPct}%;"></div>
      </div>
      <div style="font-size: 12px; color: #64748b; margin-top: 8px; text-align: right;">${paidPct}% Paid</div>
    </div>
    <div style="padding: 12px; background: ${fees.status === 'Paid' ? '#dcfce7' : '#fef3c7'}; border-radius: 6px; text-align: center; font-weight: 600; color: ${fees.status === 'Paid' ? '#16a34a' : '#b45309'};">
      ${fees.status === 'Paid' ? '✅ All fees paid' : '⚠️ Payment pending'}
    </div>
  `;
}

// Update Timetable
function updateTimetable(timetable) {
  const container = document.getElementById('studentTimetable');
  if (!container) return;

  let html = '<div style="overflow-x: auto;">';
  
  // Check if it's custom timetable with detailed class info
  const isCustomTimetable = Object.values(timetable).some(day => 
    Array.isArray(day) && day.length > 0 && typeof day[0] === 'object' && day[0].subject
  );
  
  if (isCustomTimetable) {
    // Custom timetable with detailed info
    const days = Object.keys(timetable);
    const maxClasses = Math.max(...Object.values(timetable).map(d => d.length));

    html += '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
    html += '<tr style="background: #2563eb; color: white;">';
    for (const day of days) {
      html += `<th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">${day}</th>`;
    }
    html += '</tr>';

    for (let i = 0; i < maxClasses; i++) {
      html += '<tr>';
      for (const day of days) {
        const cls = timetable[day][i];
        if (cls && typeof cls === 'object') {
          const timeDisplay = cls.startTime && cls.endTime ? `${cls.startTime}-${cls.endTime}` : '';
          const subjectDisplay = cls.subject || '-';
          const teacherDisplay = cls.teacher ? ` (${cls.teacher})` : '';
          const roomDisplay = cls.room ? ` - ${cls.room}` : '';
          html += `<td style="padding: 8px; text-align: center; border: 1px solid #e5e7eb; background: ${i % 2 === 0 ? '#f8fafc' : '#ffffff'}; font-size: 12px;">
            <div style="font-weight: 600; color: #1e40af;">${timeDisplay}</div>
            <div style="font-weight: 600;">${subjectDisplay}</div>
            <div style="color: #64748b; font-size: 11px;">${teacherDisplay}${roomDisplay}</div>
          </td>`;
        } else {
          html += `<td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb; background: ${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">-</td>`;
        }
      }
      html += '</tr>';
    }
  } else {
    // Default simple timetable
    const days = Object.keys(timetable);
    const maxClasses = Math.max(...Object.values(timetable).map(d => d.length));

    html += '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
    html += '<tr style="background: #2563eb; color: white;">';
    for (const day of days) {
      html += `<th style="padding: 12px; text-align: center; border: 1px solid #1e40af;">${day}</th>`;
    }
    html += '</tr>';

    for (let i = 0; i < maxClasses; i++) {
      html += '<tr>';
      for (const day of days) {
        const subject = timetable[day][i] || '-';
        html += `<td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb; background: ${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">${subject}</td>`;
      }
      html += '</tr>';
    }
  }

  html += '</table></div>';
  container.innerHTML = html;
}

// Get Grade
function getGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'F';
}

// Logout
function logoutStudent() {
  localStorage.removeItem('ssvm_auth');
  localStorage.removeItem('vm_studentUser');
  window.location.href = '../pages/login.html';
}

// Library Functions
function loadLibraryData() {
  const subjects = [
    { id: 'math', name: 'Mathematics', chapters: 15, icon: '🔢' },
    { id: 'science', name: 'Science', chapters: 12, icon: '🧪' },
    { id: 'english', name: 'English', chapters: 10, icon: '📖' },
    { id: 'history', name: 'History', chapters: 8, icon: '🏛️' },
    { id: 'geography', name: 'Geography', chapters: 9, icon: '🌍' },
    { id: 'hindi', name: 'Hindi', chapters: 11, icon: '🇮🇳' }
  ];

  const subjectList = document.getElementById('librarySubjectList');
  if (subjectList) {
    subjectList.innerHTML = subjects.map(subject => `
      <div class="library-subject-card" onclick="selectSubject('${subject.id}')" role="option" aria-selected="false">
        <div>
          <span>${subject.icon} ${subject.name}</span>
          <small>${subject.chapters} Chapters</small>
        </div>
        <i class="fas fa-chevron-right" style="color: var(--gray-400);" aria-hidden="true"></i>
      </div>
    `).join('');
  }
}

function selectSubject(subjectId) {
  // Remove active class from all subjects
  document.querySelectorAll('.library-subject-card').forEach(card => {
    card.classList.remove('active');
    card.setAttribute('aria-selected', 'false');
  });

  // Add active class to selected subject
  const selectedCard = event.currentTarget;
  selectedCard.classList.add('active');
  selectedCard.setAttribute('aria-selected', 'true');

  // Load chapters for selected subject
  loadChapters(subjectId);
}

function loadChapters(subjectId) {
  const chaptersData = {
    math: [
      { id: 'm1', title: 'Numbers and Operations', pages: 25, status: 'completed' },
      { id: 'm2', title: 'Algebraic Expressions', pages: 30, status: 'completed' },
      { id: 'm3', title: 'Linear Equations', pages: 28, status: 'in-progress' },
      { id: 'm4', title: 'Geometry Basics', pages: 35, status: 'locked' },
      { id: 'm5', title: 'Statistics', pages: 22, status: 'locked' }
    ],
    science: [
      { id: 's1', title: 'Matter and Its Properties', pages: 20, status: 'completed' },
      { id: 's2', title: 'Force and Motion', pages: 25, status: 'in-progress' },
      { id: 's3', title: 'Energy and Work', pages: 30, status: 'locked' },
      { id: 's4', title: 'Light and Sound', pages: 28, status: 'locked' }
    ],
    english: [
      { id: 'e1', title: 'Grammar Fundamentals', pages: 18, status: 'completed' },
      { id: 'e2', title: 'Reading Comprehension', pages: 22, status: 'completed' },
      { id: 'e3', title: 'Writing Skills', pages: 25, status: 'in-progress' },
      { id: 'e4', title: 'Literature Analysis', pages: 30, status: 'locked' }
    ],
    history: [
      { id: 'h1', title: 'Ancient Civilizations', pages: 35, status: 'completed' },
      { id: 'h2', title: 'Medieval Period', pages: 28, status: 'in-progress' },
      { id: 'h3', title: 'Modern History', pages: 32, status: 'locked' }
    ],
    geography: [
      { id: 'g1', title: 'Earth and Solar System', pages: 24, status: 'completed' },
      { id: 'g2', title: 'Maps and Navigation', pages: 20, status: 'in-progress' },
      { id: 'g3', title: 'Climate and Weather', pages: 26, status: 'locked' }
    ],
    hindi: [
      { id: 'hi1', title: 'व्याकरण की मूल बातें', pages: 22, status: 'completed' },
      { id: 'hi2', title: 'पठन कौशल', pages: 18, status: 'completed' },
      { id: 'hi3', title: 'रचनात्मक लेखन', pages: 25, status: 'in-progress' },
      { id: 'hi4', title: 'साहित्य', pages: 30, status: 'locked' }
    ]
  };

  const chapters = chaptersData[subjectId] || [];
  const chapterList = document.getElementById('libraryChapterList');

  if (chapterList && chapters.length > 0) {
    chapterList.innerHTML = chapters.map(chapter => `
      <div class="library-chapter-card ${chapter.status === 'locked' ? 'locked' : ''}" 
           onclick="${chapter.status !== 'locked' ? `openChapter('${chapter.id}', '${chapter.title}')` : ''}"
           role="option"
           ${chapter.status === 'locked' ? 'aria-disabled="true"' : ''}>
        <div>
          <strong>${chapter.title}</strong>
          <span>${chapter.pages} pages</span>
          <small class="chapter-status ${chapter.status}">${getStatusText(chapter.status)}</small>
        </div>
        ${chapter.status !== 'locked' ? '<i class="fas fa-book-open" style="color: var(--primary);" aria-hidden="true"></i>' : '<i class="fas fa-lock" style="color: var(--gray-400);" aria-hidden="true"></i>'}
      </div>
    `).join('');
  }
}

function getStatusText(status) {
  switch(status) {
    case 'completed': return '✓ Completed';
    case 'in-progress': return '📖 Reading';
    case 'locked': return '🔒 Locked';
    default: return '';
  }
}

function openChapter(chapterId, chapterTitle) {
  // Show chapter modal with content
  const modal = document.getElementById('libraryChapterModal');
  const modalTitle = document.getElementById('libraryChapterModalTitle');
  const modalMeta = document.getElementById('libraryChapterModalMeta');
  const modalBody = document.getElementById('libraryChapterModalBody');

  if (modal && modalTitle && modalMeta && modalBody) {
    modalTitle.textContent = chapterTitle;
    modalMeta.textContent = `Chapter ${chapterId} • Interactive Reading`;
    modalBody.innerHTML = `
      <div class="library-reader-head">
        <div>
          <div class="library-reader-kicker">Chapter Content</div>
          <h4>${chapterTitle}</h4>
        </div>
        <div class="library-reader-badge">Reading Mode</div>
      </div>
      <div class="library-reader-body">
        <p>This is the content for ${chapterTitle}. In a real implementation, this would contain the actual chapter text, images, and interactive elements.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    `;
    modal.style.display = 'flex';
  }
}

function searchBooks() {
  const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
  const category = document.getElementById('bookCategory').value;
  
  // This would filter books based on search term and category
  console.log('Searching for:', searchTerm, 'in category:', category);
  // In a real implementation, this would filter the available books list
}
