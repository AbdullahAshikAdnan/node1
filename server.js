const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");



// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Configure JotForm API credentials
const jotformApiKey = "27f50030f5db987ecbf9f985f47076ec";
const jotformFormId = "231365209409051";
const jotformApiUrl = "https://api.jotform.com";

// Define route for JotForm webhook notification
app.post("/jotform-webhook", upload.single("voicemail"), async (req, res) => {
  // Extract form data from JotForm submission
  const areaCode = req.body.input_5_area;
  const phoneNumber = req.body.input_5_phone;
  const voicemailFile = req.file;

  // Perform any necessary validation on the form data

  // Call function to schedule RVM
  try {
    await scheduleRVM(phoneNumber, voicemailFile);
    res.status(200).json({ message: "RVM scheduled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to schedule RVM" });
  }
});

// Function to schedule RVM
async function scheduleRVM(phoneNumber, voicemailFile) {
  // Use Axios to make API request to schedule RVM call
  const endpoint = "https://api.dropcowboy.com/v1/rvm"; // Replace with the actual API endpoint
  const url = endpoint;

  // Set request headers and parameters
  const headers = {
    "X-TeamID": "acb1088b-e24d-4c61-bb83-cfb335d71892",
    "X-SecretKey": "48db8265-f632-418b-b4f3-eb8c24aaef58",
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append("phone_number", phoneNumber);
  formData.append("voicemail", fs.createReadStream(voicemailFile.path));

  // Make the API request
  const response = await axios.post(url, formData, { headers });

  // Handle the response as needed
  console.log("RVM scheduled:", response.data);
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
