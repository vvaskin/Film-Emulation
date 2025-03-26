import React, { useState } from 'react';

function ImageUploader() {
  // State hooks to store the selected file, image preview, processed image, and any error message.
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

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
      setIsLoading(true)
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
      setIsLoading(false)
    } catch (err) {
      console.error("Upload failed:", err);
      setError("There was an error uploading the image.");
      setIsLoading(false)
    }
  };

  return (  
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload an Image</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex items-center justify-center w-full">
          <label className={`w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'} transition-colors duration-300`}>
            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-sm">Select an image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        
        <button 
          type="submit" 
          className={`${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'} w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-300`}
          
        >
          Filmify
        </button>
      </form>

      <div className="flex gap-8">
        {/* Left side - Preview Image */}
        <div className="flex-1">
          {previewUrl && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Original Image:</h3>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img src={previewUrl} alt="Preview" className="w-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Right side - Processed Image */}
        <div className="flex-1">
          {processedImageUrl && (
            <div>
              <h3 className ="text-xl font-semibold mb-4 text-gray-700">Processed Image:</h3>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img src={processedImageUrl} alt="Processed" className="w-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message at the bottom */}
      {error && (
        <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;