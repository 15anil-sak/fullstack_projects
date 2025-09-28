
document.addEventListener('DOMContentLoaded', function() {

    // --- IMPORTANT --- 
    // Replace this with your actual Firebase project configuration.
    const firebaseConfig = {
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "slvpct-madhukar-alumini.firebaseapp.com",
    projectId: "slvpct-madhukar-alumini",
    storageBucket: "slvpct-madhukar-alumini.firebasestorage.app",
    messagingSenderId: "476724736741",
    appId: "1:476724736741:web:b3469a606b9db13e5e1a0c",
    measurementId: "G-HMY8LJFPFY"
  };

    // --- MOCK DATA --- 
    // This is sample data to demonstrate the functionality without a live database.
    // In the final version, this array should be removed, and the app will fetch live data
    // from Firestore if the firebaseConfig is correctly set up.
    const mockAlumniData = [
        {
            id: '1', data: () => ({
            Batch: '2022',
            College: 'Global Tech Institute',
            Present: 'Software Engineer at Google',
            'Alumni Message': 'Proud to be part of this network!',
            'Image URL': ''
            })
        },
        {
            id: '2', data: () => ({
            Batch: '2018',
            College: 'National University of Science',
            Present: 'Product Manager at Microsoft',
            'Alumni Message': 'Great memories and a great foundation for the future.',
            'Image URL': 'https://via.placeholder.com/280x200.png?text=Alumni+2'
            })
        },
        {
            id: '3', data: () => ({
            Batch: '2008',
            College: 'State Engineering College',
            Present: 'Director of Engineering at Amazon',
            'Alumni Message': 'The connections I made here have been invaluable.',
            'Image URL': 'https://via.placeholder.com/280x200.png?text=Alumni+3'
            })
        },
        {
            id: '4', data: () => ({
            Batch: '2023',
            College: 'Institute of Innovation',
            Present: 'AI Researcher at OpenAI',
            'Alumni Message': 'Excited for what the future holds for all of us.',
            'Image URL': 'https://via.placeholder.com/280x200.png?text=Alumni+4'
            })
        }
    ];

    // Function to create an alumni card HTML element
    function createAlumniCard(alumni) {
        const card = document.createElement('div');
        card.className = 'alumni-card';
        card.id = `alumni-${alumni.id}`;

        // Safely get data, providing default values
        const imageUrl = alumni.data()['Image URL'] || 'https://via.placeholder.com/280x200.png?text=No+Image';
        const batch = alumni.data().Batch || 'N/A';
        const college = alumni.data().College || 'N/A';
        const present = alumni.data().Present || 'N/A';
        const message = alumni.data()['Alumni Message'] || '';

        card.innerHTML = `
            <img src="${imageUrl}" alt="Profile picture" class="alumni-image">
            <div class="alumni-info">
                <p><span class="label">Batch:</span> ${batch}</p>
                <p><span class="label">College:</span> ${college}</p>
                <p><span class="label">Currently:</span> ${present}</p>
            </div>
            ${message ? `<div class="alumni-message"><p>${message}</p></div>` : ''}
        `;
        return card;
    }

    // Function to render alumni cards to the correct grid
    function renderCard(cardElement, batch) {
        const year = parseInt(batch, 10);
        let gridId;

        if (year >= 2021) {
            gridId = 'grid-2021-present';
        } else if (year >= 2011 && year <= 2020) {
            gridId = 'grid-2011-2020';
        } else if (year >= 1999 && year <= 2010) {
            gridId = 'grid-1999-2010';
        } else {
            return; // Do not render if batch is not in a valid range
        }

        const grid = document.getElementById(gridId);
        if (grid) {
            grid.appendChild(cardElement);
        }
    }

    // --- Main Logic --- 
    // Check if Firebase is configured. If not, use mock data.
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        console.log("Firebase is configured. Attempting to connect to Firestore...");
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Listen for real-time updates from the 'alumni_approved' collection
        db.collection('alumni_approved').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const alumni = change.doc;
                const cardElement = document.getElementById(`alumni-${alumni.id}`);

                if (change.type === 'added') {
                    const newCard = createAlumniCard(alumni);
                    renderCard(newCard, alumni.data().Batch);
                }
                if (change.type === 'modified') {
                    if(cardElement) cardElement.remove();
                    const updatedCard = createAlumniCard(alumni);
                    renderCard(updatedCard, alumni.data().Batch);
                }
                if (change.type === 'removed') {
                    if(cardElement) cardElement.remove();
                }
            });
        });

    } else {
        console.warn("Firebase not configured. Using mock data for demonstration.");
        // Render mock data
        mockAlumniData.forEach(alumni => {
            const newCard = createAlumniCard(alumni);
            renderCard(newCard, alumni.data().Batch);
        });
    }
});
