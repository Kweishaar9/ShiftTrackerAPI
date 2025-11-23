document.getElementById("loadEmployees").addEventListener("click", async () => {
    try{
        const response = await fetch("/employees");

        if (!response.ok) {
            console.error("Failed to load employees: HTTP " + response.status);
            return;
        }
        const employees = await response.json();

        const employeesUl = document.getElementById("employeesList");
        employeesUl.innerHTML = "";

        employees.forEach(emp => {
            const li = document.createElement("li");
            li.textContent = `${emp.name} | $${emp.hourlyWage}/hr | ${emp.hoursScheduled} hours scheduled`;
            employeesUl.appendChild(li);
        });
    } 

    catch (error){
        console.error("Error loading employees:", error)
    }

});


document.getElementById("loadReport").addEventListener("click", async () => {
    try{
        const response = await fetch("/report/weekly");

        if (!response.ok){
            console.error("Failed to load weekly report: HTTP " + response.status);
            return;
        }

        const report = await response.json();

        const reportDisplay = document.getElementById("reportList");
        reportDisplay.innerHTML = `<p>Total Payroll: $${report.totalPayroll}</p>
                                <p>Overtime Employees: ${report.otCount}, ${report.otEmployees}</p>`;
        
        const employeesUl = document.getElementById("reportEmployees");
        employeesUl.innerHTML = "";
        report.employees.forEach(emp => {
            const li = document.createElement("li");
            li.textContent = `${emp.name} | $${emp.weeklyPay} | ${emp.hoursScheduled} hours worked`;
            employeesUl.appendChild(li);
        });
    }

    catch (error){
        console.error("Error loading weekly report:", error);
    }


});


document.getElementById("addEmployeeForm").addEventListener("submit", async (e) =>{
    e.preventDefault();

    const name = document.getElementById("empName").value;
    const wage = parseFloat(document.getElementById("empWage").value);
    const hours = parseInt(document.getElementById("empHours").value);

    const newEmployee = {
        name: name,
        hourlyWage: wage,
        hoursScheduled: hours
    };

    try{
        const response = await fetch("/employees", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(newEmployee)
        });

        if (!response.ok){
            document.getElementById("addEmpMessage").textContent = "Error: " + response.statusText;
            return;
        }

        const result = await response.json();

        document.getElementById("addEmpMessage").textContent = `Employee '${result.name}' added successfully!`; 

        document.getElementById("addEmployeeForm").reset();

    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("addEmpMessage").textContent = "Failed to connect to server";
    }
});

document.getElementById("deleteEmpForm").addEventListener("submit", async (e) =>{
    e.preventDefault();

    const name = document.getElementById("delEmpName").value; 

    try{
        const response = await fetch(`/employees/${encodeURIComponent(name)}`, {
            method: "DELETE",
        });

        if (!response.ok){
                document.getElementById("delEmpMessage").textContent = "Error: " + response.statusText;
                return;
        }

        const result = await response.json();

        document.getElementById("delEmpMessage").textContent = `Employee '${result.name}' deleted successfuly!`;

        document.getElementById("deleteEmpForm").reset();
    } catch (error){
        console.error("Fetch error:", error)
        document.getElementById("delEmpMessage").textContent = "Failed to connect to server";
    }
});

document.getElementById("updateEmpHoursForm").addEventListener("submit", async (e) =>{
    e.preventDefault();

    const name = document.getElementById("updateEmpHoursName").value;
    const hours = parseInt(document.getElementById("updateEmpHours").value);

    try{
        const response = await fetch(`/employees/${encodeURIComponent(name)}?newHours=${encodeURIComponent(hours)}`,{
            method: "PUT",
        });

        if (!response.ok){
            document.getElementById("updateEmpHoursMessage").textContent = "Error: " + response.statusText;
            return;
        }

        document.getElementById("updateEmpHoursMessage").textContent = `Employee '${name}' hours updated to ${hours}.`;

        document.getElementById("updateEmpHoursForm").reset();

    } catch (error) {
        console.error("Fetch error:", error)
        document.getElementById("updateEmpHoursMessage").textContent = "Failed to connect to the server";
    }

});