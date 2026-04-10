/* =============================================
   FIREBASE REALTIME DATABASE STRUCTURED DATA LAYER
   Stores data in the user-requested admin-portal tree
   ============================================= */

import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuNEXXQwNxuLVm4Gh9T6qL7FJUCvnNL9M",
  authDomain: "schoolweb-d6da1.firebaseapp.com",
  databaseURL: "https://schoolweb-d6da1-default-rtdb.firebaseio.com",
  projectId: "schoolweb-d6da1",
  storageBucket: "schoolweb-d6da1.firebasestorage.app",
  messagingSenderId: "682634808397",
  appId: "1:682634808397:web:87e7113118541313606004",
  measurementId: "G-FTF4K4EF0Y"
};
window.__vmFirebaseDatabaseUrl = firebaseConfig.databaseURL;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const portalRef = ref(db, "admin-portal");
let portalWriteQueue = Promise.resolve();
let portalTreeCache = null;
let portalTreeCacheLoadedAt = 0;
let portalTreePromise = null;
const PORTAL_TREE_CACHE_MS = 15000;

function setFallbackLocalStorage(key, value) {
  window.__vmSkipFirebaseMirror = true;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } finally {
    window.__vmSkipFirebaseMirror = false;
  }
}

function readArray(key, fallback = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readObject(key, fallback = {}) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizeClassSection(record = {}) {
  const rawClass = String(record.class || "").trim();
  const rawSection = String(record.section || "").trim().toUpperCase();
  const classMatch = rawClass.match(/(\d+)/);
  const sectionMatch = rawClass.match(/([A-Z])$/i);
  return {
    classNumber: classMatch ? classMatch[1] : rawClass || "Unknown",
    section: rawSection || (sectionMatch ? sectionMatch[1].toUpperCase() : "")
  };
}

function studentClassLabel(student) {
  const { classNumber } = normalizeClassSection(student);
  return `Class ${classNumber}`;
}

function teacherClassLabel(rawValue = "") {
  const match = String(rawValue).match(/(\d+)/);
  return match ? `Class ${match[1]}` : String(rawValue || "General").trim();
}

function toFirebaseKey(value, fallback = "Unnamed") {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[.#$/[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
}

function teacherClassBucketName(teacher) {
  const first = String(teacher?.name || teacher?.id || "Teacher").trim().split(/\s+/)[0] || "Teacher";
  return `${first}'s Classes`;
}

function preserveStructuredNode(value, fallback = "") {
  if (Array.isArray(value)) return value.length ? value : fallback;
  if (value && typeof value === "object") return Object.keys(value).length ? value : fallback;
  return value ?? fallback;
}

function buildSystemData(overrides = {}) {
  return {
    vm_students: overrides.vm_students ?? readArray("vm_students"),
    vm_teachers: overrides.vm_teachers ?? readArray("vm_teachers"),
    vm_admissions: overrides.vm_admissions ?? readArray("vm_admissions"),
    vm_notices: overrides.vm_notices ?? readArray("vm_notices"),
    vm_homework: overrides.vm_homework ?? readArray("vm_homework"),
    vm_messages: overrides.vm_messages ?? readArray("vm_messages"),
    vm_feeHistory: overrides.vm_feeHistory ?? readArray("vm_feeHistory"),
    vm_examSchedule: overrides.vm_examSchedule ?? readArray("vm_examSchedule"),
    vm_examResults: overrides.vm_examResults ?? readArray("vm_examResults"),
    vm_timetable: overrides.vm_timetable ?? readObject("vm_timetable"),
    vm_progressData: overrides.vm_progressData ?? readObject("vm_progressData"),
    vm_library: overrides.vm_library ?? readArray("vm_library"),
    vm_onlineTests: overrides.vm_onlineTests ?? readArray("vm_onlineTests"),
    vm_testResults: overrides.vm_testResults ?? readArray("vm_testResults"),
    vm_certificates: overrides.vm_certificates ?? readArray("vm_certificates"),
    vm_badges: overrides.vm_badges ?? readArray("vm_badges"),
    vm_onlineClasses: overrides.vm_onlineClasses ?? readArray("vm_onlineClasses"),
    vm_classRecordings: overrides.vm_classRecordings ?? readArray("vm_classRecordings"),
    vm_parentCommunication: overrides.vm_parentCommunication ?? readArray("vm_parentCommunication"),
    vm_classConfig: overrides.vm_classConfig ?? readArray("vm_classConfig"),
    vm_adminAuditLog: overrides.vm_adminAuditLog ?? readArray("vm_adminAuditLog"),
    vm_examTypes: overrides.vm_examTypes ?? readArray("vm_examTypes"),
    vm_recentStudyDownloads: overrides.vm_recentStudyDownloads ?? readArray("vm_recentStudyDownloads"),
    vm_contactMessages: overrides.vm_contactMessages ?? readArray("vm_contactMessages"),
    vm_admins: overrides.vm_admins ?? readArray("vm_admins"),
    vm_marks: overrides.vm_marks ?? readObject("vm_marks"),
    vm_attendance: overrides.vm_attendance ?? readObject("vm_attendance"),
    vm_admin: overrides.vm_admin ?? readObject("vm_admin"),
    vm_school: overrides.vm_school ?? readObject("vm_school"),
    vm_studyMaterials: overrides.vm_studyMaterials ?? readObject("vm_studyMaterials"),
    vm_teacherSettings: overrides.vm_teacherSettings ?? readObject("vm_teacherSettings"),
    vm_teacherLessonPlans: overrides.vm_teacherLessonPlans ?? readObject("vm_teacherLessonPlans"),
    vm_teacherAttendanceRegister: overrides.vm_teacherAttendanceRegister ?? readObject("vm_teacherAttendanceRegister"),
    vm_resultsPublished: overrides.vm_resultsPublished ?? readObject("vm_resultsPublished"),
    vm_teacherNoticeSeen: overrides.vm_teacherNoticeSeen ?? readObject("vm_teacherNoticeSeen"),
    vm_studentAttendanceCalendar: overrides.vm_studentAttendanceCalendar ?? readObject("vm_studentAttendanceCalendar"),
    vm_studentAttendanceHistory: overrides.vm_studentAttendanceHistory ?? readObject("vm_studentAttendanceHistory"),
    vm_classBookshelf: overrides.vm_classBookshelf ?? readObject("vm_classBookshelf")
  };
}

function buildStudentTree(data) {
  const grouped = {};
  data.vm_students.forEach(student => {
    const classLabel = toFirebaseKey(studentClassLabel(student), "Class Unknown");
    const studentKey = toFirebaseKey(
      `${student.name || "Student"} ${student.id ? `(${student.id})` : ""}`,
      student.id || "Student"
    );
    grouped[classLabel] ||= {};
    grouped[classLabel][studentKey] = {
      Profile: student,
      Attendence: preserveStructuredNode(data.vm_attendance[student.id] || {}, ""),
      Massage: preserveStructuredNode(data.vm_messages.filter(msg => msg.from === student.id || msg.to === student.id), ""),
      Fee: preserveStructuredNode(data.vm_feeHistory.filter(item => item.studentId === student.id), ""),
      "Marks & Results": preserveStructuredNode({
        marks: data.vm_marks[student.id] || {},
        results: data.vm_examResults.filter(item => item.studentId === student.id)
      }, ""),
      Homework: preserveStructuredNode(data.vm_homework.filter(item => item.studentId === student.id), ""),
      "Class Schedule": preserveStructuredNode(data.vm_timetable, ""),
      progress: preserveStructuredNode(Array.isArray(data.vm_progressData)
        ? data.vm_progressData.filter(item => item.studentId === student.id)
        : (data.vm_progressData[student.id] || {}), "")
    };
  });
  return grouped;
}

function buildTeacherTree(data) {
  const grouped = {};
  data.vm_teachers.forEach(teacher => {
    const teacherKey = toFirebaseKey(
      `${teacher.name || "Teacher"} ${teacher.id ? `(${teacher.id})` : ""}`,
      teacher.id || "Teacher"
    );
    const bucketName = toFirebaseKey(teacherClassBucketName(teacher), "Teachers Classes");
    const teacherNode = grouped[teacherKey] ||= {
      "Teacher Profile": {
        ...teacher,
        settings: data.vm_teacherSettings[teacher.id] || {},
        noticeSeen: data.vm_teacherNoticeSeen[teacher.id] || null
      }
    };
    teacherNode[bucketName] ||= {};

    const classTokens = String(teacher.class || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    const targets = classTokens.length ? classTokens : ["General"];
    targets.forEach(token => {
      const classLabel = toFirebaseKey(teacherClassLabel(token), "General");
      const matchingStudents = data.vm_students.filter(student => toFirebaseKey(studentClassLabel(student), "Class Unknown") === classLabel);
      teacherNode[bucketName][classLabel] = {
        "Homework ": preserveStructuredNode(data.vm_homework.filter(item => item.teacherId === teacher.id || item.teacher === teacher.name).filter(item => !item.class || toFirebaseKey(teacherClassLabel(item.class), "General") === classLabel), ""),
        "Lesson plan and schedules": preserveStructuredNode({
          lessonPlans: data.vm_teacherLessonPlans[teacher.id] || [],
          studyMaterials: data.vm_studyMaterials,
          classSchedule: data.vm_timetable
        }, ""),
        "Attendance register": preserveStructuredNode(data.vm_teacherAttendanceRegister, ""),
        "Marks register": preserveStructuredNode(Object.fromEntries(matchingStudents.map(student => [student.id, data.vm_marks[student.id] || {}])), ""),
        "Progress report": preserveStructuredNode(Array.isArray(data.vm_progressData)
          ? data.vm_progressData.filter(item => matchingStudents.some(student => student.id === item.studentId))
          : data.vm_progressData, ""),
        "Class Schedule": preserveStructuredNode(data.vm_timetable, "")
      };
    });
  });
  return grouped;
}

function buildPortalTreeFromData(data) {
  return {
    Admissions: preserveStructuredNode(data.vm_admissions, ""),
    "All Classes ": preserveStructuredNode(data.vm_classConfig, ""),
    "All Students": preserveStructuredNode(buildStudentTree(data), ""),
    "All Teachers": preserveStructuredNode(buildTeacherTree(data), ""),
    Notices: preserveStructuredNode(data.vm_notices, ""),
    Schedules: {
      "Class Schedules": preserveStructuredNode(data.vm_timetable, ""),
      "Exam Schedules": preserveStructuredNode(data.vm_examSchedule, ""),
      "Event Schedules": preserveStructuredNode(data.vm_school.eventSchedules || [], "")
    },
    "School Progress": preserveStructuredNode({
      overview: preserveStructuredNode(data.vm_progressData, ""),
      resultsPublished: preserveStructuredNode(data.vm_resultsPublished, ""),
      library: preserveStructuredNode(data.vm_library, ""),
      onlineTests: preserveStructuredNode(data.vm_onlineTests, ""),
      testResults: preserveStructuredNode(data.vm_testResults, ""),
      certificates: preserveStructuredNode(data.vm_certificates, ""),
      badges: preserveStructuredNode(data.vm_badges, ""),
      onlineClasses: preserveStructuredNode(data.vm_onlineClasses, ""),
      classRecordings: preserveStructuredNode(data.vm_classRecordings, ""),
      studyMaterials: preserveStructuredNode(data.vm_studyMaterials, ""),
      parentCommunication: preserveStructuredNode(data.vm_parentCommunication, ""),
      auditLog: preserveStructuredNode(data.vm_adminAuditLog, ""),
      recentStudyDownloads: preserveStructuredNode(data.vm_recentStudyDownloads, ""),
      "System Data": data
    }, ""),
    "admin detail": data.vm_admin
  };
}

function buildPortalTree(overrides = {}) {
  return buildPortalTreeFromData(buildSystemData(overrides));
}

function cachePortalTree(tree) {
  portalTreeCache = tree;
  portalTreeCacheLoadedAt = Date.now();
  return tree;
}

async function getPortalTree(options = {}) {
  const { force = false } = options;
  const cacheFresh = !force && portalTreeCache && (Date.now() - portalTreeCacheLoadedAt) < PORTAL_TREE_CACHE_MS;
  if (cacheFresh) return portalTreeCache;
  if (!force && portalTreePromise) return portalTreePromise;

  portalTreePromise = (async () => {
    try {
      const snap = await get(portalRef);
      return cachePortalTree(snap.exists() ? snap.val() : null);
    } catch (error) {
      console.warn("[Firebase] RTDB read error:", error.message);
      return portalTreeCache;
    } finally {
      portalTreePromise = null;
    }
  })();

  return portalTreePromise;
}

async function setPortalTree(tree) {
  cachePortalTree(tree);
  portalWriteQueue = portalWriteQueue.then(async () => {
    await set(portalRef, tree);
    return tree;
  });
  return portalWriteQueue;
}

function getSystemDataFromTree(tree) {
  return tree?.["School Progress"]?.["System Data"] || {};
}

async function buildMergedPortalTree(overrides = {}) {
  const remoteTree = await getPortalTree();
  const remoteSystemData = getSystemDataFromTree(remoteTree);
  const mergedSystemData = {
    ...buildSystemData(),
    ...(remoteSystemData && typeof remoteSystemData === "object" ? remoteSystemData : {}),
    ...overrides
  };
  return buildPortalTreeFromData(mergedSystemData);
}

async function fbGetData(key) {
  const tree = await getPortalTree();
  const systemData = getSystemDataFromTree(tree);
  if (systemData && key in systemData) {
    const value = systemData[key];
    return Array.isArray(value) ? value : [];
  }
  return readArray(key);
}

async function fbSetData(key, dataArray) {
  try {
    const tree = await buildMergedPortalTree({ [key]: Array.isArray(dataArray) ? dataArray : [] });
    await setPortalTree(tree);
    setFallbackLocalStorage(key, dataArray);
  } catch (error) {
    console.warn(`[Firebase] ${key} write error:`, error.message);
    setFallbackLocalStorage(key, dataArray);
  }
}

async function fbGetDoc(key) {
  const tree = await getPortalTree();
  const systemData = getSystemDataFromTree(tree);
  if (systemData && key in systemData) {
    const value = systemData[key];
    return value && typeof value === "object" && !Array.isArray(value) ? value : { value };
  }
  return readObject(key, JSON.parse(localStorage.getItem(key) || "null"));
}

async function fbSetDoc(key, docId, data) {
  const normalized = data && typeof data === "object" && !Array.isArray(data) ? data : { value: data };
  try {
    const tree = await buildMergedPortalTree({ [key]: normalized });
    await setPortalTree(tree);
    setFallbackLocalStorage(key, normalized);
  } catch (error) {
    console.warn(`[Firebase] ${key} doc write error:`, error.message);
    setFallbackLocalStorage(key, normalized);
  }
}

async function fbAddItem(key, item) {
  const list = await fbGetData(key);
  list.unshift(item);
  await fbSetData(key, list);
  return item.id || null;
}

async function fbDeleteItem(key, docId) {
  const list = await fbGetData(key);
  const filtered = list.filter(item => String(item.id || item._docId) !== String(docId));
  await fbSetData(key, filtered);
}

async function seedFirebaseEnhanced() {
  const tree = await getPortalTree();
  if (tree && Object.keys(tree).length) {
    const systemData = getSystemDataFromTree(tree);
    if (systemData && Object.keys(systemData).length) {
      return;
    }
    await setPortalTree(await buildMergedPortalTree());
    return;
  }
  await setPortalTree(buildPortalTree());
}

async function syncPortalTreeFromLocal(overrides = {}) {
  const tree = await buildMergedPortalTree(overrides);
  await setPortalTree(tree);
  return tree;
}

async function firebaseLogin(id, password, role) {
  const normalId = String(id || "").trim().toLowerCase();
  const systemData = getSystemDataFromTree(await getPortalTree()) || {};

  if (role === "admin") {
    const admin = systemData.vm_admin || await fbGetDoc("vm_admin");
    if (admin && password === admin.password) {
      if ([admin.id, admin.username, admin.email].map(value => String(value || "").toLowerCase()).includes(normalId)) {
        return { user: admin, role: "admin" };
      }
    }
    return null;
  }

  if (role === "teacher") {
    const teachers = Array.isArray(systemData.vm_teachers) ? systemData.vm_teachers : await fbGetData("vm_teachers");
    const teacher = teachers.find(item =>
      [item.id, item.email, item.name].map(value => String(value || "").toLowerCase()).includes(normalId) &&
      item.password === password
    );
    return teacher ? { user: teacher, role: "teacher" } : null;
  }

  const students = Array.isArray(systemData.vm_students) ? systemData.vm_students : await fbGetData("vm_students");
  const student = students.find(item =>
    [item.id, item.roll, item.rollNo, item.email, item.name].map(value => String(value || "").toLowerCase()).includes(normalId) &&
    item.password === password
  );
  return student ? { user: student, role: "student" } : null;
}

window.FB = {
  db,
  getData: fbGetData,
  setData: fbSetData,
  getDoc: fbGetDoc,
  setDoc: fbSetDoc,
  getAny: async (key) => {
    const systemData = getSystemDataFromTree(await getPortalTree());
    if (systemData && key in systemData) return systemData[key];
    return readObject(key, readArray(key));
  },
  getSystemData: async (options = {}) => {
    return getSystemDataFromTree(await getPortalTree(options)) || {};
  },
  setAny: async (key, value) => {
    if (Array.isArray(value)) return fbSetData(key, value);
    return fbSetDoc(key, "data", value);
  },
  addItem: fbAddItem,
  deleteItem: fbDeleteItem,
  login: firebaseLogin,
  seed: seedFirebaseEnhanced,
  syncPortalTreeFromLocal
};

window.__vmFirebaseReady = true;
window.dispatchEvent(new CustomEvent("vm-firebase-ready"));

window.addEventListener("DOMContentLoaded", async () => {
  await seedFirebaseEnhanced();
});
