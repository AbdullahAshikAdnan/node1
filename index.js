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

// Function to schedule RVM
async function scheduleRVM(phoneNumber, voicemailFile, rvmDate, rvmTime, quantity5RVMCalls, quantity10RVMCalls, quantity15RVMCalls, quantity20RVMCalls, quantity25RVMCalls) {
  // Use Axios to make API request to schedule RVM call
  const endpoint = "https://api.dropcowboy.com/v1/rvm"; // Replace with the actual API endpoint
  const url = endpoint;

  // Set request headers and parameters
  const headers = {
    "X-TeamID": "dropCowboyTeamId",
    "X-SecretKey": "dropCowboySecretKey",
    "Content-Type": "application/json",
  };
  
  const payload = {
    team_id: "acb1088b-e24d-4c61-bb83-cfb335d71892", // Replace with your actual team_id
    secret: "48db8265-f632-418b-b4f3-eb8c24aaef58", // Replace with your actual secret
    audio_url: "https://example.com/your-file.mp3", // Replace with the URL of your voicemail audio file
    audio_type: "mp3", // Replace with the file type of your audio file (mp3 or wav)
    phone_number: phoneNumber, // The phone number in E.164 format to send the RVM
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log("RVM scheduled:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM:", error.message);
    throw error;
  }
}

  const scheduledDateTime = `${rvmDate} ${rvmTime}`; // Combine the date and time

  // Schedule 5 RVM Calls
  for (let i = 0; i < quantity5RVMCalls; i++) {
    const payload = {
      phone_number: phoneNumber,
      voicemail: fs.readFileSync(voicemailFile.path, { encoding: "base64" }),
    };
    const response = await axios.post(dropCowboyApiUrl, payload, { headers });
    console.log("RVM scheduled:", response.data);
  }

  // Schedule 10 RVM Calls
  for (let i = 0; i < quantity10RVMCalls; i++) {
    const payload = {
      phone_number: phoneNumber,
      voicemail: fs.readFileSync(voicemailFile.path, { encoding: "base64" }),
    };
    const response = await axios.post(dropCowboyApiUrl, payload, { headers });
    console.log("RVM scheduled:", response.data);
  }

  // Schedule 15 RVM Calls
  for (let i = 0; i < quantity15RVMCalls; i++) {
    const payload = {
      phone_number: phoneNumber,
      voicemail: fs.readFileSync(voicemailFile.path, { encoding: "base64" }),
    };
    const response = await axios.post(dropCowboyApiUrl, payload, { headers });
    console.log("RVM scheduled:", response.data);
  }

  // Schedule 20 RVM Calls
  for (let i = 0; i < quantity20RVMCalls; i++) {
    const payload = {
      phone_number: phoneNumber,
      voicemail: fs.readFileSync(voicemailFile.path, { encoding: "base64" }),
    };
    const response = await axios.post(dropCowboyApiUrl, payload, { headers });
    console.log("RVM scheduled:", response.data);
  }

  // Schedule 25 RVM Calls
  for (let i = 0; i < quantity25RVMCalls; i++) {
    const payload = {
      phone_number: phoneNumber,
      voicemail: fs.readFileSync(voicemailFile.path, { encoding: "base64" }),
    };
    const response = await axios.post(dropCowboyApiUrl, payload, { headers });
    console.log("RVM scheduled:", response.data);
  }
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
