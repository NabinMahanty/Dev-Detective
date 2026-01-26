const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const statusText = document.getElementById("status");

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
      `https://api.github.com/users/${username}/repos`,
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
