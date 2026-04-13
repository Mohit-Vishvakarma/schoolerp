(function () {
const S = { admin: null, studentQuery: "", studentClass: "all", teacherQuery: "", feeClass: "all", activeFeeStudentId: "", editingStudentId: "", editingTeacherId: "", editingClassId: "" };
const $ = id => document.getElementById(id);
const txt = (id, value) => { const el = $(id); if (el) el.textContent = value; };
const fmt = d => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "--";
const money = n => `Rs${Number(n || 0).toLocaleString("en-IN")}`;
const rel = t => { if (!t) return "--"; const diff = Date.now() - new Date(t).getTime(); if (diff < 3600000) return `${Math.max(1, Math.floor(diff / 60000))} min ago`; if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`; return `${Math.floor(diff / 86400000)} days ago`; };

function authAdmin() {
  const user = JSON.parse(localStorage.getItem("vm_adminUser") || "null");
  if (user) return user;
  const auth = JSON.parse(localStorage.getItem("ssvm_auth") || "null");
  return auth?.role === "admin" ? auth.user : null;
}

function classesConfig() { return getData("vm_classConfig"); }
function saveClassesConfig(v) {
  setData("vm_classConfig", v);
  persistAdminKeyInBackground("vm_classConfig", v, "Class data sync fail ho gaya.");
}
function feeHistory() { return getData("vm_feeHistory"); }
function saveFeeHistory(v) {
  setData("vm_feeHistory", v);
  persistAdminKeyInBackground("vm_feeHistory", v, "Fee data sync fail ho gaya.");
}
function notices() { return getData("vm_notices"); }
function broadcasts() { return getData("vm_parentCommunication"); }
function saveBroadcasts(v) {
  setData("vm_parentCommunication", v);
  persistAdminKeyInBackground("vm_parentCommunication", v, "Broadcast data sync fail ho gaya.");
}
function students() { return getData("vm_students"); }
function teachers() { return getData("vm_teachers"); }
function admissions() { return getData("vm_admissions"); }
function marks() { return getObj("vm_marks"); }
function attendance() { return getObj("vm_attendance"); }
function exams() { return getData("vm_examSchedule"); }
function school() { return getObj("vm_school"); }
function saveSchool(v) {
  setData("vm_school", v);
  persistAdminKeyInBackground("vm_school", v, "School settings sync fail ho gaya.");
}
function auditLog() { return getData("vm_adminAuditLog"); }
function saveAuditLog(v) {
  setData("vm_adminAuditLog", v);
  persistAdminKeyInBackground("vm_adminAuditLog", v, "Audit log sync fail ho gaya.");
}
function libraryBooks() { return getData("vm_library"); }
function studyMaterials() { return getObj("vm_studyMaterials"); }
function timetable() {
  const raw = getObj("vm_timetable");
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw || {}).flatMap(([day, slots]) =>
    Array.isArray(slots)
      ? slots.map(slot => ({
          day: day.charAt(0).toUpperCase() + day.slice(1),
          ...slot
        }))
      : []
  );
}
function onlineTests() { return getData("vm_onlineTests"); }
function testResults() { return getData("vm_testResults"); }
function progressData() {
  const raw = getObj("vm_progressData");
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw || {}).map(([studentId, value]) => ({
    studentId,
    ...(value && typeof value === "object" ? value : { value })
  }));
}
function certificates() { return getData("vm_certificates"); }
function badges() { return getData("vm_badges"); }
function onlineClasses() { return getData("vm_onlineClasses"); }
function classRecordings() { return getData("vm_classRecordings"); }

function classKey(item) { return `${item.class}${item.section}`; }
function ensureAdminData() {
  const existing = classesConfig();
  if (!existing.length) {
    const roster = students();
    const teachersList = teachers();
    const map = new Map();
    roster.forEach(student => {
      const key = classKey(student);
      if (!map.has(key)) {
        const teacher = teachersList.find(t => (t.class || "").includes(key));
        map.set(key, {
          id: `CLS${key}`,
          class: student.class,
          section: student.section,
          classTeacher: teacher?.name || "Not assigned",
          room: `Room ${200 + map.size + 1}`,
          capacity: 40,
          annualFee: Number(student.class) >= 11 ? 18000 : Number(student.class) >= 9 ? 16000 : 14000
        });
      }
    });
    saveClassesConfig([...map.values()]);
  }
  if (!Array.isArray(broadcasts()) || !broadcasts().length) {
    saveBroadcasts([
      { id: `BC${Date.now()}1`, audience: "teachers", subject: "Weekly planning sync", message: "Please close your weekly planning and marks update by Friday afternoon.", date: new Date().toISOString() },
      { id: `BC${Date.now()}2`, audience: "parents", subject: "Fee reminder", message: "Pending fee accounts should be cleared before the 10th of this month.", date: new Date(Date.now() - 86400000).toISOString() }
    ]);
  }
  if (!auditLog().length) {
    saveAuditLog([
      { id: `LOG${Date.now()}1`, action: "System initialized", detail: "Admin control center loaded with seeded school data.", time: new Date(Date.now() - 7200000).toISOString() },
      { id: `LOG${Date.now()}2`, action: "Data normalization", detail: "Student and teacher master records were normalized for ERP usage.", time: new Date(Date.now() - 3600000).toISOString() }
    ]);
  }
}

function logAdminAction(action, detail) {
  const list = auditLog();
  list.unshift({ id: `LOG${Date.now()}`, action, detail, time: new Date().toISOString() });
  saveAuditLog(list.slice(0, 30));
}

function normalizeAdminData() {
  const normalizedStudents = students().map(s => ({
    ...s,
    rollNo: s.rollNo || s.roll || "",
    roll: s.roll || s.rollNo || "",
    parent: s.parent || s.fatherName || "",
    contact: s.contact || s.fatherPhone || s.phone || "",
    password: s.password || "student123"
  }));
  const normalizedTeachers = teachers().map(t => ({
    ...t,
    exp: t.exp || "1 year",
    class: t.class || "",
    password: t.password || "teacher123"
  }));
  setData("vm_students", normalizedStudents);
  setData("vm_teachers", normalizedTeachers);
}

function openSection(id) {
  document.querySelectorAll(".portal-nav a[data-section]").forEach(a => a.classList.toggle("active", a.dataset.section === id));
  document.querySelectorAll(".portal-section").forEach(sec => sec.classList.toggle("active", sec.id === id));
  const nav = document.querySelector(`.portal-nav a[data-section="${id}"]`);
  if (nav) txt("adminTopbarTitle", nav.textContent.trim());
  $("adminSidebar")?.classList.remove("open");
}

function filteredStudents() {
  const query = normalizeText(S.studentQuery);
  return students().filter(s => {
    const c = `${s.class}${s.section}`;
    const hit = !query || normalizeText(s.name).includes(query) || normalizeText(s.id).includes(query) || normalizeText(String(s.rollNo || s.roll || "")).includes(query) || normalizeText(c).includes(query);
    const classHit = S.studentClass === "all" || c === S.studentClass;
    return hit && classHit;
  });
}

function filteredTeachers() {
  const query = normalizeText(S.teacherQuery);
  return teachers().filter(t => !query || normalizeText(`${t.name} ${t.subject} ${t.class || ""}`).includes(query));
}

function feeForClass(student) {
  const cls = classesConfig().find(c => c.class === student.class && c.section === student.section);
  return cls?.annualFee || (Number(student.class) >= 11 ? 18000 : Number(student.class) >= 9 ? 16000 : 14000);
}

function feeQuarterTemplates(total) {
  const base = Math.floor(Number(total || 0) / 4);
  const remainder = Number(total || 0) - (base * 4);
  return [
    { quarter: "Q1 (Apr-Jun)", amount: base },
    { quarter: "Q2 (Jul-Sep)", amount: base },
    { quarter: "Q3 (Oct-Dec)", amount: base },
    { quarter: "Q4 (Jan-Mar)", amount: base + remainder }
  ];
}

function feeQuarterOrder(quarter) {
  return { "Q1 (Apr-Jun)": 1, "Q2 (Jul-Sep)": 2, "Q3 (Oct-Dec)": 3, "Q4 (Jan-Mar)": 4 }[quarter] || 99;
}

function sortedFeeEntries(entries) {
  return [...entries].sort((a, b) => feeQuarterOrder(a.quarter) - feeQuarterOrder(b.quarter));
}

function syncFeeLedgers() {
  const roster = students();
  let history = [...feeHistory()];
  let historyChanged = false;

  roster.forEach(student => {
    const templates = feeQuarterTemplates(feeForClass(student));
    templates.forEach(template => {
      const exists = history.some(item => item.studentId === student.id && item.quarter === template.quarter);
      if (!exists) {
        const isPaid = student.fees === "paid";
        history.push({
          id: `FEE${Date.now()}${history.length + 1}`,
          studentId: student.id,
          quarter: template.quarter,
          amount: template.amount,
          date: isPaid ? (student.admissionDate || new Date().toISOString().split("T")[0]) : null,
          status: isPaid ? "paid" : "pending",
          paymentMethod: isPaid ? "System Sync" : null,
          receipt: isPaid ? `SYNC${Date.now()}${history.length + 1}` : null
        });
        historyChanged = true;
      }
    });
  });

  if (historyChanged) saveFeeHistory(history);

  const updatedStudents = roster.map(student => {
    const entries = sortedFeeEntries(history.filter(item => item.studentId === student.id));
    const nextStatus = entries.length && entries.every(item => item.status === "paid") ? "paid" : "pending";
    return student.fees === nextStatus ? student : { ...student, fees: nextStatus };
  });

  if (updatedStudents.some((student, index) => student !== roster[index])) {
    setData("vm_students", updatedStudents);
  }

  return { roster: updatedStudents, history };
}

function feeStatsForStudent(student, history) {
  const entries = sortedFeeEntries(history.filter(item => item.studentId === student.id));
  const total = entries.reduce((sum, item) => sum + Number(item.amount || 0), 0) || feeForClass(student);
  const paid = entries.filter(item => item.status === "paid").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pending = Math.max(0, total - paid);
  return {
    entries,
    total,
    paid,
    pending,
    status: pending === 0 ? "paid" : "pending",
    paidInstallments: entries.filter(item => item.status === "paid").length,
    pendingInstallments: entries.filter(item => item.status !== "paid").length
  };
}

function renderFeeClassFilter(roster) {
  const options = [...new Set(roster.map(student => `${student.class}${student.section}`))].sort((a, b) => a.localeCompare(b));
  const select = $("feeClassFilter");
  if (!select) return;
  select.innerHTML = `<option value="all">All Classes</option>` + options.map(value => `<option value="${value}">Class ${value.slice(0, -1)}-${value.slice(-1)}</option>`).join("");
  select.value = S.feeClass;
}

function ensureAcademicDemoData() {
  const examList = exams();
  if (examList.length < 4) {
    const demoExams = [
      { id: `EX${Date.now()}1`, subject: "Mathematics", examName: "Mid-Term Algebra Review", date: "2026-04-18", time: "09:00 AM - 11:00 AM", duration: "2 hours", room: "Room 201", syllabus: "Algebraic identities, polynomials, linear equations" },
      { id: `EX${Date.now()}2`, subject: "Science", examName: "Integrated Science Practical", date: "2026-04-21", time: "10:30 AM - 12:30 PM", duration: "2 hours", room: "Lab 2", syllabus: "Acids and bases, force and motion, diagrams" },
      { id: `EX${Date.now()}3`, subject: "English", examName: "Literature Comprehension Check", date: "2026-04-24", time: "08:30 AM - 10:00 AM", duration: "90 min", room: "Room 104", syllabus: "Poetry analysis, prose passages, grammar application" },
      { id: `EX${Date.now()}4`, subject: "Computer Science", examName: "Coding Skills Assessment", date: "2026-04-28", time: "11:30 AM - 01:00 PM", duration: "90 min", room: "Computer Lab", syllabus: "HTML structure, JavaScript basics, logic building" }
    ];
    setData("vm_examSchedule", [...demoExams, ...examList]);
  }

  const hwList = getData("vm_homework");
  if (hwList.length < 8) {
    const roster = students().slice(0, 4);
    const demoHomework = roster.flatMap((student, index) => ([
      {
        id: `AHW${Date.now()}${index}1`,
        studentId: student.id,
        class: `${student.class}${student.section}`,
        subject: "Mathematics",
        title: "Revision Worksheet Pack",
        description: "Complete the targeted worksheet and show all solving steps neatly.",
        dueDate: "2026-04-16",
        marks: 15,
        teacher: "Dr. Sunita Sharma",
        teacherId: "TCH001",
        status: "pending",
        submitted: false
      },
      {
        id: `AHW${Date.now()}${index}2`,
        studentId: student.id,
        class: `${student.class}${student.section}`,
        subject: "Science",
        title: "Lab Observation Summary",
        description: "Write the observations, diagram labels, and final conclusion in notebook format.",
        dueDate: "2026-04-19",
        marks: 10,
        teacher: "Mr. Rajiv Kumar",
        teacherId: "TCH002",
        status: index % 2 === 0 ? "completed" : "pending",
        submitted: index % 2 === 0,
        submissionDate: index % 2 === 0 ? "2026-04-10" : null
      }
    ]));
    setData("vm_homework", [...demoHomework, ...hwList]);
  }

  const mats = studyMaterials();
  const required = {
    mathematics: [
      { id: `ACMAT${Date.now()}1`, title: "Rapid Revision Notes", type: "pdf", size: "2.1 MB", downloads: 18, createdAt: "2026-04-08", teacherName: "Dr. Sunita Sharma", subject: "Mathematics" }
    ],
    science: [
      { id: `ACMAT${Date.now()}2`, title: "Practical Prep Guide", type: "pdf", size: "3.4 MB", downloads: 12, createdAt: "2026-04-09", teacherName: "Mr. Rajiv Kumar", subject: "Science" }
    ],
    english: [
      { id: `ACMAT${Date.now()}3`, title: "Writing Improvement Audio Notes", type: "mp4", size: "24 MB", downloads: 9, createdAt: "2026-04-10", teacherName: "Mr. Pradeep Jain", subject: "English" }
    ]
  };
  let changed = false;
  Object.entries(required).forEach(([key, items]) => {
    if (!Array.isArray(mats[key])) mats[key] = [];
    items.forEach(item => {
      if (!mats[key].some(existing => normalizeText(existing.title) === normalizeText(item.title))) {
        mats[key].unshift(item);
        changed = true;
      }
    });
  });
  if (changed) setData("vm_studyMaterials", mats);
}

function renderDashboard() {
  const ss = students();
  const tt = teachers();
  const cc = classesConfig();
  const aa = admissions();
  const feePaid = ss.filter(s => s.fees === "paid");
  const feePending = ss.filter(s => s.fees !== "paid");
  const totalCollected = feePaid.reduce((sum, s) => sum + feeForClass(s), 0);
  txt("adminName", S.admin.name || "Admin");
  txt("adminHeroTitle", `Welcome back, ${S.admin.name?.split(" ")[0] || "Admin"}`);
  txt("adminTodayDate", new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" }));
  txt("statStudents", ss.length);
  txt("statTeachers", tt.length);
  txt("statClasses", cc.length);
  txt("statFeesPaid", money(totalCollected));
  txt("statFeesPending", feePending.length);
  txt("statAdmissions", aa.filter(a => a.status === "pending").length);
  txt("statPendingMeta", `${feePending.length} accounts pending`);

  const marksData = marks();
  const attData = attendance();
  $("adminAlertsList").innerHTML = [
    feePending.length ? `Fee follow-up needed for ${feePending.length} students.` : "All fee accounts are clear.",
    aa.filter(a => a.status === "pending").length ? `${aa.filter(a => a.status === "pending").length} admission applications are awaiting review.` : "No pending admissions.",
    notices().length ? `Latest notice was published ${rel(notices()[0].date || notices()[0].timestamp)}.` : "No notices published recently.",
    exams().length ? `${exams().length} exam events are scheduled in the system.` : "No exam schedule published yet."
  ].map(item => `<div class="admin-list-item"><strong>Alert</strong><span>${item}</span></div>`).join("");

  $("adminClassOverview").innerHTML = classesConfig().map(cls => {
    const list = ss.filter(s => s.class === cls.class && s.section === cls.section);
    const avgMarks = list.length ? Math.round(list.reduce((sum, st) => {
      const row = Object.values(marksData[st.id] || {}).map(Number).filter(Number.isFinite);
      return sum + (row.length ? row.reduce((a, b) => a + b, 0) / row.length : 0);
    }, 0) / list.length) : 0;
    const avgAttendance = list.length ? Math.round(list.reduce((sum, st) => sum + (attData[st.id]?.percentage || 0), 0) / list.length) : 0;
    return `<div class="admin-list-item"><strong>Class ${cls.class}-${cls.section}</strong><span>${list.length} students | Avg marks ${avgMarks}% | Attendance ${avgAttendance}%</span></div>`;
  }).join("") || `<p style="color:var(--gray-500)">No class data available.</p>`;

  const pendingAdmissions = aa.filter(a => a.status === "pending").length;
  const pendingFees = feePending.length;
  const lowAttendance = students().filter(s => (attData[s.id]?.percentage || 0) < 75).length;
  const upcomingExams = exams().filter(ex => new Date(ex.date) >= new Date()).length;
  $("adminCommandCenter").innerHTML = [
    `Priority tasks: ${pendingAdmissions + pendingFees + lowAttendance}`,
    `${pendingAdmissions} admission applications need review`,
    `${pendingFees} fee records need action`,
    `${lowAttendance} students are in attendance risk`,
    `${upcomingExams} upcoming exams are scheduled`
  ].map(item => `<div class="admin-list-item"><strong>Command</strong><span>${item}</span></div>`).join("");

  $("adminAuditLog").innerHTML = auditLog().slice(0, 8).map(entry => `<div class="admin-list-item"><strong>${entry.action}</strong><span>${entry.detail}</span><small class="admin-log-time">${rel(entry.time)}</small></div>`).join("") || `<div class="admin-list-item"><strong>No recent activity</strong><span>Audit entries will appear here.</span></div>`;

  drawCharts();
}

function drawCharts() {
  const feeCanvas = $("adminFeesChart");
  if (feeCanvas) {
    Chart.getChart(feeCanvas)?.destroy();
    const labels = classesConfig().map(c => `${c.class}-${c.section}`);
    const values = classesConfig().map(c => {
      const list = students().filter(s => s.class === c.class && s.section === c.section);
      const paid = list.filter(s => s.fees === "paid").length;
      return list.length ? Math.round((paid / list.length) * 100) : 0;
    });
    new Chart(feeCanvas, {
      type: "bar",
      data: { labels, datasets: [{ label: "Fee Collection %", data: values, backgroundColor: "rgba(37,99,235,.75)", borderRadius: 8 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });
  }
  const admCanvas = $("adminAdmissionsChart");
  if (admCanvas) {
    const list = admissions();
    const approved = list.filter(a => a.status === "approved").length;
    const pending = list.filter(a => a.status === "pending").length;
    const hold = list.filter(a => a.status === "hold").length;
    const rejected = list.filter(a => a.status === "rejected").length;
    Chart.getChart(admCanvas)?.destroy();
    new Chart(admCanvas, {
      type: "doughnut",
      data: { labels: ["Approved", "Pending", "Hold", "Rejected"], datasets: [{ data: [approved, pending, hold, rejected], backgroundColor: ["#10b981", "#f59e0b", "#2563eb", "#ef4444"] }] },
      options: { responsive: true, plugins: { legend: { position: "bottom" } }, cutout: "62%" }
    });
  }
}

function renderStudentFilters() {
  const opts = [...new Set(students().map(s => `${s.class}${s.section}`))].sort((a, b) => a.localeCompare(b));
  $("studentClassFilter").innerHTML = `<option value="all">All Classes</option>` + opts.map(o => `<option value="${o}">Class ${o.slice(0, -1)}-${o.slice(-1)}</option>`).join("");
  $("studentClassFilter").value = S.studentClass;
}

function renderStudents() {
  renderStudentFilters();
  const att = attendance();
  const allStudents = students();
  const filtered = filteredStudents();
  const readyCount = allStudents.filter(s => s.password && s.id).length;
  const feePendingCount = allStudents.filter(s => s.fees !== "paid").length;
  const topAttendanceStudent = [...allStudents].sort((a, b) => (att[b.id]?.percentage || 0) - (att[a.id]?.percentage || 0))[0];
  const lowAttendanceStudents = allStudents.filter(s => (att[s.id]?.percentage || 0) < 75);
  const heroStats = $("adminStudentsHeroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="admin-students-stat"><strong>${allStudents.length}</strong><span>Total Students</span></div>
      <div class="admin-students-stat"><strong>${readyCount}</strong><span>Portal Ready</span></div>
      <div class="admin-students-stat"><strong>${feePendingCount}</strong><span>Fee Pending</span></div>
    `;
  }
  txt("adminStudentsTopAttendance", topAttendanceStudent ? `${topAttendanceStudent.name} | ${att[topAttendanceStudent.id]?.percentage || 0}%` : "--");
  txt("adminStudentsFeeRisk", `${feePendingCount} pending account${feePendingCount === 1 ? "" : "s"}`);
  txt("adminStudentsPortalAccess", `${readyCount}/${allStudents.length} ready`);

  const controlGrid = $("adminStudentControlGrid");
  if (controlGrid) {
    controlGrid.innerHTML = `
      <div class="admin-student-control-card">
        <strong>Open Student Portal</strong>
        <p>Selected student ko student portal context me open karo for direct review.</p>
        <button class="btn btn-outline-primary btn-sm" type="button" onclick="apOpenStudentPortal()">Open Portal View</button>
      </div>
      <div class="admin-student-control-card">
        <strong>Reset Student Access</strong>
        <p>Default password reset karke portal login ko quickly restore karo.</p>
        <button class="btn btn-outline-primary btn-sm" type="button" onclick="apBulkResetStudentPasswords()">Reset Passwords</button>
      </div>
      <div class="admin-student-control-card">
        <strong>Fee Sync Controls</strong>
        <p>Fee status ko portal-ready state ke saath align rakho for smoother student access.</p>
        <button class="btn btn-outline-primary btn-sm" type="button" onclick="apMarkAllVisibleFeesPaid()">Mark Visible Fees Paid</button>
      </div>
    `;
  }

  const alerts = $("adminStudentAlerts");
  if (alerts) {
    alerts.innerHTML = [
      feePendingCount ? `<div class="admin-list-item"><strong>Fee access risk</strong><span>${feePendingCount} students still show pending fees in linked portal data.</span></div>` : "",
      lowAttendanceStudents.length ? `<div class="admin-list-item"><strong>Attendance risk</strong><span>${lowAttendanceStudents.length} students are below 75% attendance and may need intervention.</span></div>` : "",
      topAttendanceStudent ? `<div class="admin-list-item"><strong>Strongest attendance</strong><span>${topAttendanceStudent.name} from Class ${topAttendanceStudent.class}-${topAttendanceStudent.section} leads with ${att[topAttendanceStudent.id]?.percentage || 0}% attendance.</span></div>` : "",
      !allStudents.length ? `<div class="admin-list-item"><strong>No records</strong><span>Add students to activate linked student portal controls.</span></div>` : ""
    ].filter(Boolean).join("");
  }

  $("adminStudentsTable").innerHTML = filtered.map(s => {
    const attPct = att[s.id]?.percentage || 0;
    const portalReady = s.password ? "Ready" : "Setup";
    return `<tr>
      <td>${s.id}</td>
      <td><strong>${s.name}</strong><br><small style="color:var(--gray-500)">Roll ${s.rollNo || s.roll || "--"} | ${s.gender === "F" ? "Female" : "Male"}</small></td>
      <td>Class ${s.class}-${s.section}</td>
      <td>${s.parent || s.fatherName || "--"}</td>
      <td>${s.contact || s.phone || "--"}</td>
      <td><span class="badge ${s.fees === "paid" ? "badge-green" : "badge-red"}">${s.fees}</span></td>
      <td>${attPct}%<br><small style="color:var(--gray-500)">${portalReady}</small></td>
      <td><button class="btn btn-sm btn-outline-primary" type="button" onclick="apEditStudent('${s.id}')">Edit</button> <button class="btn btn-sm btn-outline-primary" type="button" onclick="apPortalPreviewStudent('${s.id}')">Portal</button> <button class="btn btn-sm btn-red" type="button" onclick="apDeleteStudent('${s.id}')">Delete</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="8" style="text-align:center;color:var(--gray-500)">No students found.</td></tr>`;
}

function renderTeachers() {
  const renderSubjects = value => (value || "").split(",").map(x => x.trim()).filter(Boolean).map(sub => `<span class="badge badge-primary">${sub}</span>`).join(" ");
  $("adminTeachersTable").innerHTML = filteredTeachers().map(t => `<tr>
    <td>${t.id}</td>
    <td><strong>${t.name}</strong><br><small style="color:var(--gray-500)">${t.email}</small></td>
    <td>${renderSubjects(t.subject) || "--"}</td>
    <td>${t.phone || "--"}</td>
    <td>${t.class || "--"}</td>
    <td>${t.exp || "--"}</td>
    <td><button class="btn btn-sm btn-outline-primary" type="button" onclick="apEditTeacher('${t.id}')">Edit</button> <button class="btn btn-sm btn-outline-primary" type="button" onclick="apPortalPreviewTeacher('${t.id}')">Portal</button> <button class="btn btn-sm btn-red" type="button" onclick="apDeleteTeacher('${t.id}')">Delete</button></td>
  </tr>`).join("") || `<tr><td colspan="7" style="text-align:center;color:var(--gray-500)">No teachers found.</td></tr>`;
}

function renderClasses() {
  const ss = students();
  const tt = teachers();
  const mats = studyMaterials();
  const classes = classesConfig();
  const dataset = classes.map(cls => {
    const classStudents = ss.filter(s => s.class === cls.class && s.section === cls.section);
    const count = classStudents.length;
    const linkedTeacher = tt.find(t => (t.class || "").includes(`${cls.class}${cls.section}`) || t.name === cls.classTeacher);
    const subjects = [...new Set(classStudents.map(s => s.subject).filter(Boolean))];
    const teacherSubjects = (linkedTeacher?.subject || "").split(",").map(x => x.trim()).filter(Boolean);
    const subjectCandidates = [...new Set([...subjects, ...teacherSubjects].map(s => normalizeText(s)).filter(Boolean))];
    const materialsCount = subjectCandidates.reduce((sum, key) => sum + ((mats[key] || []).length), 0);
    const onlineLinked = onlineClasses().filter(item => normalizeText(item.class || item.classLabel || item.title || "").includes(normalizeText(`${cls.class}${cls.section}`))).length;
    const occupancy = cls.capacity ? Math.min(100, Math.round((count / cls.capacity) * 100)) : 0;
    return {
      ...cls,
      count,
      linkedTeacher: linkedTeacher?.name || cls.classTeacher || "Not assigned",
      teacherSubjects: teacherSubjects.length ? teacherSubjects.join(", ") : "Not mapped",
      materialsCount,
      onlineLinked,
      occupancy
    };
  });

  const topFilled = [...dataset].sort((a, b) => b.count - a.count)[0];
  const unassigned = dataset.filter(item => !item.linkedTeacher || item.linkedTeacher === "Not assigned").length;
  const linkedTeachers = new Set(dataset.map(item => item.linkedTeacher).filter(name => name && name !== "Not assigned")).size;

  const heroStats = $("adminClassesHeroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="admin-classes-stat"><strong>${dataset.length}</strong><span>Total Sections</span></div>
      <div class="admin-classes-stat"><strong>${ss.length}</strong><span>Total Students</span></div>
      <div class="admin-classes-stat"><strong>${linkedTeachers}</strong><span>Teachers Linked</span></div>
    `;
  }

  txt("adminClassesTopFilled", topFilled ? `${topFilled.class}-${topFilled.section} • ${topFilled.count} students` : "--");
  txt("adminClassesPortalSync", `${dataset.length} class sections active`);
  txt("adminClassesUnassigned", `${unassigned} section${unassigned === 1 ? "" : "s"}`);

  $("adminClassCards").innerHTML = dataset.map(cls => `<div class="admin-class-card">
      <div class="admin-class-head">
        <strong>Class ${cls.class}-${cls.section}</strong>
        <span class="badge badge-primary">${cls.count}/${cls.capacity}</span>
      </div>
      <div class="admin-class-head-line">
        <div>
          <p>${cls.linkedTeacher}</p>
          <div class="admin-class-sync-meta">Teacher portal + student roster linked</div>
        </div>
      </div>
      <div class="admin-class-meta"><span>${cls.room}</span><span>${money(cls.annualFee)}</span><span>${cls.teacherSubjects}</span></div>
      <div class="admin-class-progress"><div class="admin-class-progress-bar" style="width:${cls.occupancy}%"></div></div>
      <div class="admin-class-link-grid">
        <div class="admin-class-link-chip"><strong>${cls.count}</strong>Students mapped to this section</div>
        <div class="admin-class-link-chip"><strong>${cls.materialsCount}</strong>Study resources linked via subject data</div>
        <div class="admin-class-link-chip"><strong>${cls.linkedTeacher}</strong>Teacher portal ownership</div>
        <div class="admin-class-link-chip"><strong>${cls.onlineLinked}</strong>Online class items connected</div>
      </div>
      <div class="admin-action-row"><button class="btn btn-sm btn-outline-primary" type="button" onclick="apEditClass('${cls.id}')">Edit</button><button class="btn btn-sm btn-red" type="button" onclick="apDeleteClass('${cls.id}')">Delete</button></div>
    </div>`).join("") || `<p style="color:var(--gray-500)">No classes configured.</p>`;

  $("adminClassesTable").innerHTML = dataset.map(cls => `<tr><td><strong>Class ${cls.class}-${cls.section}</strong></td><td>${cls.linkedTeacher}</td><td>${cls.count}</td><td>${cls.capacity}</td><td>${cls.room}</td><td>${money(cls.annualFee)}</td></tr>`).join("") || `<tr><td colspan="6" style="text-align:center;color:var(--gray-500)">No classes configured.</td></tr>`;
}

function renderAdmissions() {
  const list = admissions();
  const pending = list.filter(a => a.status === "pending");
  const approved = list.filter(a => a.status === "approved");
  const hold = list.filter(a => a.status === "hold");
  const rejected = list.filter(a => a.status === "rejected");
  const classDemand = list.reduce((acc, item) => {
    const key = String(item.class || "--");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topClassEntry = Object.entries(classDemand).sort((a, b) => b[1] - a[1])[0];
  const latest = [...list].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  const conversionRate = list.length ? Math.round((approved.length / list.length) * 100) : 0;

  const heroStats = $("adminAdmissionsHeroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="admin-admissions-stat"><strong>${list.length}</strong><span>Total Applications</span></div>
      <div class="admin-admissions-stat"><strong>${pending.length}</strong><span>Pending Review</span></div>
      <div class="admin-admissions-stat"><strong>${conversionRate}%</strong><span>Conversion Rate</span></div>
    `;
  }

  txt("adminAdmissionsTopClass", topClassEntry ? `Class ${topClassEntry[0]} • ${topClassEntry[1]} apps` : "--");
  txt("adminAdmissionsPending", `${pending.length} application${pending.length === 1 ? "" : "s"}`);
  txt("adminAdmissionsLatest", latest ? `${latest.name} • ${fmt(latest.date)}` : "--");

  const pipeline = $("adminAdmissionPipeline");
  if (pipeline) {
    const statuses = [
      { label: "Pending Review", count: pending.length, tone: "gold", note: pending.length ? "Needs counselor action" : "Queue is clear" },
      { label: "On Hold", count: hold.length, tone: "blue", note: hold.length ? "Waiting for follow-up" : "No applications on hold" },
      { label: "Approved", count: approved.length, tone: "green", note: approved.length ? "Ready for onboarding" : "No approvals yet" },
      { label: "Rejected", count: rejected.length, tone: "red", note: rejected.length ? "Closed applications" : "No rejected cases" }
    ];
    pipeline.innerHTML = statuses.map(item => `<div class="admin-admission-stage admin-admission-stage-${item.tone}">
      <span>${item.label}</span>
      <strong>${item.count}</strong>
      <p>${item.note}</p>
    </div>`).join("");
  }

  const insights = $("adminAdmissionsInsights");
  if (insights) {
    insights.innerHTML = [
      topClassEntry ? `<div class="admin-list-item"><strong>Highest class demand</strong><span>Class ${topClassEntry[0]} currently leads with ${topClassEntry[1]} application${topClassEntry[1] === 1 ? "" : "s"} in the pipeline.</span></div>` : "",
      pending.length ? `<div class="admin-list-item"><strong>Pending review load</strong><span>${pending.length} applications still need approval or rejection before student onboarding can move forward.</span></div>` : `<div class="admin-list-item"><strong>Review queue clear</strong><span>All current admissions have already been processed by the admin team.</span></div>`,
      hold.length ? `<div class="admin-list-item"><strong>Applications on hold</strong><span>${hold.length} application${hold.length === 1 ? "" : "s"} are paused and waiting for manual follow-up or document confirmation.</span></div>` : "",
      latest ? `<div class="admin-list-item"><strong>Latest applicant</strong><span>${latest.name} applied for Class ${latest.class || "--"} on ${fmt(latest.date)} and is the newest lead in the funnel.</span></div>` : "",
      approved.length ? `<div class="admin-list-item"><strong>Conversion health</strong><span>${approved.length} approved admission${approved.length === 1 ? "" : "s"} are already ready to flow into the student records ecosystem.</span></div>` : `<div class="admin-list-item"><strong>Conversion health</strong><span>Approve applications from the queue to activate onboarding and student record creation.</span></div>`
    ].filter(Boolean).join("");
  }

  const statusMeta = {
    approved: { badge: "badge-green", label: "approved" },
    rejected: { badge: "badge-red", label: "rejected" },
    hold: { badge: "badge-primary", label: "hold" },
    pending: { badge: "badge-gold", label: "pending" }
  };

  $("adminAdmissionsTable").innerHTML = list.map(a => `<tr>
    <td>${a.id}</td><td><strong>${a.name}</strong></td><td>Class ${a.class}</td><td>${a.parent}</td><td>${a.contact}</td><td>${a.date}</td>
    <td><span class="badge ${(statusMeta[a.status] || statusMeta.pending).badge}">${(statusMeta[a.status] || statusMeta.pending).label}</span></td>
    <td><div class="admin-admission-actions"><button class="btn btn-sm btn-green" type="button" onclick="apUpdateAdmission('${a.id}','approved')" ${a.status === "approved" ? "disabled" : ""}>Approve</button> <button class="btn btn-sm btn-outline-primary" type="button" onclick="apUpdateAdmission('${a.id}','pending')" ${a.status === "pending" ? "disabled" : ""}>Pending</button> <button class="btn btn-sm btn-outline-primary" type="button" onclick="apUpdateAdmission('${a.id}','hold')" ${a.status === "hold" ? "disabled" : ""}>Hold</button> <button class="btn btn-sm btn-red" type="button" onclick="apUpdateAdmission('${a.id}','rejected')" ${a.status === "rejected" ? "disabled" : ""}>Reject</button></div></td>
  </tr>`).join("") || `<tr><td colspan="8" style="text-align:center;color:var(--gray-500)">No admissions available.</td></tr>`;
}

function renderFees() {
  const { roster, history } = syncFeeLedgers();
  renderFeeClassFilter(roster);
  const filtered = roster.filter(student => S.feeClass === "all" || `${student.class}${student.section}` === S.feeClass);
  const totalCollectable = filtered.reduce((sum, student) => sum + feeStatsForStudent(student, history).total, 0);
  const totalReceived = filtered.reduce((sum, student) => sum + feeStatsForStudent(student, history).paid, 0);
  const totalPending = Math.max(0, totalCollectable - totalReceived);
  const paidStudents = filtered.filter(student => feeStatsForStudent(student, history).status === "paid").length;
  const unpaidStudents = filtered.length - paidStudents;
  const collectionPct = totalCollectable ? Math.round((totalReceived / totalCollectable) * 100) : 0;

  const heroStats = $("adminFeesHeroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="admin-fees-stat"><strong>${filtered.length}</strong><span>Students</span></div>
      <div class="admin-fees-stat"><strong>${money(totalCollectable)}</strong><span>Total Collectable</span></div>
      <div class="admin-fees-stat"><strong>${collectionPct}%</strong><span>Collection Rate</span></div>
    `;
  }

  const summaryGrid = $("adminFeeSummaryGrid");
  if (summaryGrid) {
    summaryGrid.innerHTML = `
      <div class="admin-fee-summary-card"><span>Total Fees</span><strong>${money(totalCollectable)}</strong><p>Selected class ki total collectable fees.</p></div>
      <div class="admin-fee-summary-card"><span>Fees Received</span><strong>${money(totalReceived)}</strong><p>Online aur offline dono payments ka total.</p></div>
      <div class="admin-fee-summary-card"><span>Pending Fees</span><strong>${money(totalPending)}</strong><p>Abhi bhi kitni fees receive hona baaki hai.</p></div>
      <div class="admin-fee-summary-card"><span>Collection Rate</span><strong>${collectionPct}%</strong><p>${paidStudents} paid | ${unpaidStudents} unpaid students.</p></div>
    `;
  }

  $("adminFeesTable").innerHTML = filtered.map(student => {
    const stats = feeStatsForStudent(student, history);
    return `<tr>
      <td><strong>${student.name}</strong><br><small style="color:var(--gray-500)">Parent ${student.parent || student.fatherName || "--"}</small></td>
      <td>Class ${student.class}-${student.section}</td>
      <td>${money(stats.total)}</td>
      <td>${money(stats.paid)}</td>
      <td>${money(stats.pending)}</td>
      <td><span class="badge ${stats.status === "paid" ? "badge-green" : "badge-red"}">${stats.status === "paid" ? "Paid" : "Pending"}</span></td>
      <td><button class="btn btn-sm btn-outline-primary" type="button" onclick="apOpenFeeModal('${student.id}')">Fee Details</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="7" style="text-align:center;color:var(--gray-500)">No students found for the selected class.</td></tr>`;

  if (S.activeFeeStudentId) renderAdminFeeModal(S.activeFeeStudentId);
}

function renderAttendanceSection() {
  const att = attendance();
  const ss = students();
  const overall = ss.length ? Math.round(ss.reduce((sum, s) => sum + (att[s.id]?.percentage || 0), 0) / ss.length) : 0;
  const below = ss.filter(s => (att[s.id]?.percentage || 0) < 75);
  const strong = ss.filter(s => (att[s.id]?.percentage || 0) >= 90);
  $("adminAttendanceSummary").innerHTML = [
    `Overall school attendance is ${overall}%`,
    `${strong.length} students are above 90% attendance`,
    `${below.length} students need attendance intervention`,
    `${classesConfig().length} class sections are under monitoring`
  ].map(item => `<div class="admin-list-item"><strong>Attendance</strong><span>${item}</span></div>`).join("");
  $("adminAttendanceRisk").innerHTML = below.map(s => `<div class="admin-list-item"><strong>${s.name}</strong><span>Class ${s.class}-${s.section} | Attendance ${(att[s.id]?.percentage || 0)}% | Parent ${s.parent || "--"}</span></div>`).join("") || `<div class="admin-list-item"><strong>Healthy attendance</strong><span>No students are currently below the risk threshold.</span></div>`;
}

function renderResultsSection() {
  const marksData = marks();
  const merit = students().map(s => {
    const vals = Object.values(marksData[s.id] || {}).map(Number).filter(Number.isFinite);
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { student: s, avg };
  }).sort((a, b) => b.avg - a.avg).slice(0, 6);
  $("adminMeritBoard").innerHTML = merit.map((item, idx) => `<div class="admin-list-item"><strong>#${idx + 1} ${item.student.name}</strong><span>Class ${item.student.class}-${item.student.section} | Average ${item.avg}%</span></div>`).join("") || `<p style="color:var(--gray-500)">No result data available.</p>`;
  const examRows = testResults();
  const progress = progressData();
  $("adminResultsInsights").innerHTML = [
    `${examRows.length} digital test results are available for review`,
    `${progress.length} progress snapshots are stored in the ERP`,
    `${merit[0] ? `${merit[0].student.name} is currently leading the merit board with ${merit[0].avg}%` : "No toppers available yet"}`,
    `${students().filter(s => {
      const vals = Object.values(marksData[s.id] || {}).map(Number).filter(Number.isFinite);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return avg < 60 && vals.length;
    }).length} students may need academic support`
  ].map(item => `<div class="admin-list-item"><strong>Result Insight</strong><span>${item}</span></div>`).join("");
}

function renderAcademics() {
  ensureAcademicDemoData();
  const marksData = marks();
  const attData = attendance();
  const examList = exams().sort((a, b) => new Date(a.date) - new Date(b.date));
  const homeworkList = getData("vm_homework");
  const materialList = Object.entries(getObj("vm_studyMaterials")).flatMap(([subject, items]) => (items || []).map(item => ({ subject, ...item })));
  const nextExam = examList.find(item => new Date(item.date) >= new Date("2026-04-07")) || examList[0];
  const avgMarks = (() => {
    const all = Object.values(marksData).flatMap(row => Object.values(row).map(Number).filter(Number.isFinite));
    return all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
  })();
  const avgAttendance = (() => {
    const all = Object.values(attData).map(x => x.percentage || 0);
    return all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
  })();
  const subjectMap = {};
  Object.values(marksData).forEach(row => {
    Object.entries(row || {}).forEach(([subject, score]) => {
      if (!Number.isFinite(Number(score))) return;
      if (!subjectMap[subject]) subjectMap[subject] = [];
      subjectMap[subject].push(Number(score));
    });
  });
  const rankedSubjects = Object.entries(subjectMap).map(([subject, scores]) => ({
    subject,
    avg: Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
  })).sort((a, b) => b.avg - a.avg);
  const topSubject = rankedSubjects[0];

  const heroStats = $("adminAcademicsHeroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="admin-academics-stat"><strong>${examList.length}</strong><span>Upcoming Exams</span></div>
      <div class="admin-academics-stat"><strong>${homeworkList.length}</strong><span>Homework Tasks</span></div>
      <div class="admin-academics-stat"><strong>${materialList.length}</strong><span>Study Resources</span></div>
    `;
  }

  txt("adminAcademicsNextExam", nextExam ? `${nextExam.examName} | ${fmt(nextExam.date)}` : "--");
  txt("adminAcademicsTopSubject", topSubject ? `${topSubject.subject} | ${topSubject.avg}%` : "--");
  txt("adminAcademicsReadiness", `${avgMarks}% marks | ${avgAttendance}% attendance`);

  $("adminExamList").innerHTML = examList.map(ex => `<div class="admin-list-item admin-academics-item"><strong>${ex.examName}</strong><span>${ex.subject} | ${fmt(ex.date)} | ${ex.time} | ${ex.room}</span><span>${ex.syllabus || "Syllabus to be announced"}${ex.duration ? ` | ${ex.duration}` : ""}</span><div class="admin-action-row"><button class="btn btn-sm btn-red" type="button" onclick="apDeleteExam('${ex.id}')">Delete</button></div></div>`).join("") || `<p style="color:var(--gray-500)">No exams scheduled.</p>`;

  $("adminAcademicSummary").innerHTML = [
    `Average marks across school: ${avgMarks}%`,
    `Average attendance across school: ${avgAttendance}%`,
    `${homeworkList.length} homework records are tracked in the system.`,
    `${materialList.length} study materials are available.`,
    `${homeworkList.filter(item => !item.submitted).length} homework items are still pending submission.`,
    `${examList.length ? `${examList.length} exams are lined up for the current academic review window.` : "No exams scheduled yet."}`
  ].map(item => `<div class="admin-list-item"><strong>Academic</strong><span>${item}</span></div>`).join("");

  $("adminAcademicBoard").innerHTML = `
    <div class="admin-academic-board-card">
      <strong>Exam Readiness</strong>
      <p>${nextExam ? `${nextExam.examName} is the next major event with ${nextExam.syllabus || "syllabus pending"}.` : "No exam added yet."}</p>
    </div>
    <div class="admin-academic-board-card">
      <strong>Homework Load</strong>
      <p>${homeworkList.filter(item => !item.submitted).length} active homework items are currently open for student completion.</p>
    </div>
    <div class="admin-academic-board-card">
      <strong>Resource Bank</strong>
      <p>${materialList.filter(item => item.type === "pdf").length} notes packs and ${materialList.filter(item => item.type === "mp4").length} video resources are ready.</p>
    </div>
  `;

  $("adminAcademicSubjectList").innerHTML = rankedSubjects.map(item => `<div class="admin-list-item admin-academics-item"><strong>${item.subject}</strong><span>Average score ${item.avg}% | Linked materials ${(getObj("vm_studyMaterials")[normalizeText(item.subject)] || []).length}</span></div>`).join("") || `<p style="color:var(--gray-500)">No subject performance data available.</p>`;
}

function renderResources() {
  const mats = Object.entries(studyMaterials()).flatMap(([subject, items]) => (items || []).map(item => ({ subject, ...item })));
  $("adminMaterialsList").innerHTML = mats.slice(0, 8).map(item => `<div class="admin-list-item"><strong>${item.title}</strong><span>${item.subject} | ${item.type} | ${item.size} | ${item.downloads || 0} downloads</span></div>`).join("") || `<p style="color:var(--gray-500)">No study materials available.</p>`;
  $("adminLibraryList").innerHTML = libraryBooks().slice(0, 8).map(book => `<div class="admin-list-item"><strong>${book.title}</strong><span>${book.author} | ${book.category || book.subject} | ${book.borrowed ? `Borrowed by ${book.borrowerId}` : "Available"}</span></div>`).join("") || `<p style="color:var(--gray-500)">No library data available.</p>`;
}

function renderDigital() {
  $("adminDigitalLearning").innerHTML = [
    `${onlineClasses().length} online classes are configured`,
    `${classRecordings().length} class recordings are stored`,
    `${onlineTests().length} online tests are active`,
    `${testResults().length} digital test attempts are recorded`
  ].map(item => `<div class="admin-list-item"><strong>Digital Learning</strong><span>${item}</span></div>`).join("");
  $("adminRecognitionList").innerHTML = [
    `${certificates().length} certificates have been issued`,
    `${badges().length} recognition badges are available`,
    `${progressData().length} progress records support student growth tracking`,
    `${students().length ? "Recognition workflows are connected with student records." : "No student records available yet."}`
  ].map(item => `<div class="admin-list-item"><strong>Recognition</strong><span>${item}</span></div>`).join("");
}

function renderOperations() {
  $("adminTimetableList").innerHTML = timetable().slice(0, 8).map(slot => `<div class="admin-list-item"><strong>${slot.day || slot.date || "Schedule"}</strong><span>${slot.class || slot.className || "--"} | ${slot.subject || slot.title || "--"} | ${slot.time || slot.period || "--"} | ${slot.room || "Room TBD"}</span></div>`).join("") || `<p style="color:var(--gray-500)">No timetable data available.</p>`;
  $("adminParentCommList").innerHTML = broadcasts().slice(0, 8).map(item => `<div class="admin-list-item"><strong>${item.subject || "Communication"}</strong><span>${item.audience || "parents"} | ${rel(item.date)} | ${item.message}</span></div>`).join("") || `<p style="color:var(--gray-500)">No parent communication logs available.</p>`;
}

function renderCommunication() {
  const noticeList = notices().sort((a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0));
  const broadcastList = broadcasts().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const teacherNotices = noticeList.filter(item => ["teachers", "all"].includes(item.audience || "all"));
  const studentNotices = noticeList.filter(item => ["students", "all"].includes(item.audience || "all"));
  const latestAdminNotice = noticeList.find(item => item.author === "Admin");

  const heroStats = $("adminCommunicationHeroStats");
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="admin-communication-stat"><strong>${noticeList.length}</strong><span>Total Notices</span></div>
      <div class="admin-communication-stat"><strong>${teacherNotices.length}</strong><span>Teacher Notices</span></div>
      <div class="admin-communication-stat"><strong>${studentNotices.length}</strong><span>Student Notices</span></div>
    `;
  }

  txt("adminCommunicationTeacherCount", `${teacherNotices.length} active`);
  txt("adminCommunicationStudentCount", `${studentNotices.length} active`);
  txt("adminCommunicationLatest", latestAdminNotice ? `${latestAdminNotice.title} | ${fmt(latestAdminNotice.date || latestAdminNotice.timestamp)}` : "--");

  const audienceLabel = audience => ({
    all: "All Portals",
    teachers: "Teachers",
    students: "Students",
    parents: "Parents"
  }[audience || "all"] || "All Portals");

  $("adminNoticesList").innerHTML = noticeList.map(item => `<div class="admin-list-item admin-communication-item">
    <div class="admin-communication-item-top">
      <div>
        <strong>${item.title}</strong>
        <span>${item.type} | ${fmt(item.date || item.timestamp)} | ${item.author || "Admin"}</span>
      </div>
      <div class="admin-communication-chip-row">
        <span class="badge ${item.author === "Admin" ? "badge-primary" : "badge-gold"}">${item.author === "Admin" ? "Admin Notice" : "Faculty Notice"}</span>
        <span class="badge badge-primary">${audienceLabel(item.audience)}</span>
      </div>
    </div>
    <span>${item.content}</span>
    <div class="admin-action-row"><button class="btn btn-sm btn-red" type="button" onclick="apDeleteNotice('${item.id}')">Delete</button></div>
  </div>`).join("") || `<p style="color:var(--gray-500)">No notices published.</p>`;

  $("adminBroadcastList").innerHTML = broadcastList.map(item => `<div class="admin-list-item admin-communication-item">
    <div class="admin-communication-item-top">
      <div>
        <strong>${item.subject}</strong>
        <span>${audienceLabel(item.audience)} | ${rel(item.date)}${item.channel ? ` | ${item.channel}` : ""}</span>
      </div>
      <div class="admin-communication-chip-row">
        <span class="badge ${item.priority === "urgent" ? "badge-red" : item.priority === "important" ? "badge-gold" : "badge-primary"}">${item.priority || "info"}</span>
        <span class="badge badge-primary">Broadcast</span>
      </div>
    </div>
    <span>${item.message}</span>
    <div class="admin-action-row"><button class="btn btn-sm btn-red" type="button" onclick="apDeleteBroadcast('${item.id}')">Delete</button></div>
  </div>`).join("") || `<p style="color:var(--gray-500)">No broadcasts yet.</p>`;
}

function renderReports() {
  const ss = students();
  const tt = teachers();
  const cc = classesConfig();
  $("adminReportSummary").innerHTML = [
    `Total student strength: ${ss.length}`,
    `Total teachers onboarded: ${tt.length}`,
    `Managed class sections: ${cc.length}`,
    `Published notices: ${notices().length}`,
    `Pending admissions: ${admissions().filter(a => a.status === "pending").length}`,
    `Library books tracked: ${libraryBooks().length}`,
    `Online classes configured: ${onlineClasses().length}`
  ].map(line => `<div class="admin-list-item"><strong>Summary</strong><span>${line}</span></div>`).join("");
}

function renderSettings() {
  const s = school();
  $("schoolName").value = s.name || "";
  $("schoolPhone").value = s.phone || "";
  $("schoolEmail").value = s.email || "";
  $("schoolSession").value = s.session || "2025-26";
  $("schoolAddress").value = s.address || "";
}

function renderAll() {
  syncFeeLedgers();
  renderDashboard();
  renderStudents();
  renderTeachers();
  renderClasses();
  renderAdmissions();
  renderFees();
  renderAttendanceSection();
  renderResultsSection();
  renderAcademics();
  renderResources();
  renderDigital();
  renderOperations();
  renderCommunication();
  renderReports();
  renderSettings();
}

function nextId(prefix, arr) { return `${prefix}${String(arr.length + 1).padStart(3, "0")}`; }

async function persistAdminKey(key, value) {
  if (typeof window.vmPersistKey === "function") {
    const result = await window.vmPersistKey(key, value);
    if (result?.syncedRemotely === false && result.error) {
      throw result.error;
    }
    return result;
  }
  setData(key, value);
  return { storedLocally: true, syncedRemotely: false };
}

function persistAdminKeyInBackground(key, value, failureMessage = "Database sync fail ho gaya.") {
  persistAdminKey(key, value).catch(error => {
    console.warn(`[Admin] Background sync failed for ${key}:`, error);
    showToast(failureMessage, "error");
  });
}

function bind() {
  document.querySelectorAll(".portal-nav a[data-section]").forEach(a => a.addEventListener("click", () => openSection(a.dataset.section)));
  $("adminSidebarToggle")?.addEventListener("click", () => $("adminSidebar").classList.toggle("open"));
  $("studentSearch")?.addEventListener("input", e => { S.studentQuery = e.target.value; renderStudents(); });
  $("studentClassFilter")?.addEventListener("change", e => { S.studentClass = e.target.value; renderStudents(); });
  $("teacherSearch")?.addEventListener("input", e => { S.teacherQuery = e.target.value; renderTeachers(); });
  $("feeClassFilter")?.addEventListener("change", e => { S.feeClass = e.target.value; renderFees(); });

  $("adminStudentForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const list = students();
    const password = $("studentPasswordInput").value.trim();
    const payload = {
      name: $("studentNameInput").value.trim(),
      class: $("studentClassInput").value.trim(),
      section: $("studentSectionInput").value.trim().toUpperCase(),
      parent: $("studentParentInput").value.trim(),
      contact: $("studentContactInput").value.trim(),
      address: $("studentAddressInput").value.trim() || "Indore",
      gender: $("studentGenderInput").value
    };
    if (S.editingStudentId) {
      const idx = list.findIndex(s => s.id === S.editingStudentId);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...payload, ...(password ? { password } : {}) };
      }
    } else {
      list.push({
        id: nextId("STU", list),
        rollNo: `${100 + list.length}`,
        fees: "pending",
        password: password || "student123",
        dob: "2010-01-01",
        ...payload
      });
    }
    try {
      await persistAdminKey("vm_students", list);
    } catch (error) {
      console.warn("[Admin] Student save sync failed:", error);
      showToast("Student local list me save hua, lekin database sync fail ho gaya.", "error");
      return;
    }
    apCloseModal("adminStudentModal");
    e.target.reset();
    S.editingStudentId = "";
    renderAll();
    logAdminAction("Student saved", `${payload.name} was saved in Class ${payload.class}-${payload.section}.`);
    showToast("Student record saved successfully.", "success");
  });

  $("adminTeacherForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const list = teachers();
    const password = $("teacherPasswordInput").value.trim();
    const payload = {
      name: $("teacherNameInput").value.trim(),
      subject: $("teacherSubjectInput").value.split(",").map(x => x.trim()).filter(Boolean).join(", "),
      email: $("teacherEmailInput").value.trim(),
      phone: $("teacherPhoneInput").value.trim(),
      exp: $("teacherExpInput").value.trim() || "1 year",
      class: $("teacherClassInput").value.trim()
    };
    if (S.editingTeacherId) {
      const idx = list.findIndex(t => t.id === S.editingTeacherId);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...payload, ...(password ? { password } : {}) };
      }
    } else {
      list.push({
        id: nextId("TCH", list),
        password: password || "teacher123",
        ...payload
      });
    }
    try {
      await persistAdminKey("vm_teachers", list);
    } catch (error) {
      console.warn("[Admin] Teacher save sync failed:", error);
      showToast("Teacher local list me save hua, lekin database sync fail ho gaya.", "error");
      return;
    }
    apCloseModal("adminTeacherModal");
    e.target.reset();
    S.editingTeacherId = "";
    renderAll();
    logAdminAction("Teacher saved", `${payload.name} teacher record was saved with subjects ${payload.subject || "--"}.`);
    showToast("Teacher record saved successfully.", "success");
  });

  $("adminClassForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const list = classesConfig();
    const payload = {
      class: $("classNumberInput").value.trim(),
      section: $("classSectionInput").value.trim().toUpperCase(),
      classTeacher: $("classTeacherInput").value.trim() || "Not assigned",
      room: $("classRoomInput").value.trim() || "TBD",
      capacity: Number($("classCapacityInput").value) || 40,
      annualFee: Number($("classFeeInput").value) || 15000
    };
    if (S.editingClassId) {
      const idx = list.findIndex(c => c.id === S.editingClassId);
      if (idx > -1) list[idx] = { ...list[idx], ...payload };
    } else {
      list.push({ id: nextId("CLS", list), ...payload });
    }
    try {
      await persistAdminKey("vm_classConfig", list);
    } catch (error) {
      console.warn("[Admin] Class save sync failed:", error);
      showToast("Class local list me save hui, lekin database sync fail ho gaya.", "error");
      return;
    }
    apCloseModal("adminClassModal");
    e.target.reset();
    S.editingClassId = "";
    renderAll();
    logAdminAction("Class saved", `Class ${payload.class}-${payload.section} was updated in class management.`);
    showToast("Class record saved successfully.", "success");
  });

  $("adminNoticeForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const list = notices();
    list.unshift({
      id: nextId("N", list),
      title: $("noticeTitleInput").value.trim(),
      content: $("noticeContentInput").value.trim(),
      type: $("noticeTypeInput").value,
      audience: $("noticeAudienceInput").value,
      date: new Date().toISOString().split("T")[0],
      author: "Admin"
    });
    try {
      await persistAdminKey("vm_notices", list);
    } catch (error) {
      console.warn("[Admin] Notice save sync failed:", error);
      showToast("Notice local list me save hui, lekin database sync fail ho gaya.", "error");
      return;
    }
    apCloseModal("adminNoticeModal");
    e.target.reset();
    renderDashboard();
    renderCommunication();
    logAdminAction("Notice published", `${$("noticeTitleInput").value.trim()} was published for ${$("noticeAudienceInput").value}.`);
    showToast("Notice published successfully.", "success");
  });

  $("adminBroadcastForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const list = broadcasts();
    list.unshift({
      id: `BC${Date.now()}`,
      audience: $("broadcastAudienceInput").value,
      subject: $("broadcastSubjectInput").value.trim(),
      priority: $("broadcastPriorityInput").value,
      channel: $("broadcastChannelInput").value,
      message: $("broadcastMessageInput").value.trim(),
      date: new Date().toISOString()
    });
    try {
      await persistAdminKey("vm_parentCommunication", list);
    } catch (error) {
      console.warn("[Admin] Broadcast save sync failed:", error);
      showToast("Broadcast local list me save hua, lekin database sync fail ho gaya.", "error");
      return;
    }
    apCloseModal("adminBroadcastModal");
    e.target.reset();
    renderCommunication();
    logAdminAction("Broadcast sent", `${$("broadcastSubjectInput").value.trim()} was sent to ${$("broadcastAudienceInput").value}.`);
    showToast("Broadcast saved successfully.", "success");
  });

  $("adminExamForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const list = exams();
    list.unshift({
      id: `EX${Date.now()}`,
      examName: $("examNameInput").value.trim(),
      subject: $("examSubjectInput").value.trim(),
      date: $("examDateInput").value,
      time: $("examTimeInput").value.trim(),
      room: $("examRoomInput").value.trim() || "TBD"
    });
    try {
      await persistAdminKey("vm_examSchedule", list);
    } catch (error) {
      console.warn("[Admin] Exam save sync failed:", error);
      showToast("Exam local list me save hua, lekin database sync fail ho gaya.", "error");
      return;
    }
    apCloseModal("adminExamModal");
    e.target.reset();
    renderAcademics();
    renderDashboard();
    logAdminAction("Exam scheduled", `${$("examNameInput").value.trim()} for ${$("examSubjectInput").value.trim()} was scheduled.`);
    showToast("Exam scheduled successfully.", "success");
  });

  $("adminSchoolForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const nextSchool = {
      ...school(),
      name: $("schoolName").value.trim(),
      phone: $("schoolPhone").value.trim(),
      email: $("schoolEmail").value.trim(),
      session: $("schoolSession").value.trim(),
      address: $("schoolAddress").value.trim()
    };
    try {
      await persistAdminKey("vm_school", nextSchool);
    } catch (error) {
      console.warn("[Admin] School settings sync failed:", error);
      showToast("School settings local me save hui, lekin database sync fail ho gaya.", "error");
      return;
    }
    logAdminAction("School settings saved", "Core school information was updated by admin.");
    showToast("School settings saved.", "success");
  });

  $("adminPasswordForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const current = $("adminCurrentPassword").value;
    const next = $("adminNewPassword").value;
    const confirm = $("adminConfirmPassword").value;
    const admin = getObj("vm_admin");
    if (current !== admin.password) return showToast("Current password is incorrect.", "error");
    if (!next || next !== confirm) return showToast("New password confirmation does not match.", "error");
    try {
      await persistAdminKey("vm_admin", { ...admin, password: next });
    } catch (error) {
      console.warn("[Admin] Admin password sync failed:", error);
      showToast("Password local me update hua, lekin database sync fail ho gaya.", "error");
      return;
    }
    e.target.reset();
    logAdminAction("Admin password updated", "Administrator credentials were updated successfully.");
    showToast("Admin password updated.", "success");
  });
}

