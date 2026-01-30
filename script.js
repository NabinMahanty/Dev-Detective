const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const statusText = document.getElementById("status");
const battleToggleBtn = document.getElementById("battleToggleBtn");
const singleMode = document.getElementById("singleMode");
const battleMode = document.getElementById("battleMode");
const fightBtn = document.getElementById("fightBtn");

let isBattleOn = false;

battleToggleBtn.addEventListener("click", () => {
  const isBattleModeVisible = battleMode.style.display === "block";

  if (isBattleModeVisible) {
    // Switch to Search Mode
    battleMode.style.display = "none";
    singleMode.style.display = "block";
    battleToggleBtn.textContent = "⚔️ Battle Mode";
    // Clear battle results when switching modes
    document.getElementById("battleResult").innerHTML = "";
  } else {
    // Switch to Battle Mode
    battleMode.style.display = "block";
    singleMode.style.display = "none";
    battleToggleBtn.textContent = "🔍 Search Mode";
    // Clear profile when switching modes
    profile.innerHTML = "";
    statusText.textContent = "";
  }
});

fightBtn.addEventListener("click", () => {
  const u1 = document.getElementById("user1").value.trim();
  const u2 = document.getElementById("user2").value.trim();

  if (!u1 || !u2) {
    document.getElementById("battleResult").innerHTML = `
      <div class="error-message">
        <p>⚠️ Please enter both usernames to start the battle!</p>
      </div>
    `;
    return;
  }

  if (u1 && u2) {
    battleUser(u1, u2);
  }
});

async function battleUser(u1, u2) {
  // Show loading state
  document.getElementById("battleResult").innerHTML = `
    <div class="loading-message">
      <p>⚔️ Preparing battle...</p>
    </div>
  `;

  try {
    const [r1, r2] = await Promise.all([
      fetch(`https://api.github.com/users/${u1}`),
      fetch(`https://api.github.com/users/${u2}`),
    ]);

    // Check if both users exist
    if (!r1.ok && !r2.ok) {
      throw new Error(
        `Both users "${u1}" and "${u2}" not found. Please check the usernames.`,
      );
    } else if (!r1.ok) {
      throw new Error(`User "${u1}" not found. Please check the username.`);
    } else if (!r2.ok) {
      throw new Error(`User "${u2}" not found. Please check the username.`);
    }

    const d1 = await r1.json();
    const d2 = await r2.json();

    const [repos1, repos2] = await Promise.all([
      fetch(`https://api.github.com/users/${u1}/repos?per_page=100`),
      fetch(`https://api.github.com/users/${u2}/repos?per_page=100`),
    ]);

    if (!repos1.ok || !repos2.ok) {
      throw new Error("Failed to fetch repositories. Please try again.");
    }

    const reposData1 = await repos1.json();
    const reposData2 = await repos2.json();

    showWinner(d1, d2, reposData1, reposData2);
  } catch (error) {
    document.getElementById("battleResult").innerHTML = `
      <div class="error-message">
        <p>❌ ${error.message}</p>
      </div>
    `;
  }
}

function showWinner(a, b, reposA, reposB) {
  const starsA = reposA.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const starsB = reposB.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  // Calculate total score
  const scoreA = starsA + a.followers + a.public_repos;
  const scoreB = starsB + b.followers + b.public_repos;

  // Determine winner and loser
  let winner, loser, winnerStars, loserStars;
  if (scoreA > scoreB) {
    winner = a;
    loser = b;
    winnerStars = starsA;
    loserStars = starsB;
  } else {
    winner = b;
    loser = a;
    winnerStars = starsB;
    loserStars = starsA;
  }

  document.getElementById("battleResult").innerHTML = `
    <div class="battle-cards">
      <div class="result-card winner-card">
        <h2> WINNER</h2>
        <img src="${winner.avatar_url}" alt="${winner.login}">
        <h3>${winner.login}</h3>
        <div class="stats">
          <div class="stat">
            <span class="stat-label">⭐ Total Stars</span>
            <span class="stat-value">${winnerStars}</span>
          </div>
          <div class="stat">
            <span class="stat-label">👥 Followers</span>
            <span class="stat-value">${winner.followers}</span>
          </div>
          <div class="stat">
            <span class="stat-label">📚 Repositories</span>
            <span class="stat-value">${winner.public_repos}</span>
          </div>
        </div>
      </div>

      <div class="result-card loser-card">
        <h2> LOSER</h2>
        <img src="${loser.avatar_url}" alt="${loser.login}">
        <h3>${loser.login}</h3>
        <div class="stats">
          <div class="stat">
            <span class="stat-label">⭐ Total Stars</span>
            <span class="stat-value">${loserStars}</span>
          </div>
          <div class="stat">
            <span class="stat-label">👥 Followers</span>
            <span class="stat-value">${loser.followers}</span>
          </div>
          <div class="stat">
            <span class="stat-label">📚 Repositories</span>
            <span class="stat-value">${loser.public_repos}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function calculateScore(user) {
  const followerScore = user.followers * 2;
  const repoScore = user.public_repos * 3;
  const gistScore = user.public_gists * 1;
  const accountAgeScore = getAccountAge(user.created_at) * 0.1;

  return followerScore + repoScore + gistScore + accountAgeScore;
}

function getAccountAge(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  const diff = now - created;
  return Math.floor(diff / (1000 * 60 * 60 * 24)); // days
}

searchBtn.addEventListener("click", () => {
  const username = input.value.trim();
  if (username) {
    fetchUser(username);
  }
});

async function fetchUser(username) {
  statusText.textContent = "Loading...";
  profile.innerHTML = "";

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `User "${username}" not found. Please check the username.`,
        );
      } else if (response.status === 403) {
        throw new Error("API rate limit exceeded. Please try again later.");
      } else {
        throw new Error("Failed to fetch user data. Please try again.");
      }
    }

    const data = await response.json();
    displayUser(data);
    fetchMoreData(username);
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message;
    profile.innerHTML = "";
  }
}

function displayUser(user) {
  profile.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}">
      <h2>${user.name || "No Name"}</h2>
      <p>${user.bio || "No Bio"}</p>
      <p>${user.location || "No location"}</p>
      <p>Joined: ${new Date(user.created_at).toDateString()}</p>
      <a href="${user.blog}" target="_blank">${user.blog}</a>
    </div>
  `;
}

async function fetchMoreData(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=5`,
    );
    if (!response.ok) {
      throw new Error("Repositories Not Found");
    }
    const data = await response.json();
    displayRepos(data);
  } catch (error) {
    statusText.textContent = error.message;
  }
}

function displayRepos(repos) {
  const repoContainer = document.createElement("div");
  repoContainer.className = "repos";
  repoContainer.innerHTML = "<h3>Repositories:</h3>";

  repos.slice(0, 5).forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";
    repoCard.innerHTML = `
      <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
      <p>${repo.description || "No description"}</p>
    `;
    repoContainer.appendChild(repoCard);
  });

  profile.appendChild(repoContainer);
}
