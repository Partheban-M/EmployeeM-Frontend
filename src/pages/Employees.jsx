import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function Employees() {
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        department: "",
        salary: "",
    });

    const [editingId, setEditingId] = useState(null);

    const getEmployees = async () => {
        const response = await API.get("/Employee");
        setEmployees(response.data.data);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const addEmployee = async (e) => {
        e.preventDefault();

        if (editingId) {
            await API.put(`/Employee/${editingId}`, {
                name: formData.name,
                department: formData.department,
                salary: Number(formData.salary),
            });

            setEditingId(null);
        } else {
            await API.post("/Employee", {
                name: formData.name,
                department: formData.department,
                salary: Number(formData.salary),
            });
        }

        setFormData({
            name: "",
            department: "",
            salary: "",
        });

        getEmployees();
    };

    const deleteEmployee = async (id) => {
        await API.delete(`/Employee/${id}`);
        getEmployees();
    };

    const editEmployee = (emp) => {
        setFormData({
            name: emp.name,
            department: emp.department,
            salary: emp.salary,
        });

        setEditingId(emp.id);
    };

    useEffect(() => {
        getEmployees();
    }, []);

    return (
        <div className="container">
            <Navbar />

            <h1>Employee Management</h1>

            <form onSubmit={addEmployee}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="salary"
                    placeholder="Enter salary"
                    value={formData.salary}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editingId ? "Update Employee" : "Add Employee"}
                </button>
            </form>

            {employees.map((emp) => (
                <div key={emp.id} className="card">
                    <h3>{emp.name}</h3>

                    <p>{emp.department}</p>

                    <p>{emp.salary}</p>

                    <button onClick={() => editEmployee(emp)}>
                        Edit
                    </button>

                    <button onClick={() => deleteEmployee(emp.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Employees;