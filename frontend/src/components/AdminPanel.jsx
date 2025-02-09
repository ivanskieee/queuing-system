import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCog } from "react-icons/fa";
import Swal from "sweetalert2";

function AdminPanel() {
  const [queue, setQueue] = useState([]);
  const [paperName, setPaperName] = useState("");
  const [reason, setReason] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reasons = [
    "Social Security System",
    "Tax Filing",
    "Loan Application",
    "Employment Verification",
    "Health Insurance",
    "Passport Renewal",
    "Visa Application",
    "Birth Certificate",
    "Marriage Certificate",
    "Police Clearance",
  ];

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/queue");
      setQueue(response.data);
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  const addPaper = async () => {
    if (!paperName.trim() || !reason.trim()) {
      // Use SweetAlert2 for error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Paper name and reason cannot be empty!",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/queue", {
        paper_name: paperName,
        reason: reason,
      });

      setQueue((prevQueue) => [...prevQueue, response.data]);
      setPaperName("");
      setReason("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding paper:", error);
    }
  };

  const updateStatus = async (_id, status) => {
    try {
      // First, optimistically update the status locally
      const updatedQueue = queue.map((item) =>
        item._id === _id ? { ...item, status, updatedAt: new Date() } : item
      );
      setQueue(updatedQueue);

      // Then, send the request to the server
      await axios.put(`http://localhost:5000/api/queue/${_id}`, { status });

      // After the request is successful, you can leave the local update or fetch the updated data from the server
      // Optionally, refetch the queue if you prefer server-side synchronization:
      // fetchQueue();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const serveNext = async () => {
    const nextItem = queue.find((item) => item.status === "Ready for Pickup");

    if (!nextItem) {
      Swal.fire({
        icon: "info",
        title: "No papers ready for pickup",
        text: "There are no papers ready for pickup at the moment.",
      });
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/queue/serve/${nextItem._id}`
      );

      setQueue((prevQueue) =>
        prevQueue.filter((item) => item._id !== nextItem._id)
      );
    } catch (error) {
      console.error("Error serving next:", error);
    }
  };

  const clearQueue = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This action will clear the entire queue.",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("http://localhost:5000/api/queue");
        setQueue([]);
        Swal.fire({
          icon: "success",
          title: "Queue Cleared",
          text: "The queue has been cleared successfully.",
        });
      } catch (error) {
        console.error("Error clearing queue:", error);
      }
    }
  };

  const firstInQueue = queue[0];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-850 to-blue-800 text-white p-4 flex items-center uppercase justify-between">
        <h1 className="px-2 py-2 text-left text-2xl font-bold text-white uppercase tracking-wider">
          Queueing System
        </h1>
      </div>

      <div className="flex bg-blue-50 h-220 space-x-6">
        {/* Left Section */}
        <div className="flex-1 bg-black p-6 rounded-lg m-5 shadow-xl flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-shadow text-center px-2 py-2 text-6xl font-bold text-blue-500 uppercase tracking-wider">
              NOW SERVING
            </h2>
            {firstInQueue ? (
              <div className="mt-6">
                <h3 className="text-7xl text-blue-200 font-bold">
                  {firstInQueue.paper_name}
                </h3>
                <div className="w-200 h-[1px] bg-blue-200 mt-1"></div>

                <div className="text-3xl mt-4 text-blue-300">
                  {/* Queue Number */}
                  <div className="flex flex-col items-center mt-4">
                    <span className="text-7xl text-blue-200 font-bold">
                      {firstInQueue.queue_number}
                    </span>
                    <span className="font-semibold uppercase text-sm mt-2">
                      Queue Number
                    </span>
                    <div className="w-60 h-[1px] bg-blue-200 mt-1"></div>
                  </div>

                  {/* Reason */}
                  <div className="flex flex-col items-center mt-6">
                    <span className="text-3xl uppercase text-blue-200 font-bold">
                      {firstInQueue.reason}
                    </span>
                    <span className="font-semibold uppercase text-sm mt-2">
                      Reason
                    </span>
                    <div className="w-60 h-[1px] bg-blue-200 mt-1"></div>
                  </div>

                  {/* Updated At */}
                  <div className="flex flex-col items-center mt-6">
                    <span className="text-3xl text-blue-200 font-bold">
                      {new Date(firstInQueue.updatedAt).toLocaleString()}
                    </span>
                    <span className="font-semibold uppercase text-sm mt-2">
                      TIME
                    </span>
                    <div className="w-60 h-[1px] bg-blue-200 mt-1"></div>
                  </div>
                </div>

                {/* Status Section */}
                <p
                  className={`text-5xl font-semibold mt-6 ${
                    firstInQueue.status === "On Queue"
                      ? "text-blue-600 uppercase"
                      : firstInQueue.status === "Processing"
                      ? "text-blue-600 uppercase"
                      : firstInQueue.status === "Approved"
                      ? "text-green-600 uppercase"
                      : firstInQueue.status === "Rejected"
                      ? "text-red-600 uppercase "
                      : firstInQueue.status === "Ready for Pickup"
                      ? "text-green-500 uppercase animate-pulse"
                      : "text-gray-600"
                  }`}
                >
                  {firstInQueue.status === "On Queue"
                    ? "Processing"
                    : firstInQueue.status}
                </p>
                {/* Ready for Pickup */}
                {firstInQueue.status === "Ready for Pickup" && (
                  <p className="mt-6 text-4xl font-semibold text-green-200 animate-pulse">
                    PLEASE HEAD TO THE COUNTER
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-6 uppercase tracking-wider">
                No papers in the queue
              </p>
            )}
          </div>
        </div>

        {/* Right Section (Queue List and Actions) */}
        <div className="w-96 bg-white p-6 shadow-lg flex flex-col space-y-4 h-full">
          <h2 className="text-center text-blue-800 text-3xl font-semibold uppercase tracking-wider">
            Queue List
          </h2>

          <div className="overflow-y-auto h-190 space-y-4">
            {queue
              .filter((item) => item._id !== firstInQueue?._id)
              .map((item) => (
                <div
                  key={item._id}
                  className="user-card bg-white border border-blue-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-5"
                >
                  {/* User Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {item.paper_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Queue Number: {item.queue_number}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          item.status === "On Queue"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "Received" ? "On Queue" : item.status}
                      </span>
                    </div>
                  </div>

                  {/* Reason and Created At */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2">
                    <div className="flex items-center space-x-2">
                      <strong>Reason:</strong>
                      <span>{item.reason}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <strong>Created At:</strong>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex space-x-4 justify-center">
            {/* FAB Icon */}
            <button
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className={`bg-blue-200 text-blue-800 p-5 rounded-full shadow-lg hover:bg-blue-300 transition-all transform ${
                isSelectOpen ? "scale-50" : "scale-75"
              }`}
            >
              <FaCog size={28} />
            </button>
            {/* Add Paper Button */}
            <button
              onClick={serveNext}
              className="bg-blue-200 text-blue-900 py-2 px-2 rounded-lg hover:bg-blue-300 font-bold uppercase text-sm"
            >
              Serve Next
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-200 text-blue-900 py-2 px-2 rounded-lg hover:bg-blue-300 font-bold uppercase text-sm"
            >
              Add Paper
            </button>
            <button
              onClick={clearQueue}
              className="bg-blue-200 text-blue-900 py-2 px-2 rounded-lg hover:bg-blue-300 font-bold uppercase text-sm"
            >
              Clear Queue
            </button>
          </div>
        </div>
      </div>

      {/* Add Paper Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add Paper Details</h3>
            <input
              type="text"
              value={paperName}
              onChange={(e) => setPaperName(e.target.value)}
              placeholder="Enter Paper Name"
              className="p-2 w-full border  rounded-lg mb-2"
            />
            {/* Reason Select Dropdown */}
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="p-2 w-full border rounded-lg mb-2"
            >
              <option value="">Select Reason</option>
              {reasons.map((reasonOption, index) => (
                <option key={index} value={reasonOption}>
                  {reasonOption}
                </option>
              ))}
            </select>
            <button
              onClick={addPaper}
              className="w-full bg-blue-200 text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-300"
            >
              Add Paper
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAB for Status Select */}

      {/* Animated Status Select Section */}
      <div
        className={`fixed bottom-0 right-101 p-4 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${
          isSelectOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {queue.length > 0 && (
          <>
            {[
              "On Queue",
              "Processing",
              "Approved",
              "Rejected",
              "Ready for Pickup",
            ].map((status) => (
              <div key={status} className="mb-3">
                <button
                  onClick={() => updateStatus(firstInQueue._id, status)}
                  className="w-50 p-2 text-xs font-medium rounded-md text-blue-900 focus:outline-none hover:opacity-80 transition-all bg-blue-200"
                >
                  Mark as {status}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
