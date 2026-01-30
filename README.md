# 🔍 Dev Detective

A modern, interactive GitHub user search and comparison application with a beautiful gradient UI.

## ✨ Features

### 🔍 Search Mode

- **User Search**: Search for any GitHub user by username
- **Profile Display**: View detailed user information including:
  - Avatar and name
  - Bio and location
  - Account creation date
  - Personal website/blog
- **Repository List**: Display top 5 repositories with descriptions
- **Error Handling**: User-friendly error messages for invalid usernames or API issues

### ⚔️ Battle Mode

- **User Comparison**: Compare two GitHub users head-to-head
- **Scoring System**: Calculate winner based on:
  - Total repository stars
  - Follower count
  - Number of public repositories
- **Visual Results**: Beautiful winner/loser cards with stats
- **Validation**: Input validation and specific error messages

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for GitHub API access

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start searching for GitHub users!

## 🎮 How to Use

### Search Mode

1. Enter a GitHub username in the search box
2. Click the "Search" button or press Enter
3. View the user's profile and repositories

### Battle Mode

1. Click the "⚔️ Battle Mode" button
2. Enter two GitHub usernames (User 1 and User 2)
3. Click "Fight" to see who wins!
4. Switch back to Search Mode by clicking "🔍 Search Mode"

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with modern features
  - CSS Grid and Flexbox
  - Gradient backgrounds
  - Animations and transitions
  - Glassmorphism effects
  - Responsive design
- **JavaScript (ES6+)**: Logic and API integration
  - Async/await for API calls
  - Fetch API for HTTP requests
  - Error handling with try/catch
  - DOM manipulation

## 🌐 API

This application uses the [GitHub REST API](https://docs.github.com/en/rest) to fetch user data:

- User endpoint: `https://api.github.com/users/{username}`
- Repositories endpoint: `https://api.github.com/users/{username}/repos`

**Note**: GitHub API has rate limits for unauthenticated requests (60 requests per hour).

## 🎨 Design Features

- Modern gradient color scheme (Purple, Pink, Blue)
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Hover effects on interactive elements
- Responsive design for all screen sizes
- Beautiful card-based layouts

## 📁 Project Structure

```
Week_3/
├── index.html      # Main HTML structure
├── style.css       # All styling and animations
├── script.js       # JavaScript logic and API calls
└── README.md       # Project documentation
```

## 🔧 Key Functions

### Search Mode Functions

- `fetchUser(username)`: Fetches user data from GitHub API
- `displayUser(user)`: Displays user profile information
- `fetchMoreData(username)`: Fetches user repositories
- `displayRepos(repos)`: Displays repository cards

### Battle Mode Functions

- `battleUser(u1, u2)`: Fetches data for both users
- `showWinner(a, b, reposA, reposB)`: Determines and displays the winner

## 🎯 Future Enhancements

- Add more comparison metrics (contributions, gists, etc.)
- Save favorite users/comparisons
- Dark/Light theme toggle
- Export battle results
- Pagination for repositories
- Advanced search filters

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as part of Week 3 project at Prodesk IT

---

**Enjoy discovering developers! 🚀**
