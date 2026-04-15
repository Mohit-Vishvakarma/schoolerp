/* =============================================
   VIDYA MANDIR SCHOOL ERP - MAIN JS
   ============================================= */

/* ===== INITIAL DATA SEEDING ===== */
function seedData() {
  const parseLocalJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };
  const hasSeedFlag = !!localStorage.getItem('vm_seeded');
  const existingStudents = parseLocalJson('vm_students', []);
  const existingTeachers = parseLocalJson('vm_teachers', []);
  const existingAdmin = parseLocalJson('vm_admin', {});
  const needsSeed = !hasSeedFlag
    || !Array.isArray(existingStudents)
    || !existingStudents.length
    || !Array.isArray(existingTeachers)
    || !existingTeachers.length
    || !existingAdmin
    || typeof existingAdmin !== 'object'
    || !Object.keys(existingAdmin).length;

  if (needsSeed) {
    const students = [
      {
        id: 'STU001',
        name: 'Aarav Sharma',
        roll: '101',
        class: '10',
        section: 'A',
        email: 'aarav.sharma@vidyamandir.in',
        phone: '9876543210',
        dob: '2008-05-14',
        address: 'MG Road, Indore, M.P. - 452001',
        fatherName: 'Rajesh Sharma',
        fatherPhone: '9876543210',
        motherName: 'Priya Sharma',
        emergencyContact: '9876543210',
        password: 'student123',
        fees: 'paid',
        gender: 'M',
        bloodGroup: 'O+',
        admissionDate: '2020-04-01',
        transport: 'School Bus',
        medicalInfo: 'No known allergies'
      },
      {
        id: 'STU002',
        name: 'Priya Patel',
        roll: '102',
        class: '10',
        section: 'A',
        email: 'priya.patel@vidyamandir.in',
        phone: '9876543211',
        dob: '2008-07-22',
        address: 'Vijay Nagar, Indore, M.P. - 452010',
        fatherName: 'Suresh Patel',
        fatherPhone: '9876543211',
        motherName: 'Meera Patel',
        emergencyContact: '9876543211',
        password: 'student123',
        fees: 'paid',
        gender: 'F',
        bloodGroup: 'A+',
        admissionDate: '2020-04-01',
        transport: 'Self',
        medicalInfo: 'Asthma - carries inhaler'
      },
      {
        id: 'STU003',
        name: 'Rohan Verma',
        roll: '103',
        class: '9',
        section: 'B',
        email: 'rohan.verma@vidyamandir.in',
        phone: '9876543212',
        dob: '2009-03-10',
        address: 'Palasia, Indore, M.P. - 452001',
        fatherName: 'Mohan Verma',
        fatherPhone: '9876543212',
        motherName: 'Kavita Verma',
        emergencyContact: '9876543212',
        password: 'student123',
        fees: 'pending',
        gender: 'M',
        bloodGroup: 'B+',
        admissionDate: '2021-04-01',
        transport: 'School Van',
        medicalInfo: 'None'
      },
      {
        id: 'STU004',
        name: 'Sneha Gupta',
        roll: '104',
        class: '11',
        section: 'A',
        email: 'sneha.gupta@vidyamandir.in',
        phone: '9876543213',
        dob: '2007-11-05',
        address: 'Rau, Indore, M.P. - 453331',
        fatherName: 'Anil Gupta',
        fatherPhone: '9876543213',
        motherName: 'Sunita Gupta',
        emergencyContact: '9876543213',
        password: 'student123',
        fees: 'paid',
        gender: 'F',
        bloodGroup: 'O-',
        admissionDate: '2019-04-01',
        transport: 'Self',
        medicalInfo: 'Vegetarian diet preference'
      },
      {
        id: 'STU005',
        name: 'Karan Singh',
        roll: '105',
        class: '12',
        section: 'A',
        email: 'karan.singh@vidyamandir.in',
        phone: '9876543214',
        dob: '2006-08-18',
        address: 'Bhawarkua, Indore, M.P. - 452001',
        fatherName: 'Vikram Singh',
        fatherPhone: '9876543214',
        motherName: 'Poonam Singh',
        emergencyContact: '9876543214',
        password: 'student123',
        fees: 'pending',
        gender: 'M',
        bloodGroup: 'AB+',
        admissionDate: '2018-04-01',
        transport: 'School Bus',
        medicalInfo: 'None'
      }
    ];

    const teachers = [
      { id: 'TCH001', name: 'Dr. Sunita Sharma', subject: 'Mathematics', email: 'sunita@vidyamandir.in', password: 'teacher123', exp: '12 years', class: '10A, 10B', phone: '9000000001' },
      { id: 'TCH002', name: 'Mr. Rajiv Kumar', subject: 'Science', email: 'rajiv@vidyamandir.in', password: 'teacher123', exp: '8 years', class: '9A, 9B', phone: '9000000002' },
      { id: 'TCH003', name: 'Mrs. Anita Singh', subject: 'Hindi', email: 'anita@vidyamandir.in', password: 'teacher123', exp: '15 years', class: '11A, 12A', phone: '9000000003' },
      { id: 'TCH004', name: 'Mr. Pradeep Jain', subject: 'English', email: 'pradeep@vidyamandir.in', password: 'teacher123', exp: '10 years', class: '8A, 8B', phone: '9000000004' },
      { id: 'TCH005', name: 'Ms. Kavita Patel', subject: 'Social Science', email: 'kavita@vidyamandir.in', password: 'teacher123', exp: '6 years', class: '7A, 7B', phone: '9000000005' },
      { id: 'TCH006', name: 'Mr. Arun Tiwari', subject: 'Computer Science', email: 'arun@vidyamandir.in', password: 'teacher123', exp: '9 years', class: '11A, 12A', phone: '9000000006' }
    ];

    const marks = {
      STU001: {
        'Mathematics': 94,
        'Science': 88,
        'English': 91,
        'Hindi': 85,
        'Social Science': 89,
        'Computer Science': 92
      },
      STU002: {
        'Mathematics': 97,
        'Science': 95,
        'English': 92,
        'Hindi': 90,
        'Social Science': 93,
        'Computer Science': 96
      },
      STU003: {
        'Mathematics': 76,
        'Science': 82,
        'English': 79,
        'Hindi': 88,
        'Social Science': 75,
        'Computer Science': 80
      },
      STU004: {
        'Mathematics': 89,
        'Science': 91,
        'English': 87,
        'Hindi': 83,
        'Social Science': 86,
        'Computer Science': 90
      },
      STU005: {
        'Mathematics': 72,
        'Science': 78,
        'English': 80,
        'Hindi': 74,
        'Social Science': 71,
        'Computer Science': 85
      }
    };

    const attendance = {
      STU001: { present: 88, total: 95, percentage: 93 },
      STU002: { present: 92, total: 95, percentage: 97 },
      STU003: { present: 75, total: 95, percentage: 79 },
      STU004: { present: 90, total: 95, percentage: 95 },
      STU005: { present: 68, total: 95, percentage: 72 }
    };

    const homework = [
      {
        id: 'HW001',
        studentId: 'STU001',
        subject: 'Mathematics',
        title: 'Chapter 5: Quadratic Equations',
        description: 'Solve all exercises from Ex 5.2. Show all steps clearly.',
        dueDate: '2025-03-22',
        marks: 10,
        teacher: 'Dr. Sunita Sharma',
        status: 'pending',
        submitted: false
      },
      {
        id: 'HW002',
        studentId: 'STU001',
        subject: 'English',
        title: 'Essay Writing',
        description: 'Write a 300-400 word essay on "My Favourite Season".',
        dueDate: '2025-03-23',
        marks: 10,
        teacher: 'Mr. Pradeep Jain',
        status: 'pending',
        submitted: false
      },
      {
        id: 'HW003',
        studentId: 'STU001',
        subject: 'Science',
        title: 'Lab Report',
        description: 'Osmosis experiment observation and results.',
        dueDate: '2025-03-21',
        marks: 15,
        teacher: 'Mr. Rajiv Kumar',
        status: 'completed',
        submitted: true,
        submissionDate: '2025-03-21',
        obtainedMarks: 15
      }
    ];

    const messages = [
      {
        id: 'MSG001',
        from: 'TCH001',
        to: 'STU001',
        subject: 'Mathematics Homework Review',
        content: 'Dear Aarav,\n\nI have reviewed your mathematics homework submission. Good work on the quadratic equations, but please pay more attention to the steps in Ex 5.2 Q.7.\n\nPlease resubmit the corrected version by tomorrow.\n\nBest regards,\nDr. Sunita Sharma',
        timestamp: '2025-03-20T14:30:00',
        read: true,
        type: 'received'
      },
      {
        id: 'MSG002',
        from: 'TCH004',
        to: 'STU001',
        subject: 'Essay Feedback',
        content: 'Hello Aarav,\n\nYour essay on "My Favourite Season" is well-written. The introduction and conclusion are excellent. Please work on paragraph transitions.\n\nGrade: A-\n\nRegards,\nMr. Pradeep Jain',
        timestamp: '2025-03-19T10:15:00',
        read: true,
        type: 'received'
      }
    ];

    const libraryBooks = [
      {
        id: 'LIB001',
        title: 'Mathematics Textbook',
        author: 'R.D. Sharma',
        subject: 'Mathematics',
        isbn: '9788177001234',
        available: true,
        borrowed: true,
        borrowerId: 'STU001',
        dueDate: '2025-04-25',
        category: 'Textbook'
      },
      {
        id: 'LIB002',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        subject: 'Literature',
        isbn: '9780061122415',
        available: true,
        borrowed: false,
        category: 'Fiction'
      },
      {
        id: 'LIB003',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        subject: 'Science',
        isbn: '9780553380169',
        available: true,
        borrowed: false,
        category: 'Non-Fiction'
      }
    ];

    const studyMaterials = {
      mathematics: [
        { id: 'MAT001', title: 'Chapter 5 Notes - Quadratic Equations', type: 'pdf', size: '2.5 MB', downloads: 45 },
        { id: 'MAT002', title: 'Practice Worksheet Ex 5.1-5.3', type: 'pdf', size: '1.8 MB', downloads: 32 },
        { id: 'MAT003', title: 'Quadratic Equations Video Lecture', type: 'mp4', size: '45 MB', downloads: 28 }
      ],
      science: [
        { id: 'SCI001', title: 'Chemistry Notes - Acids & Bases', type: 'pdf', size: '3.2 MB', downloads: 38 },
        { id: 'SCI002', title: 'Physics Lab Manual', type: 'pdf', size: '5.1 MB', downloads: 52 },
        { id: 'SCI003', title: 'Biology Diagrams Collection', type: 'pdf', size: '8.7 MB', downloads: 41 }
      ],
      english: [
        { id: 'ENG001', title: 'Grammar Rules & Exercises', type: 'pdf', size: '2.1 MB', downloads: 67 },
        { id: 'ENG002', title: 'Literature Analysis Guide', type: 'pdf', size: '4.3 MB', downloads: 29 },
        { id: 'ENG003', title: 'Essay Writing Techniques', type: 'mp4', size: '38 MB', downloads: 35 }
      ]
    };

    const examSchedule = [
      {
        id: 'EXAM001',
        subject: 'Mathematics',
        examName: 'Unit Test - Chapters 5-7',
        date: '2025-04-15',
        time: '10:00 AM - 12:00 PM',
        duration: '2 hours',
        room: 'Room 101',
        syllabus: 'Quadratic Equations, Linear Equations, Polynomials'
      },
      {
        id: 'EXAM002',
        subject: 'Science',
        examName: 'Practical Exam',
        date: '2025-04-18',
        time: '9:00 AM - 12:00 PM',
        duration: '3 hours',
        room: 'Lab 1',
        syllabus: 'Chemistry Practical, Physics Experiments'
      }
    ];

    const examResults = [
      {
        id: 'RES001',
        studentId: 'STU001',
        subject: 'English',
        examName: 'Mid-term Exam',
        marks: 85,
        maxMarks: 100,
        percentage: 85,
        grade: 'A',
        date: '2025-04-10'
      },
      {
        id: 'RES002',
        studentId: 'STU001',
        subject: 'Social Science',
        examName: 'Mid-term Exam',
        marks: 78,
        maxMarks: 100,
        percentage: 78,
        grade: 'B+',
        date: '2025-04-08'
      }
    ];

    const feeHistory = [
      {
        id: 'FEE001',
        studentId: 'STU001',
        quarter: 'Q1 (Apr-Jun)',
        amount: 3750,
        date: '2024-04-04',
        status: 'paid',
        paymentMethod: 'Online',
        receipt: 'RCP001'
      },
      {
        id: 'FEE002',
        studentId: 'STU001',
        quarter: 'Q2 (Jul-Sep)',
        amount: 3750,
        date: '2024-07-02',
        status: 'paid',
        paymentMethod: 'Cash',
        receipt: 'RCP002'
      },
      {
        id: 'FEE003',
        studentId: 'STU001',
        quarter: 'Q3 (Oct-Dec)',
        amount: 3750,
        date: null,
        status: 'pending',
        paymentMethod: null,
        receipt: null
      },
      {
        id: 'FEE004',
        studentId: 'STU001',
        quarter: 'Q4 (Jan-Mar)',
        amount: 3750,
        date: null,
        status: 'pending',
        paymentMethod: null,
        receipt: null
      }
    ];

    const notices = [
      {
        id: 'N001',
        title: 'Annual Sports Day - 15 April',
        content: 'Annual Sports Day will be held on 15th April. All students must participate. Sports uniform is mandatory.',
        date: '2025-03-15',
        type: 'important',
        author: 'Admin',
        category: 'events'
      },
      {
        id: 'N002',
        title: 'Half Yearly Exam Schedule Released',
        content: 'Half Yearly Examinations will commence from 20th April. Timetable has been uploaded on the portal.',
        date: '2025-03-18',
        type: 'urgent',
        author: 'Examination Cell',
        category: 'academic'
      },
      {
        id: 'N003',
        title: 'Republic Day Celebration',
        content: 'All students are requested to attend Republic Day celebration on 26th January at 8:30 AM on the school ground.',
        date: '2025-01-10',
        type: 'info',
        author: 'Admin',
        category: 'events'
      },
      {
        id: 'N004',
        title: 'Fee Submission Deadline Extended',
        content: 'The last date for fee submission for Q3 has been extended to 31st March. Pay online or at school office.',
        date: '2025-03-12',
        type: 'important',
        author: 'Accounts Department',
        category: 'academic'
      }
    ];

    const timetable = {
      monday: [
        { time: '8:00-8:45', subject: 'Mathematics', teacher: 'Dr. Sunita Sharma', room: '101' },
        { time: '8:45-9:30', subject: 'English', teacher: 'Mr. Pradeep Jain', room: '102' },
        { time: '9:30-10:15', subject: 'Science', teacher: 'Mr. Rajiv Kumar', room: '103' },
        { time: '10:15-10:30', subject: 'Break', teacher: '', room: '' },
        { time: '10:30-11:15', subject: 'Hindi', teacher: 'Mrs. Anita Singh', room: '104' },
        { time: '11:15-12:00', subject: 'Social Science', teacher: 'Ms. Kavita Patel', room: '105' },
        { time: '12:00-12:45', subject: 'Computer Science', teacher: 'Mr. Arun Tiwari', room: '106' }
      ],
      tuesday: [
        { time: '8:00-8:45', subject: 'Science', teacher: 'Mr. Rajiv Kumar', room: '103' },
        { time: '8:45-9:30', subject: 'Hindi', teacher: 'Mrs. Anita Singh', room: '104' },
        { time: '9:30-10:15', subject: 'English', teacher: 'Mr. Pradeep Jain', room: '102' },
        { time: '10:15-10:30', subject: 'Break', teacher: '', room: '' },
        { time: '10:30-11:15', subject: 'Mathematics', teacher: 'Dr. Sunita Sharma', room: '101' },
        { time: '11:15-12:00', subject: 'Computer Science', teacher: 'Mr. Arun Tiwari', room: '106' },
        { time: '12:00-12:45', subject: 'Social Science', teacher: 'Ms. Kavita Patel', room: '105' }
      ]
    };

    const onlineTests = [
      {
        id: 'TEST001',
        title: 'Mathematics Practice Test',
        subject: 'Mathematics',
        description: 'Quadratic Equations & Linear Equations',
        duration: 30,
        questions: 25,
        marks: 50,
        available: true,
        dueDate: '2025-04-30'
      },
      {
        id: 'TEST002',
        title: 'Science Quiz',
        subject: 'Science',
        description: 'Chemistry - Acids, Bases & Salts',
        duration: 20,
        questions: 20,
        marks: 40,
        available: true,
        dueDate: '2025-04-25'
      }
    ];

    const testResults = [
      {
        id: 'TRES001',
        studentId: 'STU001',
        testId: 'TEST001',
        score: 42,
        maxScore: 50,
        percentage: 84,
        grade: 'A',
        date: '2025-03-15',
        timeTaken: 28
      },
      {
        id: 'TRES002',
        studentId: 'STU001',
        testId: 'TEST002',
        score: 35,
        maxScore: 40,
        percentage: 87.5,
        grade: 'A',
        date: '2025-03-12',
        timeTaken: 18
      }
    ];

    const progressData = {
      STU001: {
        subjects: {
          mathematics: { current: 85, target: 90, completedTopics: 12, totalTopics: 15 },
          science: { current: 78, target: 85, completedTopics: 8, totalTopics: 12 },
          english: { current: 92, target: 95, completedTopics: 10, totalTopics: 10 },
          socialScience: { current: 71, target: 80, completedTopics: 6, totalTopics: 10 }
        },
        goals: [
          {
            id: 'GOAL001',
            title: 'Complete Mathematics Chapter 5',
            description: 'Master quadratic equations and their applications',
            progress: 60,
            target: 100,
            dueDate: '2025-04-15'
          },
          {
            id: 'GOAL002',
            title: 'Improve Science Lab Skills',
            description: 'Practice experimental procedures and observations',
            progress: 40,
            target: 100,
            dueDate: '2025-04-20'
          }
        ]
      }
    };

    const certificates = [
      {
        id: 'CERT001',
        studentId: 'STU001',
        title: 'Mathematics Excellence',
        description: 'Outstanding performance in Mathematics',
        type: 'academic',
        date: '2025-03-01',
        issuer: 'Vidya Mandir School'
      },
      {
        id: 'CERT002',
        studentId: 'STU001',
        title: 'Science Fair Winner',
        description: '1st Prize in Inter-school Science Fair',
        type: 'achievement',
        date: '2025-02-15',
        issuer: 'Vidya Mandir School'
      },
      {
        id: 'CERT003',
        studentId: 'STU001',
        title: 'Perfect Attendance',
        description: '100% attendance for the academic year',
        type: 'attendance',
        date: '2025-01-31',
        issuer: 'Vidya Mandir School'
      }
    ];

    const badges = [
      { id: 'BADGE001', name: 'Top Performer', icon: '⭐', earned: true, date: '2025-03-01' },
      { id: 'BADGE002', name: 'Science Star', icon: '🔬', earned: true, date: '2025-02-15' },
      { id: 'BADGE003', name: 'Book Worm', icon: '📖', earned: true, date: '2025-01-20' },
      { id: 'BADGE004', name: 'Quick Learner', icon: '⚡', earned: false, date: null }
    ];

    const onlineClasses = [
      {
        id: 'CLASS001',
        subject: 'Mathematics',
        title: 'Chapter 5: Quadratic Equations',
        teacher: 'Dr. Sunita Sharma',
        date: '2025-03-22',
        time: '10:00',
        duration: 45,
        platform: 'Zoom',
        meetingId: 'MATH-001-2025',
        status: 'scheduled'
      },
      {
        id: 'CLASS002',
        subject: 'Science',
        title: 'Chemistry Lab Session',
        teacher: 'Mr. Rajiv Kumar',
        date: '2025-03-22',
        time: '11:00',
        duration: 60,
        platform: 'Google Meet',
        meetingId: 'SCI-001-2025',
        status: 'scheduled'
      }
    ];

    const classRecordings = [
      {
        id: 'REC001',
        subject: 'Mathematics',
        title: 'Linear Equations',
        teacher: 'Dr. Sunita Sharma',
        date: '2025-03-15',
        duration: 45,
        size: '250 MB',
        views: 45
      },
      {
        id: 'REC002',
        subject: 'English',
        title: 'Grammar Rules',
        teacher: 'Mr. Pradeep Jain',
        date: '2025-03-14',
        duration: 40,
        size: '180 MB',
        views: 32
      }
    ];

    const parentCommunication = [
      {
        id: 'PCOM001',
        studentId: 'STU001',
        from: 'father',
        message: 'Great job on your mathematics test! Keep it up.',
        date: '2025-03-20',
        type: 'praise'
      },
      {
        id: 'PCOM002',
        studentId: 'STU001',
        from: 'mother',
        message: 'Don\'t forget to complete your homework before tomorrow.',
        date: '2025-03-18',
        type: 'reminder'
      }
    ];

    // Store all data in localStorage
    localStorage.setItem('vm_students', JSON.stringify(students));
    localStorage.setItem('vm_teachers', JSON.stringify(teachers));
    localStorage.setItem('vm_marks', JSON.stringify(marks));
    localStorage.setItem('vm_attendance', JSON.stringify(attendance));
    localStorage.setItem('vm_homework', JSON.stringify(homework));
    localStorage.setItem('vm_messages', JSON.stringify(messages));
    localStorage.setItem('vm_library', JSON.stringify(libraryBooks));
    localStorage.setItem('vm_studyMaterials', JSON.stringify(studyMaterials));
    localStorage.setItem('vm_examSchedule', JSON.stringify(examSchedule));
    localStorage.setItem('vm_examResults', JSON.stringify(examResults));
    localStorage.setItem('vm_feeHistory', JSON.stringify(feeHistory));
    localStorage.setItem('vm_notices', JSON.stringify(notices));
    localStorage.setItem('vm_timetable', JSON.stringify(timetable));
    localStorage.setItem('vm_onlineTests', JSON.stringify(onlineTests));
    localStorage.setItem('vm_testResults', JSON.stringify(testResults));
    localStorage.setItem('vm_progressData', JSON.stringify(progressData));
    localStorage.setItem('vm_certificates', JSON.stringify(certificates));
    localStorage.setItem('vm_badges', JSON.stringify(badges));
    localStorage.setItem('vm_onlineClasses', JSON.stringify(onlineClasses));
    localStorage.setItem('vm_classRecordings', JSON.stringify(classRecordings));
    localStorage.setItem('vm_parentCommunication', JSON.stringify(parentCommunication));
    localStorage.setItem('vm_school', JSON.stringify({
      name: 'Vidya Mandir Senior Secondary School',
      address: 'Vijay Nagar, Indore, M.P. - 452010',
      phone: '0731-4567890',
      email: 'info@vidyamandir.in',
      estYear: '1998',
      affiliation: 'CBSE Board (Affil. No. 1040XXX)',
      tagline: 'Excellence in Education Since 1998'
    }));
    localStorage.setItem('vm_admin', JSON.stringify({
      id: 'ADMIN001',
      name: 'Principal Admin',
      username: 'admin',
      email: 'admin@vidyamandir.in',
      password: 'admin123'
    }));
    localStorage.setItem('vm_seeded', 'true');
  }
  fixSeededUsers();
}

