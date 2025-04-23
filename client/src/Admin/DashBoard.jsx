import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "./NavBar";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

function DashBoard({ theme, toggleTheme, handleLogout }) {
  const [paymentStats, setPaymentStats] = useState([]);
  const [sessionStats, setSessionStats] = useState([]);
  const [categorySeverityData, setCategorySeverityData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/admin/stats").then((res) => {
      const { payments, sessions, severity_distribution } = res.data;
      setPaymentStats([
        { status: "Completed", count: payments.completed },
        { status: "Pending", count: payments.pending },
      ]);
      setSessionStats([
        { label: "Total", count: sessions.total },
        { label: "Paid", count: sessions.paid },
        { label: "Unpaid", count: sessions.unpaid },
        { label: "Completed", count: sessions.completed },
      ]);
      const severityList = Object.entries(severity_distribution).map(
        ([label, count]) => ({ label, count })
      );
      setCategorySeverityData(severityList);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
      />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStats}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >
                  {paymentStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sessions Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Severity by Category</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categorySeverityData}
                  dataKey="count"
                  nameKey="label"
                  outerRadius={130}
                  label
                >
                  {categorySeverityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
