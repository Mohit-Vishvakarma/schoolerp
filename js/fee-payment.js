document.addEventListener('DOMContentLoaded', async function() {
    if (window.ensureVmDataReady) {
        await window.ensureVmDataReady({ forceHydrate: true });
    }

    const paymentForm = document.getElementById('payment-form');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');

    renderFeeDetails();

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validatePaymentForm()) {
                processPayment();
            }
        });
    }

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            showPaymentMethod(this.value);
        });
    });

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
            e.target.value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
            e.target.value = value;
        });
    }
});

function getCurrentFeeStudent() {
    const auth = JSON.parse(localStorage.getItem('ssvm_auth') || 'null');
    const user = auth?.role === 'student'
        ? auth.user
        : JSON.parse(localStorage.getItem('vm_studentUser') || 'null');
    const students = JSON.parse(localStorage.getItem('vm_students') || '[]');
    if (user) {
        return students.find(student => student.id === user.id) || user;
    }
    return students[0] || null;
}

function getStudentFeeEntries(studentId) {
    return JSON.parse(localStorage.getItem('vm_feeHistory') || '[]')
        .filter(item => item.studentId === studentId)
        .sort((a, b) => String(a.quarter || '').localeCompare(String(b.quarter || '')));
}

function getStudentFeeSummary(student) {
    const entries = getStudentFeeEntries(student.id);
    const total = entries.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const paid = entries
        .filter(item => item.status === 'paid')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return {
        entries,
        total,
        paid,
        pending: Math.max(0, total - paid)
    };
}

function renderFeeDetails() {
    const detailBox = document.getElementById('fee-details');
    const amountInput = document.getElementById('amount');
    const student = getCurrentFeeStudent();

    if (!detailBox) return;
    if (!student) {
        detailBox.innerHTML = '<p>No student fee record is available right now.</p>';
        return;
    }

    const summary = getStudentFeeSummary(student);
    const currentPendingInstallment = summary.entries.find(item => item.status !== 'paid');

    detailBox.innerHTML = `
        <p>Student Name: ${student.name || '-'}</p>
        <p>Roll Number: ${student.rollNo || student.roll || '-'}</p>
        <p>Class: ${student.class || '-'}${student.section ? `-${student.section}` : ''}</p>
        <p>Total Fees: Rs ${summary.total.toLocaleString('en-IN')}</p>
        <p>Paid: Rs ${summary.paid.toLocaleString('en-IN')}</p>
        <p>Pending: Rs ${summary.pending.toLocaleString('en-IN')}</p>
        <p>Next Installment: ${currentPendingInstallment?.quarter || 'All cleared'}</p>
    `;

    if (amountInput) {
        amountInput.value = currentPendingInstallment?.amount || summary.pending || '';
        amountInput.max = String(summary.pending || 0);
    }
}

function showPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(`${method}-payment`);
    if (activeSection) activeSection.style.display = 'block';
}

function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'card';
    const amount = Number(document.getElementById('amount')?.value || 0);
    const student = getCurrentFeeStudent();

    if (!student) {
        alert('No student record found for payment.');
        return false;
    }

    const summary = getStudentFeeSummary(student);
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        return false;
    }

    if (amount > summary.pending) {
        alert('Entered amount is greater than the pending fee.');
        return false;
    }

    if (paymentMethod === 'card') {
        const cardNumber = (document.getElementById('card-number')?.value || '').replace(/\s/g, '');
        const expiry = document.getElementById('expiry')?.value || '';
        const cvv = document.getElementById('cvv')?.value || '';
        const cardName = document.getElementById('card-name')?.value || '';

        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number.');
            return false;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            alert('Please enter a valid expiry date (MM/YY).');
            return false;
        }
        if (!/^\d{3}$/.test(cvv)) {
            alert('Please enter a valid 3-digit CVV.');
            return false;
        }
        if (!cardName.trim()) {
            alert('Please enter the name on card.');
            return false;
        }
    } else if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upi-id')?.value || '';
        if (!upiId.includes('@')) {
            alert('Please enter a valid UPI ID.');
            return false;
        }
    } else if (paymentMethod === 'netbanking') {
        const bank = document.getElementById('bank')?.value || '';
        if (!bank) {
            alert('Please select a bank.');
            return false;
        }
    }

    return true;
}

function processPayment() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'card';
    const amount = Number(document.getElementById('amount')?.value || 0);
    const submitBtn = document.querySelector('#payment-form button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Pay Now';

    if (submitBtn) {
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
    }

    setTimeout(() => {
        const transactionId = `TXN${Date.now()}`;
        const paymentDate = new Date().toISOString().split('T')[0];

        updateFeeStatus(amount, paymentMethod, transactionId, paymentDate);

        document.getElementById('transaction-id').textContent = transactionId;
        document.getElementById('paid-amount').textContent = amount.toLocaleString('en-IN');
        document.getElementById('payment-date').textContent = paymentDate;
        document.getElementById('payment-success-modal').style.display = 'flex';

        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }

        document.getElementById('payment-form')?.reset();
        showPaymentMethod('card');
        renderFeeDetails();
    }, 1200);
}

function updateFeeStatus(paidAmount, paymentMethod, transactionId, paymentDate) {
    const student = getCurrentFeeStudent();
    if (!student) return;

    const feeHistory = JSON.parse(localStorage.getItem('vm_feeHistory') || '[]');
    let remainingAmount = Number(paidAmount || 0);

    feeHistory.forEach(entry => {
        if (entry.studentId !== student.id || entry.status === 'paid' || remainingAmount <= 0) return;

        const entryAmount = Number(entry.amount || 0);
        if (remainingAmount >= entryAmount) {
            entry.status = 'paid';
            entry.date = paymentDate;
            entry.paymentMethod = paymentMethod.toUpperCase();
            entry.receipt = `${transactionId}-${entry.id}`;
            remainingAmount -= entryAmount;
        }
    });

    localStorage.setItem('vm_feeHistory', JSON.stringify(feeHistory));

    const students = JSON.parse(localStorage.getItem('vm_students') || '[]');
    const studentIndex = students.findIndex(item => item.id === student.id);
    const pendingEntries = feeHistory.filter(item => item.studentId === student.id && item.status !== 'paid');
    if (studentIndex >= 0) {
        students[studentIndex].fees = pendingEntries.length ? 'pending' : 'paid';
        localStorage.setItem('vm_students', JSON.stringify(students));
    }

    const auth = JSON.parse(localStorage.getItem('ssvm_auth') || 'null');
    if (auth?.role === 'student' && auth.user?.id === student.id && studentIndex >= 0) {
        localStorage.setItem('vm_studentUser', JSON.stringify(students[studentIndex]));
        localStorage.setItem('ssvm_auth', JSON.stringify({ ...auth, user: students[studentIndex] }));
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function downloadReceipt() {
    const student = getCurrentFeeStudent();
    const transactionId = document.getElementById('transaction-id')?.textContent || '';
    const amount = document.getElementById('paid-amount')?.textContent || '';
    const date = document.getElementById('payment-date')?.textContent || '';

    const receiptContent = [
        'VIDYA MANDIR SCHOOL',
        'Fee Payment Receipt',
        '',
        `Transaction ID: ${transactionId}`,
        `Student: ${student?.name || '-'}`,
        `Student ID: ${student?.id || '-'}`,
        `Roll Number: ${student?.rollNo || student?.roll || '-'}`,
        `Amount Paid: Rs ${amount}`,
        `Date: ${date}`
    ].join('\n');

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
