document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("results").addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-primary")) {
            let movieCard = event.target.closest(".movie-card");

            let title = movieCard.querySelector("h5").textContent;
            let posterUrl = movieCard.querySelector("img").src;
            let genres = movieCard.querySelector(".movie-genres").textContent.replace("Genres: ", "");
            let rating = movieCard.querySelector(".movie-rating").textContent.replace("Rating: ", "");
            
            let overview = movieCard.getAttribute("data-overview") || "No overview available.";
            let streamingServices = movieCard.getAttribute("data-streaming") || "";

            // Populate the modal with movie details
            document.getElementById("modalTitle").textContent = title;
            document.getElementById("modalPoster").src = posterUrl;
            document.getElementById("modalGenres").textContent = `Genres: ${genres}`;
            document.getElementById("modalRating").textContent = `Rating: ${rating}`;
            document.getElementById("modalOverview").textContent = `Overview: ${overview}`;
            
            // Clear previous streaming icons
            const streamingContainer = document.getElementById("modalStreaming");
            streamingContainer.innerHTML = "";
            
            // Add streaming service icons if available
            if (streamingServices) {
                const services = streamingServices.split(",");
                console.log(services)
                services.forEach(service => {
                    const trimmedService = service.trim();
                    if (trimmedService) {
                        const icon = document.createElement("img");
                        icon.src = getStreamingServiceLogo(trimmedService);
                        icon.alt = trimmedService;
                        icon.title = trimmedService; // Show service name on hover
                        icon.className = "streaming-icon";
                        icon.style.width = "40px";
                        icon.style.height = "40px";
                        icon.style.objectFit = "contain";
                        icon.style.marginRight = "5px";
                        streamingContainer.appendChild(icon);
                    }
                    console.log(trimmedService)
                });
            } else {
                streamingContainer.textContent = "Not available on streaming platforms.";
            }

            // Show the modal
            var movieModal = new bootstrap.Modal(document.getElementById("movieModal"));
            movieModal.show();
        }
    });
});

// Helper function to get logo URLs for streaming services
function getStreamingServiceLogo(serviceName) {
    const serviceLogos = {
        'Netflix': '/images/Netflix_Symbol_RGB.png',
        'Hulu': '/images/hulu-Green-digital.png',
        'Disney+': '/images/disney_logo_march_2024_050fef2e.png',
        'Prime Video': '/images/AmazonPrimeVideo.png',
        'Max': '/images/maxlogo.jpg',
        'Apple TV': '/images/AppleTV-iOS.png',
        'Peacock': '/images/Peacock_P.png',
        'Paramount+': '/images/Paramountplus.png',
        'Starz': '/images/Starz_Prism_Button_Option_01.png',
        'Tubi': '/images/tubitvlogo.png',
        'Pluto TV': '/images/Pluto-TV-Logo.jpg',
        'BritBox': '/images/britboxlogo.png',
        'AMC+': '/images/amcpluslogo.png'
    };
    
    return serviceLogos[serviceName] || ''; // Return empty string if no logo found
}

// Update the recommendationsContainer event listener similarly
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('recommendationsContainer')?.addEventListener('click', async function(event) {
        if (event.target.classList.contains('btn-primary') && 
            event.target.textContent.trim() === 'View Details') {
            
            const movieCard = event.target.closest('.movie-card');
            
            if (movieCard) {
                const titleElement = movieCard.querySelector('h5');
                const title = titleElement ? titleElement.textContent.replace(/\s*\(\d+\)$/, '').trim() : '';
                
                if (!title) {
                    console.error("Could not determine movie title");
                    return;
                }

                try {
                    const modalTitle = document.getElementById('modalTitle');
                    modalTitle.textContent = "Loading...";
                    
                    // Clear previous streaming icons
                    const streamingContainer = document.getElementById('modalStreaming');
                    streamingContainer.innerHTML = "";
                    
                    const response = await fetch(`/Home/SearchMovies?query=${encodeURIComponent(title)}`);
                    const results = await response.json();
                    
                    if (!results || results.length === 0) {
                        throw new Error("No results found");
                    }
                    
                    const movie = results[0];
                    
                    modalTitle.textContent = `${movie.title} (${movie.releaseYear || 'N/A'})`;
                    document.getElementById('modalGenres').textContent = 
                        `Genres: ${movie.genres?.join(", ") || "Unknown"}`;

                    document.getElementById('modalRating').textContent = 
                        `Rating: ${movie.rating || "No rating available"}`;

                    document.getElementById('modalOverview').textContent = 
                        `Overview: ${movie.overview || "No overview available"}`;
                    
                    // Add streaming service icons if available
                    if (movie.services && movie.services.length > 0) {
                        movie.services.forEach(service => {
                            const trimmedService = service.trim();
                            if (trimmedService) {
                                const icon = document.createElement("img");
                                icon.src = getStreamingServiceLogo(trimmedService);
                                icon.alt = trimmedService;
                                icon.title = trimmedService;
                                icon.className = "streaming-icon";
                                icon.style.width = "40px";
                                icon.style.height = "40px";
                                icon.style.objectFit = "contain";
                                icon.style.marginRight = "5px";
                                streamingContainer.appendChild(icon);
                            }
                        });
                    } else {
                        streamingContainer.textContent = "Not available on streaming platforms.";
                    }
                    
                    const posterImg = document.getElementById('modalPoster');
                    posterImg.src = movie.posterUrl || 'https://via.placeholder.com/150';
                    posterImg.alt = `${movie.title} poster`;
                    
                    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
                    modal.show();
                    
                } catch (error) {
                    console.error("Error fetching movie details:", error);
                    
                    document.getElementById('modalTitle').textContent = "Error";
                    document.getElementById('modalGenres').textContent = "";
                    document.getElementById('modalOverview').textContent = 
                        "Could not load movie details. Please try again.";
                    document.getElementById('modalStreaming').textContent = "";
                    
                    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
                    modal.show();
                }
            }
        }
    });
});