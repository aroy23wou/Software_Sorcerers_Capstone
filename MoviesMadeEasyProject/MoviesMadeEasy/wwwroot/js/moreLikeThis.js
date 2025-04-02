document.addEventListener("DOMContentLoaded", function() {
    // Check if we're on the recommendations page
    if (document.getElementById("recommendationsContainer")) {
        loadRecommendations();
    }
    
    // Set up event listeners for "More Like This" buttons on search results
    setupMoreLikeThisButtons();
});

function setupMoreLikeThisButtons() {
    // Use event delegation for dynamically created buttons
    document.addEventListener('click', async function(event) {
        if (event.target.classList.contains('btn-outline-secondary') && 
            event.target.textContent.trim() === "More Like This") {
            
            const movieCard = event.target.closest('.movie-card');
            const movieTitle = movieCard.querySelector('h5').textContent.split(' (')[0].trim();
            const loadingSpinner = document.getElementById('loadingSpinner');
            
            try {
                loadingSpinner.style.display = 'block';
                
                const response = await fetch(`/Home/GetSimilarMovies?title=${encodeURIComponent(movieTitle)}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Request failed');
                }
                
                const recommendations = await response.json();
                
                // Store recommendations and redirect
                sessionStorage.setItem('recommendations', JSON.stringify(recommendations));
                sessionStorage.setItem('originalTitle', movieTitle);
                window.location.href = '/Home/Recommendations';
                
            } catch (error) {
                loadingSpinner.style.display = 'none';
                
                if (error.message.includes('rate_limit_exceeded')) {
                    alert('⚠️ Please wait a moment before requesting more recommendations. Our system is getting too many requests.');
                } else {
                    alert('❌ Failed to get recommendations. Please try again later.');
                }
                
                console.error('Error:', error);
            } finally {
                loadingSpinner.style.display = 'none';
            }
        }
    });
}

async function getMoreLikeThis(movieTitle) {
    try {
        // Show loading state
        const resultsContainer = document.getElementById("results");
        const loadingSpinner = document.getElementById("loadingSpinner");
        loadingSpinner.style.display = "block";
        
        // Call your backend API which will call OpenAI
        const response = await fetch(`/Home/GetSimilarMovies?title=${encodeURIComponent(movieTitle)}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data)

        // Redirect to recommendations page with the data
        sessionStorage.setItem('recommendationsData', JSON.stringify({
            originalTitle: movieTitle,
            recommendations: data
        }));
        
        window.location.href = '/Home/Recommendations';
    } catch (error) {
        console.error("Error getting recommendations:", error);
        alert("Sorry, we couldn't get recommendations at this time. Please try again later.");
    } finally {
        loadingSpinner.style.display = "none";
    }
}

async function loadRecommendations() {
    const container = document.getElementById("recommendationsContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const data = sessionStorage.getItem('recommendations');
    
    if (!data) {
        container.innerHTML = '<div class="error-message">No recommendations data found. Please start a new search.</div>';
        return;
    }

    try {
        const parsedData = JSON.parse(data);
        console.log(parsedData)
        console.log("test")

        // Directly display the raw content in the container
        container.innerHTML = `<p>${JSON.stringify(parsedData)}<p>`;  // Using <pre> to preserve formatting

    } catch (error) {
        console.log(error)
        console.error("Error loading recommendations:", error);
        container.innerHTML = '<div class="error-message">Error displaying recommendations.</div>';
    }
}
