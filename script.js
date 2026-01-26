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
      <p>Joined: ${new Date(user.created_at).toDateString()}</p>
      <a href="${user.blog}" target="_blank">${user.blog}</a>
    </div>
  `;
}
