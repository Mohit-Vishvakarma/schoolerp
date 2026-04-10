// Student Portal JavaScript
// Author: AI Assistant
// Date: April 2026

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (authenticateStudent(username, password)) {
            showDashboard();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
    
    // Check if already logged in
    if (getFromLocalStorage('studentLoggedIn')) {
        showDashboard();
    }
});

let attendanceCalendarDate = new Date();
let currentStudentData = null;

function authenticateStudent(username, password) {
    // Demo authentication - in real app, this would check against database
    if (password === 'student123') {
        // Simulate successful login
        saveToLocalStorage('studentLoggedIn', true);
        saveToLocalStorage('currentStudent', { username: username, name: 'John Doe' });
        return true;
    }
    return false;
}

function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    // Load student data
    loadStudentData();
}

function loadStudentData() {
    // Simulate loading student data
    // In a real app, this would fetch from API based on logged-in user
    
    // For demo, we'll use static data
    const studentData = {
        attendance: {
            total: 200,
            present: 185,
            absent: 15,
            percentage: 92.5,
            absentDays: [7, 14, 21],
            daily: {
                '2026-04': [true, true, true, true, true, true, false, true, true, true, true, true, true, false, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true]
            }
        },
        marks: [
            { subject: 'Mathematics', marks: 95, total: 100 },
            { subject: 'Science', marks: 92, total: 100 },
            { subject: 'English', marks: 88, total: 100 },
            { subject: 'Social Studies', marks: 90, total: 100 }
        ],
        rank: {
            current: 8,
            classSize: 30,
            ahead: [
                { name: 'Priya Sharma', rank: 1, percentage: 98 },
                { name: 'Aarav Verma', rank: 2, percentage: 97 },
                { name: 'Nisha Patel', rank: 3, percentage: 96 },
                { name: 'Rohan Gupta', rank: 4, percentage: 95 },
                { name: 'Sania Joshi', rank: 5, percentage: 94 },
                { name: 'Karan Singh', rank: 6, percentage: 93 },
                { name: 'Aditi Mehta', rank: 7, percentage: 92 }
            ]
        },
        homework: [
            { title: 'Math Assignment', due: 'Tomorrow', status: 'pending' },
            { title: 'Science Project', due: 'Friday', status: 'pending' },
            { title: 'English Essay', due: 'Completed', status: 'completed' }
        ],
        fees: {
            total: 50000,
            paid: 40000,
            pending: 10000
        },
        schedule: [
            { time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Sharma' },
            { time: '10:00 AM', subject: 'Science', teacher: 'Ms. Patel' },
            { time: '11:00 AM', subject: 'English', teacher: 'Mrs. Singh' },
            { time: '1:00 PM', subject: 'Social Studies', teacher: 'Mr. Kumar' },
            { time: '2:00 PM', subject: 'Computer', teacher: 'Ms. Joshi' }
        ],
        studyPlan: [
            { activity: 'Revise Mathematics chapter 5', duration: '45 min', priority: 'High' },
            { activity: 'Finish Science lab report', duration: '30 min', priority: 'Medium' },
            { activity: 'Read English literature notes', duration: '25 min', priority: 'Medium' },
            { activity: 'Complete Social Studies project', duration: '40 min', priority: 'High' }
        ]
    };
    
    currentStudentData = studentData;
    
    // Update attendance
    const attendanceInfo = document.getElementById('attendance-info');
    attendanceInfo.innerHTML = `
        <p>Total Days: ${studentData.attendance.total}</p>
        <p>Present: ${studentData.attendance.present}</p>
        <p>Absent: ${studentData.attendance.absent}</p>
        <p>Percentage: ${studentData.attendance.percentage}%</p>
    `;
    
    // Update marks
    const marksInfo = document.getElementById('marks-info');
    marksInfo.innerHTML = studentData.marks.map(mark => 
        `<p>${mark.subject}: ${mark.marks}/${mark.total}</p>`
    ).join('');
    
    // Update rank details
    renderRankInfo(studentData);
    
    // Update homework
    const homeworkInfo = document.getElementById('homework-info');
    homeworkInfo.innerHTML = studentData.homework.map(hw => 
        `<p>${hw.title} - Due: ${hw.due}</p>`
    ).join('');
    
    // Update fees
    const feeInfo = document.getElementById('fee-info');
    feeInfo.innerHTML = `
        <p>Total Fees: ₹${studentData.fees.total}</p>
        <p>Paid: ₹${studentData.fees.paid}</p>
        <p>Pending: ₹${studentData.fees.pending}</p>
        <a href="fee-payment.html" class="btn">Pay Now</a>
    `;

    // Update today's schedule
    const scheduleInfo = document.getElementById('schedule-info');
    if (scheduleInfo) {
        scheduleInfo.innerHTML = studentData.schedule.map(item =>
            `<p><strong>${item.time}</strong> - ${item.subject} <span style="color:#555">(${item.teacher})</span></p>`
        ).join('');
    }

    // Update study plan
    const planInfo = document.getElementById('plan-info');
    if (planInfo) {
        planInfo.innerHTML = studentData.studyPlan.map(plan =>
            `<p><strong>${plan.activity}</strong><br><small>${plan.duration} • Priority: ${plan.priority}</small></p>`
        ).join('');
    }

    renderAttendanceCalendar(studentData);
}

function renderRankInfo(studentData) {
    const rankInfo = document.getElementById('rank-info');
    const rankList = document.getElementById('rank-list');
    if (rankInfo) {
        rankInfo.textContent = `Your rank: ${studentData.rank.current} / ${studentData.rank.classSize}`;
    }
    if (rankList) {
        rankList.innerHTML = `
            <div style="margin-bottom:8px;color:#475569;font-size:14px">Students ahead of you</div>
            ${studentData.rank.ahead.map(student => `
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(15,23,42,.08);font-size:14px;color:#1f2937;">
                    <span>${student.rank}. ${student.name}</span>
                    <span>${student.percentage}%</span>
                </div>
            `).join('')}
        `;
    }
}

function formatMonthLabel(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getAttendanceStatus(date, studentData) {
    const yearMonthKey = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}`;
    const dayIndex = date.getDate() - 1;
    if (studentData.attendance.daily && studentData.attendance.daily[yearMonthKey]) {
        return studentData.attendance.daily[yearMonthKey][dayIndex] ? 'present' : 'absent';
    }
    return studentData.attendance.absentDays.includes(date.getDate()) ? 'absent' : 'present';
}

function renderAttendanceCalendar(studentData) {
    const monthLabel = document.getElementById('attendanceMonthLabel');
    if (monthLabel) {
        monthLabel.textContent = formatMonthLabel(attendanceCalendarDate);
    }

    const calendar = document.getElementById('attendance-calendar');
    if (!calendar) return;

    const year = attendanceCalendarDate.getFullYear();
    const month = attendanceCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let calendarHtml = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;margin-bottom:10px;font-size:13px;color:#475569;">';
    dayNames.forEach(day => { calendarHtml += `<div style="font-weight:700">${day}</div>`; });
    calendarHtml += '</div>';

    calendarHtml += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">';
    for (let i = 0; i < firstDay; i += 1) {
        calendarHtml += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const status = getAttendanceStatus(date, studentData);
        const statusLabel = status === 'present' ? 'P' : 'A';
        const statusColor = status === 'present' ? '#059669' : '#dc2626';
        calendarHtml += `
            <div style="border-radius:12px;padding:10px;min-height:72px;background:#f8fafc;border:1px solid rgba(15,23,42,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
                <div style="font-size:14px;font-weight:700;color:#111827">${day}</div>
                <div style="font-size:12px;font-weight:700;color:${statusColor}">${statusLabel}</div>
            </div>
        `;
    }

    calendarHtml += '</div>';
    calendar.innerHTML = calendarHtml;
}

function changeAttendanceMonth(delta) {
    attendanceCalendarDate.setMonth(attendanceCalendarDate.getMonth() + delta);
    renderAttendanceCalendar(currentStudentData || {
        attendance: { absentDays: [7, 14, 21], daily: {} }
    });
}

function downloadTimetable() {
    // Simulate downloading timetable
    alert('Timetable downloaded successfully!');
    
    // In a real app, this would generate and download a PDF
    const timetableData = `
Timetable - Shri Saraswati Vidya Mandir

Monday:
9:00 AM - Mathematics
10:00 AM - Science
11:00 AM - English

Tuesday:
9:00 AM - Science
10:00 AM - Mathematics
11:00 AM - Social Studies

Wednesday:
9:00 AM - English
10:00 AM - Social Studies
11:00 AM - Mathematics

Thursday:
9:00 AM - Social Studies
10:00 AM - English
11:00 AM - Science

Friday:
9:00 AM - Computer
10:00 AM - Art
11:00 AM - Physical Education
    `;
    
    const blob = new Blob([timetableData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Logout function (can be called from a logout button if added)
function logout() {
    localStorage.removeItem('studentLoggedIn');
    localStorage.removeItem('currentStudent');
    location.reload();
}
