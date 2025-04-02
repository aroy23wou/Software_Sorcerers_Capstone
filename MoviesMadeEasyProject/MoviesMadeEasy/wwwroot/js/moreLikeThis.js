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
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains('btn-outline-secondary') && 
            event.target.textContent.trim() === "More Like This") {
            const movieCard = event.target.closest('.movie-card');
            const movieTitle = movieCard.querySelector('h5').textContent.split(' (')[0].trim();
            getMoreLikeThis(movieTitle);
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

function loadRecommendations() {
    const container = document.getElementById("recommendationsContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const data = sessionStorage.getItem('recommendationsData');
    
    if (!data) {
        container.innerHTML = '<div class="error-message">No recommendations data found. Please start a new search.</div>';
        return;
    }
    
    try {
        const { originalTitle, recommendations } = JSON.parse(data);
        document.getElementById("originalTitle").textContent = originalTitle;
        
        if (!recommendations || recommendations.length === 0) {
            container.innerHTML = '<div class="no-results">No recommendations found for this movie.</div>';
            return;
        }
        
        container.innerHTML = recommendations.map(movie => `
            <div class="recommendation-card">
                <h4>${movie.title || 'Unknown Title'}</h4>
                <p>${movie.year ? `(${movie.year})` : ''}</p>
                <p>${movie.reason || 'Similar in theme and style'}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading recommendations:", error);
        container.innerHTML = '<div class="error-message">Error displaying recommendations.</div>';
    }
}