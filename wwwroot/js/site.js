document.getElementById("loadEmployees").addEventListener("click", async () => {
    const response = await fetch("/employees");

    if (!response.ok) {
        console.error("Failed to load employees");
        return;
    }
    const employees = await response.json();

    const employeesUl = document.getElementById("employeesList");
    employeesUl.innerHTML = "";

    employees.forEach(emp => {
        const li = document.createElement("li");
        li.textContent = `${emp.name} - ${emp.hourlyWage} - ${emp.hoursScheduled}`;
        employeesUl.appendChild(li);
    });
});


document.getElementById("loadReport").addEventListener("click", async () => {
    const response = await fetch("/report/weekly");

    if (!response.ok){
        console.error("Failed to load weekly report");
        return;
    }

    const report = await response.json();

    const reportDisplay = document.getElementById("reportList");
    reportDisplay.innerHTML = `<p>Total Payroll: ${report.totalPayroll}</p>
                               <p>Overtime Employees: ${report.otCount}</p>`;
    
    const employeesUl = document.getElementById("reportEmployees");
    employeesUl.innerHTML = "";
    report.employees.forEach(emp => {
        const li = document.createElement("li");
        li.textContent = `${emp.name} - ${emp.hourlyWage} - ${emp.hoursScheduled}`;
        employeesUl.appendChild(li);
    });

});