import React, { useRef } from "react";
import axios from "axios";

const API_BASE_URL = "https://pdf-lens.onrender.com";

const DragDrop = ({ setResult, setLoading }) => {
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      setResult(null);
      const token = window.sessionStorage.getItem("token");

      const { data } = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(data);
    } catch (err) {
      const backendMessage = err.response?.data?.error;
      const errorMessage = backendMessage || "Error processing file";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBrowse();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <div
        className="drop-zone"
        onClick={handleBrowse}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <p>Drag & Drop PDF here or click to browse</p>
      </div>
    </>
  );
};

export default DragDrop;
