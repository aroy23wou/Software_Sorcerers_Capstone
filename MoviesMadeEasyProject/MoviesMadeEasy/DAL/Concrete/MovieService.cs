using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using MoviesMadeEasy.Models;
using MoviesMadeEasy.DTOs;
using MoviesMadeEasy.DAL.Abstract;

namespace MoviesMadeEasy.DAL.Concrete
{
    public class MovieService : IMovieService
    {
        private readonly HttpClient _httpClient;
        private const string ApiKey = "2f855c58c0msh088be7c2675ba23p1d2815jsn4397c7bac39f"; // Replace with your actual RapidAPI key
        private const string ApiHost = "streaming-availability.p.rapidapi.com";

        public MovieService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", ApiKey);
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", ApiHost);
        }

        public async Task<List<MoviesMadeEasy.Models.Movie>> SearchMoviesAsync(string query)
        {
            var url = $"https://streaming-availability.p.rapidapi.com/search/title?title={query}&country=us";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Response Content: " + content); // Debugging log

                // Deserialize the response
                var apiResponse = JsonSerializer.Deserialize<ApiResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                // Ensure results are not null before returning
                return apiResponse?.Results?.Cast<MoviesMadeEasy.Models.Movie>().ToList() ?? new List<MoviesMadeEasy.Models.Movie>();
            }

            return new List<MoviesMadeEasy.Models.Movie>();
        }
    }
}
