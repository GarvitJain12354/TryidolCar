import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import "../styles/PendingAppointment.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Modal } from "antd";
import { Divider, Radio, Table } from 'antd';
const { Column, ColumnGroup } = Table;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sydney No. 1 Lake Park',
  },
];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};
const PendingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [employeeName, setEmployeeName] = useState({});
  const [selectionType, setSelectionType] = useState('radio');

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }appointments/getAllPendingAppointmentsByBranchId/66addb87384b0263493328dd`
        );

        const data = response.data;
        console.log(data, 123);
        const formattedAppointments = data.data.map((appointment, index) => ({
          serialNumber: index + 1,
          serviceName: Array.isArray(appointment.services)
            ? appointment.services.map((service) => service.name)
            : [],
          clientName: appointment.clientName || "",
          contact: appointment.mobile || "",
          dateTime: `${new Date(appointment.date).toLocaleDateString()} - ${
            convertTo12HourFormat(appointment.time) || ""
          }`,
          workerName: appointment.workerId.name || "",
          duration: appointment.duration || "N/A",
          cancel: "Cancel",
        }));

        setAppointments(formattedAppointments);
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

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const adjustedHour = hourInt % 12 || 12;
    return `${adjustedHour}:${
      minuteInt < 10 ? `0${minuteInt}` : minuteInt
    } ${ampm}`;
  };

  const convertToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours}h `;
    }
    if (remainingMinutes > 0) {
      result += `${remainingMinutes}m`;
    }
    return result.trim(); // Remove any trailing whitespace
  };

  const handleCancelClick = async (apptId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}appointments/cancel`, {
        apptId,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.apptId !== apptId)
      );
      console.log(`Appointment with ID ${apptId} cancelled successfully`);
    } catch (error) {
      console.error(`Error cancelling appointment with ID ${apptId}`, error);
    }
  };

  const handleAssignClick = async (apptId, prefEmployee) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}appointments/assign`, {
        apptId,
        prefEmployee,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.apptId !== apptId)
      );
      console.log(
        `Appointment with ID ${apptId} assigned to employee ${prefEmployee} successfully`
      );
    } catch (error) {
      console.error(`Error assigning appointment with ID ${apptId}`, error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr. No.",
        accessor: "serialNumber",
      },
      {
        Header: "Service Name",
        accessor: "serviceName",
        Cell: ({ value }) => (
          <div className="pending-appt-service-list">
            {value.map((service, index) => (
              <span key={index} className="pending-appt-service-item">
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
        Header: "Preferred Worker",
        accessor: "workerName",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Assign Worker",
        accessor: "assignEmployee",
        Cell: <button onClick={showModal} className="pending-appt-assign-select">Assign <i class="ri-arrow-down-s-line"></i></button>,
      },
      // {
      //   Header: "Cancel",
      //   accessor: "cancel",
      //   Cell: ({ row }) => (
      //     <button
      //       className="pending-appt-cancel-btn"
      //       onClick={() => handleCancelClick(row.original.apptId)}
      //     >
      //       Cancel
      //     </button>
      //   ),
      // },
    ],
    [employeeName]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: appointments,
    });

  if (loading) {
    return <Loader />; // Display the loader while fetching data
  }

  return (
    <div className="pending-appointments-container">
      <div className="pending-appointments-header">
        <h2>Pending Appointments</h2>
        <NavLink to="/AppointmentForm" className="navlink">
          <button className="pending-add-appointment-btn">
            Add a new Appointment
          </button>
        </NavLink>
      </div>
      <table {...getTableProps()} className="pending-appointments-table">
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
      <Stack
        spacing={2}
        style={{ width: "100%", display: "flex", alignItems: "center",marginTop:"2vw" }}
      >
        <Pagination count={10} color="primary" />
      </Stack>
      <Modal centered title="Assign Worker" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <div>

      <Divider />
      <ColumnGroup title="Name">
      <Column title="First Name" dataIndex="firstName" key="firstName" />
      <Column title="Last Name" dataIndex="lastName" key="lastName" />
    </ColumnGroup>
    <Column title="Age" dataIndex="age" key="age" />
    <Column title="Address" dataIndex="address" key="address" />
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
      
    </div>
      </Modal>
    </div>
  );
};

export default PendingAppointment;
