using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization.Infrastructure;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();

// Loads filepath for json data, converts json data to a list for use in functions.
string dataPath = "data/employees.json";
List<Employee> staff = new();
if (File.Exists(dataPath))
{
    string json = File.ReadAllText(dataPath);
    staff = JsonSerializer.Deserialize<List<Employee>>(json) ?? new List<Employee>();

}

// Helper function for saving the staff list back to the json file
void saveStaff()
{
    File.WriteAllText(dataPath, JsonSerializer.Serialize(staff, new JsonSerializerOptions { WriteIndented = true }));
}

// GET for pulling all employee data from staff
app.MapGet("/employees", () =>
{
    return staff;
});

// GET for weekly report

app.MapGet("/report/weekly", () =>
{
    double payroll = 0;
    int otEmployees = 0;
    string otEmps = "";
    var employeeReport = new List<object>();
    

    foreach (Employee e in staff)
    {
        double pay = e.WeeklyPay();
        bool isOt = e.HoursScheduled > 40;
        
        if (isOt)
        {
            Console.WriteLine(e.Name);
            otEmps += $"{e.Name} ";
            otEmployees++;
        }

        payroll += pay;

        employeeReport.Add(new
        {
            name = e.Name,
            hourlyWage = e.HourlyWage,
            hoursScheduled = e.HoursScheduled,
            weeklyPay = pay,
            isOvertime = isOt
        });

    }

    return Results.Ok(new
    {
        totalPayroll = payroll,
        otCount = otEmployees,
        employees = employeeReport,
        otEmployees = otEmps


    });

});


// POST for adding a new employee to staff data, then save to json file
app.MapPost("/employees", (Employee newEmployee) =>
{
    staff.Add(newEmployee);
    saveStaff();
    return Results.Created($"/employees/{newEmployee.Name}", newEmployee);
});

// PUT to update the hours for named employee, then save to json file
app.MapPut("/employees/{name}", (String name, int newHours) =>
{
    Employee? found = staff.FirstOrDefault(emp => emp.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase));
    if (found is null)
    {
        return Results.NotFound($"Employee '{name}' not found.");
    }

    found.UpdateHours(newHours);
    saveStaff();
    return Results.Ok($"Updated hours: {found.HoursScheduled}");

});


// DELETE to remove an employee from staff, then save to json file
app.MapDelete("/employees/{name}", (String name) =>
{
    Employee? found = staff.FirstOrDefault(emp => emp.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase));
    if (found is null)
    {
        return Results.NotFound($"Employee '{name}' not found.");

    }

    staff.Remove(found);
    saveStaff();
    return Results.Ok(found);
});

app.MapGet("/hello", () =>
{
    return "ShiftTracker API is running.";
})
.WithName("ShiftTracker")
.WithOpenApi();

app.MapGet("/", async context =>
{
    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync("wwwroot/index.html");
});
app.Run();



