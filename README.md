Real-Time Alumni Management System (RAMS) - Madhukar Alumni Portal🚀
Overview:
This is a full-stack, real-time web application developed for the SLVPCT Trust to dynamically manage and display the Madhukar Hostel alumni network. The system automates data collection from a public form, processes it via a serverless function, and instantly updates the front-end display.The architecture is designed to be fully scalable and requires zero manual HTML updates to publish new alumni records.
Key FeaturesReal-Time Data Feed: 
Uses Firestore's onSnapshot listener to update the webpage instantly when new data is submitted.
Serverless Ingestion: Utilizes a Google Cloud Function to reliably process form submissions.
Direct Feed: Configured for a direct data flow: Form → Cloud Function → Firestore (alumni_pending) → Webpage.
Responsive Design: Front-end is built with HTML/Tailwind CSS for optimal viewing on all devices.
Chronological Sorting: Alumni cards are automatically sorted into distinct time-based sections (1999–2010, 2011–2020, 2021–Present).
🛠️ Technology Stack  Layer  Component   Purpose
FrontendHTML5, Tailwind CSSSingle-file responsive structure and styling.Client LogicJavaScript (ES6+), Firebase SDKAuthentication, Real-time data reading, and dynamic card rendering.
Backend/IngestionGoogle Cloud Function (Node.js/Cloud Run)Serverless webhook to process form submissions.DatabaseFirebase FirestoreReal-time, NoSQL storage for structured alumni records.InputGoogle Forms / Apps ScriptPublic data collection and sending data to the Cloud Function.
📐 Project Architecture & Data FlowThis project utilizes a three-part pipeline:Submission: Alumni fill out the Google Form.Processing: A Google Apps Script (Trigger: On form submit) sends the data to the deployed Google Cloud Function.Storage: The Cloud Function writes the new record to the alumni_pending collection in Firestore.Display: The webpage reads the alumni_pending collection directly and displays the new card instantly.
Firestore CollectionsThe system is configured to use the following public collection path:Public Collection Path: /artifacts/{appId}/public/data/alumni_pendingSecurity Rules (CRITICAL)The following rule must be published in the Firestore console to allow the front-end to read the data:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allows any authenticated user (signed in anonymously by the app) to read public data.
    match /artifacts/{appId}/public/data/{collectionName}/{document=**} {
      allow read: if request.auth != null;
    }
    // Deny all other access for security.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
⚙️ Setup and Deployment Instructions1. Cloud Function DeploymentThe cloud_function.js file must be deployed to Google Cloud Run/Functions as an HTTP Trigger with Allow unauthenticated invocations.
The function must be assigned the Cloud Datastore User IAM role to grant write permission to Firestore.2. Frontend DeploymentThe madhukar_alumni_final.html file is the complete, final deployment artifact. It contains all HTML, CSS, and JavaScript, including the Firebase configuration keys embedded within the script tag.This file can be hosted on any static hosting service (Firebase Hosting, GitHub Pages, etc.).
3. Google Apps Script ConfigurationThe final version of the Google Apps Script in the form must be configured with the Cloud Function's public URL (e.g., https://[HASH].run.app) to complete the submission pipeline.