function fixSeededUsers() {
  const students = getData('vm_students').map(s => ({
    ...s,
    rollNo: s.rollNo || s.roll || '',
    roll: s.roll || s.rollNo || '',
    parent: s.parent || s.fatherName || '',
    contact: s.contact || s.fatherPhone || s.phone || '',
    password: s.password || 'student123'
  }));
  const teachers = getData('vm_teachers').map(t => ({ ...t, password: t.password || 'teacher123' }));
  const adminData = getObj('vm_admin');
  const admin = {
    ...adminData,
    username: adminData.username || 'admin',
    password: adminData.password || 'admin123'
  };

  setData('vm_students', students);
  setData('vm_teachers', teachers);
  setData('vm_admin', admin);

  const timetableValue = safeJsonParse(localStorage.getItem('vm_timetable') || 'null', null);
  if (!timetableValue || Array.isArray(timetableValue) || typeof timetableValue !== 'object') {
    setData('vm_timetable', {
      monday: [
        { time: '8:00-8:45', subject: 'Mathematics', teacher: 'Dr. Sunita Sharma', room: '101' },
        { time: '8:45-9:30', subject: 'English', teacher: 'Mr. Pradeep Jain', room: '102' },
        { time: '9:30-10:15', subject: 'Science', teacher: 'Mr. Rajiv Kumar', room: '103' }
      ],
      tuesday: [
        { time: '8:00-8:45', subject: 'Science', teacher: 'Mr. Rajiv Kumar', room: '103' },
        { time: '8:45-9:30', subject: 'Hindi', teacher: 'Mrs. Anita Singh', room: '104' },
        { time: '9:30-10:15', subject: 'English', teacher: 'Mr. Pradeep Jain', room: '102' }
      ]
    });
  }

  const progressValue = safeJsonParse(localStorage.getItem('vm_progressData') || 'null', null);
  if (!progressValue || Array.isArray(progressValue) || typeof progressValue !== 'object') {
    const firstStudent = students[0];
    const fallbackProgress = firstStudent ? {
      [firstStudent.id]: {
        subjects: {
          mathematics: { current: 85, target: 90, completedTopics: 12, totalTopics: 15 },
          science: { current: 78, target: 85, completedTopics: 8, totalTopics: 12 },
          english: { current: 92, target: 95, completedTopics: 10, totalTopics: 10 }
        },
        goals: [
          {
            id: 'GOAL001',
            title: 'Complete Mathematics Chapter 5',
            description: 'Master quadratic equations and their applications',
            progress: 60,
            target: 100,
            dueDate: '2026-04-20'
          }
        ]
      }
    } : {};
    setData('vm_progressData', fallbackProgress);
  }
}

