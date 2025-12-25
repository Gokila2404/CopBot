import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/trackcase.css';

interface TimelineEvent {
  date: string;
  text: string;
}

interface CaseData {
  caseId: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  date: string;
  incidentType: string;
  details: string;
  attachmentUrls?: string[]; // uploaded evidence
  status?: 'In Progress' | 'Solved' | 'Not Solved';
  timeline?: TimelineEvent[];
}

const TrackCase: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [caseId, setCaseId] = useState(searchParams.get('id') || '');
  const [foundCase, setFoundCase] = useState<CaseData | null>(null);
  const [error, setError] = useState('');

  const searchCase = useCallback((id: string) => {
    const storedCases: CaseData[] = JSON.parse(localStorage.getItem('cases') || '[]');
    const matchedCase = storedCases.find(c => c.caseId.toUpperCase() === id.toUpperCase());

    if (matchedCase) {
      setFoundCase(matchedCase);
      setError('');
      setSearchParams({ id: id });
    } else {
      setFoundCase(null);
      setError('No case found with this Case ID.');
      setSearchParams({});
    }
  }, [setSearchParams]);

  // Prepopulate demo statuses and timeline if missing
  useEffect(() => {
    const storedCases: CaseData[] = JSON.parse(localStorage.getItem('cases') || '[]');
    let updated = false;
    const updatedCases = storedCases.map(c => {
      if (!c.status) {
        updated = true;
        return {
          ...c,
          status: 'In Progress',
          timeline: [
            { date: new Date(c.date).toLocaleDateString(), text: 'Case reported' },
            { date: new Date().toLocaleDateString(), text: 'Investigation in progress' }
          ]
        };
      }
      return c;
    });
    if (updated) localStorage.setItem('cases', JSON.stringify(updatedCases));
  }, []);

  // Search case when ID is in URL
  useEffect(() => {
    if (caseId) searchCase(caseId);
  }, [caseId, searchCase]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (caseId.trim()) searchCase(caseId);
  };

  return (
    <div className="page-container">
      <div className="search-container">
        <h1>Track Your Case</h1>
        <p>Enter your <strong>Case ID</strong> to view your submitted case details, progress, and uploaded evidence.</p>

        <form onSubmit={handleSearch} className="form-container">
          <input
            type="text"
            placeholder="Enter Case ID"
            value={caseId}
            onChange={e => setCaseId(e.target.value)}
            required
          />
          <button type="submit">Search Case</button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>

      {foundCase && (
        <div className="case-details">
          <h2>Case Details</h2>
          <div className="case-grid">
            <div className="case-row"><span className="case-label">Case ID:</span><span className="case-value">{foundCase.caseId}</span></div>
            <div className="case-row"><span className="case-label">Status:</span><span className={`status-badge ${foundCase.status?.toLowerCase().replace(' ', '-')}`}>{foundCase.status || 'Not Available'}</span></div>
            <div className="case-row"><span className="case-label">Name:</span><span className="case-value">{foundCase.name}</span></div>
            {foundCase.email && <div className="case-row"><span className="case-label">Email:</span><span className="case-value">{foundCase.email}</span></div>}
            {foundCase.phone && <div className="case-row"><span className="case-label">Phone:</span><span className="case-value">{foundCase.phone}</span></div>}
            <div className="case-row"><span className="case-label">Location:</span><span className="case-value">{foundCase.location}</span></div>
            <div className="case-row"><span className="case-label">Date:</span><span className="case-value">{foundCase.date}</span></div>
            <div className="case-row"><span className="case-label">Type:</span><span className="case-value">{foundCase.incidentType}</span></div>
            <div className="case-row"><span className="case-label">Details:</span><span className="case-value">{foundCase.details}</span></div>
          </div>

          {/* Evidence / Attachments */}
          {foundCase.attachmentUrls && foundCase.attachmentUrls.length > 0 && (
            <div className="case-attachments">
              <h3>Uploaded Evidence</h3>
              <div className="attachments-grid">
                {foundCase.attachmentUrls.map((url, idx) => {
                  const ext = url.split('.').pop()?.toLowerCase();
                  if (['mp4', 'webm'].includes(ext || '')) {
                    return <video key={idx} src={url} controls width={250} />;
                  } else if (['jpg','jpeg','png','gif'].includes(ext || '')) {
                    return <img key={idx} src={url} alt={`attachment-${idx}`} width={250} />;
                  } else {
                    return <a key={idx} href={url} target="_blank" rel="noopener noreferrer">Download File {idx+1}</a>;
                  }
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          {foundCase.timeline && foundCase.timeline.length > 0 && (
            <div className="case-timeline">
              <h3>Case Timeline</h3>
              {foundCase.timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-date">{event.date}</div>
                    <div className="timeline-text">{event.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackCase;
