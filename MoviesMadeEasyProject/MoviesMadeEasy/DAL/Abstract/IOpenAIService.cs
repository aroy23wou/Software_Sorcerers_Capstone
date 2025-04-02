// IOpenAIService.cs
public interface IOpenAIService
{
    Task<List<MovieRecommendation>> GetSimilarMoviesAsync(string title);
    Task<string> GetChatCompletionAsync(string prompt);
    // Add other OpenAI operations you might need
}

public record MovieRecommendation(
    string Title,
    string Year,
    string Reason
);