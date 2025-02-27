/**
 * @jest-environment jsdom
 */

const { searchMovies } = require("../MoviesMadeEasy/wwwroot/js/movieSearch");
require("@testing-library/jest-dom");

// Mock the DOM
beforeAll(() => {
    document.body.innerHTML = `
        <input id="searchInput" value="Avengers" />
        <select id="sortBy">
            <option value="default">Sort by</option>
            <option value="titleAsc">Title (A-Z)</option>
            <option value="titleDesc">Title (Z-A)</option>
        </select>
        <div id="results"></div>
        <div id="loadingSpinner"></div>
    `;
});

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
    document.getElementById('results').innerHTML = ''; // Clear results
});

function decodeHtmlEntities(html) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
}

test('movies are sorted by title in ascending order', async () => {
    // Mock fetch for this test
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { title: "Avengers Confidential: Black Widow & Punisher", releaseYear: 2014, genres: ["Action", "Animation"], rating: 57 },
                { title: "Avengers from Hell", releaseYear: 1981, genres: ["Horror"], rating: 49 },
                { title: "Avengers Grimm", releaseYear: 2015, genres: ["Action", "Adventure", "Fantasy"], rating: 29 }
            ]),
        })
    );

    document.getElementById('sortBy').value = 'titleAsc';
    await searchMovies();

    const results = decodeHtmlEntities(document.getElementById('results').innerHTML);
    expect(results).toContain('Avengers Confidential: Black Widow & Punisher');
    expect(results).toContain('Avengers from Hell');
    expect(results).toContain('Avengers Grimm');

    // Verify the order
    const firstMovie = results.indexOf('Avengers Confidential: Black Widow & Punisher');
    const secondMovie = results.indexOf('Avengers from Hell');
    const thirdMovie = results.indexOf('Avengers Grimm');
    expect(firstMovie).toBeLessThan(secondMovie);
    expect(secondMovie).toBeLessThan(thirdMovie);
});

test('movies are sorted by title in descending order', async () => {
    // Mock fetch for this test
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { title: "Ultimate Avengers: The Movie", releaseYear: 2006, genres: ["Action", "Animation"], rating: 70 },
                { title: "The Avengers", releaseYear: 2012, genres: ["Action", "Adventure", "Sci-Fi"], rating: 85 },
                { title: "The Avengers", releaseYear: 1998, genres: ["Action", "Adventure"], rating: 60 }
            ]),
        })
    );

    document.getElementById('sortBy').value = 'titleDesc';
    await searchMovies();

    const results = decodeHtmlEntities(document.getElementById('results').innerHTML);
    expect(results).toContain('Ultimate Avengers: The Movie');
    expect(results).toContain('The Avengers');
    expect(results).toContain('The Avengers');

    // Verify the order
    const firstMovie = results.indexOf('Ultimate Avengers: The Movie');
    const secondMovie = results.indexOf('The Avengers');
    const thirdMovie = results.indexOf('The Avengers');
    expect(firstMovie).toBeLessThan(secondMovie);
    expect(secondMovie).toBeLessThanOrEqual(thirdMovie);
    //same result so <=
});