using System;
using System.Collections.Generic;

namespace MoviesMadeEasy.Models
{
    public class Movie
    {
        public string ItemType { get; set; } // "show" or other types
        public string ShowType { get; set; } // "movie" or other types
        public string Id { get; set; } // API-specific ID
        public string ImdbId { get; set; } // IMDb ID
        public string TmdbId { get; set; } // TMDb ID
        public string Title { get; set; } // Movie title
        public string Overview { get; set; } // Movie description
        public int ReleaseYear { get; set; } // Release year
        public string OriginalTitle { get; set; } // Original title
        public List<string> Genres { get; set; } // List of genres
        public List<string> Directors { get; set; } // List of directors
        public List<string> Cast { get; set; } // List of cast members
        public int Rating { get; set; } // Rating (e.g., 77)
        public int Runtime { get; set; } // Runtime in minutes
        public ImageSet ImageSet { get; set; } // Image set (posters, banners, etc.)
        public Dictionary<string, List<StreamingOption>> StreamingOptions { get; set; } // Streaming options by country
    }

    public class ImageSet
    {
        public VerticalPoster VerticalPoster { get; set; } // Vertical poster images
    }

    public class VerticalPoster
    {
        public string W240 { get; set; } // URL for the 240px wide poster
    }

    public class StreamingOption
    {
        public string ServiceId { get; set; } // Service ID (e.g., "apple")
        public string Name { get; set; } // Service name (e.g., "Apple TV")
        public string HomePage { get; set; } // Service homepage URL
        public string ThemeColorCode { get; set; } // Theme color code (e.g., "#000000")
        public ServiceImageSet ImageSet { get; set; } // Service logo images
        public string Type { get; set; } // Type of streaming (e.g., "buy", "rent", "subscription")
        public string Link { get; set; } // Link to the streaming page
        public string Quality { get; set; } // Quality (e.g., "hd")
        public List<string> Audios { get; set; } // Available audio languages
        public List<string> Subtitles { get; set; } // Available subtitle languages
        public Price Price { get; set; } // Price information
        public bool ExpiresSoon { get; set; } // Whether the availability expires soon
        public long AvailableSince { get; set; } // Timestamp when the movie became available
    }

    public class ServiceImageSet
    {
        public string LightThemeImage { get; set; } // Logo for light theme
        public string DarkThemeImage { get; set; } // Logo for dark theme
        public string WhiteImage { get; set; } // White logo
    }

    public class Price
    {
        public string Amount { get; set; } // Price amount (e.g., "19.99")
        public string Currency { get; set; } // Currency code (e.g., "USD")
        public string Formatted { get; set; } // Formatted price (e.g., "19.99 USD")
    }
}