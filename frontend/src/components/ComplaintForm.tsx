import { useState } from "react";
import axios from "axios";

export default function ComplaintForm() {
  const [complaint, setComplaint] = useState({
    type: "",
    description: "",
    location: "",
    attachments: [] as File[],
  });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/complaints", complaint, {
        headers: { Authorization: token },
      });
      alert("Complaint submitted!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to submit complaint.");
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="bg-gray-100 p-4 mb-6 rounded shadow">
      <h3 className="font-bold mb-2">Register Complaint</h3>
      <input
        type="text"
        placeholder="Type"
        className="w-full mb-2 p-2 border rounded"
        value={complaint.type}
        onChange={(e) => setComplaint({ ...complaint, type: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        className="w-full mb-2 p-2 border rounded"
        value={complaint.location}
        onChange={(e) =>
          setComplaint({ ...complaint, location: e.target.value })
        }
      />
      <textarea
        placeholder="Description"
        className="w-full mb-2 p-2 border rounded"
        value={complaint.description}
        onChange={(e) =>
          setComplaint({ ...complaint, description: e.target.value })
        }
      />
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white p-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
