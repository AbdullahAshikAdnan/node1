const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const axios = require("axios");
const path = require("path");
const fs = require("fs"); // Added fs module import

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Configure JotForm API credentials
const jotformApiKey = "27f50030f5db987ecbf9f985f47076ec";
const jotformFormId = "231365209409051";
const jotformApiUrl = "https://api.jotform.com";

// Configure Drop Cowboy API credentials
const dropCowboyTeamId = "acb1088b-e24d-4c61-bb83-cfb335d71892";
const dropCowboySecretKey = "48db8265-f632-418b-b4f3-eb8c24aaef58";
const dropCowboyApiUrl = "https://api.dropcowboy.com/v1/rvm";

// Define route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, Glitch!");
});

// Define route for JotForm form submission
app.post(
  "/jotform-submission",
  upload.single("voicemail"),
  async (req, res) => {
    // Extract form data from JotForm submission
    const areaCode = req.body["#input_5_area"];
    const phoneNumber = req.body["#input_5_phone"];
    const voicemailFile = req.file;
    const rvmDate = `${req.body["#month_7"]}/${req.body["#day_7"]}/${req.body["#year_7"]}`;
    const rvmTime = `${req.body["#hour_7"]}:${req.body["#min_7"]} ${req.body["#ampm_7"]}`;
    const quantity5RVMCalls = parseInt(req.body["#input_17_1000"]);
    const quantity10RVMCalls = parseInt(req.body["#input_17_1001"]);
    const quantity15RVMCalls = parseInt(req.body["#input_17_1002"]);
    const quantity20RVMCalls = parseInt(req.body["#input_17_1003"]);
    const quantity25RVMCalls = parseInt(req.body["#input_17_1004"]);

    // Perform any necessary validation on the form data

    // Call function to schedule RVM
    try {
      await scheduleRVM(phoneNumber, voicemailFile, rvmDate, rvmTime, quantity5RVMCalls, quantity10RVMCalls, quantity15RVMCalls, quantity20RVMCalls, quantity25RVMCalls);
      res.status(200).json({ message: "RVM scheduled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to schedule RVM" });
    }
  }
);

// Function to schedule RVM for Package 5
async function scheduleRVMForPackage5(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, { headers: getHeaders() });
    console.log("RVM scheduled for Package 5:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 5:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 10
async function scheduleRVMForPackage10(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, { headers: getHeaders() });
    console.log("RVM scheduled for Package 10:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 10:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 15
async function scheduleRVMForPackage15(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, { headers: getHeaders() });
    console.log("RVM scheduled for Package 15:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 15:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 20
async function scheduleRVMForPackage20(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, { headers: getHeaders() });
    console.log("RVM scheduled for Package 20:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 20:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 25
async function scheduleRVMForPackage25(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, { headers: getHeaders() });
    console.log("RVM scheduled for Package 25:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 25:", error.message);
    throw error;
  }
}

// Function to schedule RVM based on the selected packages
async function scheduleRVM(phoneNumber, voicemailFile, rvmDate, rvmTime, packages) {
  // Use Axios to make API request to schedule RVM call
  const endpoint = "https://api.dropcowboy.com/v1/rvm"; // Replace with the actual API endpoint
  const url = endpoint;
  
  const payload = {
    team_id: dropCowboyTeamId,
    secret: dropCowboySecretKey,
    audio_url: "https://example.com/your-file.mp3", // Replace with the URL of your voicemail audio file
    audio_type: "mp3", // Replace with the file type of your audio file (mp3 or wav)
    phone_number: phoneNumber, // The phone number in E.164 format to send the RVM
  };

  for (const pack of packages) {
    switch (pack) {
      case "1":
        // For Package 1, schedule only one RVM
        await scheduleRVMForPackage(payload, 1);
        break;
      case "5":
        // For Package 5, schedule 5 RVMs
        await scheduleRVMForPackage(payload, 5);
        break;
      case "10":
        // For Package 10, schedule 10 RVMs
        await scheduleRVMForPackage(payload, 10);
        break;
      case "20":
        // For Package 20, schedule 20 RVMs
        await scheduleRVMForPackage(payload, 20);
        break;
      case "25":
        // For Package 25, schedule 25 RVMs
        await scheduleRVMForPackage(payload, 25);
        break;
      default:
        // Invalid package selected
        throw new Error("Invalid package selected.");
    }
  }
} 

  const scheduledDateTime = `${rvmDate} ${rvmTime}`; // Combine the date and time

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