/* ===== HELPERS ===== */
const FIREBASE_DOC_MAP = {
  vm_marks: 'all_marks',
  vm_attendance: 'all_attendance',
  vm_admin: 'ADMIN001',
  vm_school: 'profile',
  vm_timetable: 'all',
  vm_progressData: 'all',
  vm_studyMaterials: 'all',
  vm_teacherSettings: 'all',
  vm_teacherLessonPlans: 'all',
  vm_teacherAttendanceRegister: 'all',
  vm_resultsPublished: 'status',
  vm_teacherNoticeSeen: 'all',
  vm_studentAttendanceCalendar: 'all',
  vm_studentAttendanceHistory: 'all',
  vm_classBookshelf: 'all'
};
const FIREBASE_ARRAY_KEYS = new Set([
  'vm_students', 'vm_teachers', 'vm_admissions', 'vm_notices', 'vm_homework',
  'vm_messages', 'vm_library', 'vm_examSchedule', 'vm_examResults', 'vm_feeHistory',
  'vm_onlineTests', 'vm_testResults', 'vm_certificates', 'vm_badges',
  'vm_onlineClasses', 'vm_classRecordings', 'vm_parentCommunication', 'vm_classConfig',
  'vm_adminAuditLog', 'vm_examTypes', 'vm_recentStudyDownloads', 'vm_contactMessages', 'vm_admins'
]);
const FIREBASE_OBJECT_KEYS = new Set(Object.keys(FIREBASE_DOC_MAP));
const pendingFirebaseSyncs = new Map();
function writeLocalStorageSilently(key, value) {
  window.__vmSkipFirebaseMirror = true;
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } finally {
    window.__vmSkipFirebaseMirror = false;
  }
}

