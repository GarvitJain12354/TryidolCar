import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import "../styles/ConfirmedAppointments.css";
import axios from "axios";
import Loader from "../components/Loader";
import checkicon from "../assets/check-in-icon.png";

const ConfirmedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [appointmentId, setAppointmentId] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }appointments/getAllConfirmedAppointmentsByBranchId/66addb87384b0263493328dd`
        );
        const data = response.data;
        console.log("Data from API:", data);

        const formattedAppointments = data.data.map((appointment) => ({
          serviceName: Array.isArray(appointment.services)
            ? appointment.services.map((service) => service.name)
            : appointment.services[0].name.split(", "),
          clientName: appointment.clientName || "",
          contact: appointment.mobile || "",
          dateTime: `${new Date(appointment.date).toLocaleDateString()} - ${
            appointment.time || ""
          }`,
          workerAssigned: appointment.workerId.name || "N/A",
          duration: appointment.duration || "N/A",
          checkIn: "Check in",
          appointmentId: appointment._id, // Ensure you are using the correct ID property
        }));
        setAppointments(formattedAppointments.reverse());
      } catch (error) {
        console.error("API fetching error", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchAppointments()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "serviceName",
        Cell: ({ value }) => (
          <div className="confirm-appt-service-list">
            {value.map((service, index) => (
              <span key={index} className="confirm-appt-service-item">
                {service}
              </span>
            ))}
          </div>
        ),
      },
      {
        Header: "Client Name",
        accessor: "clientName",
      },
      {
        Header: "Contact",
        accessor: "contact",
      },
      {
        Header: "Date - Time",
        accessor: "dateTime",
      },
      {
        Header: "Worker Assigned",
        accessor: "workerAssigned",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Check in",
        accessor: "checkIn",
        Cell: ({ row }) => (
          <button
            className="confirm-appt-checkin-btn"
            onClick={() => handleCheckIn(row.original)}
          >
            Check in
          </button>
        ),
      },
    ],
    []
  );

  const handleCheckIn = async (row) => {
    try {
      await axios.post(check_in_url, { apptId: row.appointmentId });
      console.log("Check In confirmed with Appointment ID:", row.appointmentId);

      // Remove the checked-in appointment from the list
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.appointmentId !== row.appointmentId
        )
      );
    } catch (error) {
      console.error("Error confirming check-in:", error);
    }
  };

  const handleManualCheckIn = async (newAppointmentId) => {
    try {
      const response = await axios.post(check_in_info, {
        apptId: newAppointmentId,
      });
      const data = response.data;
      console.log("data found -> ", data);
      if (data.success) {
        setCurrentData({
          clientName: data.name,
        });
      } else {
        console.error("No appointment found with the given ID");
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  const handleAppointmentIdChange = (e) => {
    const newAppointmentId = e.target.value;
    console.log("id types is -> ", newAppointmentId);
    setAppointmentId(newAppointmentId);
    alert(appointmentId);
    if (newAppointmentId.length === 21) {
      handleManualCheckIn(newAppointmentId);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(check_in_url, {
        apptId: appointmentId,
      });
      console.log("Check In confirmed with Appointment ID:", appointmentId);

      const newAppointment = {
        serviceName: response.data.services || [],
        clientName: response.data.name || "",
        contact: response.data.phone || "",
        dateTime: `${response.data.date || ""} - ${
          convertTo12HourFormat(response.data.time) || ""
        }`,
        workerAssigned: response.data.assignedEmployee || "",
        duration: response.data.duration
          ? convertToHoursAndMinutes(response.data.duration)
          : "",
        checkIn: "Checked in",
        appointmentId: appointmentId,
      };

      // Add the new appointment to the list and remove the modal
      setAppointments((prevAppointments) => [
        newAppointment,
        ...prevAppointments,
      ]);
      setShowModal(false);
      setAppointmentId("");
      setCurrentData({});
      window.reload();
    } catch (error) {
      console.error("Error confirming check-in:", error);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: appointments,
    });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="confirm-appointments-container">
      <div className="confirm-appointments-header">
        <h2>Confirmed Appointments</h2>
        <button
          className="confirm-appt-checkin-btn"
          onClick={() => setShowModal(true)}
        >
          Check in
        </button>
      </div>
      <table {...getTableProps()} className="confirm-appointments-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="confirm-appointments-modal-overlay">
          <div className="confirm-appointments-modal-content">
            <div className="confirm-appointments-heading">
              <img src={checkicon} alt="" />
            </div>
            <h2>Check In</h2>
            <form>
              <div>
                <label>User Check In Appointment I.D</label>
                <input
                  type="text"
                  value={appointmentId}
                  onChange={handleAppointmentIdChange}
                />
              </div>
              <div>
                <label>Client Name</label>
                <input type="text" value={currentData.clientName} readOnly />
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                className="confirm-appointments-confirm-button"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="confirm-appointments-cancel-button"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedAppointments;
