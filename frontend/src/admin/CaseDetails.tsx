import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./admin.css";

interface CaseData {
  caseId: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  date: string;
  incidentType: string;
  details: string;
  attachmentUrls?: string[];
  status: "In Progress" | "Solved" | "Not Solved";
  timeline?: { date: string; text: string }[];
}

const CaseDetails: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const storedCases: CaseData[] = JSON.parse(localStorage.getItem("cases") || "[]");

  const [caseData, setCaseData] = React.useState<CaseData | null>(() => {
    return storedCases.find((x) => x.caseId === caseId) || null;
  });

  const [newStatus, setNewStatus] = React.useState<CaseData["status"]>("In Progress");

  React.useEffect(() => {
    if (caseData) setNewStatus(caseData.status);
  }, [caseData]);

  const persist = (updated: CaseData) => {
    const all: CaseData[] = JSON.parse(localStorage.getItem("cases") || "[]");
    const updatedAll = all.map(a => (a.caseId === updated.caseId ? updated : a));
    localStorage.setItem("cases", JSON.stringify(updatedAll));
    setCaseData(updated);
  };

  const handleUpdateStatus = () => {
    if (!caseData) return;
    const updated: CaseData = { ...caseData, status: newStatus };
    persist(updated);
  };

  const handleAssignOfficer = () => {
    if (!caseData) return;
    const officer = prompt("Enter officer ID/name to assign:");
    if (!officer) return;
    const updated: CaseData = { ...caseData, timeline: [...(caseData.timeline || []), { date: new Date().toLocaleString(), text: `Assigned to ${officer}` }] };
    persist(updated);
    alert(`Assigned to ${officer}`);
  };

  const handleAddRemark = () => {
    if (!caseData) return;
    const remark = prompt("Add remark:");
    if (!remark) return;
    const updated: CaseData = { ...caseData, timeline: [...(caseData.timeline || []), { date: new Date().toLocaleString(), text: remark }] };
    persist(updated);
  };

  const handleMarkClosed = () => {
    if (!caseData) return;
    const updated: CaseData = { ...caseData, status: "Solved" };
    persist(updated);
  };

  const handleReject = () => {
    if (!caseData) return;
    const updated: CaseData = { ...caseData, status: "Not Solved" };
    persist(updated);
  };

  if (!caseData) {
    return (
      <div className="case-details">
        <h3>Case not found</h3>
        <button onClick={() => navigate(-1)} className="btn">Back</button>
      </div>
    );
  }

  return (
    <div className="case-details">
      <h2>{caseData.incidentType} - {caseData.caseId}</h2>

      <div className="case-grid">
        <div className="case-card">
          <h4>Case Information</h4>
          <p><strong>Case ID:</strong> {caseData.caseId}</p>
          <p><strong>Crime Type:</strong> {caseData.incidentType}</p>
          <p><strong>Date:</strong> {caseData.date}</p>
          <p><strong>Location:</strong> {caseData.location}</p>
          <p className="field-row">
            <strong>Current Status:</strong>
            <label htmlFor="status-select" className="visually-hidden">Change status</label>
            <select id="status-select" value={newStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStatus(e.target.value as CaseData["status"])} className="status-select">
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
              <option value="Not Solved">Not Solved</option>
            </select>
          </p>

          <div className="case-actions">
            <button className="btn primary" onClick={handleUpdateStatus}>Update Status</button>
            <button className="btn" onClick={handleAssignOfficer}>Assign Officer</button>
          </div>
        </div>

        <div className="case-card">
          <h4>Complainant Details</h4>
          <p><strong>Full Name:</strong> {caseData.name}</p>
          {caseData.email && <p><strong>Email:</strong> {caseData.email}</p>}
          {caseData.phone && <p><strong>Phone:</strong> {caseData.phone.replace(/(\d{3})\d{4}(\d{2})/, "$1****$2")}</p>}
        </div>
      </div>

      <div className="case-card mt-18">
        <h4>Complaint Description</h4>
        <div className="description-box">{caseData.details}</div>
      </div>

      <div className="case-card mt-18">
        <h4>Evidence</h4>
        {caseData.attachmentUrls && caseData.attachmentUrls.length > 0 ? (
          <div>
            {caseData.attachmentUrls.map((url, idx) => (
              <div key={idx} className="evidence-item">
                <span className="evidence-name">{url.split('/').pop()}</span>
                <div className="evidence-actions">
                  <a href={url} target="_blank" rel="noopener noreferrer"><button className="btn">View</button></a>
                  <a href={url} download><button className="btn ml-8">Download</button></a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No evidence uploaded.</div>
        )}
      </div>

      <div className="case-card mt-18">
        <h4>Admin Actions</h4>
        <div className="case-actions-flex">
          <button className="btn" onClick={handleAddRemark}>Add Remarks</button>
          <button className="btn" onClick={handleAssignOfficer}>Assign Officer</button>
          <button className="btn success" onClick={handleMarkClosed}>Mark as Closed</button>
          <button className="btn danger" onClick={handleReject}>Reject Case</button>
        </div>
      </div>

      {caseData.timeline && caseData.timeline.length > 0 && (
        <div className="case-card mt-18">
          <h4>Timeline</h4>
          {caseData.timeline.map((t, idx) => (
            <div key={idx} className="timeline-item">
              <span className="timeline-strong">{t.date}:</span> {t.text}
            </div>
          ))}
        </div>
      )}

      <div className="back-row">
        <button onClick={() => navigate(-1)} className="btn">Back</button>
      </div>
    </div>
  );
};

export default CaseDetails;