function safeJsonParse(rawValue, fallback) {
  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

const getData = (key) => {
  const value = safeJsonParse(localStorage.getItem(key) || '[]', []);
  return Array.isArray(value) ? value : [];
};
const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
const getObj = (key) => {
  const value = safeJsonParse(localStorage.getItem(key) || '{}', {});
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
};
const normalizeText = (text) => (text || '').toString().trim().toLowerCase();
let vmDataReadyPromise = null;

async function persistAnyViaRest(key, value) {
  const baseUrl = window.__vmFirebaseDatabaseUrl || 'https://schoolweb-d6da1-default-rtdb.firebaseio.com';
  const target = `${baseUrl}/admin-portal/School%20Progress/System%20Data/${encodeURIComponent(key)}.json`;
  const response = await fetch(target, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
  if (!response.ok) {
    throw new Error(`REST persist failed (${response.status})`);
  }
  return response.json().catch(() => null);
}

async function persistAnyToStorageAndFirebase(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  if (!window.FB) {
    try {
      await persistAnyViaRest(key, value);
      pendingFirebaseSyncs.delete(key);
      return { storedLocally: true, syncedRemotely: true, via: 'rest' };
    } catch (error) {
      pendingFirebaseSyncs.set(key, value);
      return { storedLocally: true, syncedRemotely: false, error };
    }
  }

  try {
    const docId = FIREBASE_DOC_MAP[key] || 'data';
    await window.FB.setAny(key, value, docId);
    pendingFirebaseSyncs.delete(key);
    return { storedLocally: true, syncedRemotely: true, via: 'sdk' };
  } catch (error) {
    console.warn(`[Firebase] Explicit persist failed for ${key}:`, error);
    try {
      await persistAnyViaRest(key, value);
      pendingFirebaseSyncs.delete(key);
      return { storedLocally: true, syncedRemotely: true, via: 'rest-fallback', error };
    } catch (restError) {
      pendingFirebaseSyncs.set(key, value);
      return { storedLocally: true, syncedRemotely: false, error: restError };
    }
  }
}

async function syncKeyToFirebase(key, value) {
  if (!window.FB) {
    pendingFirebaseSyncs.set(key, value);
    return;
  }
  try {
    const docId = FIREBASE_DOC_MAP[key] || 'data';
    await window.FB.setAny(key, value, docId);
    pendingFirebaseSyncs.delete(key);
  } catch (error) {
    console.warn(`[Firebase] Failed to sync ${key}:`, error);
    pendingFirebaseSyncs.set(key, value);
  }
}

async function flushPendingFirebaseSyncs() {
  if (!window.FB || !pendingFirebaseSyncs.size) return;
  const entries = [...pendingFirebaseSyncs.entries()];
  for (const [key, value] of entries) {
    try {
      const docId = FIREBASE_DOC_MAP[key] || 'data';
      await window.FB.setAny(key, value, docId);
      pendingFirebaseSyncs.delete(key);
    } catch (error) {
      console.warn(`[Firebase] Failed to flush ${key}:`, error);
    }
  }
}

async function hydrateAppDataFromFirebase() {
  if (!window.FB) return;
  const systemData = await window.FB.getSystemData?.();
  if (systemData && typeof systemData === 'object' && Object.keys(systemData).length) {
    for (const key of FIREBASE_ARRAY_KEYS) {
      const remote = systemData[key];
      if (Array.isArray(remote)) writeLocalStorageSilently(key, remote);
    }
    for (const key of FIREBASE_OBJECT_KEYS) {
      const remote = systemData[key];
      if (remote && typeof remote === 'object') writeLocalStorageSilently(key, remote);
    }
    return;
  }
  const keys = [...FIREBASE_ARRAY_KEYS, ...FIREBASE_OBJECT_KEYS];
  for (const key of keys) {
    try {
      const docId = FIREBASE_DOC_MAP[key] || 'data';
      const remote = await window.FB.getAny(key, docId);
      if (remote == null) continue;
      if (FIREBASE_ARRAY_KEYS.has(key) && Array.isArray(remote)) {
        writeLocalStorageSilently(key, remote);
      } else if (FIREBASE_OBJECT_KEYS.has(key) && typeof remote === 'object') {
        writeLocalStorageSilently(key, remote);
      }
    } catch (error) {
      console.warn(`[Firebase] Failed to hydrate ${key}:`, error);
    }
  }
}

if (!window.__vmFirebaseStoragePatched) {
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    if (!window.__vmSkipFirebaseMirror && this === window.localStorage && (FIREBASE_ARRAY_KEYS.has(key) || FIREBASE_OBJECT_KEYS.has(key))) {
      try {
        syncKeyToFirebase(key, JSON.parse(value));
      } catch (error) {
        console.warn(`[Firebase] Failed to mirror localStorage key ${key}:`, error);
      }
    }
  };
  window.__vmFirebaseStoragePatched = true;
}

window.addEventListener("vm-firebase-ready", () => {
  flushPendingFirebaseSyncs();
  hydrateAppDataFromFirebase();
});

async function ensureVmDataReady(options = {}) {
  const { forceHydrate = false } = options;
  if (!vmDataReadyPromise || forceHydrate) {
    vmDataReadyPromise = (async () => {
      if (forceHydrate || (window.FB && !localStorage.getItem('vm_seeded'))) {
        await hydrateAppDataFromFirebase();
      }
      const hadSeedBefore = !!localStorage.getItem('vm_seeded');
      seedData();
      if (window.FB?.syncPortalTreeFromLocal) {
        const remoteRoot = await window.FB.getAny('vm_admin');
        const remoteMissing = !remoteRoot || (typeof remoteRoot === 'object' && !Object.keys(remoteRoot).length);
        if (!hadSeedBefore || remoteMissing) {
          await window.FB.syncPortalTreeFromLocal();
        }
      }
      return true;
    })();
  }
  return vmDataReadyPromise;
}

window.ensureVmDataReady = ensureVmDataReady;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isLoginPage() {
  return document.body.classList.contains('login-page-body');
}

function runDeferred(task) {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => task());
    return;
  }
  window.setTimeout(task, 0);
}

async function runNoticeCrudSmokeTest() {
  await ensureVmDataReady();
  if (!window.FB?.syncPortalTreeFromLocal || !window.FB?.getAny) {
    throw new Error("Firebase sync helpers are not available.");
  }
  const testId = `SMOKE_${Date.now()}`;
  const original = getData('vm_notices');
  const createRecord = {
    id: testId,
    title: 'Smoke Test Notice',
    content: 'Temporary CRUD verification record',
    type: 'info',
    author: 'Codex Smoke Test',
    date: new Date().toISOString().split('T')[0]
  };

  const results = { create: false, update: false, delete: false, id: testId };

  try {
    setData('vm_notices', [createRecord, ...original]);
    await window.FB.syncPortalTreeFromLocal({ vm_notices: getData('vm_notices') });
    await delay(250);
    const afterCreate = await window.FB.getAny('vm_notices');
    results.create = Array.isArray(afterCreate) && afterCreate.some(item => item.id === testId);

    const updatedRecords = getData('vm_notices').map(item =>
      item.id === testId ? { ...item, title: 'Smoke Test Notice Updated' } : item
    );
    setData('vm_notices', updatedRecords);
    await window.FB.syncPortalTreeFromLocal({ vm_notices: getData('vm_notices') });
    await delay(250);
    const afterUpdate = await window.FB.getAny('vm_notices');
    results.update = Array.isArray(afterUpdate) && afterUpdate.some(item => item.id === testId && item.title === 'Smoke Test Notice Updated');

    const cleanedRecords = getData('vm_notices').filter(item => item.id !== testId);
    setData('vm_notices', cleanedRecords);
    await window.FB.syncPortalTreeFromLocal({ vm_notices: getData('vm_notices') });
    await delay(250);
    const afterDelete = await window.FB.getAny('vm_notices');
    results.delete = Array.isArray(afterDelete) && !afterDelete.some(item => item.id === testId);

    return results;
  } catch (error) {
    setData('vm_notices', original);
    await window.FB.syncPortalTreeFromLocal({ vm_notices: getData('vm_notices') });
    throw error;
  }
}

window.vmDebug = {
  runNoticeCrudSmokeTest
};
window.vmPersistKey = persistAnyToStorageAndFirebase;

