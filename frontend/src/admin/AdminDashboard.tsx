import React, { useState, useEffect, useMemo } from "react";
import { FaCircle } from "react-icons/fa";
import "./admin.css";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

interface CaseData {
  caseId: string;
  name?: string;
  location?: string;
  date?: string;
  incidentType?: string;
  status?: string;
  reporter?: string;
  category?: string;
  assignedOfficer?: string;
  submittedDate?: string;
  progress?: number;
}

const AdminDashboard: React.FC = () => {
  const [cases, setCases] = useState<CaseData[]>([]);

  useEffect(() => {
    const storedCases = JSON.parse(localStorage.getItem("cases") || "[]");
    setCases(storedCases);

    // fetch from backend API
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/admin/cases');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        // normalize data shape if needed
        const normalized = (data || []).map((c: any) => ({
          caseId: c.caseId || c.id || c._id || '#C000',
          reporter: c.reporter || c.reporterType || c.reporterName || 'Anonymous',
          category: c.category || c.incidentType || 'Unknown',
          assignedOfficer: c.assignedOfficer || c.officer || '-',
          status: c.status || 'Pending',
          submittedDate: c.submittedDate || c.date || c.createdAt || '',
          progress: typeof c.progress === 'number' ? c.progress : (c.completion || 0),
        }));
        setCases(normalized);
      } catch (err) {
        console.warn('Could not fetch /api/admin/cases', err);
      }
    };

    fetchCases();
  }, []);

  const total = cases.length;
  const newCases = cases.filter((c: any) => !c.timeline || c.timeline.length === 0).length;
  const inProgress = cases.filter((c: any) => c.status && c.status.toLowerCase().includes('progress')).length;
  const closed = cases.filter((c: any) => c.status && (c.status.toLowerCase().includes('solved') || c.status.toLowerCase().includes('resolved'))).length;

  // prepare chart datasets
  const { lineData, donutData } = useMemo(() => {
    // line: cases per day (last 14 days)
    const countsByDay: Record<string, number> = {};
    const categories: Record<string, number> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0,10);
      countsByDay[key] = 0;
    }

    cases.forEach((c: any) => {
      const dateStr = (c.submittedDate || c.date || '').slice(0,10);
      if (dateStr && countsByDay.hasOwnProperty(dateStr)) countsByDay[dateStr]++;
      // categories
      const cat = (c.category || c.incidentType || 'Unknown');
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const labels = Object.keys(countsByDay);
    const dataPoints = labels.map(l => countsByDay[l] || 0);

    const donutLabels = Object.keys(categories);
    const donutValues = donutLabels.map(l => categories[l]);

    const lineData = {
      labels,
      datasets: [
        {
          label: 'Cases per day',
          data: dataPoints,
          borderColor: '#1C4E80', // Police Blue
          backgroundColor: 'rgba(28, 78, 128, 0.1)',
          tension: 0.2,
        },
      ],
    };

    const donutData = {
      labels: donutLabels,
      datasets: [
        {
          data: donutValues,
          backgroundColor: [
            '#1E8449', // Dark Green (Success)
            '#B9770E', // Amber (Warning)
            '#922B21', // Dark Red (Danger)
            '#1C4E80', // Police Blue (Secondary)
            '#34495E', // Steel Gray (Accent)
          ],
        },
      ],
    };

    return { lineData, donutData };
  }, [cases]);

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { color: '#6b7280' } }, y: { ticks: { color: '#6b7280' } } },
  } as any;

  const donutOptions = {
    responsive: true,
    plugins: { legend: { position: 'right' as const } },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-top">
        <div className="dashboard-title">
          <h2>Police Admin Dashboard</h2>
          <p className="muted">Operational awareness and case management overview</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-cards">
        <div className="stat-card card blue">
          <div className="stat-icon">📄</div>
          <div className="stat-body">
            <div className="stat-title">Total Complaints</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">All registered complaints</div>
          </div>
        </div>

        <div className="stat-card card orange">
          <div className="stat-icon">⚡</div>
          <div className="stat-body">
            <div className="stat-title">Active Investigations</div>
            <div className="stat-value">{inProgress}</div>
            <div className="stat-sub">Ongoing cases</div>
          </div>
        </div>

        <div className="stat-card card green">
          <div className="stat-icon">✅</div>
          <div className="stat-body">
            <div className="stat-title">Solved Cases</div>
            <div className="stat-value">{closed}</div>
            <div className="stat-sub">Successfully resolved</div>
          </div>
        </div>

        <div className="stat-card card" style={{ borderLeft: "4px solid var(--warning)" }}>
          <div className="stat-icon">⏳</div>
          <div className="stat-body">
            <div className="stat-title">Pending Complaints</div>
            <div className="stat-value">{newCases}</div>
            <div className="stat-sub">Awaiting assignment</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-panel card">
          <h3>Complaints by Area</h3>
          <div style={{ height: "300px", marginTop: "16px" }}>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
        <div className="chart-panel card">
          <h3>Monthly Complaint Trend</h3>
          <div style={{ height: "300px", marginTop: "16px" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="activity-panel card">
        <div className="panel-header">
          <div className="panel-title">Recent Activity Log</div>
        </div>
        <ul className="activity-list">
          <li>
            <FaCircle style={{ fontSize: "8px", color: "var(--success)", marginRight: "8px" }} />
            New case registered - Case #C001
          </li>
          <li>
            <FaCircle style={{ fontSize: "8px", color: "var(--secondary)", marginRight: "8px" }} />
            Officer assigned to Case #C002
          </li>
          <li>
            <FaCircle style={{ fontSize: "8px", color: "var(--success)", marginRight: "8px" }} />
            Case closed - Case #C003
          </li>
        </ul>
      </div>

      {/* High Priority Alert Panel */}
      <div className="alert-panel card" style={{ borderLeft: "4px solid var(--danger)", marginBottom: "24px" }}>
        <div className="panel-header">
          <div className="panel-title">High Priority Alerts</div>
        </div>
        <div className="alert-content">
          <p><strong>Escalated Cases:</strong> 3 cases require immediate attention</p>
          <p><strong>AI-Flagged Sensitive Complaints:</strong> 2 complaints flagged by Cobot AI</p>
        </div>
      </div>
      <div className="lower-panels">
        <div className="left-chart card">
          <div className="panel-title">Cobot Chatbot Activity</div>
          <div className="cobot-grid">
            <div className="cobot-stats">
              <div className="cstat">Interactions Today<br/><strong>1,234</strong></div>
              <div className="cstat">AI Success Rate<br/><strong>92%</strong></div>
              <div className="cstat">Escalations<br/><strong>12</strong></div>
            </div>
            <div className="cobot-logs">
              <div className="log-title">Recent Chat Logs</div>
              <ul className="chat-log-list">
                <li>#C102 • Anonymous • Resolved</li>
                <li>#C110 • Registered • Escalated</li>
                <li>#C115 • Anonymous • Resolved</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="right-timeline card">
          <div className="panel-title">Analytics & Security</div>
          <div className="analytics-grid">
            <div className="chart card small"><Line data={lineData} options={lineOptions} /></div>
            <div className="chart card small"><Doughnut data={donutData} options={donutOptions} /></div>
            <div className="security card small">
              <div className="panel-title">Authentication & OTP Monitoring</div>
              <ul>
                <li>Total OTP requests today: <strong>1,042</strong></li>
                <li>Failed login attempts: <strong>8</strong></li>
                <li>Last suspicious activity: <strong>2025-12-21 18:22</strong></li>
              </ul>
              <div style={{ marginTop: 8 }}><button className="btn outline small">View Security Logs</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
