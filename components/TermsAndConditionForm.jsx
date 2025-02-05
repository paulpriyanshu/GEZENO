"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Quill's styles
import toast, { Toaster } from "react-hot-toast"; // Import Hot Toast

// Dynamically import ReactQuill with no SSR (server-side rendering)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TermsAndConditionForm = () => {
  const [terms, setTerms] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returns, setReturns] = useState("");
  const [cancellation, setCancellation] = useState("");
  const [isClient, setIsClient] = useState(false); // For handling SSR
  const [loading, setLoading] = useState(true); // Loading state

  // Set isClient to true when the component mounts (only on the client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch all saved data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend.gezeno.in/api/terms-and-conditions"
        );
        const data = response.data;

        console.log("Fetched Data:", data);

        // Populate the state with fetched data
        setTerms(data.terms || "");
        setPrivacyPolicy(data.privacyPolicy || "");
        setReturns(data.returns || "");
        setCancellation(data.cancellation || "");

        toast.success("Data loaded successfully!");
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData();
  }, []);

  // Save the updated data to the backend
  const handleSave = async () => {
    try {
      const data = await axios.post(
        "https://backend.gezeno.in/api/terms-and-conditions",
        {
          terms,
          privacyPolicy,
          returns,
          cancellation,
        }
      );
      console.log("Data Saved:", data);

      toast.success("Terms and conditions saved successfully!");
    } catch (error) {
      console.error("Error saving terms:", error);
      toast.error("Failed to save data. Please try again.");
    }
  };

  // Render the form only on the client-side
  if (!isClient) {
    return null;
  }

  // Show loading indicator while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false} /> 

      <h1>Edit Terms & Conditions</h1>

      <h2>Terms</h2>
      {isClient && <ReactQuill value={terms} onChange={setTerms} theme="snow" />}

      <h2>Privacy Policy</h2>
      {isClient && <ReactQuill value={privacyPolicy} onChange={setPrivacyPolicy} theme="snow" />}

      <h2>Returns</h2>
      {isClient && <ReactQuill value={returns} onChange={setReturns} theme="snow" />}

      <h2>Cancellation</h2>
      {isClient && <ReactQuill value={cancellation} onChange={setCancellation} theme="snow" />}

      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save
      </button>
    </div>
  );
};

export default TermsAndConditionForm;