import { useState, useEffect, type FormEvent } from 'react';
import '../styles/reportcase.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  incidentType: string;
  details: string;
  attachments: FileList | null;
}

interface CaseData extends FormData {
  caseId: string;
  attachmentUrls: string[]; // store uploaded file URLs
  status?: 'In Progress' | 'Solved' | 'Not Solved';
  timeline?: { date: string; text: string }[];
}

const ReportCase: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    date: '',
    incidentType: 'Select Type',
    details: '',
    attachments: null
  });

  const [submittedCase, setSubmittedCase] = useState<CaseData | null>(null);
  const [nameSaved, setNameSaved] = useState(false);

  // Load name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('reporterName');
    if (savedName) {
      setForm(prev => ({ ...prev, name: savedName }));
      setNameSaved(true);
    }
  }, []);

  // Save name to localStorage
  useEffect(() => {
    localStorage.setItem('reporterName', form.name);
    setNameSaved(true);
  }, [form.name]);

  const generateCaseId = () => 'CASE-' + Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Convert attachments to local URLs
    const attachmentUrls: string[] = [];
    if (form.attachments) {
      Array.from(form.attachments).forEach(file => {
        const url = URL.createObjectURL(file);
        attachmentUrls.push(url);
      });
    }

    const caseId = generateCaseId();
    const newCase: CaseData = {
      ...form,
      caseId,
      attachmentUrls,
      status: 'In Progress',
      timeline: [
        { date: new Date().toLocaleDateString(), text: 'Case reported and registered' }
      ]
    };

    // Save to localStorage
    const storedCases: CaseData[] = JSON.parse(localStorage.getItem('cases') || '[]');
    storedCases.push(newCase);
    localStorage.setItem('cases', JSON.stringify(storedCases));

    setSubmittedCase(newCase);

    // Reset form except name
    setForm({
      name: form.name,
      email: '',
      phone: '',
      location: '',
      date: '',
      incidentType: 'Select Type',
      details: '',
      attachments: null
    });
  };

  return (
    <div className="page-container">
      <h1>Report a Case</h1>
      <p>All complaints are <strong>private and encrypted</strong>.</p>

      {!submittedCase && (
        <form onSubmit={handleSubmit} className="form-container">
          <label>Your Name {nameSaved && <span className="saved-label">Saved</span>}</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <label>Phone (optional)</label>
          <input
            type="text"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <label>Location of Incident</label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            required
          />

          <label>Date of Incident</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required
          />

          <label>Type of Incident</label>
          <select
            value={form.incidentType}
            onChange={e => setForm({ ...form, incidentType: e.target.value })}
            required
          >
            <option disabled>Select Type of Incident</option>
            <option>Harassment</option>
            <option>Corruption</option>
            <option>Cyber Crime</option>
            <option>Theft / Robbery</option>
            <option>Other</option>
          </select>

          <label>Detailed Description</label>
          <textarea
            value={form.details}
            onChange={e => setForm({ ...form, details: e.target.value })}
            required
          />

          <label>Attachments (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={e => setForm({ ...form, attachments: e.target.files })}
          />

          <button type="submit">Submit Case</button>
        </form>
      )}

      {submittedCase && (
        <div className="submitted-case">
          <h2>Case Submitted Successfully!</h2>
          <p><strong>Case ID:</strong> {submittedCase.caseId}</p>
          <p><strong>Name:</strong> {submittedCase.name}</p>
          {submittedCase.email && <p><strong>Email:</strong> {submittedCase.email}</p>}
          {submittedCase.phone && <p><strong>Phone:</strong> {submittedCase.phone}</p>}
          <p><strong>Location:</strong> {submittedCase.location}</p>
          <p><strong>Date:</strong> {submittedCase.date}</p>
          <p><strong>Type:</strong> {submittedCase.incidentType}</p>
          <p><strong>Details:</strong> {submittedCase.details}</p>

          {/* Display attachments */}
          {submittedCase.attachmentUrls.length > 0 && (
            <div className="attachments">
              <h3>Uploaded Evidence</h3>
              {submittedCase.attachmentUrls.map((url, idx) => {
                const ext = url.split('.').pop()?.toLowerCase();
                if (['mp4', 'webm'].includes(ext || '')) {
                  return <video key={idx} src={url} controls width={250}></video>;
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
                  return <img key={idx} src={url} alt={`attachment-${idx}`} width={250} />;
                } else {
                  return <a key={idx} href={url} target="_blank" rel="noopener noreferrer">Download File {idx+1}</a>;
                }
              })}
            </div>
          )}

          <p>Use the <strong>Case ID</strong> to track your case.</p>
          <button onClick={() => setSubmittedCase(null)}>Report Another Case</button>
        </div>
      )}
    </div>
  );
};

export default ReportCase;
