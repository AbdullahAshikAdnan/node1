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

// Function to get headers for Drop Cowboy API requests
function getHeaders() {
  return {
    "X-TeamID": dropCowboyTeamId,
    "X-SecretKey": dropCowboySecretKey,
    "Content-Type": "application/json",
  };
}

// Define route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, Glitch!");
});

// Define route for JotForm form submission
app.post("/jotform-submission", upload.single("input_8"), async (req, res) => {
  // Log that the form submission is received
  console.log("Form submission received:", req.body);

  // Check if the file was received
  if (!req.file) {
    return res.status(400).json({ error: "Voicemail file is missing" });
  }

  // Extract form data from JotForm submission
  const areaCode = req.body["input_5_area"];
  const phoneNumber = req.body["input_5_phone"];
  const voicemailFile = req.file;
  const rvmDate = `${req.body["month_7"]}/${req.body["day_7"]}/${req.body["year_7"]}`;
  const rvmTime = `${req.body["hour_7"]}:${req.body["min_7"]} ${req.body["ampm_7"]}`;
  const quantity1RVMCalls = parseInt(req.body["input_17_1000"]);
  const quantity5RVMCalls = parseInt(req.body["input_17_1001"]);
  const quantity10RVMCalls = parseInt(req.body["input_17_1002"]);
  const quantity20RVMCalls = parseInt(req.body["input_17_1003"]);
  const quantity25RVMCalls = parseInt(req.body["input_17_1004"]);

  // Upload the voicemail file to the Glitch file system
  const fileName = path.basename(voicemailFile.filename);
  const filePath = path.join("uploads", fileName);
  await voicemailFile.save(filePath);

  // Read and encode file data to base64
  let fileData;
  try {
    fileData = fs.readFileSync(filePath);
  } catch (error) {
    console.error("Failed to read the file:", error.message);
    return res.status(500).json({ error: "Failed to read the file" });
  }
  const audio_url = "data:audio/mp3;base64," + fileData.toString("base64");

  // Perform any necessary validation on the form data

  // Call function to schedule RVM
  try {
    await scheduleRVM(
      areaCode,
      phoneNumber,
      voicemailFile,
      rvmDate,
      rvmTime,
      quantity1RVMCalls,
      quantity5RVMCalls,
      quantity10RVMCalls,
      quantity20RVMCalls,
      quantity25RVMCalls
    );
    res.status(200).json({ message: "RVM scheduled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to schedule RVM" });
  }
});

// Function to schedule RVM for Package 1
async function scheduleRVMForPackage1(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, {
      headers: getHeaders(),
    });
    console.log("RVM scheduled for Package 1:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 1:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 5
async function scheduleRVMForPackage5(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, {
      headers: getHeaders(),
    });
    console.log("RVM scheduled for Package 5:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 5:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 10
async function scheduleRVMForPackage10(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, {
      headers: getHeaders(),
    });
    console.log("RVM scheduled for Package 10:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 10:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 20
async function scheduleRVMForPackage20(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, {
      headers: getHeaders(),
    });
    console.log("RVM scheduled for Package 20:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 20:", error.message);
    throw error;
  }
}

// Function to schedule RVM for Package 25
async function scheduleRVMForPackage25(payload) {
  try {
    const response = await axios.post(dropCowboyApiUrl, payload, {
      headers: getHeaders(),
    });
    console.log("RVM scheduled for Package 25:", response.data);
  } catch (error) {
    console.error("Failed to schedule RVM for Package 25:", error.message);
    throw error;
  }
}

// Function to schedule RVM based on the selected packages
async function scheduleRVM(
  areaCode,
  phoneNumber,
  voicemailFile,
  rvmDate,
  rvmTime,
  quantity1RVMCalls,
  quantity5RVMCalls,
  quantity10RVMCalls,
  quantity20RVMCalls,
  quantity25RVMCalls
) {
  // Form the complete phone number in E.164 format
  const phone_number_with_area_code = `+1${areaCode}${phoneNumber}`;

  // Use Axios to make API request to schedule RVM call
  const endpoint = "https://api.dropcowboy.com/v1/rvm"; // Replace with the actual API endpoint
  const url = endpoint;

  // Get the file upload from the JotForm submission
  const fileName = voicemailFile.filename;
  const filePath = path.join("uploads", fileName);
  const fileData = fs.readFileSync(filePath);
  const audio_url = "data:audio/mp3;base64," + fileData.toString("base64");

  const payload = {
    team_id: dropCowboyTeamId,
    secret: dropCowboySecretKey,
    branding_id: "fae66130-e5a1-4254-ba19-53971fc55df1",
    recording_id: "918d69fd-ca9c-4703-8981-3f606514fffa",
    audio_url:
      "https://drive.google.com/u/0/uc?id=1mg5_sXZNN8U0dYTw9aumoz16wJQhgaw6&export=download", // Replace with the URL of your voicemail audio file
    audio_type: "mp3", // Replace with the file type of your audio file (mp3 or wav)
    phone_number: phone_number_with_area_code, // The phone number in E.164 format to send the RVM
    rvm_date: rvmDate, // Add rvmDate and rvmTime to the payload
    rvm_time: rvmTime,
    foreign_id: "rereerrer",
  };

  // Schedule RVMs based on the selected packages and their quantities
  if (quantity1RVMCalls > 0) {
    // For Package 1, schedule only one RVM
    for (let i = 0; i < quantity1RVMCalls; i++) {
      await scheduleRVMForPackage1(payload);
      console.log("RVM scheduled successfully for Package 1");
    }
  }

  if (quantity5RVMCalls > 0) {
    // For Package 5, schedule 5 RVMs
    for (let i = 0; i < quantity5RVMCalls; i++) {
      await scheduleRVMForPackage5(payload);
      console.log("RVM scheduled successfully for Package 5");
    }
  }

  if (quantity10RVMCalls > 0) {
    // For Package 10, schedule 10 RVMs
    for (let i = 0; i < quantity10RVMCalls; i++) {
      await scheduleRVMForPackage10(payload);
      console.log("RVM scheduled successfully for Package 10");
    }
  }

  if (quantity20RVMCalls > 0) {
    // For Package 20, schedule 20 RVMs
    for (let i = 0; i < quantity20RVMCalls; i++) {
      await scheduleRVMForPackage20(payload);
      console.log("RVM scheduled successfully for Package 20");
    }
  }

  if (quantity25RVMCalls > 0) {
    // For Package 25, schedule 25 RVMs
    for (let i = 0; i < quantity25RVMCalls; i++) {
      await scheduleRVMForPackage25(payload);
      console.log("RVM scheduled successfully for Package 25");
    }
  }
}

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
