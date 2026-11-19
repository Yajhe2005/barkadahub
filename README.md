# 🎓 BarkadaHub

> Your barkada's all-in-one college toolkit — study tools, decision makers, mini games, and planning, all in one place.

BarkadaHub is a lightweight web app built with **plain HTML, CSS, and JavaScript** (no frameworks, no build step). It's designed to help college students and their friends with everyday life: studying, deciding what to eat, splitting bills, and having fun.

---

## ✨ Features

### 📚 Study Tools
- **⏱️ Focus Timer**
  - 🍅 **Pomodoro**: 25-min focus, 5-min short break, 15-min long break, with a progress ring and session stats
  - 🌊 **Flowtime**: work as long as you want, then get a suggested break (~20% of your work time, minimum 5 min) plus a session log
- **📊 Grade Calculator**: weighted average with add/remove components and pass/fail remarks

### 🎲 Decision Tools
- **🃏 Random Picker**: food, activity, study-spot cards, or add your own custom options
- **🪙 Coin Flip & Yes/No**: animated coin, yes/no spinner, and random number roller

### 👥 Barkada Tools
- **🔀 Random Groups**: split names into random teams
- **💸 Expense Splitter**: track expenses and split the bill evenly (₱)

### 🎮 Mini Games
- **⌨️ Word Blitz**: ZType-style typing game with combos, levels, and lives
- **🧠 Memory Match**: flip cards and find all pairs (Easy 4×4 / Hard 5×4)

### 📅 Planning
- **📅 Shared Calendar**: monthly view, color-coded events, and an upcoming events list

---

## 🚀 Getting Started

No installation needed.

1. Clone or download this repository
   ```bash
   git clone https://github.com/<your-username>/barkadahub.git
   ```
2. Open `index.html` in your browser
3. Log in with the demo account:

   | Username  | Password |
   |-----------|----------|
   | `barkada` | `1234`   |

---

## 🌐 Deploy with GitHub Pages (free hosting)

1. Push this project to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`
4. Choose the `main` branch and the `/ (root)` folder, then click **Save**
5. After a minute, your site will be live at:
   `https://<your-username>.github.io/barkadahub/`

---

## 📁 Project Structure

```
barkadahub/
├── index.html
├── README.md
├── css/
│   ├── main.css       # variables, reset, login, nav, home
│   ├── pages.css      # tool pages (timer, grades, calendar, etc.)
│   └── games.css      # Word Blitz + Memory Match
└── js/
    ├── auth.js        # login / logout
    ├── router.js      # page navigation
    ├── timer.js       # Pomodoro timer + timer type switcher
    ├── flowtime.js    # Flowtime timer
    ├── cards.js       # random card picker
    ├── grades.js      # grade calculator
    ├── decision.js    # coin flip, yes/no, random number
    ├── groups.js      # random group maker
    ├── expenses.js    # expense splitter
    ├── calendar.js    # shared calendar
    ├── wordblitz.js   # Word Blitz game
    └── memory.js      # Memory Match game
```

---

## ⚠️ Notes

- **Login is for demo/design purposes only.** Usernames and passwords are stored in plain text in `js/auth.js`, so don't use real passwords. You can edit the `USERS` object there to add your friends.
- **Data is not saved.** Calendar events, expenses, and timer logs reset when you refresh the page (only the Word Blitz best score is kept in `localStorage`).
- The calendar is "shared" in layout only. Everyone using it sees their own browser's data. A backend (e.g. Firebase) would be needed for real sharing.
- Fonts (Syne, DM Sans) load from Google Fonts, so an internet connection is needed for the intended look.

---

## 🛠️ Built With

- HTML5
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript

---

Made with ❤️ for the barkada.