function showToast(msg, type = 'success') {
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

function calcGrade(pct) {
  if (pct >= 91) return 'A1';
  if (pct >= 81) return 'A2';
  if (pct >= 71) return 'B1';
  if (pct >= 61) return 'B2';
  if (pct >= 51) return 'C1';
  if (pct >= 41) return 'C2';
  return 'D';
}

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  const step = (ts) => {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

/* ===== INTERSECTION OBSERVER ===== */
function initAOS() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-aos]').forEach(el => io.observe(el));

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(el => animateCounter(el));
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const countersSection = document.querySelector('.counters-grid');
  if (countersSection) counterIO.observe(countersSection);
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav && hamburger.dataset.bound !== 'true') {
    hamburger.dataset.bound = 'true';
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }
  window.addEventListener('scroll', () => {
    const nb = document.querySelector('.navbar');
    if (nb) nb.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.12)' : '0 2px 20px rgba(0,0,0,0.08)';
  });
}

/* ===== PORTAL NAVIGATION ===== */
function initPortal(role) {
  const links = document.querySelectorAll('.portal-nav a[data-section]');
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.portal-section').forEach(s => s.classList.remove('active'));
      link.classList.add('active');
      const sec = document.getElementById(link.dataset.section);
      if (sec) sec.classList.add('active');
      const topbar = document.getElementById('portalTopbarTitle');
      if (topbar) topbar.textContent = link.textContent.trim();
      const sidebar = document.querySelector('.portal-sidebar');
      if (sidebar && window.innerWidth < 768) sidebar.classList.remove('open');
    });
  });
  const sideToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.portal-sidebar');
  const hasCustomSidebarToggle = sideToggle?.dataset.customToggle === 'true' || sidebar?.dataset.customToggle === 'true';
  if (sideToggle && sidebar && !hasCustomSidebarToggle) {
    sideToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

/* ===== ADMIN SPECIFIC ===== */
function initAdmin() {
  if (!document.body.classList.contains('admin-page')) return;
  const admin = JSON.parse(localStorage.getItem('vm_adminUser') || 'null');
  if (!admin) { window.location.href = '../pages/login.html'; return; }
  document.getElementById('adminName').textContent = admin.name;
  initPortal('admin');
  renderAdminDashboard();
  renderStudentTable();
  renderTeacherTable();
  renderAdmissionTable();
  renderFeeTable();
  renderNoticeTable();
  renderAdminAttendance();
  renderResultsTable();
  initAdminForms();
}

function renderAdminDashboard() {
  const students = getData('vm_students');
  const admissions = getData('vm_admissions');
  const teachers = getData('vm_teachers');
  const paidFees = students.filter(s => s.fees === 'paid').length;
  const pendingFees = students.filter(s => s.fees === 'pending').length;
  setEl('statStudents', students.length);
  setEl('statTeachers', teachers.length);
  setEl('statFeesPaid', `₹${(paidFees * 15000).toLocaleString()}`);
  setEl('statFeesPending', pendingFees);
  setEl('statAdmissions', admissions.filter(a => a.status === 'pending').length);
  drawAdminCharts();
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function drawAdminCharts() {
  drawBarChart('feesChart', ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    [85, 92, 78, 95, 88, 90, 82, 97, 75, 89, 93, 87], 'Fee Collection (%)');
  drawPieChart('admChart', ['Approved', 'Pending', 'Rejected'], [45, 30, 25], ['#10b981', '#f59e0b', '#ef4444']);
}

function renderStudentTable() {
  const students = getData('vm_students');
  const tbody = document.getElementById('studentTableBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${s.id}</td>
      <td><strong>${s.name}</strong><br><small style="color:var(--gray-500)">${s.gender === 'M' ? '👦' : '👧'} Roll: ${s.rollNo}</small></td>
      <td>Class ${s.class}-${s.section}</td>
      <td>${s.parent}</td>
      <td>${s.contact}</td>
      <td><span class="status status-${s.fees === 'paid' ? 'paid' : 'unpaid'}">${s.fees === 'paid' ? 'Paid' : 'Pending'}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="editStudent('${s.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-red" style="margin-left:6px" onclick="deleteStudent('${s.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function renderTeacherTable() {
  const teachers = getData('vm_teachers');
  const tbody = document.getElementById('teacherTableBody');
  if (!tbody) return;
  tbody.innerHTML = teachers.map(t => `
    <tr>
      <td>${t.id}</td>
      <td><strong>${t.name}</strong></td>
      <td><span class="badge badge-primary">${t.subject}</span></td>
      <td>${t.email}</td>
      <td>${t.phone}</td>
      <td>${t.exp}</td>
      <td>${t.class}</td>
      <td><button class="btn btn-sm btn-red" onclick="deleteTeacher('${t.id}')">🗑️</button></td>
    </tr>
  `).join('');
}

function renderAdmissionTable() {
  const admissions = getData('vm_admissions');
  const tbody = document.getElementById('admissionTableBody');
  if (!tbody) return;
  tbody.innerHTML = admissions.map(a => `
    <tr>
      <td>${a.id}</td>
      <td><strong>${a.name}</strong></td>
      <td>Class ${a.class}</td>
      <td>${a.parent}</td>
      <td>${a.contact}</td>
      <td>${a.date}</td>
      <td><span class="status status-${a.status}">${a.status}</span></td>
      <td>
        ${a.status === 'pending' ? `
          <button class="btn btn-sm btn-green" onclick="updateAdmission('${a.id}','approved')">✅ Approve</button>
          <button class="btn btn-sm btn-red" style="margin-left:6px" onclick="updateAdmission('${a.id}','rejected')">❌</button>
        ` : `<span class="badge badge-${a.status === 'approved' ? 'green' : 'red'}">${a.status}</span>`}
      </td>
    </tr>
  `).join('');
}

function renderFeeTable() {
  const students = getData('vm_students');
  const tbody = document.getElementById('feeTableBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${s.id}</td>
      <td><strong>${s.name}</strong></td>
      <td>Class ${s.class}-${s.section}</td>
      <td>₹15,000</td>
      <td>${s.fees === 'paid' ? '₹15,000' : '₹0'}</td>
      <td>${s.fees === 'paid' ? '₹0' : '₹15,000'}</td>
      <td><span class="status status-${s.fees === 'paid' ? 'paid' : 'unpaid'}">${s.fees === 'paid' ? 'Paid' : 'Pending'}</span></td>
      <td>${s.fees === 'pending' ? `<button class="btn btn-sm btn-green" onclick="markFeePaid('${s.id}')">Mark Paid</button>` : '<span class="badge badge-green">✓ Done</span>'}</td>
    </tr>
  `).join('');
}

function renderNoticeTable() {
  const notices = getData('vm_notices');
  const tbody = document.getElementById('noticeTableBody');
  if (!tbody) return;
  tbody.innerHTML = notices.map(n => `
    <tr>
      <td><strong>${n.title}</strong></td>
      <td>${n.content.substring(0, 60)}...</td>
      <td><span class="badge badge-${n.type === 'urgent' ? 'red' : n.type === 'info' ? 'green' : 'primary'}">${n.type}</span></td>
      <td>${n.date}</td>
      <td>${n.author}</td>
      <td>
        <button class="btn btn-sm btn-red" onclick="deleteNotice('${n.id}')">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminAttendance() {
  const students = getData('vm_students');
  const grid = document.getElementById('adminAttGrid');
  if (!grid) return;
  grid.innerHTML = students.map(s => `
    <div class="student-attendance-card">
      <div class="student-att-info">
        <div class="student-att-avatar">${s.name[0]}</div>
        <div>
          <div class="student-att-name">${s.name}</div>
          <div class="student-att-roll">Roll: ${s.rollNo} | Class ${s.class}</div>
        </div>
      </div>
      <div class="att-toggle">
        <button class="att-btn att-btn-p" id="p_${s.id}" onclick="markAtt('${s.id}','P')">P</button>
        <button class="att-btn att-btn-a" id="a_${s.id}" onclick="markAtt('${s.id}','A')">A</button>
      </div>
    </div>
  `).join('');
}

function renderResultsTable() {
  const students = getData('vm_students');
  const marks = getObj('vm_marks');
  const tbody = document.getElementById('resultsTableBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(s => {
    const m = marks[s.id];
    if (!m) return `<tr><td>${s.id}</td><td>${s.name}</td><td colspan="7"><em>No marks entered</em></td></tr>`;
    const total = m.math + m.science + m.english + m.hindi + m.social;
    const pct = (total / 500 * 100).toFixed(1);
    const grade = calcGrade(parseFloat(pct));
    return `
      <tr>
        <td>${s.id}</td><td><strong>${s.name}</strong></td><td>${s.class}</td>
        <td>${m.math}</td><td>${m.science}</td><td>${m.english}</td>
        <td><strong>${pct}%</strong></td>
        <td><span class="badge badge-${parseFloat(pct)>=80?'green':parseFloat(pct)>=60?'primary':'red'}">${grade}</span></td>
      </tr>`;
  }).join('');
}

window.markAtt = function(id, status) {
  document.getElementById(`p_${id}`)?.classList.toggle('active', status === 'P');
  document.getElementById(`a_${id}`)?.classList.toggle('active', status === 'A');
  const att = getObj('vm_attendance');
  if (!att[id]) att[id] = { present: 0, total: 95 };
  if (status === 'P') att[id].present = Math.min(att[id].present + 1, att[id].total);
  setData('vm_attendance', att);
};

window.updateAdmission = function(id, status) {
  const admissions = getData('vm_admissions');
  const idx = admissions.findIndex(a => a.id === id);
  if (idx > -1) {
    admissions[idx].status = status;
    setData('vm_admissions', admissions);
    if (status === 'approved') {
      const a = admissions[idx];
      const students = getData('vm_students');
      students.push({ id: `STU${String(students.length+1).padStart(3,'0')}`, name: a.name, rollNo: `${200+students.length}`, class: a.class, section: 'A', parent: a.parent, contact: a.contact, address: 'Indore', password: 'student123', fees: 'pending', gender: 'M', dob: '2010-01-01' });
      setData('vm_students', students);
      showToast('Student admitted and record created!', 'success');
    } else showToast('Application status updated', 'info');
    renderAdmissionTable();
    renderStudentTable();
    renderAdminDashboard();
  }
};

window.deleteStudent = function(id) {
  if (!confirm('Delete this student?')) return;
  let students = getData('vm_students');
  setData('vm_students', students.filter(s => s.id !== id));
  renderStudentTable(); renderAdminDashboard(); showToast('Student deleted', 'info');
};

window.editStudent = function(id) {
  const s = getData('vm_students').find(s => s.id === id);
  if (!s) return;
  document.getElementById('editStudentId').value = s.id;
  document.getElementById('editStudentName').value = s.name;
  document.getElementById('editStudentClass').value = s.class;
  document.getElementById('editStudentParent').value = s.parent;
  document.getElementById('editStudentContact').value = s.contact;
  openModal('editStudentModal');
};

window.deleteTeacher = function(id) {
  if (!confirm('Delete this teacher?')) return;
  let teachers = getData('vm_teachers');
  setData('vm_teachers', teachers.filter(t => t.id !== id));
  renderTeacherTable(); showToast('Teacher deleted', 'info');
};

window.deleteNotice = function(id) {
  if (!confirm('Delete this notice?')) return;
  let notices = getData('vm_notices');
  setData('vm_notices', notices.filter(n => n.id !== id));
  renderNoticeTable(); showToast('Notice deleted', 'info');
};

window.markFeePaid = function(id) {
  const students = getData('vm_students');
  const idx = students.findIndex(s => s.id === id);
  if (idx > -1) { students[idx].fees = 'paid'; setData('vm_students', students); renderFeeTable(); renderAdminDashboard(); showToast('Fee marked as paid', 'success'); }
};

function initAdminForms() {
  const addStudentForm = document.getElementById('addStudentForm');
  if (addStudentForm) {
    addStudentForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(addStudentForm);
      const students = getData('vm_students');
      const newS = {
        id: `STU${String(students.length+1).padStart(3,'0')}`,
        name: fd.get('name') || document.getElementById('newStudentName').value,
        rollNo: `${100+students.length}`,
        class: document.getElementById('newStudentClass').value,
        section: document.getElementById('newStudentSection').value || 'A',
        parent: document.getElementById('newStudentParent').value,
        contact: document.getElementById('newStudentContact').value,
        address: document.getElementById('newStudentAddress').value || 'Indore',
        password: 'student123', fees: 'pending', gender: 'M', dob: '2010-01-01'
      };
      students.push(newS); setData('vm_students', students);
      closeModal('addStudentModal'); renderStudentTable(); renderAdminDashboard();
      addStudentForm.reset(); showToast('Student added successfully!', 'success');
    });
  }

  const editStudentForm = document.getElementById('editStudentForm');
  if (editStudentForm) {
    editStudentForm.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('editStudentId').value;
      const students = getData('vm_students');
      const idx = students.findIndex(s => s.id === id);
      if (idx > -1) {
        students[idx].name = document.getElementById('editStudentName').value;
        students[idx].class = document.getElementById('editStudentClass').value;
        students[idx].parent = document.getElementById('editStudentParent').value;
        students[idx].contact = document.getElementById('editStudentContact').value;
        setData('vm_students', students);
        closeModal('editStudentModal'); renderStudentTable(); showToast('Student updated!', 'success');
      }
    });
  }

  const addTeacherForm = document.getElementById('addTeacherForm');
  if (addTeacherForm) {
    addTeacherForm.addEventListener('submit', e => {
      e.preventDefault();
      const teachers = getData('vm_teachers');
      teachers.push({
        id: `TCH${String(teachers.length+1).padStart(3,'0')}`,
        name: document.getElementById('newTeacherName').value,
        subject: document.getElementById('newTeacherSubject').value,
        email: document.getElementById('newTeacherEmail').value,
        phone: document.getElementById('newTeacherPhone').value,
        exp: document.getElementById('newTeacherExp').value || '1 year',
        class: 'TBD', password: 'teacher123'
      });
      setData('vm_teachers', teachers);
      closeModal('addTeacherModal'); renderTeacherTable(); addTeacherForm.reset(); showToast('Teacher added!', 'success');
    });
  }

  const addNoticeForm = document.getElementById('addNoticeForm');
  if (addNoticeForm) {
    addNoticeForm.addEventListener('submit', e => {
      e.preventDefault();
      const notices = getData('vm_notices');
      notices.unshift({
        id: `N${String(notices.length+1).padStart(3,'0')}`,
        title: document.getElementById('noticeTitle').value,
        content: document.getElementById('noticeContent').value,
        type: document.getElementById('noticeType').value,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin'
      });
      setData('vm_notices', notices);
      closeModal('addNoticeModal'); renderNoticeTable(); addNoticeForm.reset(); showToast('Notice published!', 'success');
    });
  }

  // Export CSV
  document.getElementById('exportStudentsBtn')?.addEventListener('click', () => exportCSV('vm_students', ['id','name','rollNo','class','section','parent','contact','fees'],'students'));
  document.getElementById('exportFeesBtn')?.addEventListener('click', () => exportCSV('vm_students', ['id','name','class','fees'],'fees'));
}

