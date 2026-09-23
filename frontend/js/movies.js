const TVMAZE_API_URL = "https://api.tvmaze.com";

document.addEventListener("DOMContentLoaded", () => {
    initializeMovieSearch();
    initializeMovieRemoval();
});


/* =========================================
   MOVIE SEARCH
========================================= */

function initializeMovieSearch() {

    const searchForm =
        document.getElementById("movieSearchForm");

    const searchInput =
        document.getElementById("movieSearch");

    if (!searchForm || !searchInput) {
        return;
    }


    searchForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const query =
            searchInput.value.trim();

        if (!query) {
            clearSearchResults();
            return;
        }

        await searchMovies(query);

    });

}


/* =========================================
   SEARCH TVMAZE
========================================= */

async function searchMovies(query) {

    const searchResults =
        document.getElementById("searchResults");

    if (!searchResults) {
        return;
    }


    showSearchMessage(
        searchResults,
        "Searching..."
    );


    try {

        const response = await fetch(
            `${TVMAZE_API_URL}/search/shows?q=${encodeURIComponent(query)}`
        );


        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }


        const results =
            await response.json();


        renderSearchResults(results);

    } catch (error) {

        console.error(
            "Movie search error:",
            error
        );

        showSearchMessage(
            searchResults,
            "Unable to search movies. Please try again."
        );

    }

}


/* =========================================
   RENDER SEARCH RESULTS
========================================= */

function renderSearchResults(results) {

    const searchResults =
        document.getElementById("searchResults");


    if (!searchResults) {
        return;
    }


    searchResults.innerHTML = "";


    if (!results.length) {

        showSearchMessage(
            searchResults,
            "No movies found."
        );

        return;
    }


    results.slice(0, 6).forEach(result => {

        const show =
            result.show;

        const card =
            createSearchResultCard(show);

        searchResults.appendChild(card);

    });


    searchResults.classList.add(
        "has-results"
    );

}


/* =========================================
   CREATE SEARCH RESULT CARD
========================================= */

function createSearchResultCard(show) {

    const card =
        document.createElement("article");

    card.className =
        "search-result";


    const image =
        document.createElement("img");

    image.src =
        getMovieImage(show);

    image.alt =
        show.name || "Movie";


    const content =
        document.createElement("div");

    content.className =
        "search-result-content";


    const title =
        document.createElement("h3");

    title.textContent =
        show.name || "Untitled";


    content.appendChild(title);

    card.appendChild(image);

    card.appendChild(content);


    card.addEventListener(
        "click",
        () => addMovieToGrid(show)
    );


    return card;

}


/* =========================================
   ADD MOVIE TO GRID
========================================= */

function addMovieToGrid(show) {

    const movieGrid =
        document.getElementById("movieGrid");


    if (!movieGrid) {
        return;
    }


    const movieId =
        String(show.id);


    // Prevent duplicate movies

    const existingMovie =
        movieGrid.querySelector(
            `[data-movie-id="${movieId}"]`
        );


    if (existingMovie) {

        showSearchMessage(
            document.getElementById("searchResults"),
            "This movie is already in your favourites."
        );

        return;
    }


    const movieCard =
        createMovieCard(show);


    movieGrid.appendChild(movieCard);


    // Clear search results after selecting

    clearSearchResults();

    const searchInput =
        document.getElementById("movieSearch");

    if (searchInput) {
        searchInput.value = "";
    }

}


/* =========================================
   CREATE MOVIE CARD
========================================= */

function createMovieCard(show) {

    const article =
        document.createElement("article");

    article.className =
        "movie-card";

    article.dataset.movieId =
        show.id;


    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "movie-image-wrapper";


    const image =
        document.createElement("img");

    image.className =
        "movie-image";

    image.src =
        getMovieImage(show);

    image.alt =
        show.name || "Movie";


    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.className =
        "remove-movie";

    removeButton.setAttribute(
        "aria-label",
        `Remove ${show.name}`
    );

    removeButton.textContent =
        "×";


    removeButton.addEventListener(
        "click",
        () => {
            article.remove();
        }
    );


    imageWrapper.appendChild(image);

    imageWrapper.appendChild(
        removeButton
    );


    const content =
        document.createElement("div");

    content.className =
        "movie-content";


    const title =
        document.createElement("h3");

    title.textContent =
        show.name || "Untitled";


    const description =
        document.createElement("p");

    description.innerHTML =
        cleanSummary(
            show.summary
        );


    content.appendChild(title);

    content.appendChild(description);


    article.appendChild(imageWrapper);

    article.appendChild(content);


    return article;

}


/* =========================================
   REMOVE STATIC MOVIES
========================================= */

function initializeMovieRemoval() {

    const removeButtons =
        document.querySelectorAll(
            ".movie-card .remove-movie"
        );


    removeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".movie-card"
                    );

                if (card) {
                    card.remove();
                }

            }
        );

    });

}


/* =========================================
   IMAGE
========================================= */

function getMovieImage(show) {

    if (
        show.image &&
        show.image.medium
    ) {
        return show.image.medium;
    }


    return createPlaceholderImage(
        show.name
    );

}


/* =========================================
   PLACEHOLDER IMAGE
========================================= */

function createPlaceholderImage(title) {

    return (
        "data:image/svg+xml;charset=UTF-8," +
        `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="295">` +
        `<rect width="100%" height="100%" fill="#333"/>` +
        `<text x="50%" y="50%" fill="#aaa" ` +
        `font-size="14" text-anchor="middle">` +
        `${escapeXml(title || "No Image")}` +
        `</text></svg>`
    );

}


/* =========================================
   SUMMARY
========================================= */

function cleanSummary(summary) {

    if (!summary) {
        return "No description available.";
    }


    const temporaryElement =
        document.createElement("div");

    temporaryElement.innerHTML =
        summary;


    const text =
        temporaryElement.textContent ||
        temporaryElement.innerText ||
        "";


    return truncateText(
        text,
        120
    );

}


/* =========================================
   TRUNCATE TEXT
========================================= */

function truncateText(text, maxLength) {

    if (text.length <= maxLength) {
        return text;
    }


    return `${text.substring(0, maxLength).trim()}...`;

}


/* =========================================
   ESCAPE XML
========================================= */

function escapeXml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

}


/* =========================================
   SEARCH MESSAGE
========================================= */

function showSearchMessage(
    container,
    message
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";

    container.classList.add(
        "has-results"
    );


    const messageElement =
        document.createElement("p");

    messageElement.textContent =
        message;

    messageElement.style.gridColumn =
        "1 / -1";

    messageElement.style.color =
        "#999999";

    messageElement.style.fontSize =
        "10px";


    container.appendChild(
        messageElement
    );

}


/* =========================================
   CLEAR RESULTS
========================================= */

function clearSearchResults() {

    const searchResults =
        document.getElementById("searchResults");


    if (!searchResults) {
        return;
    }


    searchResults.innerHTML = "";

    searchResults.classList.remove(
        "has-results"
    );

}