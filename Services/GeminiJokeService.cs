using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace JOKEWEBAPPS.Services
{
    public class GeminiJokeService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiJokeService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["Gemini:ApiKey"];
        }

        public async Task<string> GeneratePunchlineAsync(string setup)
        {
            if (string.IsNullOrWhiteSpace(_apiKey) || _apiKey == "YOUR_API_KEY_HERE")
            {
                return "Error: Missing Gemini API Key in appsettings.json.";
            }

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = $"You are a comedian. Finish this joke setup with a short, punchy punchline. Only return the punchline text, nothing else. Setup: {setup}" }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.9,
                    maxOutputTokens = 60
                }
            };

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
            
            try
            {
                var response = await _httpClient.PostAsJsonAsync(url, requestBody);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    using var document = JsonDocument.Parse(responseContent);
                    var text = document.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();
                    
                    return text?.Trim() ?? "I'm speechless.";
                }
                
                var error = await response.Content.ReadAsStringAsync();
                return $"AI is currently offline. (Status: {response.StatusCode})";
            }
            catch (Exception ex)
            {
                return $"Error connecting to AI: {ex.Message}";
            }
        }
    }
}
