document.addEventListener('DOMContentLoaded', async function() {
    if (window.ensureVmDataReady) {
        await window.ensureVmDataReady({ forceHydrate: true });
    }

    const resultSearchForm = document.getElementById('result-search-form');
    if (resultSearchForm) {
        resultSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const rollNumber = document.getElementById('roll-number')?.value.trim() || '';
            searchResult(rollNumber);
        });
    }
});

function searchResult(rollNumber) {
    const students = JSON.parse(localStorage.getItem('vm_students') || '[]');
    const student = students.find(item =>
        String(item.rollNo || item.roll || '').trim() === rollNumber ||
        String(item.id || '').trim() === rollNumber
    );

    if (!student) {
        alert('Result not found for the given roll number. Please check and try again.');
        document.getElementById('result-display').style.display = 'none';
        return;
    }

    const examResults = JSON.parse(localStorage.getItem('vm_examResults') || '[]')
        .filter(item => item.studentId === student.id);
    const marksMap = JSON.parse(localStorage.getItem('vm_marks') || '{}')[student.id] || {};

    const marks = examResults.length
        ? examResults.map(item => ({
            subject: item.subject,
            obtained: Number(item.marks || item.obtained || 0),
            total: Number(item.maxMarks || 100),
            grade: item.grade || calculateOverallGrade(Number(item.percentage || item.marks || 0)),
            examName: item.examName || 'Assessment'
        }))
        : Object.entries(marksMap).map(([subject, obtained]) => ({
            subject,
            obtained: Number(obtained || 0),
            total: 100,
            grade: calculateOverallGrade(Number(obtained || 0)),
            examName: 'Subject Marks'
        }));

    if (!marks.length) {
        alert('No published marks are available for this student yet.');
        document.getElementById('result-display').style.display = 'none';
        return;
    }

    displayResult({
        rollNumber: student.rollNo || student.roll || student.id,
        name: student.name,
        class: `${student.class || '-'}${student.section ? `-${student.section}` : ''}`,
        marks
    });
}

function displayResult(result) {
    document.getElementById('student-name').textContent = result.name;
    document.getElementById('student-details').textContent = `Class: ${result.class} | Roll Number: ${result.rollNumber}`;

    const totalObtained = result.marks.reduce((sum, mark) => sum + Number(mark.obtained || 0), 0);
    const totalMarks = result.marks.reduce((sum, mark) => sum + Number(mark.total || 0), 0);
    const percentage = totalMarks ? ((totalObtained / totalMarks) * 100).toFixed(2) : '0.00';
    const overallGrade = calculateOverallGrade(Number(percentage));

    const marksTable = document.getElementById('marks-table');
    marksTable.innerHTML = result.marks.map(mark => `
        <tr>
            <td>${mark.subject}</td>
            <td>${mark.obtained}</td>
            <td>${mark.total}</td>
            <td>${mark.grade}</td>
        </tr>
    `).join('');

    document.getElementById('total-marks').textContent = `${totalObtained}/${totalMarks}`;
    document.getElementById('percentage').textContent = percentage;
    document.getElementById('overall-grade').textContent = overallGrade;
    document.getElementById('result-display').style.display = 'block';
    document.getElementById('result-display').scrollIntoView({ behavior: 'smooth' });
}

function calculateOverallGrade(percentage) {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C+';
    if (percentage >= 50) return 'C';
    return 'F';
}

function downloadResult() {
    const studentName = document.getElementById('student-name').textContent;
    const studentDetails = document.getElementById('student-details').textContent;
    const totalMarks = document.getElementById('total-marks').textContent;
    const percentage = document.getElementById('percentage').textContent;
    const overallGrade = document.getElementById('overall-grade').textContent;

    const resultContent = [
        'VIDYA MANDIR SCHOOL',
        'Academic Result',
        '',
        studentName,
        studentDetails,
        '',
        `Total Marks: ${totalMarks}`,
        `Percentage: ${percentage}%`,
        `Grade: ${overallGrade}`,
        '',
        'Detailed Marks:',
        getMarksTableText(),
        `Generated on: ${new Date().toLocaleDateString('en-IN')}`
    ].join('\n');

    const blob = new Blob([resultContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result_${studentName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function printResult() {
    window.print();
}

function getMarksTableText() {
    return [...document.querySelectorAll('#marks-table tr')]
        .map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent).join(' - '))
        .join('\n');
}