function exportCSV(key, fields, filename) {
  const data = getData(key);
  const rows = [fields.join(','), ...data.map(r => fields.map(f => `"${r[f]||''}"`).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${filename}_${Date.now()}.csv`; a.click();
  showToast('CSV exported!', 'success');
}

/* ===== STUDENT PORTAL ===== */
function initStudent() {
  if (!document.body.classList.contains('student-page')) return;
  const user = JSON.parse(localStorage.getItem('vm_studentUser') || 'null');
  if (!user) { window.location.href = '../pages/login.html'; return; }
  initPortal('student');
  renderStudentDashboard(user);
}

function renderStudentDashboard(user) {
  const students = getData('vm_students');
  const s = students.find(x => x.id === user.id);
  if (!s) return;
  setEl('studentName', s.name);
  setEl('studentClass', `Class ${s.class}-${s.section}`);
  setEl('studentRoll', `Roll No: ${s.rollNo}`);

  // Attendance
  const att = getObj('vm_attendance')[s.id] || { present: 80, total: 95 };
  const attPct = Math.round(att.present / att.total * 100);
  setEl('studentAttPct', `${attPct}%`);
  const attBar = document.getElementById('studentAttBar');
  if (attBar) { attBar.style.width = `${attPct}%`; attBar.className = `progress-fill ${attPct >= 75 ? 'green' : 'red'}`; }

  // Marks
  const marks = getObj('vm_marks')[s.id] || { math: 75, science: 80, english: 82, hindi: 78, social: 79 };
  const total = Object.values(marks).reduce((a, b) => a + b, 0);
  const pct = (total / 500 * 100).toFixed(1);
  setEl('studentMarksPct', `${pct}%`);
  setEl('studentGrade', calcGrade(parseFloat(pct)));

  // Fee Status
  const feeStatus = s.fees;
  setEl('studentFeeStatus', feeStatus === 'paid' ? '✅ Paid' : '⚠️ Pending');

  // Render marks table
  const mTable = document.getElementById('studentMarksTable');
  if (mTable) {
    mTable.innerHTML = Object.entries({ Mathematics: marks.math, Science: marks.science, English: marks.english, Hindi: marks.hindi, 'Social Science': marks.social }).map(([sub, m]) => `
      <tr>
        <td><strong>${sub}</strong></td><td>100</td><td>${m}</td>
        <td>${(m).toFixed(0)}%</td>
        <td><span class="badge badge-${m>=75?'green':m>=50?'primary':'red'}">${calcGrade(m)}</span></td>
      </tr>
    `).join('');
  }

  // Notices
  const notices = getData('vm_notices');
  const noticeList = document.getElementById('studentNoticeList');
  if (noticeList) {
    noticeList.innerHTML = notices.slice(0, 4).map(n => `
      <div class="notice-item ${n.type}">
        <div class="notice-icon">${n.type==='urgent'?'🔴':n.type==='info'?'🟢':'🔵'}</div>
        <div class="notice-content">
          <h4>${n.title}</h4>
          <p>${n.content.substring(0,80)}...</p>
          <div class="notice-date">${n.date}</div>
        </div>
      </div>
    `).join('');
  }

  // Timetable
  const tt = document.getElementById('studentTimetable');
  if (tt) {
    const schedule = [
      ['Monday', 'Mathematics', 'Science', 'English', 'Hindi', 'Computer'],
      ['Tuesday', 'English', 'Mathematics', 'Science', 'Social', 'P.E.'],
      ['Wednesday', 'Hindi', 'English', 'Mathematics', 'Science', 'Art'],
      ['Thursday', 'Social', 'Hindi', 'English', 'Mathematics', 'Library'],
      ['Friday', 'Computer', 'Social', 'Hindi', 'English', 'Mathematics'],
      ['Saturday', 'P.E.', 'Assembly', 'Special Class', '-', '-']
    ];
    tt.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr><th>Day</th><th>P1 (8-9)</th><th>P2 (9-10)</th><th>P3 (10-11)</th><th>P4 (11-12)</th><th>P5 (12-1)</th></tr></thead><tbody>${schedule.map(r=>`<tr>${r.map((c,i)=>`<td>${i===0?`<strong>${c}</strong>`:c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  // Draw marks chart
  setTimeout(() => drawBarChart('studentMarksChart', ['Math','Science','English','Hindi','Social'],
    [marks.math, marks.science, marks.english, marks.hindi, marks.social], 'Marks Out of 100'), 300);
}

/* ===== TEACHER PORTAL ===== */
function initTeacher() {
  if (!document.body.classList.contains('teacher-page')) return;
  const user = JSON.parse(localStorage.getItem('vm_teacherUser') || 'null');
  if (!user) { window.location.href = '../pages/login.html'; return; }
  initPortal('teacher');
  const teachers = getData('vm_teachers');
  const t = teachers.find(x => x.id === user.id);
  if (t) { setEl('teacherName', t.name); setEl('teacherSubject', t.subject); }
  renderTeacherAttendance();
  renderHomeworkList();
  renderTeacherStudentMarks();
}

function renderTeacherAttendance() {
  const students = getData('vm_students');
  const grid = document.getElementById('teacherAttGrid');
  if (!grid) return;
  grid.innerHTML = students.map(s => `
    <div class="student-attendance-card">
      <div class="student-att-info">
        <div class="student-att-avatar">${s.name[0]}</div>
        <div>
          <div class="student-att-name">${s.name}</div>
          <div class="student-att-roll">Roll: ${s.rollNo} | Class ${s.class}</div>
        </div>
      </div>
      <div class="att-toggle">
        <button class="att-btn att-btn-p" id="tp_${s.id}" onclick="markAtt('${s.id}','P')">P</button>
        <button class="att-btn att-btn-a" id="ta_${s.id}" onclick="markAtt('${s.id}','A')">A</button>
      </div>
    </div>
  `).join('');
}

function renderHomeworkList() {
  const hw = getData('vm_homework');
  const list = document.getElementById('homeworkList');
  if (!list) return;
  if (!hw.length) { list.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:20px">No homework assigned yet</p>'; return; }
  list.innerHTML = hw.map(h => `
    <div class="notice-item" style="border-left-color:var(--accent)">
      <div class="notice-icon">📝</div>
      <div class="notice-content">
        <h4>${h.subject} - ${h.title}</h4>
        <p>${h.desc}</p>
        <div class="notice-date">Deadline: ${h.deadline} | Class: ${h.class}</div>
      </div>
    </div>
  `).join('');
}

function renderTeacherStudentMarks() {
  const students = getData('vm_students');
  const marks = getObj('vm_marks');
  const tbody = document.getElementById('teacherMarksBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(s => {
    const m = marks[s.id] || { math: '', science: '', english: '', hindi: '', social: '' };
    return `<tr>
      <td>${s.id}</td><td><strong>${s.name}</strong></td><td>Class ${s.class}</td>
      <td><input type="number" class="form-control" style="width:70px;padding:4px 8px" min="0" max="100" value="${m.math}" onchange="updateMark('${s.id}','math',this.value)"></td>
      <td><input type="number" class="form-control" style="width:70px;padding:4px 8px" min="0" max="100" value="${m.science}" onchange="updateMark('${s.id}','science',this.value)"></td>
      <td><input type="number" class="form-control" style="width:70px;padding:4px 8px" min="0" max="100" value="${m.english}" onchange="updateMark('${s.id}','english',this.value)"></td>
    </tr>`;
  }).join('');
}

window.updateMark = function(studentId, subject, value) {
  const marks = getObj('vm_marks');
  if (!marks[studentId]) marks[studentId] = {};
  marks[studentId][subject] = parseInt(value);
  setData('vm_marks', marks);
  showToast('Marks saved!', 'success');
};

/* ===== LOGIN ===== */
function initLogin() {
  if (!document.body.classList.contains('login-page-body')) return;
  const form = document.getElementById('loginForm');
  if (!form) return;
  if (form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  currentRole = 'student';
  updateLoginRoleUi(currentRole);

  const urlRole = new URLSearchParams(window.location.search).get('role');
  if (urlRole && ['student', 'teacher', 'admin'].includes(urlRole)) {
    const activeTab = document.querySelector(`.login-tab[data-role="${urlRole}"]`);
    if (activeTab) setRole(urlRole, { currentTarget: activeTab });
  }

  document.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setRole(tab.dataset.role, { currentTarget: tab });
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    await doLogin();
  });
}

/* ===== CHART FUNCTIONS ===== */
function drawBarChart(canvasId, labels, data, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data, backgroundColor: 'rgba(37,99,235,0.75)', borderRadius: 6, borderSkipped: false }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
    }
  });
}

function drawPieChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }
  });
}

/* ===== ADMISSION FORM (PUBLIC) ===== */
function pickFieldValue(selectors = []) {
  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field && typeof field.value === 'string') {
      const value = field.value.trim();
      if (value) return value;
    }
  }
  return '';
}

function buildAdmissionRecord() {
  const admissions = getData('vm_admissions');
  return {
    id: `ADM${Date.now()}`,
    name: pickFieldValue(['#admName', '#admissionForm input[type="text"]']),
    class: pickFieldValue(['#admClass', '#admissionForm select']),
    parent: pickFieldValue(['#admParent', '#admFather', '#admissionForm input[placeholder*="Father"]']),
    contact: pickFieldValue(['#admContact', '#admPhone', '#admissionForm input[type="tel"]']),
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    source: 'website-admission',
    _sequence: admissions.length + 1
  };
}

async function saveAdmissionRecord() {
  const admissions = getData('vm_admissions');
  const record = buildAdmissionRecord();
  if (!record.name || !record.class || !record.parent || !record.contact) {
    return { ok: false };
  }
  admissions.unshift(record);
  if (window.vmPersistKey) {
    const persistResult = await window.vmPersistKey('vm_admissions', admissions);
    if (persistResult?.error) {
      console.warn('Admission Firebase sync failed:', persistResult.error);
    }
  } else {
    setData('vm_admissions', admissions);
  }
  return { ok: true, record };
}

function buildContactMessageRecord(form) {
  const fields = form ? Array.from(form.querySelectorAll('input, select, textarea')) : [];
  const [nameInput, emailInput, phoneInput, subjectInput, messageInput] = fields;
  return {
    id: `CT${Date.now()}`,
    name: nameInput?.value?.trim() || pickFieldValue(['#contactName']),
    email: emailInput?.value?.trim() || pickFieldValue(['#contactEmail']),
    phone: phoneInput?.value?.trim() || pickFieldValue(['#contactPhone']),
    subject: subjectInput?.value?.trim() || pickFieldValue(['#contactSubject']) || 'General Enquiry',
    message: messageInput?.value?.trim() || pickFieldValue(['#contactMessage']),
    date: new Date().toISOString(),
    status: 'new',
    source: 'website-contact'
  };
}

async function saveContactMessageRecord(form) {
  const contactMessages = getData('vm_contactMessages');
  const record = buildContactMessageRecord(form);
  if (!record.name || !record.phone || !record.message) {
    return { ok: false };
  }
  contactMessages.unshift(record);
  if (window.vmPersistKey) {
    const persistResult = await window.vmPersistKey('vm_contactMessages', contactMessages);
    if (persistResult?.error) {
      console.warn('Contact Firebase sync failed:', persistResult.error);
    }
  } else {
    setData('vm_contactMessages', contactMessages);
  }
  return { ok: true, record };
}

function initAdmissionForm() {
  const form = document.getElementById('publicAdmissionForm');
  if (!form) return;
  if ((form.getAttribute('onsubmit') || '').includes('handleAdmissionForm')) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const result = await saveAdmissionRecord();
    if (!result.ok) {
      showToast('Please fill all required admission details.', 'error');
      return;
    }
    showToast('Application submitted! We will contact you soon.', 'success');
    form.reset();
  });
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  if ((form.getAttribute('onsubmit') || '').includes('handleContactForm')) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const result = await saveContactMessageRecord(form);
    if (!result.ok) {
      showToast('Please fill name, phone and message.', 'error');
      return;
    }
    showToast('Message sent! We will reply within 24 hours.', 'success');
    form.reset();
  });
}

/* ===== SEARCH ===== */
window.filterStudents = function(q) {
  const students = getData('vm_students');
  const filtered = students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNo.includes(q) || s.id.toLowerCase().includes(q.toLowerCase()));
  const tbody = document.getElementById('studentTableBody');
  if (!tbody) return;
  if (!q) { renderStudentTable(); return; }
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.id}</td><td><strong>${s.name}</strong></td><td>Class ${s.class}-${s.section}</td>
      <td>${s.parent}</td><td>${s.contact}</td>
      <td><span class="status status-${s.fees==='paid'?'paid':'unpaid'}">${s.fees}</span></td>
      <td><button class="btn btn-sm btn-outline-primary" onclick="editStudent('${s.id}')">✏️</button></td>
    </tr>`).join('');
};

/* ===== LOGOUT ===== */
window.logout = function(role) {
  localStorage.removeItem(`vm_${role}User`);
  window.location.href = '../pages/login.html';
};

/* ===== TEACHER HOMEWORK FORM ===== */
function initTeacherForms() {
  const hwForm = document.getElementById('hwForm');
  if (hwForm) {
    hwForm.addEventListener('submit', e => {
      e.preventDefault();
      const hw = getData('vm_homework');
      hw.unshift({
        id: `HW${Date.now()}`,
        subject: document.getElementById('hwSubject').value,
        title: document.getElementById('hwTitle').value,
        desc: document.getElementById('hwDesc').value,
        deadline: document.getElementById('hwDeadline').value,
        class: document.getElementById('hwClass').value
      });
      setData('vm_homework', hw);
      renderHomeworkList();
      closeModal('addHwModal');
      hwForm.reset();
      showToast('Homework assigned!', 'success');
    });
  }
}

/* ===== LOGIN FUNCTIONS ===== */
let currentRole = 'student';

function updateLoginRoleUi(role) {
  const normalizedRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';
  const label = document.getElementById('loginIdLabel');
  const input = document.getElementById('loginId');
  const display = document.getElementById('currentRoleDisplay');

  if (label) {
    if (normalizedRole === 'student') label.textContent = 'Roll No / Student ID / Email';
    else if (normalizedRole === 'teacher') label.textContent = 'Teacher ID / Email';
    else label.textContent = 'Admin ID / Email / Username';
  }

  if (input) {
    if (normalizedRole === 'student') input.placeholder = 'e.g. 101 or STU001';
    else if (normalizedRole === 'teacher') input.placeholder = 'e.g. TCH001 or teacher email';
    else input.placeholder = 'e.g. admin or admin@vidyamandir.in';
  }

  if (display) {
    display.textContent = normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
  }
}

function setRole(role, evt) {
  currentRole = role;
  const tabs = document.querySelectorAll('.login-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (evt?.currentTarget) evt.currentTarget.classList.add('active');
  updateLoginRoleUi(role);
}

function findLocalLoginMatch(id, pass, role) {
  const normalizedId = normalizeText(id);
  const admin = getObj('vm_admin');

  if (role === 'admin') {
    if (admin && [admin.email, admin.id, admin.username].some(value => normalizeText(value) === normalizedId) && pass === admin.password) {
      return admin;
    }
    return null;
  }

  if (role === 'teacher') {
    const teachers = getData('vm_teachers');
    return teachers.find(t =>
      [t.email, t.id, t.name].some(value => normalizeText(value) === normalizedId) &&
      t.password === pass
    ) || null;
  }

  const students = getData('vm_students');
  return students.find(s => {
    const studentRoll = normalizeText(s.rollNo || s.roll || '');
    return [studentRoll, normalizeText(s.id), normalizeText(s.name), normalizeText(s.email)].includes(normalizedId) &&
      s.password === pass;
  }) || null;
}

async function doLogin() {
  const id = document.getElementById('loginId')?.value?.trim();
  const pass = document.getElementById('loginPass')?.value?.trim();
  const errorMsg = document.getElementById('loginError');

  if (!id || !pass) {
    if (errorMsg) { errorMsg.textContent = '❌ ID aur Password dono fill karein!'; errorMsg.classList.add('show'); }
    return;
  }

  let user = null;
  let role = currentRole;
  const roleOrder = [role, ...['student', 'teacher', 'admin'].filter(item => item !== role)];

  if (!user) {
    for (const candidateRole of roleOrder) {
      const localUser = findLocalLoginMatch(id, pass, candidateRole);
      if (localUser) {
        user = localUser;
        role = candidateRole;
        break;
      }
    }
  }

  if (!user && window.FB?.login) {
    await ensureVmDataReady();
    for (const candidateRole of roleOrder) {
      const loginResult = await window.FB.login(id, pass, candidateRole);
      if (loginResult?.user) {
        user = loginResult.user;
        role = loginResult.role;
        if (role === 'student') {
          const currentStudents = getData('vm_students');
          if (!currentStudents.some(s => s.id === user.id)) setData('vm_students', [user, ...currentStudents]);
        } else if (role === 'teacher') {
          const currentTeachers = getData('vm_teachers');
          if (!currentTeachers.some(t => t.id === user.id)) setData('vm_teachers', [user, ...currentTeachers]);
        } else if (role === 'admin') {
          setData('vm_admin', user);
        }
        break;
      }
    }
  }

  if (user) {
    currentRole = role;
    const matchedTab = document.querySelector(`.login-tab[data-role="${role}"]`);
    if (matchedTab) setRole(role, { currentTarget: matchedTab });
  }

  if (user) {
    localStorage.setItem('ssvm_auth', JSON.stringify({ user, role, loginTime: new Date().toISOString() }));
    if (role === 'admin') {
      localStorage.setItem('vm_adminUser', JSON.stringify(user));
      localStorage.removeItem('vm_teacherUser');
      localStorage.removeItem('vm_studentUser');
    } else if (role === 'teacher') {
      localStorage.setItem('vm_teacherUser', JSON.stringify(user));
      localStorage.removeItem('vm_adminUser');
      localStorage.removeItem('vm_studentUser');
    } else {
      localStorage.setItem('vm_studentUser', JSON.stringify(user));
      localStorage.removeItem('vm_adminUser');
      localStorage.removeItem('vm_teacherUser');
    }
    if (errorMsg) errorMsg.classList.remove('show');
    showToast(`✅ ${role} login successful! Portal khul raha hai...`, 'success');
    // Immediate redirect
    const targetPage = role === 'admin' ? '../admin-portal/admin-portal.html' : role === 'teacher' ? '../teacher-portal/teacher-portal.html' : '../student-portal/student-portal.html';
    window.location.replace(targetPage);
  } else {
    if (errorMsg) { errorMsg.textContent = '❌ Invalid ID ya Password!'; errorMsg.classList.add('show'); }
    showToast('❌ Login failed! Check ID and password.', 'error');
  }
}

function doLogout() {
  localStorage.removeItem('ssvm_auth');
  localStorage.removeItem('vm_adminUser');
  localStorage.removeItem('vm_teacherUser');
  localStorage.removeItem('vm_studentUser');
  showToast('👋 Logout successful!', 'success');
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const homePath = /\/(pages|student-portal|teacher-portal|admin-portal)\//.test(normalizedPath) ? '../index.html' : 'index.html';
  setTimeout(() => { window.location.href = homePath; }, 800);
}

function toggleNav() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  if (nav && hamburger) {
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
  }
}

function closeNav() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  if (nav && hamburger) {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchPTab(element, viewId) {
  const pviews = document.querySelectorAll('.pview');
  const ptabs = document.querySelectorAll('.ptab');
  
  pviews.forEach(v => v.classList.remove('active'));
  ptabs.forEach(t => t.classList.remove('active'));
  
  element.classList.add('active');
  const view = document.getElementById(viewId);
  if (view) view.classList.add('active');
}

function openLightbox(emoji, title) {
  const lb = document.getElementById('lightboxModal');
  if (lb) {
    document.getElementById('lightboxEmoji').textContent = emoji;
    document.getElementById('lightboxTitle').textContent = title;
    lb.classList.add('show');
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightboxModal');
  if (lb) lb.classList.remove('show');
}

function submitAdmission(e) {
  e.preventDefault();
  const result = saveAdmissionRecord();
  if (result.ok) {
    showToast('✅ Application submit ho gya! 2-3 din mein call karenge.', 'success');
    e.target.reset();
  } else {
    showToast('❌ Sab fields fill karein!', 'error');
  }
}

function goToSlide(index) {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  if (slides[index]) slides[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
}

function openLightbox(emoji, title) {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    document.getElementById('lightboxEmoji').textContent = emoji;
    document.getElementById('lightboxTitle').textContent = title;
    modal.style.display = 'flex';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.style.display = 'none';
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', async () => {
  if (isLoginPage()) {
    window.__vmSkipFirebaseMirror = true;
    try {
      seedData();
    } finally {
      window.__vmSkipFirebaseMirror = false;
    }
    initLogin();
    runDeferred(() => {
      ensureVmDataReady().catch(error => console.warn('[Login] Background init failed:', error));
    });
    return;
  }

  await ensureVmDataReady();
  initNavbar();
  initAOS();
  initLogin();
  initAdmin();
  initStudent();
  initTeacher();
  initAdmissionForm();
  initContactForm();
  initTeacherForms();

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});
