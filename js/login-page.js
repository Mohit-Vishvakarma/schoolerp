(function () {
  const LOGIN_ROLES = ["student", "teacher", "admin"];

  function safeParse(rawValue, fallback) {
    try {
      return JSON.parse(rawValue);
    } catch {
      return fallback;
    }
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getArray(key) {
    const value = safeParse(localStorage.getItem(key) || "[]", []);
    return Array.isArray(value) ? value : [];
  }

  function getObject(key) {
    const value = safeParse(localStorage.getItem(key) || "null", null);
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureLoginSeedData() {
    const existingStudents = getArray("vm_students");
    if (!existingStudents.length) {
      setJson("vm_students", [
        {
          id: "STU001",
          name: "Aarav Sharma",
          roll: "101",
          rollNo: "101",
          class: "10",
          section: "A",
          email: "aarav.sharma@vidyamandir.in",
          parent: "Rajesh Sharma",
          contact: "9876543210",
          password: "student123",
          fees: "paid"
        },
        {
          id: "STU002",
          name: "Priya Patel",
          roll: "102",
          rollNo: "102",
          class: "10",
          section: "A",
          email: "priya.patel@vidyamandir.in",
          parent: "Suresh Patel",
          contact: "9876543211",
          password: "student123",
          fees: "paid"
        }
      ]);
    }

    const existingTeachers = getArray("vm_teachers");
    if (!existingTeachers.length) {
      setJson("vm_teachers", [
        {
          id: "TCH001",
          name: "Dr. Sunita Sharma",
          subject: "Mathematics",
          email: "sunita@vidyamandir.in",
          password: "teacher123",
          exp: "12 years",
          class: "10A, 10B",
          phone: "9000000001"
        },
        {
          id: "TCH002",
          name: "Mr. Rajiv Kumar",
          subject: "Science",
          email: "rajiv@vidyamandir.in",
          password: "teacher123",
          exp: "8 years",
          class: "9A, 9B",
          phone: "9000000002"
        }
      ]);
    }

    const existingAdmin = getObject("vm_admin");
    if (!Object.keys(existingAdmin).length) {
      setJson("vm_admin", {
        id: "ADMIN001",
        name: "Principal Admin",
        username: "admin",
        email: "admin@vidyamandir.in",
        password: "admin123"
      });
    }
  }

  function showToast(message, type) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type || "success"} show`;
    toast.textContent = message;
    container.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.remove("show");
      window.setTimeout(() => toast.remove(), 250);
    }, 1800);
  }

  function updateRoleUi(role) {
    const currentRole = LOGIN_ROLES.includes(role) ? role : "student";
    document.querySelectorAll(".login-tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.role === currentRole);
    });

    const display = document.getElementById("currentRoleDisplay");
    if (display) display.textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

    const label = document.getElementById("loginIdLabel");
    const input = document.getElementById("loginId");
    if (label) {
      if (currentRole === "student") label.textContent = "Roll No / Student ID / Email";
      else if (currentRole === "teacher") label.textContent = "Teacher ID / Email";
      else label.textContent = "Admin ID / Email / Username";
    }
    if (input) {
      if (currentRole === "student") input.placeholder = "e.g. 101 or STU001";
      else if (currentRole === "teacher") input.placeholder = "e.g. TCH001 or teacher email";
      else input.placeholder = "e.g. admin or admin@vidyamandir.in";
    }
    document.body.dataset.currentRole = currentRole;
  }

  function getSelectedRole() {
    const role = document.body.dataset.currentRole || "student";
    return LOGIN_ROLES.includes(role) ? role : "student";
  }

  function findUser(id, password, role) {
    const normalizedId = normalizeText(id);

    if (role === "student") {
      return getArray("vm_students").find(student => {
        return [
          normalizeText(student.id),
          normalizeText(student.roll),
          normalizeText(student.rollNo),
          normalizeText(student.email),
          normalizeText(student.name)
        ].includes(normalizedId) && student.password === password;
      }) || null;
    }

    if (role === "teacher") {
      return getArray("vm_teachers").find(teacher => {
        return [
          normalizeText(teacher.id),
          normalizeText(teacher.email),
          normalizeText(teacher.name)
        ].includes(normalizedId) && teacher.password === password;
      }) || null;
    }

    const admin = getObject("vm_admin");
    if ([normalizeText(admin.id), normalizeText(admin.username), normalizeText(admin.email)].includes(normalizedId) && admin.password === password) {
      return admin;
    }
    return null;
  }

  function persistSession(user, role) {
    setJson("ssvm_auth", { user, role, loginTime: new Date().toISOString() });
    localStorage.removeItem("vm_studentUser");
    localStorage.removeItem("vm_teacherUser");
    localStorage.removeItem("vm_adminUser");

    if (role === "student") setJson("vm_studentUser", user);
    else if (role === "teacher") setJson("vm_teacherUser", user);
    else setJson("vm_adminUser", user);
  }

  function redirectToPortal(role) {
    const targetPage = role === "admin"
      ? "../admin-portal/admin-portal.html"
      : role === "teacher"
        ? "../teacher-portal/teacher-portal.html"
        : "../student-portal/student-portal.html";
    window.location.replace(targetPage);
  }

  function handleLogin(event) {
    event.preventDefault();
    const id = document.getElementById("loginId")?.value?.trim();
    const password = document.getElementById("loginPass")?.value?.trim();
    const errorBox = document.getElementById("loginError");

    if (!id || !password) {
      if (errorBox) {
        errorBox.textContent = "ID aur password dono fill karein.";
        errorBox.classList.add("show");
      }
      return;
    }

    const preferredRole = getSelectedRole();
    const roleOrder = [preferredRole, ...LOGIN_ROLES.filter(role => role !== preferredRole)];
    let matchedUser = null;
    let matchedRole = preferredRole;

    for (const role of roleOrder) {
      const user = findUser(id, password, role);
      if (user) {
        matchedUser = user;
        matchedRole = role;
        break;
      }
    }

    if (!matchedUser) {
      if (errorBox) {
        errorBox.textContent = "Invalid ID ya password.";
        errorBox.classList.add("show");
      }
      showToast("Login failed. Check credentials.", "error");
      return;
    }

    if (errorBox) errorBox.classList.remove("show");
    updateRoleUi(matchedRole);
    persistSession(matchedUser, matchedRole);
    showToast(`${matchedRole} login successful. Portal khul raha hai...`, "success");
    window.setTimeout(() => redirectToPortal(matchedRole), 120);
  }

  function initLoginPage() {
    ensureLoginSeedData();

    const requestedRole = new URLSearchParams(window.location.search).get("role");
    updateRoleUi(LOGIN_ROLES.includes(requestedRole) ? requestedRole : "student");

    document.querySelectorAll(".login-tab").forEach(tab => {
      tab.addEventListener("click", () => updateRoleUi(tab.dataset.role));
    });

    const form = document.getElementById("loginForm");
    if (form) form.addEventListener("submit", handleLogin);
  }

  document.addEventListener("DOMContentLoaded", initLoginPage);
})();
