import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        API.get("/Employee")
            .then((res) => setEmployees(res.data.data || []))
            .catch(() => console.log("Failed to load dashboard"));
    }, []);

    const departmentData = Object.values(
        employees.reduce((acc, emp) => {
            acc[emp.department] = acc[emp.department] || {
                department: emp.department,
                count: 0,
            };

            acc[emp.department].count += 1;
            return acc;
        }, {})
    );

    const totalSalary = employees.reduce(
        (sum, emp) => sum + Number(emp.salary),
        0
    );

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Dashboard</h1>
                    <p>Overview of employee records and department statistics</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>{employees.length}</h3>
                        <p>Total Employees</p>
                    </div>

                    <div className="stat-card">
                        <h3>{departmentData.length}</h3>
                        <p>Total Departments</p>
                    </div>

                    <div className="stat-card">
                        <h3>₹{totalSalary}</h3>
                        <p>Total Salary</p>
                    </div>
                </div>

                <div className="content-card">
                    <h2>Employees by Department</h2>

                    <div className="chart-box">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <XAxis dataKey="department" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;