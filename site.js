(function () {
  const root = document.body;
  const savedTheme = localStorage.getItem("Irie-retro-theme");

  if (savedTheme === "light") {
    root.classList.add("light-retro");
  }

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      root.classList.toggle("light-retro");
      localStorage.setItem(
        "Irie-retro-theme",
        root.classList.contains("light-retro") ? "light" : "dark"
      );
    });
  });

  document.querySelectorAll("[data-card-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".retro-card");
      const expanded = card.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(expanded));
    });
  });

  document.querySelectorAll("[data-ad]").forEach((ad) => {
    ad.addEventListener("click", () => {
      ad.dataset.clicked = "true";
      const label = ad.querySelector("small");
      if (label) {
        label.textContent = "pop-up blocked by Irie OS";
      }
    });
  });

  const directory = [
    {
      title: "Architecture",
      url: "architecture.html",
      cardUrl: "index.html#architecture",
      keywords: "architecture modular config data strategies engine execution risk monitoring backtest system blueprint"
    },
    {
      title: "Strategies",
      url: "strategies.html",
      cardUrl: "index.html#strategies",
      keywords: "strategies trend following mean reversion breakout sma rsi bollinger signal alpha"
    },
    {
      title: "Signal Resolver",
      url: "signal-resolver.html",
      cardUrl: "index.html#signal-resolver",
      keywords: "signal resolver merge votes naked shorting position reversal close cover arbitration"
    },
    {
      title: "Risk Management",
      url: "risk-management.html",
      cardUrl: "index.html#risk-management",
      keywords: "risk kelly portfolio heat exposure daily loss drawdown atr stops sizing guardrails"
    },
    {
      title: "Data Pipeline",
      url: "data-pipeline.html",
      cardUrl: "index.html#data-pipeline",
      keywords: "data pipeline fetching caching cache rate limiting provider yahoo parquet bars source"
    },
    {
      title: "Execution",
      url: "execution.html",
      cardUrl: "index.html#execution",
      keywords: "execution ibkr broker paper live market order bracket orders gateway tws"
    },
    {
      title: "Notifications",
      url: "notifications.html",
      cardUrl: "index.html#notifications",
      keywords: "notifications discord telegram webhook bot alerts pager error status"
    },
    {
      title: "Backtesting",
      url: "backtesting.html",
      cardUrl: "index.html#backtesting",
      keywords: "backtesting vectorbt metrics sharpe max drawdown win rate simulation historical"
    },
    {
      title: "Dashboard",
      url: "dashboard.html",
      cardUrl: "index.html#dashboard",
      keywords: "dashboard fastapi endpoints health positions trades signals realtime localhost"
    },
    {
      title: "Deployment",
      url: "deployment.html",
      cardUrl: "index.html#deployment",
      keywords: "deployment vps oracle cloud docker systemd security secrets firewall server"
    }
  ];

  const scoreItem = (item, query) => {
    const q = query.trim().toLowerCase();
    if (!q) return 1;
    const haystack = `${item.title} ${item.keywords}`.toLowerCase();
    return q
      .split(/\s+/)
      .filter(Boolean)
      .reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
  };

  const renderResults = (resultsBox, query) => {
    const matches = directory
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ item }) => item);

    resultsBox.innerHTML = "";

    if (!matches.length) {
      const empty = document.createElement("span");
      empty.className = "search-empty";
      empty.textContent = "no local directory hits";
      resultsBox.append(empty);
      return null;
    }

    matches.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.title;
      resultsBox.append(link);
    });

    return matches[0];
  };

  document.querySelectorAll("[data-site-search]").forEach((form) => {
    const input = form.querySelector("input[type='search']");
    const resultsBox = form.querySelector("[data-search-results]");
    let bestMatch = resultsBox ? renderResults(resultsBox, input.value) : null;

    input.addEventListener("input", () => {
      bestMatch = resultsBox ? renderResults(resultsBox, input.value) : null;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!bestMatch && resultsBox) {
        bestMatch = renderResults(resultsBox, input.value);
      }
      if (bestMatch) {
        window.location.href = bestMatch.url;
      }
    });
  });

  const counter = document.querySelector("[data-counter]");
  if (counter) {

    const namespace = "irie-trading-bot";
    const key = "unique-visitors";
    const visitedKey = "irie_ret_visited";

    const pad = (n) => String(n).padStart(6, "0");
    const updateDisplay = (n) => {
      counter.textContent = pad(n);
    };

    const fetchCount = async (increment) => {
      const url = increment
        ? `https://api.countapi.xyz/hit/${namespace}/${key}`
        : `https://api.countapi.xyz/get/${namespace}/${key}`;
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Network response was not ok");
        const j = await res.json();
        if (typeof j.value === "number") {
          updateDisplay(j.value);
          return;
        }
      } catch (e) {
        // fall through to local fallback
      }

      // fallback: local counter stored in localStorage (only for offline / blocked API)
      const local = Number(localStorage.getItem("Irie-retro-counter") || "128");
      const next = increment ? local + 1 : local;
      localStorage.setItem("Irie-retro-counter", String(next));
      updateDisplay(next);
    };

    (async () => {
      const hasVisited = localStorage.getItem(visitedKey);
      if (!hasVisited) {
        await fetchCount(true); // increment global counter and show result
        localStorage.setItem(visitedKey, String(Date.now()));
      } else {
        await fetchCount(false); // just read current global count
      }
    })();
  }
})();
