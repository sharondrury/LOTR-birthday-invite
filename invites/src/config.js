// ============================================================
//  PARTY RSVP - CONFIGURATION FILE
//  Edit this file to customise your party details
// ============================================================

const config = {
  // ----- Party Details -----
  partyName: "Barry's 30th Birthday",
  hostName: "Barry",
  date: "Saturday, 14th June 2026",
  time: "7:00 PM",
  location: "The Grand Hall, 42 Park Lane, London",
  dresscode: "Black Tie Optional",
  rsvpDeadline: "1st June 2026",

  // ----- Password Protection -----
  // Change this to your own secret password!
  password: "111",

  // Admin panel password (for viewing all RSVPs)
  adminPassword: "222",

  // ----- Google Sheets Integration -----
  // STEP 1: Create a Google Sheet
  // STEP 2: Go to Extensions > Apps Script
  // STEP 3: Paste the code from google-apps-script.js into the editor
  // STEP 4: Deploy as Web App (Anyone can access), copy the URL below
  googleScriptUrl:
    "https://script.google.com/macros/s/AKfycbwWVJkfR0X9YdNWmSi4DD27b3lscWY1mZuoQyKL_d3dw-nnHItBFXKs55ySo9wykdWrww/exec",

  // ----- Optional: Custom message on the invite -----
  inviteMessage:
    "Join us for a night of celebrations, laughter, and memories. We'd love to have you there!",
};

export default config;
