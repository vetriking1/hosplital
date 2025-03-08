import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [doctor, setDoctor] = useState({
    loginId: "",
    password: "",
    name: "",
    Doctor_ID: "",
    Specialization: "",
    Contact_Number: "",
    Department: "",
    Availability_Status: "",
  });

  const [patient, setPatient] = useState({
    Patient_ID: "",
    Name: "",
    Age: "",
    Gender: "",
    Contact_Number: "",
    Address: "",
    Blood_Group: "",
    Admission_Status: "",
  });

  const [staff, setStaff] = useState({
    Staff_ID: "",
    Name: "",
    Role: "Nurse",
    Contact_Number: "",
    Shift_Timing: "",
    Assigned_Department: "",
    Attendance_Status: "Present",
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [billers, setBillers] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [labTechs, setLabTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, billersRes, nursesRes, labTechRes] =
          await Promise.all([
            axios.get("http://192.168.109.73:3000/doctors"),
            axios.get("http://192.168.109.73:3000/patients"),
            axios.get("http://192.168.109.73:3000/biller"),
            axios.get("http://192.168.109.73:3000/nurse"),
            axios.get("http://192.168.109.73:3000/labTech"),
          ]);

        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
        setBillers(billersRes.data);
        setNurses(nursesRes.data);
        setLabTechs(labTechRes.data);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (endpoint, data, setter) => {
    try {
      await axios.post(`http://192.168.109.73:3000/users/${endpoint}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Data added successfully!");
      setter((prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, ""]))
      );
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error adding data.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Doctor Form */}
      <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("addDoctor", doctor, setDoctor);
        }}
      >
        {Object.keys(doctor).map((key) =>
          key === "Availability_Status" ? (
            <div key={key}>
              <label>Availability Status:</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="availability"
                    value="Available"
                    checked={doctor.Availability_Status === "Available"}
                    onChange={(e) =>
                      setDoctor({
                        ...doctor,
                        Availability_Status: e.target.value,
                      })
                    }
                    required
                  />
                  Available
                </label>
                <label>
                  <input
                    type="radio"
                    name="availability"
                    value="Unavailable"
                    checked={doctor.Availability_Status === "Unavailable"}
                    onChange={(e) =>
                      setDoctor({
                        ...doctor,
                        Availability_Status: e.target.value,
                      })
                    }
                    required
                  />
                  Unavailable
                </label>
              </div>
            </div>
          ) : (
            <input
              key={key}
              type="text"
              className="border p-2 w-full"
              placeholder={key}
              value={doctor[key]}
              onChange={(e) => setDoctor({ ...doctor, [key]: e.target.value })}
              required
            />
          )
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Doctor
        </button>
      </form>

      {/* Patient Form */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Add Patient</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("addPatient", patient, setPatient);
        }}
      >
        {Object.keys(patient).map((key) => (
          <input
            key={key}
            type="text"
            className="border p-2 w-full"
            placeholder={key}
            value={patient[key]}
            onChange={(e) => setPatient({ ...patient, [key]: e.target.value })}
            required
          />
        ))}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Patient
        </button>
      </form>

      {/* Staff Form */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Add Staff</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("addStaff", staff, setStaff);
        }}
      >
        {Object.keys(staff).map((key) =>
          key !== "Role" ? (
            <input
              key={key}
              type="text"
              className="border p-2 w-full"
              placeholder={key}
              value={staff[key]}
              onChange={(e) => setStaff({ ...staff, [key]: e.target.value })}
              required
            />
          ) : (
            <div>
              <select
                key={key}
                className="border p-2 w-full"
                value={staff[key]}
                onChange={(e) => setStaff({ ...staff, [key]: e.target.value })}
              >
                <option value="Nurse">Nurse</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Biller">Biller</option>
              </select>
              <br />
              <select
                key="Attendance_Status"
                className="border p-2 w-full"
                value={staff.Attendance_Status}
                onChange={(e) =>
                  setStaff({ ...staff, Attendance_Status: e.target.value })
                }
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          )
        )}
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add Staff
        </button>
      </form>
      <div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Hospital Dashboard</h1>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Doctors</h2>
                {doctors.map((doctor) => (
                  <p key={doctor.Doctor_ID}>
                    {doctor.Name} - {doctor.Specialization}
                  </p>
                ))}
              </div>
              <div className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Patients</h2>
                {patients.map((patient) => (
                  <p key={patient.Patient_ID}>
                    {patient.Name} - {patient.Age} years
                  </p>
                ))}
              </div>
              <div className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Billers</h2>
                {billers.map((biller) => (
                  <p key={biller.Staff_ID}>
                    {biller.Name} - {biller.Contact_Number}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
