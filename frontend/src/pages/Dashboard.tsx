import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import ComplaintForm from "../components/ComplaintForm";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
        <ComplaintForm />
        <ChatBot />
      </div>
    </div>
  );
}
