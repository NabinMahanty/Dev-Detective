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
  isBattleOn = !isBattleOn;

  if (isBattleOn) {
    singleMode.style.display = "none";
    battleMode.style.display = "block";
  } else {
    singleMode.style.display = "block";
    battleMode.style.display = "none";
  }
});

fightBtn.addEventListener("click", () => {
  const u1 = document.getElementById("user1").value.trim();
  const u2 = document.getElementById("user2").value.trim();
  if (u1 && u2) {
    battleUser(u1, u2);
  }
});

async function battleUser(u1, u2) {
  const [r1, r2] = await Promise.all([
    fetch(`https://api.github.com/users/${u1}`),
    fetch(`https://api.github.com/users/${u2}`),
  ]);
  const d1 = await r1.json();
  const d2 = await r2.json();
  showWinner(d1, d2);
}

function showWinner(a, b) {
  const winner = a.followers > b.followers ? a : b;
  const loser = a.followers > b.followers ? b : a;

  document.getElementById("battleResult").innerHTML =
    `<p style="color:green">Winner: ${winner.login}</p>
    <p style="color:red">Loser: ${loser.login}</p>`;
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
      throw new Error("User Not Found");
    }

    const data = await response.json();
    displayUser(data);
    fetchMoreData(username);
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message;
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
