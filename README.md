# Emoji Slots Builder

A modern, interactive web application for creating and playing custom slot machine games with emojis.

![Emoji Slots Builder](docs/images/emoji-slots-builder-preview.png)

## 🎮 Overview

Emoji Slots Builder is a feature-rich application that allows users to create, customize, and play their own slot machine games. With an intuitive interface and powerful customization options, users can design unique slot machines with custom symbols, paylines, and payout rules.

## ✨ Features

- **Create Custom Slot Machines**: Design your own slot machines with custom emojis, paylines, and payout rules
- **Game Directory**: Browse and play slot machines created by the community
- **Customizable Themes**: Personalize your slot machine with custom colors and themes
- **Special Features**: Support for wilds, scatters, jackpots, free spins, and multipliers
- **Theme Inspirations**: Choose from pre-designed themes like Fruits, Animals, Ocean, Space, and Fantasy
- **Symbol Management**: Add, edit, and remove symbols with custom payouts and weights
- **Responsive Design**: Works on desktop and mobile devices
- **Game Mechanics**: Start with $1,000 and try to reach $30,000 to win the game
- **RTP Implementation**: Realistic Return to Player mechanics that affect gameplay

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/emoji-slots-builder.git
   cd emoji-slots-builder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 📚 Documentation

Comprehensive documentation is available in the `docs` directory:

- [User Guide](docs/user/USER_GUIDE.md) - For players and slot machine creators
- [Developer Documentation](docs/developer/DEVELOPER_GUIDE.md) - For developers who want to modify or extend the application
- [Product Documentation](docs/product/PRODUCT_SPEC.md) - For product managers and stakeholders

## 📁 Project Structure

```
/
├── docs/                # Documentation
│   ├── developer/       # Developer documentation
│   ├── product/         # Product documentation
│   ├── user/            # User documentation
│   └── images/          # Documentation images
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── EmojiPicker/ # Emoji selection component
│   │   ├── GameDirectory/ # Game listing component
│   │   ├── SlotBuilder/ # Slot machine creation component
│   │   └── SlotMachine/ # Slot machine gameplay component
│   ├── utils/           # Utility functions
│   │   └── slotMachineEngine.ts  # Core game logic
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Application entry point
└── package.json         # Project dependencies and scripts
```

## 🎮 Game Rules

- **Starting Balance**: Players begin with $1,000 in credits
- **Win Condition**: Reach $30,000 to win the game
- **Game Over**: If your balance reaches $0, the game ends
- **RTP (Return to Player)**: The configured RTP affects your chances of winning on each spin
- **Special Features**:
  - **Wild Symbols**: Substitute for other symbols to help form winning combinations
  - **Scatter Symbols**: Trigger free spins when 3 or more appear
  - **Jackpot Symbols**: Get 5 on a payline to win the jackpot prize
  - **Multipliers**: Randomly multiply your winnings

## 🛠️ Available Scripts

- `npm start` - Starts the development server
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm lint` - Runs the linter
- `npm format` - Formats the code with Prettier

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Emoji support provided by native browser capabilities
- Inspired by classic slot machine games 