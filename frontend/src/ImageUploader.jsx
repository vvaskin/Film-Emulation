import React, { useState } from 'react';

function ImageUploader() {
  // State hooks to store the selected file, image preview, processed image, and any error message.
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  // Event handler for the file input.
  // This function retrieves the selected file and creates a temporary preview URL.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Store the file in component state
      setSelectedFile(file);
      // Create a temporary URL for preview using the browser's URL API
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Event handler for form submission.
  // This function packages the file into FormData and sends it to the backend.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form behavior (page refresh)
    setError(null);
    setProcessedImageUrl(null);

    // Check if a file has been selected
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    // Create a FormData instance and append the selected file
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Send a POST request to Flask backend
      const response = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        body: formData,
      });

      // If the response is not okay, parse the json error message
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error processing image.");
      } else {
        // Convert the response (a Binary Large Object, blob) to a URL to display the processed image
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log(imageUrl);
        setProcessedImageUrl(imageUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("There was an error uploading the image.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload an Image</h2>

      {/* Form for uploading the image */}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={{ display: 'block', marginTop: '10px' }}>
          Filmify
        </button>
      </form>

      {/* Display preview of the selected image */}
      {previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Selected Image Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {/* Display the processed image returned from the backend */}
      {processedImageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Processed Image:</h3>
          <img src={processedImageUrl} alt="Processed" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {/* Display error message, if any */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default ImageUploader;