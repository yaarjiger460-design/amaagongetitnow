// GetItNow Finds - High-Converting Product Bridge & Catalog Engine

document.addEventListener("DOMContentLoaded", () => {
  const spotlightContainer = document.getElementById("spotlight-container");
  const productsGrid = document.getElementById("products-grid");
  const searchInput = document.getElementById("search-input");
  const filterPills = document.querySelectorAll(".filter-pill");
  const resultsCount = document.getElementById("results-count");
  const sectionTitle = document.getElementById("catalog-section-title");

  let currentCategory = "all";
  let searchQuery = "";

  // 1. Check for URL Parameter (e.g. ?p=pill-case or ?p=airplane-footrest)
  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const spotlightId = getUrlParam("p") || getUrlParam("product");

  // 2. Render Spotlight Mode (Bridge Page)
  function renderSpotlight(productId) {
    const item = products.find((p) => p.id.toLowerCase() === productId.toLowerCase());
    if (!item) {
      spotlightContainer.innerHTML = "";
      spotlightContainer.style.display = "none";
      return;
    }

    document.title = `${item.title} | GetItNow Finds`;

    const starsHtml = "★".repeat(Math.floor(parseFloat(item.rating))) + (parseFloat(item.rating) % 1 >= 0.5 ? "½" : "");

    spotlightContainer.style.display = "block";
    spotlightContainer.innerHTML = `
      <div class="spotlight-card">
        <div class="spotlight-header-pill">
          <div><span class="pulse-dot"></span> <strong>Featured Find from Pinterest</strong></div>
          <span style="font-size:0.75rem; color:#b45309;">Verified Amazon Listing</span>
        </div>
        <div class="spotlight-body">
          <div class="spotlight-image-box">
            <img src="${item.image}" alt="${item.title}" loading="eager" />
          </div>
          <div class="spotlight-details">
            <div class="spotlight-badges">
              <span class="badge badge-${item.badgeType}" style="position:static;">${item.badge}</span>
              <div class="rating-box">
                <span class="stars">${starsHtml}</span>
                <span>${item.rating}</span>
                <span style="color:#64748b; font-weight:normal;">(${item.reviews} reviews)</span>
              </div>
            </div>

            <h2 class="spotlight-title">${item.title}</h2>
            <p class="spotlight-tagline">${item.tagline}</p>

            <ul class="bullet-list">
              ${item.bullets
                .map(
                  (b) => `
                <li>
                  <span class="check-icon">✓</span>
                  <span>${b}</span>
                </li>
              `
                )
                .join("")}
            </ul>

            <a href="${item.amazonUrl}" target="_blank" rel="noopener noreferrer sponsored" class="cta-button" id="spotlight-cta">
              <div class="btn-main">
                <span>Check Price & Availability on Amazon</span>
                <span style="font-size:1.2rem;">➔</span>
              </div>
              <div class="btn-sub">Prime eligible • Safe 24-hr checkout on Amazon.com</div>
            </a>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
              <a href="index.html" class="reset-spotlight-btn" id="view-all-link">
                ← Browse all curated finds
              </a>
              <span style="font-size:0.75rem; color:#94a3b8;">Official Affiliate Link</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (sectionTitle) {
      sectionTitle.textContent = "More Viral Finds You Might Like";
    }

    // Scroll smoothly to spotlight card
    spotlightContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 3. Render Product Card for Grid
  function createProductCard(item) {
    const starsHtml = "★".repeat(Math.floor(parseFloat(item.rating))) + (parseFloat(item.rating) % 1 >= 0.5 ? "½" : "");

    return `
      <div class="product-card" data-id="${item.id}" data-category="${item.category}">
        <div class="card-image-box">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <span class="badge badge-${item.badgeType}">${item.badge}</span>
        </div>
        <div class="card-content">
          <div class="card-rating">
            <span class="stars">${starsHtml}</span>
            <span>${item.rating}</span>
            <span style="color:#64748b; font-weight:normal;">(${item.reviews})</span>
          </div>

          <h3 class="card-title">${item.title}</h3>
          <p class="card-tagline">${item.tagline}</p>

          <div class="card-features">
            ${item.features.map((f) => `<span class="feature-tag">${f}</span>`).join("")}
          </div>

          <div class="card-footer">
            <a href="${item.amazonUrl}" target="_blank" rel="noopener noreferrer sponsored" class="card-btn">
              <span>View on Amazon</span>
              <span style="font-size:0.9rem;">➔</span>
            </a>
            <a href="index.html?p=${item.id}" class="card-spotlight-link">
              Read product highlights & details
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Filter & Render Catalog Grid
  function renderCatalog() {
    let filtered = products;

    // Filter by Spotlight exclusion (if spotlight is showing, don't duplicate that exact card at top of grid)
    if (spotlightId) {
      filtered = filtered.filter((p) => p.id.toLowerCase() !== spotlightId.toLowerCase());
    }

    // Filter by Category
    if (currentCategory !== "all") {
      if (currentCategory === "under15") {
        filtered = filtered.filter((p) => p.badge.includes("Under") || p.badgeType === "budget");
      } else {
        filtered = filtered.filter((p) => p.category === currentCategory);
      }
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
        );
      });
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <h3>No products found</h3>
          <p>Try searching for "travel", "organizer", or browse by categories above.</p>
        </div>
      `;
      if (resultsCount) resultsCount.textContent = "0 items found";
      return;
    }

    productsGrid.innerHTML = filtered.map(createProductCard).join("");
    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} curated find${filtered.length === 1 ? "" : "s"}`;
    }
  }

  // 5. Category Pill Clicks
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.category;
      renderCatalog();
    });
  });

  // 6. Live Search Input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Initialize
  if (spotlightId) {
    renderSpotlight(spotlightId);
  }
  renderCatalog();
});
