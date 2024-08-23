import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/AdminDashboard.css";
import Cards from "../components/Cards";
import ApptDashCards from "../components/ApptDashCards";
import Loader from "../components/Loader";
import booking from "../assets/booking.png";
import week_booking from "../assets/week_booking.png";
import sales from "../assets/sales.png";
import AdminSalesChart from "../components/AdminSalesChart";
import axios from "axios";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const AdminDashboard = () => {
  const [panelData, setPanelData] = useState([]);
  const [apptDashCardsData, setApptDashCardsData] = useState([]);
  const [services, setServices] = useState([]);
  const [weeklyRecord, setWeeklyRecord] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const apiUrl =
        `${
            import.meta.env.VITE_BASE_URL
          }appointments/getAllAppointmentByBranchId/66addb87384b0263493328dd`;
      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log(data);
        if (data.success) {
          // Get today's date
          const today = new Date();
          const todayString = today.toISOString().split("T")[0];

          // Calculate the start and end of the current week (Monday to Sunday)
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
          const endOfWeek = new Date(today);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

          const startOfWeekString = startOfWeek.toISOString().split("T")[0];
          const endOfWeekString = endOfWeek.toISOString().split("T")[0];

          // Filter appointments created today
          const todaysAppointments = data.data.filter((appointment) => {
            const createdAtDate = new Date(appointment.createdAt)
              .toISOString()
              .split("T")[0];
            return createdAtDate === todayString;
          });

          // Filter appointments created this week
          const weeklyAppointments = data.data.filter((appointment) => {
            const createdAtDate = new Date(appointment.createdAt)
              .toISOString()
              .split("T")[0];
            return (
              createdAtDate >= startOfWeekString &&
              createdAtDate <= endOfWeekString
            );
          });

          // Calculate the number of appointments by status
          const statusCounts = {
            PENDING: 0,
            CONFIRMED: 0,
            "CHECK IN": 0,
            PAID: 0,
          };

          data.data.forEach((appointment) => {
            if (statusCounts[appointment.status] !== undefined) {
              statusCounts[appointment.status]++;
            }
          });

          setPanelData([
            {
              id: "1",
              heading: "Today Booking",
              img: booking,
              panelinfo: todaysAppointments.length || 0,
            },
            {
              id: "2",
              heading: "Week Booking",
              img: week_booking,
              panelinfo: weeklyAppointments.length || 0,
            },
            {
              id: "3",
              heading: "Total Sales",
              img: sales,
              panelinfo: data.all_sales || 0,
            },
            {
              id: "4",
              heading: "Weekly Sales",
              img: sales,
              panelinfo: data.weekly_sales || 0,
            },
          ]);

          setApptDashCardsData([
            {
              status: "Pending Appointment",
              count: statusCounts.PENDING || 0,
              color: "#8280FF",
            },
            {
              status: "Confirmed Appointment",
              count: statusCounts.CONFIRMED || 0,
              color: "#FEC53D",
            },
            {
              status: "Checkin Appointment",
              count: statusCounts["CHECK IN"] || 0,
              color: "#4AD991",
            },
            {
              status: "Paid Appointment",
              count: statusCounts.PAID || 0,
              color: "#A6B5FF",
            },
          ]);

          const serviceList = Object.entries(data.items_overview || {}).map(
            ([name, sales]) => ({
              name,
              sales,
              color: getRandomColor(),
            })
          );
          setServices(serviceList);

          setWeeklyRecord(data.weeklyRecord || {});
        } else {
          console.error("API fetch unsuccessful");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-heading">
        <h3>Sales Dashboard</h3>
      </div>
      <div className="dashboard-panel">
        {panelData.map((data) => (
          <Cards
            key={data.id}
            heading={data.heading}
            img={data.img}
            values={[data.panelinfo]}
          />
        ))}
      </div>
      <div className="dashboard-cards-panel2">
        {apptDashCardsData.map((data, index) => (
          <ApptDashCards
            key={index}
            status={data.status}
            count={data.count}
            color={data.color}
          />
        ))}
      </div>
      <div className="admin-sales-chart-section">
        <div className="admin-sales-chart-box">
          <AdminSalesChart
            totalSales={
              panelData.find((item) => item.heading === "Total Sales")
                ?.panelinfo || 0
            }
            weeklyRecord={weeklyRecord}
          />
        </div>
        <div className="admin-service-list-box">
          <div className="admin-services-list">
            <h4>Services</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index}>
                    <td>{service.name}</td>
                    <td>
                      <span
                        className="admin-sales-percentage"
                        style={{ backgroundColor: service.color }}
                      >
                        {service.sales}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