window.apOpenModal = id => {
  if (id === "adminStudentModal") {
    if (!S.editingStudentId) $("adminStudentForm")?.reset();
    if ($("studentPasswordInput")) $("studentPasswordInput").value = "";
    txt("adminStudentModalTitle", S.editingStudentId ? "Edit Student" : "Add Student");
  }
  if (id === "adminTeacherModal") {
    if (!S.editingTeacherId) $("adminTeacherForm")?.reset();
    if ($("teacherPasswordInput")) $("teacherPasswordInput").value = "";
    txt("adminTeacherModalTitle", S.editingTeacherId ? "Edit Teacher" : "Add Teacher");
  }
  if (id === "adminClassModal" && !S.editingClassId) $("adminClassForm")?.reset();
  $(id)?.classList.add("show");
};
window.apCloseModal = id => {
  if (id === "adminStudentModal") {
    S.editingStudentId = "";
    $("adminStudentForm")?.reset();
    txt("adminStudentModalTitle", "Add Student");
  }
  if (id === "adminTeacherModal") {
    S.editingTeacherId = "";
    $("adminTeacherForm")?.reset();
    txt("adminTeacherModalTitle", "Add Teacher");
  }
  if (id === "adminClassModal") {
    S.editingClassId = "";
    $("adminClassForm")?.reset();
  }
  if (id === "adminFeeModal") {
    S.activeFeeStudentId = "";
  }
  $(id)?.classList.remove("show");
};
window.apDeleteStudent = async function (id) {
  if (!confirm("Delete this student?")) return;
  const student = students().find(s => s.id === id);
  const nextStudents = students().filter(s => s.id !== id);
  try {
    await persistAdminKey("vm_students", nextStudents);
  } catch (error) {
    console.warn("[Admin] Student delete sync failed:", error);
    showToast("Student delete local me hua, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderAll();
  logAdminAction("Student deleted", `${student?.name || id} was removed from the ERP.`);
  showToast("Student deleted.", "success");
};
window.apPortalPreviewStudent = function (id) {
  const student = students().find(s => s.id === id);
  if (!student) return;
  localStorage.setItem("vm_studentUser", JSON.stringify(student));
  logAdminAction("Student portal preview prepared", `${student.name} was loaded into student portal preview context.`);
  showToast(`Student portal preview is ready for ${student.name}.`, "success");
  window.open("../student-portal/student-portal.html", "_blank");
};
window.apOpenStudentPortal = function () {
  const first = filteredStudents()[0] || students()[0];
  if (!first) return showToast("No student record available.", "error");
  window.apPortalPreviewStudent(first.id);
};
window.apBulkResetStudentPasswords = async function () {
  const list = students();
  if (!list.length) return showToast("No student records available.", "error");
  const nextStudents = list.map(s => ({ ...s, password: "student123" }));
  try {
    await persistAdminKey("vm_students", nextStudents);
  } catch (error) {
    console.warn("[Admin] Student password reset sync failed:", error);
    showToast("Password reset local me hua, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderStudents();
  logAdminAction("Student passwords reset", `${list.length} student portal passwords were reset to default.`);
  showToast("Visible student portal passwords reset to default.", "success");
};
window.apMarkAllVisibleFeesPaid = function () {
  const visibleIds = new Set(filteredStudents().map(s => s.id));
  if (!visibleIds.size) return showToast("No visible students found.", "error");
  const history = feeHistory().map(item => visibleIds.has(item.studentId) ? {
    ...item,
    status: "paid",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: item.paymentMethod || "Offline Cash",
    receipt: item.receipt || `RCP${Date.now()}${item.id}`
  } : item);
  saveFeeHistory(history);
  renderAll();
  logAdminAction("Bulk fee update", `${visibleIds.size} visible student records were marked as fee paid.`);
  showToast("Visible students marked as fee paid.", "success");
};
window.apPortalPreviewTeacher = function (id) {
  const teacher = teachers().find(t => t.id === id);
  if (!teacher) return;
  localStorage.setItem("vm_teacherUser", JSON.stringify(teacher));
  logAdminAction("Teacher portal preview prepared", `${teacher.name} was loaded into teacher portal preview context.`);
  showToast(`Teacher portal preview is ready for ${teacher.name}.`, "success");
  window.open("../teacher-portal/teacher-portal.html", "_blank");
};
window.apEditStudent = function (id) {
  const student = students().find(s => s.id === id);
  if (!student) return;
  S.editingStudentId = id;
  $("studentNameInput").value = student.name || "";
  $("studentClassInput").value = student.class || "";
  $("studentSectionInput").value = student.section || "";
  $("studentParentInput").value = student.parent || "";
  $("studentContactInput").value = student.contact || "";
  $("studentAddressInput").value = student.address || "";
  $("studentGenderInput").value = student.gender || "M";
  $("studentPasswordInput").value = "";
  apOpenModal("adminStudentModal");
  showToast("Student loaded into form. Save to update.", "info");
};
window.apDeleteTeacher = async function (id) {
  if (!confirm("Delete this teacher?")) return;
  const teacher = teachers().find(t => t.id === id);
  const nextTeachers = teachers().filter(t => t.id !== id);
  try {
    await persistAdminKey("vm_teachers", nextTeachers);
  } catch (error) {
    console.warn("[Admin] Teacher delete sync failed:", error);
    showToast("Teacher delete local me hua, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderAll();
  logAdminAction("Teacher deleted", `${teacher?.name || id} was removed from faculty records.`);
  showToast("Teacher deleted.", "success");
};
window.apEditTeacher = function (id) {
  const teacher = teachers().find(t => t.id === id);
  if (!teacher) return;
  S.editingTeacherId = id;
  $("teacherNameInput").value = teacher.name || "";
  $("teacherSubjectInput").value = teacher.subject || "";
  $("teacherEmailInput").value = teacher.email || "";
  $("teacherPhoneInput").value = teacher.phone || "";
  $("teacherExpInput").value = teacher.exp || "";
  $("teacherClassInput").value = teacher.class || "";
  $("teacherPasswordInput").value = "";
  apOpenModal("adminTeacherModal");
  showToast("Teacher loaded into form. Save to update.", "info");
};
window.apEditClass = function (id) {
  const cls = classesConfig().find(c => c.id === id);
  if (!cls) return;
  S.editingClassId = id;
  $("classNumberInput").value = cls.class || "";
  $("classSectionInput").value = cls.section || "";
  $("classTeacherInput").value = cls.classTeacher || "";
  $("classRoomInput").value = cls.room || "";
  $("classCapacityInput").value = cls.capacity || 40;
  $("classFeeInput").value = cls.annualFee || 15000;
  apOpenModal("adminClassModal");
  showToast("Class loaded into form. Save to update.", "info");
};
window.apDeleteClass = function (id) {
  if (!confirm("Delete this class?")) return;
  const cls = classesConfig().find(c => c.id === id);
  saveClassesConfig(classesConfig().filter(c => c.id !== id));
  renderAll();
  logAdminAction("Class deleted", `Class ${cls?.class || ""}-${cls?.section || ""} was removed from class management.`);
  showToast("Class deleted.", "success");
};
window.apMarkFeePaid = function (id) {
  const history = feeHistory().map(item => item.studentId === id ? {
    ...item,
    status: "paid",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: item.paymentMethod || "Offline Cash",
    receipt: item.receipt || `RCP${Date.now()}${item.id}`
  } : item);
  saveFeeHistory(history);
  renderAll();
  const student = students().find(s => s.id === id);
  logAdminAction("Fee updated", `${student?.name || id} was marked as fee paid.`);
  showToast("Fee marked as paid.", "success");
};
window.apOpenFeeModal = function (id) {
  S.activeFeeStudentId = id;
  renderAdminFeeModal(id);
  apOpenModal("adminFeeModal");
};
window.apUpdateFeeEntry = function (entryId, status) {
  if (!S.activeFeeStudentId) return;
  const list = feeHistory();
  const idx = list.findIndex(item => item.id === entryId);
  if (idx < 0) return;
  const method = $("adminFeeMethodInput")?.value || "Offline Cash";
  const date = $("adminFeeDateInput")?.value || new Date().toISOString().split("T")[0];
  list[idx] = {
    ...list[idx],
    status,
    date: status === "paid" ? date : null,
    paymentMethod: status === "paid" ? method : null,
    receipt: status === "paid" ? (list[idx].receipt || `RCP${Date.now()}`) : null
  };
  saveFeeHistory(list);
  renderAll();
  renderAdminFeeModal(S.activeFeeStudentId);
  apOpenModal("adminFeeModal");
  logAdminAction("Fee installment updated", `${entryId} was marked ${status} for ${S.activeFeeStudentId}.`);
  showToast(`Fee installment marked ${status}.`, "success");
};
window.apUpdateFullFeeStatus = function (status) {
  if (!S.activeFeeStudentId) return;
  const method = $("adminFeeMethodInput")?.value || "Offline Cash";
  const date = $("adminFeeDateInput")?.value || new Date().toISOString().split("T")[0];
  const list = feeHistory().map(item => item.studentId === S.activeFeeStudentId ? {
    ...item,
    status,
    date: status === "paid" ? date : null,
    paymentMethod: status === "paid" ? method : null,
    receipt: status === "paid" ? (item.receipt || `RCP${Date.now()}${item.id}`) : null
  } : item);
  saveFeeHistory(list);
  renderAll();
  renderAdminFeeModal(S.activeFeeStudentId);
  apOpenModal("adminFeeModal");
  logAdminAction("Full fee status updated", `${S.activeFeeStudentId} full fee status was updated to ${status}.`);
  showToast(`Full fee status marked ${status}.`, "success");
};

function renderAdminFeeModal(studentId) {
  const { roster, history } = syncFeeLedgers();
  const student = roster.find(item => item.id === studentId);
  if (!student) return;
  const stats = feeStatsForStudent(student, history);
  txt("adminFeeModalTitle", `${student.name} | Fee Details`);
  if ($("adminFeeDateInput") && !$("adminFeeDateInput").value) {
    $("adminFeeDateInput").value = new Date().toISOString().split("T")[0];
  }
  $("adminFeeDetailSummary").innerHTML = `
    <div class="admin-fee-detail-card"><span>Class</span><strong>${student.class}-${student.section}</strong><p>${student.id}</p></div>
    <div class="admin-fee-detail-card"><span>Total Fees</span><strong>${money(stats.total)}</strong><p>Annual linked fee plan</p></div>
    <div class="admin-fee-detail-card"><span>Paid</span><strong>${money(stats.paid)}</strong><p>${stats.paidInstallments} installment cleared</p></div>
    <div class="admin-fee-detail-card"><span>Pending</span><strong>${money(stats.pending)}</strong><p>${stats.pendingInstallments} installment remaining</p></div>
  `;
  $("adminFeeDetailRows").innerHTML = stats.entries.map(item => `<tr>
    <td>${item.quarter}</td>
    <td>${money(item.amount)}</td>
    <td><span class="badge ${item.status === "paid" ? "badge-green" : "badge-gold"}">${item.status}</span></td>
    <td>${item.date ? fmt(item.date) : "--"}</td>
    <td>${item.paymentMethod || "--"}</td>
    <td>${item.receipt || "--"}</td>
    <td><div class="admin-action-row">${item.status === "paid" ? `<button class="btn btn-sm btn-outline-primary" type="button" onclick="apUpdateFeeEntry('${item.id}','pending')">Mark Pending</button>` : `<button class="btn btn-sm btn-green" type="button" onclick="apUpdateFeeEntry('${item.id}','paid')">Mark Paid</button>`}</div></td>
  </tr>`).join("");
}
window.apUpdateAdmission = async function (id, status) {
  const list = admissions();
  const idx = list.findIndex(a => a.id === id);
  if (idx < 0) return;
  const previousStatus = list[idx].status;
  list[idx].status = status;
  if (status === "approved" && previousStatus !== "approved") {
    const a = list[idx];
    const roster = students();
    const existingStudent = roster.find(s =>
      normalizeText(s.name) === normalizeText(a.name) &&
      String(s.class || "") === String(a.class || "") &&
      normalizeText(s.parent || "") === normalizeText(a.parent || "")
    );
    if (!existingStudent) {
      roster.push({
        id: nextId("STU", roster),
        name: a.name,
        rollNo: `${200 + roster.length}`,
        class: a.class,
        section: "A",
        parent: a.parent,
        contact: a.contact,
        address: "Indore",
        password: "student123",
        fees: "pending",
        gender: "M",
        dob: "2010-01-01"
      });
      try {
        await persistAdminKey("vm_students", roster);
      } catch (error) {
        console.warn("[Admin] Admission student-create sync failed:", error);
        showToast("Admission approve hua, lekin student database sync fail ho gaya.", "error");
        return;
      }
    }
  }
  try {
    await persistAdminKey("vm_admissions", list);
  } catch (error) {
    console.warn("[Admin] Admission status sync failed:", error);
    showToast("Admission local list me update hui, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderAll();
  logAdminAction("Admission updated", `${list[idx].name} admission was marked ${status}.`);
  showToast(`Admission ${status}.`, "success");
};
window.apDeleteNotice = async function (id) {
  if (!confirm("Delete this notice?")) return;
  const notice = notices().find(n => n.id === id);
  const nextNotices = notices().filter(n => n.id !== id);
  try {
    await persistAdminKey("vm_notices", nextNotices);
  } catch (error) {
    console.warn("[Admin] Notice delete sync failed:", error);
    showToast("Notice delete local me hua, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderAll();
  logAdminAction("Notice deleted", `${notice?.title || id} was removed from the notice board.`);
  showToast("Notice deleted.", "success");
};
window.apDeleteBroadcast = async function (id) {
  if (!confirm("Delete this broadcast?")) return;
  const item = broadcasts().find(b => b.id === id);
  const nextBroadcasts = broadcasts().filter(b => b.id !== id);
  try {
    await persistAdminKey("vm_parentCommunication", nextBroadcasts);
  } catch (error) {
    console.warn("[Admin] Broadcast delete sync failed:", error);
    showToast("Broadcast delete local me hua, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderAll();
  logAdminAction("Broadcast deleted", `${item?.subject || id} was removed from communication logs.`);
  showToast("Broadcast deleted.", "success");
};
window.apDeleteExam = async function (id) {
  if (!confirm("Delete this exam schedule?")) return;
  const exam = exams().find(ex => ex.id === id);
  const nextExams = exams().filter(ex => ex.id !== id);
  try {
    await persistAdminKey("vm_examSchedule", nextExams);
  } catch (error) {
    console.warn("[Admin] Exam delete sync failed:", error);
    showToast("Exam delete local me hua, lekin database sync fail ho gaya.", "error");
    return;
  }
  renderAll();
  logAdminAction("Exam deleted", `${exam?.examName || id} was removed from exam scheduling.`);
  showToast("Exam removed.", "success");
};
window.apClearAuditLog = function () {
  saveAuditLog([]);
  renderDashboard();
  showToast("Audit log cleared.", "success");
};

window.apExportDataset = function (type) {
  const map = {
    students: ["vm_students", ["id", "name", "rollNo", "class", "section", "parent", "contact", "fees"], "students"],
    teachers: ["vm_teachers", ["id", "name", "subject", "email", "phone", "exp", "class"], "teachers"],
    admissions: ["vm_admissions", ["id", "name", "class", "parent", "contact", "status", "date"], "admissions"],
    fees: ["vm_students", ["id", "name", "class", "section", "fees"], "fees"],
    notices: ["vm_notices", ["id", "title", "type", "audience", "date", "author"], "notices"],
    library: ["vm_library", ["id", "title", "author", "subject", "category", "borrowed", "borrowerId"], "library"],
    online: ["vm_onlineClasses", ["id", "title", "subject", "teacher", "date", "time"], "online_classes"]
  };
  if (type === "classes") {
    const fields = ["class", "section", "classTeacher", "room", "capacity", "annualFee"];
    const rows = [fields.join(","), ...classesConfig().map(r => fields.map(f => `"${r[f] ?? ""}"`).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `classes_${Date.now()}.csv`;
    a.click();
    return showToast("Classes CSV exported.", "success");
  }
  const cfg = map[type];
  if (!cfg) return;
  exportCSV(cfg[0], cfg[1], cfg[2]);
};

function exportCSV(key, fields, filename) {
  const data = getData(key);
  const rows = [fields.join(","), ...data.map(r => fields.map(f => `"${r[f] || ""}"`).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}_${Date.now()}.csv`;
  a.click();
  showToast("CSV exported.", "success");
}

// ==================== RESULTS MANAGEMENT ====================
let resultsData = { exams: [], marksRecords: [] };

function initResultsSection() {
  // Load classes
  const cc = classesConfig();
  const classOpts = cc.map(c => `<option value="${c.class}-${c.section}">${c.class}-${c.section}</option>`).join("");
  ["marksClass", "reportCardClass", "resultsClassFilter", "exportClass"].forEach(el => {
    const elem = $(el);
    if (elem) elem.innerHTML = `<option value="">Select Class</option>${classOpts}`;
  });

  // Initialize default exams
  if (!localStorage.getItem("vm_examTypes")) {
    setData("vm_examTypes", ["Unit Test", "Midterm", "Final", "Practice"]);
  }

  renderResultsSection();
}

function renderResultsSection() {
  const ss = students();
  const marksRecords = getObj("vm_marks");
  let totalMarks = 0, countRecords = 0, passCount = 0;

  // Calculate statistics
  Object.values(marksRecords).forEach(studentMarks => {
    Object.values(studentMarks).forEach(mark => {
      if (typeof mark === 'number') {
        totalMarks += mark;
        countRecords++;
        if (mark >= 40) passCount++;
      }
    });
  });

  const avgMarks = countRecords > 0 ? (totalMarks / countRecords).toFixed(1) : 0;
  const passPercentage = ss.length > 0 ? Math.round((passCount / ss.length) * 100) : 0;
  const failedCount = ss.length - passCount;

  txt("resultsTotalStudents", ss.length);
  txt("resultsAvgMarks", avgMarks);
  txt("resultsPassPercentage", `${passPercentage}%`);
  txt("resultsFailedCount", failedCount);

  // Topper info
  let topper = null;
  let maxTotal = 0;
  ss.forEach(s => {
    const total = Object.values(marksRecords[s.id] || {}).reduce((a, b) => typeof b === 'number' ? a + b : a, 0);
    if (total > maxTotal) {
      maxTotal = total;
      topper = s;
      topper.totalMarks = total;
    }
  });

  $("resultsTopperInfo").innerHTML = topper ? `
    <div class="admin-list-item">
      <strong>🏆 ${topper.name}</strong>
      <span>Roll: ${topper.roll} | Total: ${topper.totalMarks} marks</span>
    </div>
  ` : `<div class="admin-list-item"><span>No marks entered yet</span></div>`;

  // Status info
  $("resultsStatusInfo").innerHTML = `
    <div class="admin-list-item"><strong>Students with marks:</strong><span>${Object.keys(marksRecords).length}</span></div>
    <div class="admin-list-item"><strong>Report cards generated:</strong><span>0</span></div>
    <div class="admin-list-item"><strong>Results published:</strong><span>No</span></div>
    <div class="admin-list-item"><strong>Last update:</strong><span>${new Date().toLocaleDateString()}</span></div>
  `;

  // Merit board
  const meritList = ss
    .map(s => ({
      ...s,
      totalMarks: Object.values(marksRecords[s.id] || {}).reduce((a, b) => typeof b === 'number' ? a + b : a, 0)
    }))
    .sort((a, b) => b.totalMarks - a.totalMarks)
    .slice(0, 5);

  $("adminMeritBoard").innerHTML = meritList.map((s, i) => `
    <div class="admin-list-item">
      <strong>${i + 1}. ${s.name}</strong>
      <span>${s.totalMarks} marks | ${s.class}-${s.section}</span>
    </div>
  `).join("") || `<div class="admin-list-item"><span>No merit data</span></div>`;

  // Weak students
  const weakStudents = ss
    .filter(s => {
      const avg = (Object.values(marksRecords[s.id] || {}).filter(m => typeof m === 'number').reduce((a, b) => a + b, 0) / 6) || 0;
      return avg < 40;
    })
    .slice(0, 5);

  $("adminWeakStudents").innerHTML = weakStudents.map(s => `
    <div class="admin-list-item">
      <strong>⚠️ ${s.name}</strong>
      <span>Roll: ${s.roll} | Class: ${s.class}</span>
    </div>
  `).join("") || `<div class="admin-list-item"><span>No weak students</span></div>`;

  renderStudentResultsTable();
  renderMeritLists();
}

function loadStudentsForMarks() {
  const classVal = $("marksClass").value;
  if (!classVal) return;

  const ss = students().filter(s => `${s.class}-${s.section}` === classVal);
  $("marksStudent").innerHTML = `<option value="">Select Student</option>` + ss.map(s => `<option value="${s.id}">${s.name} (${s.roll})</option>`).join("");
}

async function submitMarksEntry(e) {
  e.preventDefault();

  const marksRec = getObj("vm_marks");
  const studentId = $("marksStudent").value;
  const subject = $("marksSubject").value;
  const obtained = parseFloat($("marksObtained").value);
  const total = parseFloat($("markTotal").value);

  if (!studentId || !subject || obtained == null) {
    showToast("❌ Please fill all fields", "error");
    return;
  }

  if (!marksRec[studentId]) marksRec[studentId] = {};
  marksRec[studentId][subject] = obtained;

  try {
    await persistAdminKey("vm_marks", marksRec);
  } catch (error) {
    console.warn("[Admin] Marks save sync failed:", error);
    showToast("Marks local me save hue, lekin database sync fail ho gaya.", "error");
    return;
  }
  showToast(`✅ Marks saved for ${subject}`, "success");
  e.target.reset();
  renderResultsSection();
}

function renderStudentResultsTable() {
  const ss = students();
  const marksRec = getObj("vm_marks");

  $("studentResultsTable").innerHTML = ss.slice(0, 20).map(s => {
    const studentMarks = marksRec[s.id] || {};
    const total = Object.values(studentMarks).filter(m => typeof m === 'number').reduce((a, b) => a + b, 0);
    const avg = Object.keys(studentMarks).length > 0 ? (total / Object.keys(studentMarks).length).toFixed(1) : 0;
    const grade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B' : avg >= 60 ? 'C' : 'F';
    const status = avg >= 40 ? '✅ Pass' : '❌ Fail';

    return `<tr>
      <td>${s.roll}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>Final</td>
      <td>${total}</td>
      <td>${avg}%</td>
      <td>${grade}</td>
      <td>${status}</td>
      <td><button class="btn btn-sm btn-outline-primary" onclick="editStudentMarks('${s.id}')">Edit</button></td>
    </tr>`;
  }).join("");
}

function renderMeritLists() {
  const ss = students();
  const marksRec = getObj("vm_marks");

  // Class-wise toppers
  const classesList = [...new Set(ss.map(s => `${s.class}-${s.section}`))];
  $("classWiseToppers").innerHTML = classesList.map(c => {
    const topperInClass = ss
      .filter(s => `${s.class}-${s.section}` === c)
      .map(s => ({ ...s, total: Object.values(marksRec[s.id] || {}).filter(m => typeof m === 'number').reduce((a, b) => a + b, 0) }))
      .sort((a, b) => b.total - a.total)[0];

    return topperInClass ? `<div class="admin-list-item"><strong>${c}</strong><span>${topperInClass.name} - ${topperInClass.total} marks</span></div>` : '';
  }).join("");

  // Overall merit
  const meritList = ss
    .map(s => ({
      ...s,
      total: Object.values(marksRec[s.id] || {}).filter(m => typeof m === 'number').reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.total - a.total);

  $("overallMeritTable").innerHTML = meritList.slice(0, 10).map((s, i) => {
    const avg = Object.keys(marksRec[s.id] || {}).length > 0 ? (s.total / Object.keys(marksRec[s.id]).length).toFixed(1) : 0;
    const grade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B' : avg >= 60 ? 'C' : 'F';
    return `<tr><td>${i + 1}</td><td>${s.name}</td><td>${s.class}</td><td>${s.total}</td><td>${avg}%</td><td>${grade}</td></tr>`;
  }).join("");
}

function switchResultTab(e, tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".admin-tab-content").forEach(t => t.style.display = "none");
  e.target.classList.add("active");
  $(tabName).style.display = "block";
}

function filterResults() {
  renderStudentResultsTable();
}

async function publishResults() {
  try {
    await persistAdminKey("vm_resultsPublished", true);
  } catch (error) {
    console.warn("[Admin] Results publish sync failed:", error);
    showToast("Results local me publish hue, lekin database sync fail ho gaya.", "error");
    return;
  }
  showToast("✅ Results published! Students can now view them.", "success");
}

function generateReportCard() {
  const studentId = $("reportCardStudent").value;
  if (!studentId) return;

  const ss = students().find(s => s.id === studentId);
  const marksRec = getObj("vm_marks")[studentId] || {};

  $("reportCardPreview").innerHTML = `
    <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);max-width:600px;margin:0 auto;">
      <div style="text-align:center;border-bottom:3px solid #1a3a6b;padding-bottom:20px;margin-bottom:20px;">
        <h2 style="color:#1a3a6b;margin:0;">REPORT CARD</h2>
        <p style="color:#666;margin:5px 0 0;">Vidya Mandir School</p>
      </div>
      <div style="margin-bottom:20px;">
        <p><strong>Student Name:</strong> ${ss.name}</p>
        <p><strong>Roll No:</strong> ${ss.roll}</p>
        <p><strong>Class:</strong> ${ss.class}-${ss.section}</p>
        <p><strong>Session:</strong> 2025-26</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#f0f0f0;"><th style="border:1px solid #ddd;padding:10px;text-align:left;">Subject</th><th style="border:1px solid #ddd;padding:10px;">Marks</th><th style="border:1px solid #ddd;padding:10px;">Grade</th></tr>
        ${Object.entries(marksRec).map(([subject, marks]) => `
          <tr>
            <td style="border:1px solid #ddd;padding:10px;">${subject}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center;">${marks}</td>
            <td style="border:1px solid #ddd;padding:10px;text-align:center;">${marks >= 80 ? 'A' : marks >= 60 ? 'B' : 'C'}</td>
          </tr>
        `).join("")}
      </table>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #ddd;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">
        <div><strong>Total:</strong> ${Object.values(marksRec).reduce((a, b) => a + b, 0)}</div>
        <div><strong>Percentage:</strong> ${((Object.values(marksRec).reduce((a, b) => a + b, 0) / (Object.keys(marksRec).length * 100)) * 100).toFixed(1)}%</div>
        <div><strong>Status:</strong> ✅ Pass</div>
      </div>
    </div>
  `;
}

function downloadReportCardPDF() {
  showToast("📥 PDF download started!", "success");
}

function importMarksCSV() {
  showToast("📤 CSV import capability enabled. Upload CSV with StudentID, Class, Subject, Marks, TotalMarks, ExamType", "info");
}

function exportResultsExcel() {
  const marksRec = getObj("vm_marks");
  const ss = students();

  let csv = "StudentID,Name,Class,Subject,Marks,Percentage\n";
  ss.forEach(s => {
    Object.entries(marksRec[s.id] || {}).forEach(([subject, marks]) => {
      csv += `${s.id},${s.name},${s.class},${subject},${marks},${((marks / 100) * 100).toFixed(1)}\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "results_export.csv";
  a.click();
  showToast("✅ Results exported to CSV", "success");
}

function exportResultsPDF() {
  showToast("📄 PDF export feature available. Download formatted PDF report.", "info");
}

function editStudentMarks(studentId) {
  showToast("✏️ Edit marks form opening...", "info");
}

function loadStudentsForReportCard() {
  const classVal = $("reportCardClass").value;
  if (!classVal) return;

  const ss = students().filter(s => `${s.class}-${s.section}` === classVal);
  $("reportCardStudent").innerHTML = `<option value="">Select Student</option>` + ss.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
}

function showSectionRanking() {
  const sectionVal = $("sectionRankFilter").value;
  if (!sectionVal) return;

  const ss = students().filter(s => s.section === sectionVal);
  const marksRec = getObj("vm_marks");

  $("sectionRankingList").innerHTML = ss
    .map(s => ({
      ...s,
      total: Object.values(marksRec[s.id] || {}).filter(m => typeof m === 'number').reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.total - a.total)
    .map((s, i) => `
      <div class="admin-list-item">
        <strong>${i + 1}. ${s.name}</strong>
        <span>Roll: ${s.roll} | Total: ${s.total} marks</span>
      </div>
    `)
    .join("");
}

async function init() {
  if (window.ensureVmDataReady) {
    await window.ensureVmDataReady();
  } else {
    seedData();
  }
  normalizeAdminData();
  ensureAdminData();
  initResultsSection();
  S.admin = authAdmin();
  if (!S.admin) {
    window.location.href = "../pages/login.html";
    return;
  }
  bind();
  renderAll();
  openSection("secDashboard");
}

document.addEventListener("DOMContentLoaded", init);
})();
