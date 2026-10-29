/* ============================= */
/* ATTENDANCE */
/* ============================= */

let attendanceData = {};


/* Mark Present / Absent */

function markAttendance(button, status) {

    const row = button.closest("tr");

    const rollNumber = row.cells[0].innerText;

    const presentButton = row.querySelector(".present-btn");
    const absentButton = row.querySelector(".absent-btn");

    presentButton.classList.remove("selected");
    absentButton.classList.remove("selected");

    button.classList.add("selected");

    attendanceData[rollNumber] = status;

    updateAttendanceSummary();
}


/* Update Summary */

function updateAttendanceSummary() {

    let present = 0;
    let absent = 0;

    Object.values(attendanceData).forEach(function(status) {

        if (status === "present") {
            present++;
        }

        if (status === "absent") {
            absent++;
        }

    });


    document.getElementById("presentCount").innerText = present;

    document.getElementById("absentCount").innerText = absent;


    let total = present + absent;

    if (total > 0) {

        let percentage = Math.round((present / total) * 100);

        document.getElementById("attendancePercentage").innerText =
            percentage + "%";

    } else {

        document.getElementById("attendancePercentage").innerText = "0%";

    }
}


/* Search Attendance */

function searchAttendance() {

    const search =
        document.getElementById("attendanceSearch").value.toLowerCase();

    const rows =
        document.querySelectorAll("#attendanceTable tbody tr");

    rows.forEach(function(row) {

        const name = row.cells[1].innerText.toLowerCase();

        const roll = row.cells[0].innerText.toLowerCase();

        if (name.includes(search) || roll.includes(search)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });
}


/* Save Attendance */

function saveAttendance() {

    const date =
        document.getElementById("attendanceDate").value;

    if (!date) {

        alert("Please select attendance date.");

        return;
    }


    localStorage.setItem(
        "attendance_" + date,
        JSON.stringify(attendanceData)
    );


    alert("Attendance saved successfully!");
}

/* ============================= */
/* PERFORMANCE */
/* ============================= */

function calculateResult() {

    const inputs = document.querySelectorAll(".marks-input");

    let total = 0;

    inputs.forEach(function(input) {

        let marks = Number(input.value);

        if (marks < 0) {
            input.value = 0;
            marks = 0;
        }

        if (marks > 100) {
            input.value = 100;
            marks = 100;
        }

        total += marks;
    });


    const maximum = inputs.length * 100;

    const percentage = (total / maximum) * 100;


    let grade = "";

    if (percentage >= 90) {
        grade = "A+";
    }
    else if (percentage >= 80) {
        grade = "A";
    }
    else if (percentage >= 70) {
        grade = "B";
    }
    else if (percentage >= 60) {
        grade = "C";
    }
    else if (percentage >= 50) {
        grade = "D";
    }
    else {
        grade = "F";
    }


    let result = percentage >= 33 ? "PASS" : "FAIL";


    document.getElementById("totalMarks").innerText =
        total + " / " + maximum;

    document.getElementById("percentage").innerText =
        percentage.toFixed(2) + "%";

    document.getElementById("grade").innerText =
        grade;

    document.getElementById("resultStatus").innerText =
        result;
}


function savePerformance() {

    const student =
        document.getElementById("studentSelect").value;

    if (student === "") {

        alert("Please select a student.");

        return;
    }


    const resultData = {

        student: student,

        className:
            document.getElementById("performanceClass").value,

        exam:
            document.getElementById("examType").value,

        total:
            document.getElementById("totalMarks").innerText,

        percentage:
            document.getElementById("percentage").innerText,

        grade:
            document.getElementById("grade").innerText,

        result:
            document.getElementById("resultStatus").innerText
    };


    localStorage.setItem(
        "performance_" + student,
        JSON.stringify(resultData)
    );


    alert("Performance saved successfully!");
}

/* ========================================
   FEES MANAGEMENT
======================================== */

function calculateFee() {

    let total =
        Number(document.getElementById("totalFee").value) || 0;

    let paid =
        Number(document.getElementById("paidFee").value) || 0;


    /* Prevent paid amount from exceeding total */

    if (paid > total) {
        paid = total;

        document.getElementById("paidFee").value = total;
    }


    let pending = total - paid;


    /* Update input */

    document.getElementById("pendingFee").value =
        pending;


    /* Update cards */

    document.getElementById("totalFeeDisplay").innerText =
        "₹" + total.toLocaleString("en-IN");

    document.getElementById("paidFeeDisplay").innerText =
        "₹" + paid.toLocaleString("en-IN");

    document.getElementById("pendingFeeDisplay").innerText =
        "₹" + pending.toLocaleString("en-IN");


    /* Determine status */

    let status = "Pending";

    if (total > 0 && paid === total) {
        status = "Paid";
    }
    else if (paid > 0 && paid < total) {
        status = "Partial";
    }


    document.getElementById("paymentStatus").value =
        status;


    document.getElementById("feeStatusDisplay").innerText =
        status;
}


/* Save Fee */

function saveFee() {

    const student =
        document.getElementById("feeStudent").value;


    if (student === "") {

        alert("Please select a student.");

        return;
    }


    const total =
        Number(document.getElementById("totalFee").value) || 0;

    const paid =
        Number(document.getElementById("paidFee").value) || 0;


    if (total <= 0) {

        alert("Please enter total fee.");

        return;
    }


    const feeData = {

        student: student,

        className:
            document.getElementById("feeClass").value,

        feeType:
            document.getElementById("feeType").value,

        date:
            document.getElementById("paymentDate").value,

        total: total,

        paid: paid,

        pending: total - paid,

        status:
            document.getElementById("paymentStatus").value
    };


    localStorage.setItem(
        "fee_" + student,
        JSON.stringify(feeData)
    );


    alert("Fee payment saved successfully!");
}

javascript
/* ============================= */
/* CLASS ROUTINE */
/* ============================= */

let routineData =
    JSON.parse(localStorage.getItem("eduVaultRoutine")) || [];

let editingRoutineIndex = -1;


/* ============================= */
/* ADD ROUTINE */
/* ============================= */

function addRoutine() {

    const className =
        document.getElementById("routineClass").value;

    const day =
        document.getElementById("routineDay").value;

    const period =
        document.getElementById("routinePeriod").value;

    const subject =
        document.getElementById("routineSubject").value.trim();

    const teacher =
        document.getElementById("routineTeacher").value.trim();

    const room =
        document.getElementById("routineRoom").value.trim();

    const startTime =
        document.getElementById("routineStartTime").value;

    const endTime =
        document.getElementById("routineEndTime").value;


    /* ============================= */
    /* VALIDATION */
    /* ============================= */

    if (
        className === "" ||
        day === "" ||
        period === "" ||
        subject === "" ||
        teacher === "" ||
        room === "" ||
        startTime === "" ||
        endTime === ""
    ) {

        alert("Please fill all routine details.");

        return;
    }


    if (startTime >= endTime) {

        alert("End time must be after start time.");

        return;
    }


    const routine = {

        className: className,

        day: day,

        period: period,

        subject: subject,

        teacher: teacher,

        room: room,

        startTime: startTime,

        endTime: endTime

    };


    /* ============================= */
    /* EDIT EXISTING */
    /* ============================= */

    if (editingRoutineIndex !== -1) {

        routineData[editingRoutineIndex] = routine;

        editingRoutineIndex = -1;

        document.querySelector(
            ".routine-add-btn"
        ).innerText = "+ Add Routine";

        alert("Routine updated successfully!");

    }

    /* ============================= */
    /* ADD NEW */
    /* ============================= */

    else {

        routineData.push(routine);

        alert("Routine added successfully!");

    }


    /* ============================= */
    /* SAVE */
    /* ============================= */

    localStorage.setItem(
        "eduVaultRoutine",
        JSON.stringify(routineData)
    );


    clearRoutineForm();

    displayRoutine();
}


/* ============================= */
/* DISPLAY ROUTINE */
/* ============================= */

function displayRoutine() {

    const tableBody =
        document.getElementById("routineTableBody");

    if (!tableBody) {
        return;
    }


    const filter =
        document.getElementById(
            "filterRoutineClass"
        ).value;


    tableBody.innerHTML = "";


    let filteredData = routineData;


    if (filter !== "All") {

        filteredData =
            routineData.filter(
                function(item) {

                    return item.className === filter;

                }
            );

    }


    /* ============================= */
    /* EMPTY DATA */
    /* ============================= */

    if (filteredData.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-routine">
                    No routine added yet.
                </td>
            </tr>
        `;

        return;
    }


    /* ============================= */
    /* DAY ORDER */
    /* ============================= */

    const dayOrder = {

        "Monday": 1,

        "Tuesday": 2,

        "Wednesday": 3,

        "Thursday": 4,

        "Friday": 5,

        "Saturday": 6

    };


    filteredData.sort(
        function(a, b) {

            return (
                dayOrder[a.day] -
                dayOrder[b.day]
            );

        }
    );


    /* ============================= */
    /* CREATE TABLE ROWS */
    /* ============================= */

    filteredData.forEach(
        function(item) {

            const originalIndex =
                routineData.indexOf(item);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${item.className}
                </td>

                <td>
                    ${item.day}
                </td>

                <td>
                    ${item.period}
                </td>

                <td>
                    <strong>
                        ${item.subject}
                    </strong>
                </td>

                <td>
                    ${item.teacher}
                </td>

                <td>
                    ${item.room}
                </td>

                <td>
                    ${formatTime(item.startTime)}
                    -
                    ${formatTime(item.endTime)}
                </td>

                <td>

                    <button
                        class="routine-edit-btn"
                        onclick="editRoutine(${originalIndex})"
                    >
                        Edit
                    </button>

                    <button
                        class="routine-delete-btn"
                        onclick="deleteRoutine(${originalIndex})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );
}


/* ============================= */
/* EDIT ROUTINE */
/* ============================= */

function editRoutine(index) {

    const item =
        routineData[index];


    document.getElementById(
        "routineClass"
    ).value = item.className;


    document.getElementById(
        "routineDay"
    ).value = item.day;


    document.getElementById(
        "routinePeriod"
    ).value = item.period;


    document.getElementById(
        "routineSubject"
    ).value = item.subject;


    document.getElementById(
        "routineTeacher"
    ).value = item.teacher;


    document.getElementById(
        "routineRoom"
    ).value = item.room;


    document.getElementById(
        "routineStartTime"
    ).value = item.startTime;


    document.getElementById(
        "routineEndTime"
    ).value = item.endTime;


    editingRoutineIndex = index;


    document.querySelector(
        ".routine-add-btn"
    ).innerText = "Update Routine";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ============================= */
/* DELETE ROUTINE */
/* ============================= */

function deleteRoutine(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this routine?"
        );


    if (!confirmDelete) {

        return;

    }


    routineData.splice(index, 1);


    localStorage.setItem(
        "eduVaultRoutine",
        JSON.stringify(routineData)
    );


    displayRoutine();

}


/* ============================= */
/* CLEAR FORM */
/* ============================= */

function clearRoutineForm() {

    document.getElementById(
        "routineClass"
    ).value = "";

    document.getElementById(
        "routineDay"
    ).value = "";

    document.getElementById(
        "routinePeriod"
    ).value = "";

    document.getElementById(
        "routineSubject"
    ).value = "";

    document.getElementById(
        "routineTeacher"
    ).value = "";

    document.getElementById(
        "routineRoom"
    ).value = "";

    document.getElementById(
        "routineStartTime"
    ).value = "";

    document.getElementById(
        "routineEndTime"
    ).value = "";

}


/* ============================= */
/* FORMAT TIME */
/* ============================= */

function formatTime(time) {

    if (!time) {
        return "";
    }


    const parts =
        time.split(":");


    let hour =
        parseInt(parts[0]);

    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return (
        hour +
        ":" +
        minute +
        " " +
        period
    );

}


/* ============================= */
/* LOAD ROUTINE */
/* ============================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayRoutine();

    }
)

/* ============================= */
/* REPORTS & ANALYTICS */
/* ============================= */

function readStorage(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function getStudentRecords() {
    const possibleKeys = [
        "students",
        "studentData",
        "eduVaultStudents"
    ];

    for (const key of possibleKeys) {
        const value = readStorage(key);

        if (Array.isArray(value)) {
            return value;
        }
    }

    return [];
}

function getSavedRecords(prefix) {
    const records = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (!key || !key.startsWith(prefix)) {
            continue;
        }

        const value = readStorage(key);

        if (value && typeof value === "object") {
            records.push({
                storageKey: key,
                ...value
            });
        }
    }

    return records;
}

function getAttendanceRecords() {
    const records = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (!key || !key.startsWith("attendance_")) {
            continue;
        }

        const value = readStorage(key);

        if (value && typeof value === "object") {
            records.push({
                date: key.replace("attendance_", ""),
                attendance: value
            });
        }
    }

    return records;
}

function updateReportStats() {
    const students = getStudentRecords();
    const attendance = getAttendanceRecords();
    const performance = getSavedRecords("performance_");
    const fees = getSavedRecords("fee_");

    const attendanceCount = attendance.reduce(
        (total, record) =>
            total + Object.keys(record.attendance).length,
        0
    );

    const studentElement = document.getElementById("reportStudents");
    const attendanceElement = document.getElementById("reportAttendance");
    const performanceElement = document.getElementById("reportPerformance");
    const feesElement = document.getElementById("reportFees");

    if (!studentElement) return;

    studentElement.textContent = students.length;
    attendanceElement.textContent = attendanceCount;
    performanceElement.textContent = performance.length;
    feesElement.textContent = fees.length;
}

function generateReport() {
    const type = document.getElementById("reportType").value;
    const selectedClass = document.getElementById("reportClass").value;

    const head = document.getElementById("reportTableHead");
    const body = document.getElementById("reportTableBody");
    const title = document.getElementById("reportTableTitle");
    const description = document.getElementById("reportDescription");

    let columns = [];
    let rows = [];

    if (type === "students") {
        title.textContent = "Student Records";
        columns = ["Student ID", "Name", "Class", "Details"];

        rows = getStudentRecords()
            .filter(student => {
                const className = student.className || student.class || "";
                return selectedClass === "all" ||
                    className === selectedClass;
            })
            .map(student => [
                student.rollNumber || student.studentId || student.id || "—",
                student.name || student.studentName || "—",
                student.className || student.class || "—",
                student.email || student.phone || "—"
            ]);
    }

    if (type === "attendance") {
        title.textContent = "Attendance Report";
        columns = ["Date", "Student ID", "Status"];

        rows = getAttendanceRecords().flatMap(record =>
            Object.entries(record.attendance).map(([studentId, status]) => [
                record.date,
                studentId,
                String(status)
            ])
        );
    }

    if (type === "performance") {
        title.textContent = "Academic Performance";
        columns = ["Student", "Class", "Exam", "Total", "Percentage", "Grade", "Result"];

        rows = getSavedRecords("performance_")
            .filter(record =>
                selectedClass === "all" ||
                (record.className || record.class || "") === selectedClass
            )
            .map(record => [
                record.student || "—",
                record.className || record.class || "—",
                record.exam || "—",
                record.total || "—",
                record.percentage || "—",
                record.grade || "—",
                record.result || "—"
            ]);
    }

    if (type === "fees") {
        title.textContent = "Fee Report";
        columns = ["Student", "Class", "Fee Type", "Date", "Total", "Paid", "Pending", "Status"];

        rows = getSavedRecords("fee_")
            .filter(record =>
                selectedClass === "all" ||
                (record.className || record.class || "") === selectedClass
            )
            .map(record => [
                record.student || "—",
                record.className || record.class || "—",
                record.feeType || "—",
                record.date || "—",
                formatRupees(record.total),
                formatRupees(record.paid),
                formatRupees(record.pending),
                record.status || "—"
            ]);
    }

    head.replaceChildren();
    body.replaceChildren();

    const headerRow = document.createElement("tr");

    columns.forEach(column => {
        const th = document.createElement("th");
        th.textContent = column;
        headerRow.appendChild(th);
    });

    head.appendChild(headerRow);

    if (rows.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = columns.length;
        cell.className = "report-empty";
        cell.textContent = "No records found. Add and save records first.";

        row.appendChild(cell);
        body.appendChild(row);
    } else {
        rows.forEach(values => {
            const row = document.createElement("tr");

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = String(value ?? "—");
                row.appendChild(cell);
            });

            body.appendChild(row);
        });
    }

    description.textContent = `${rows.length} record(s) found.`;
    updateReportStats();
}

function formatRupees(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "—";
    }

    return "₹" + amount.toLocaleString("en-IN");
}

function downloadReportCSV() {
    const table = document.querySelector(".report-table");

    if (!table || !table.rows.length) {
        alert("Generate a report first.");
        return;
    }

    const csvRows = Array.from(table.rows).map(row =>
        Array.from(row.cells).map(cell => {
            const value = cell.innerText.replace(/"/g, '""');
            return `"${value}"`;
        }).join(",")
    );

    const blob = new Blob(
        ["\uFEFF" + csvRows.join("\r\n")],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "EduVault_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("reportTableBody")) {
        updateReportStats();
        generateReport();
    }
});

```javascript
/* ============================= */
/* SETTINGS */
/* ============================= */

const settingsStorageKey = "eduVaultSettings";

function loadSettings() {
    const form = document.getElementById("settingsForm");

    if (!form) return;

    let settings = {};

    try {
        settings = JSON.parse(
            localStorage.getItem(settingsStorageKey)
        ) || {};
    } catch (error) {
        settings = {};
    }

    const fields = [
        "schoolName",
        "schoolEmail",
        "schoolPhone",
        "schoolAddress",
        "academicYear",
        "passingPercentage",
        "gradingSystem",
        "themePreference"
    ];

    fields.forEach(id => {
        const field = document.getElementById(id);

        if (field && settings[id] !== undefined) {
            field.value = settings[id];
        }
    });
}

function saveSettings(event) {
    event.preventDefault();

    const settings = {
        schoolName: document.getElementById("schoolName").value.trim(),
        schoolEmail: document.getElementById("schoolEmail").value.trim(),
        schoolPhone: document.getElementById("schoolPhone").value.trim(),
        schoolAddress: document.getElementById("schoolAddress").value.trim(),
        academicYear: document.getElementById("academicYear").value,
        passingPercentage: Number(
            document.getElementById("passingPercentage").value
        ),
        gradingSystem: document.getElementById("gradingSystem").value,
        themePreference: document.getElementById("themePreference").value
    };

    if (
        !settings.schoolName ||
        settings.passingPercentage < 1 ||
        settings.passingPercentage > 100
    ) {
        alert("Enter a school name and a passing percentage from 1 to 100.");
        return;
    }

    localStorage.setItem(
        settingsStorageKey,
        JSON.stringify(settings)
    );

    const message = document.getElementById("settingsMessage");
    message.textContent = "Settings saved successfully in this browser.";

    setTimeout(() => {
        if (message) message.textContent = "";
    }, 4000);
}

function resetSettings() {
    const form = document.getElementById("settingsForm");

    if (!form) return;

    form.reset();
    loadSettings();

    const message = document.getElementById("settingsMessage");
    message.textContent = "Saved settings have been reloaded.";
}

document.addEventListener("DOMContentLoaded", function () {
    const settingsForm = document.getElementById("settingsForm");

    if (settingsForm) {
        loadSettings();
        settingsForm.addEventListener("submit", saveSettings);
    }
});
```
