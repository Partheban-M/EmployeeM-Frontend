import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function Employees() {
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        department: "",
        salary: "",
    });

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("");

    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [errors, setErrors] = useState({});
    const cancelEdit = () => {
        setEditingId(null);

        setFormData({
            name: "",
            department: "",
            salary: "",
        });

        setErrors({});
    };

    const getEmployees = async () => {
        try {
            setLoading(true);

            const response = await API.get("/Employee");

            setEmployees(response.data.data || []);
        } catch (error) {
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Employee name is required";
        }

        if (!formData.department.trim()) {
            newErrors.department = "Department is required";
        }

        if (!formData.salary) {
            newErrors.salary = "Salary is required";
        } else if (Number(formData.salary) <= 0) {
            newErrors.salary = "Salary must be greater than 0";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const saveEmployee = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.warning("Please fix the form errors");
            return;
        }

        try {
            const employeeData = {
                name: formData.name,
                department: formData.department,
                salary: Number(formData.salary),
            };

            if (editingId) {
                await API.put(`/Employee/${editingId}`, employeeData);

                toast.success("Employee updated successfully");
            } else {
                await API.post("/Employee", employeeData);

                toast.success("Employee added successfully");
            }

            setFormData({
                name: "",
                department: "",
                salary: "",
            });

            setEditingId(null);

            getEmployees();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const deleteEmployee = async () => {
        try {
            await API.delete(`/Employee/${deleteId}`);

            toast.success("Employee deleted successfully");

            setDeleteId(null);
            getEmployees();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const editEmployee = (emp) => {
        setFormData({
            name: emp.name,
            department: emp.department,
            salary: emp.salary,
        });

        setEditingId(emp.id);
    };

    const departments = [
        "All",
        ...new Set(employees.map((emp) => emp.department)),
    ];

    const filteredEmployees = employees
        .filter((emp) => {
            const matchesSearch =
                emp.name.toLowerCase().includes(search.toLowerCase()) ||
                emp.department.toLowerCase().includes(search.toLowerCase());

            const matchesDepartment =
                departmentFilter === "All" ||
                emp.department === departmentFilter;

            return matchesSearch && matchesDepartment;
        })
        .sort((a, b) => {
            if (sortOrder === "lowToHigh") {
                return a.salary - b.salary;
            }

            if (sortOrder === "highToLow") {
                return b.salary - a.salary;
            }

            return 0;
        });
    const exportToCSV = () => {
        if (employees.length === 0) {
            toast.warning("No employees to export");
            return;
        }

        const headers = ["Name", "Department", "Salary"];

        const rows = employees.map((emp) => [
            emp.name,
            emp.department,
            emp.salary,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "employees.csv";
        link.click();

        URL.revokeObjectURL(url);

        toast.success("Employee data exported");
    };

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Employee Management</h1>

                        <p>
                            Professional Employee Administration Dashboard
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>{employees.length}</h3>

                        <p>Total Employees</p>
                    </div>

                    <div className="stat-card">
                        <h3>
                            {
                                new Set(
                                    employees.map((emp) => emp.department)
                                ).size
                            }
                        </h3>

                        <p>Departments</p>
                    </div>
                </div>

                <div className="content-card">
                    <h2>
                        {editingId
                            ? "Update Employee"
                            : "Add New Employee"}
                    </h2>

                    <form
                        onSubmit={saveEmployee}
                        className="employee-form"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Employee Name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={formData.department}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={formData.salary}
                            onChange={handleChange}
                        />

                        <div className="form-buttons">
                            <button type="submit" className="primary-btn">
                                {editingId ? "Update" : "Add Employee"}
                            </button>

                            {editingId && (
                                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="content-card">
                    <div className="table-header">
                        <h2>Employee List</h2>

                        <div className="table-actions">
                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input"
                            />

                            <select
                                className="filter-select"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="filter-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="">Sort Salary</option>
                                <option value="lowToHigh">Low to High</option>
                                <option value="highToLow">High to Low</option>
                            </select>

                            <button className="export-btn" onClick={exportToCSV}>
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading employees...</p>
                    ) : filteredEmployees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>{emp.name}</td>

                                        <td>{emp.department}</td>

                                        <td>₹{emp.salary}</td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    editEmployee(emp)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => setDeleteId(emp.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {deleteId && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Delete Employee?</h2>
                        <p>This action cannot be undone.</p>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteId(null)}>
                                Cancel
                            </button>

                            <button className="delete-btn" onClick={deleteEmployee}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Employees;