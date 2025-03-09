const API_KEY = "8acbcea00bfb44e6943b62a25889f49c";
const url = "https://newsapi.org/v2/everything?q=";

// Fetch news on page load
window.addEventListener("load", () => fetchNews("India"));

// Reload button
document.getElementById("reload-button").addEventListener("click", () => location.reload());

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();

        console.log("API Response:", data); // Debugging log

        if (data.articles) bindData(data.articles);
        else console.error("No articles found for:", query);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const template = document.getElementById("template-news-card");
    cardsContainer.innerHTML = ""; // Clear previous news

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const card = template.content.cloneNode(true);
        fillData(card, article);
        cardsContainer.appendChild(card);
    });
}

function fillData(card, article) {
    card.querySelector(".news-img").src = article.urlToImage;
    card.querySelector(".news-title").textContent = article.title;
    card.querySelector(".news-desc").textContent = article.description;
    card.querySelector(".news-source").textContent = `${article.source.name} · ${new Date(article.publishedAt).toLocaleString()}`;

    card.firstElementChild.addEventListener("click", () => window.open(article.url, "_blank"));
}

// Navbar category click event
document.querySelectorAll("#nav-items li").forEach(item => {
    item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        console.log("Fetching news for:", category); // Debugging log
        fetchNews(category);
        
        // Remove previous active class and set the new one
        document.querySelector(".active")?.classList.remove("active");
        item.classList.add("active");
    });
});

// Search functionality
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-text").value;
    if (query) fetchNews(query);
});
