public class Employee
{
    public string Name { get; set; }
    public double HourlyWage { get; set; }
    public int HoursScheduled { get; set; }

    public Employee(string name, double hourlyWage, int hoursScheduled)
    {
        Name = name;
        HourlyWage = hourlyWage;
        HoursScheduled = hoursScheduled;
    }

    public double WeeklyPay()
    {
        if (HoursScheduled <= 40){
            return HourlyWage * HoursScheduled;
        }
            
        int otHours = HoursScheduled - 40;
        double otWage = HourlyWage * 1.5;
        return (HourlyWage * 40) + (otWage * otHours);
    }

    public void UpdateHours(int newHours)
    {
        HoursScheduled = newHours;
    }
}
