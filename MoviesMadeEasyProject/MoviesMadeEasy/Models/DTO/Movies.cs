using System.Collections.Generic;

namespace MoviesMadeEasy.DTOs
{
    public class ApiResponse
    {
        public List<Movie> Results { get; set; } // List of movies returned by the API
    }

    public class Movie
    {
        public string ItemType { get; set; }
        public string ShowType { get; set; }
        public string Id { get; set; }
        public string ImdbId { get; set; }
        public string TmdbId { get; set; }
        public string Title { get; set; }
        public string Overview { get; set; }
        public int ReleaseYear { get; set; }
        public string OriginalTitle { get; set; }
        public List<string> Genres { get; set; }
        public List<string> Directors { get; set; }
        public List<string> Cast { get; set; }
        public int Rating { get; set; }
        public int Runtime { get; set; }
        public ImageSet ImageSet { get; set; }
        public Dictionary<string, List<StreamingOption>> StreamingOptions { get; set; }
    }

    public class ImageSet
    {
        public VerticalPoster VerticalPoster { get; set; }
    }

    public class VerticalPoster
    {
        public string W240 { get; set; }
    }

    public class StreamingOption
    {
        public string ServiceId { get; set; }
        public string Name { get; set; }
        public string HomePage { get; set; }
        public string ThemeColorCode { get; set; }
        public ServiceImageSet ImageSet { get; set; }
        public string Type { get; set; }
        public string Link { get; set; }
        public string Quality { get; set; }
        public List<string> Audios { get; set; }
        public List<string> Subtitles { get; set; }
        public Price Price { get; set; }
        public bool ExpiresSoon { get; set; }
        public long AvailableSince { get; set; }
    }

    public class ServiceImageSet
    {
        public string LightThemeImage { get; set; }
        public string DarkThemeImage { get; set; }
        public string WhiteImage { get; set; }
    }

    public class Price
    {
        public string Amount { get; set; }
        public string Currency { get; set; }
        public string Formatted { get; set; }
    }
}