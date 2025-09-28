
const { Firestore } = require('@google-cloud/firestore');

/**
 * Triggered by a Google Form submission webhook.
 * This function parses the incoming form data and saves it to a 'alumni_pending' collection in Firestore.
 *
 * @param {object} req The HTTP request object.
 * @param {object} res The HTTP response object.
 */
exports.processAlumniSubmission = async (req, res) => {
    // Ensure the request is a POST request.
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // The form data is expected in the request body.
    // The field names here MUST EXACTLY MATCH the question titles in your Google Form.
    const { 
        Batch,
        College,
        Present,
        Email,
        Phone,
        'Alumni Message': alumniMessage, // Google Forms often sends multi-word titles with spaces.
        'Image URL': imageUrl 
    } = req.body;

    // Basic validation
    if (!Batch || !College || !Present || !Email) {
        console.error('Validation Failed: Missing required fields.', req.body);
        res.status(400).send('Bad Request: Missing required fields.');
        return;
    }

    try {
        // Initialize Firestore
        const firestore = new Firestore();

        // Create a new document in the 'alumni_pending' collection
        const docRef = await firestore.collection('alumni_pending').add({
            Batch: Batch,
            College: College,
            Present: Present,
            Email: Email,
            Phone: Phone || null, // Optional field
            'Alumni Message': alumniMessage || '', // Optional field
            'Image URL': imageUrl || null, // Optional field
            status: 'pending', // Set the initial status for approval
            timestamp: new Date() // Add a submission timestamp
        });

        console.log(`Successfully created pending entry with ID: ${docRef.id}`);
        res.status(201).send({ success: true, message: `Entry created with ID: ${docRef.id}` });

    } catch (error) {
        console.error('Error writing to Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
};
