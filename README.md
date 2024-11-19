# Story Writing App

A modern web application for writers to create, organize, and manage their stories with AI-assisted features. Built with Astro, React, and Supabase.

## 🚀 Features

- **Authentication**: Secure user authentication via GitHub
- **Story Management**: Create, edit, and organize multiple stories
- **Chapter Organization**: Break down stories into chapters with rich text editing
- **AI Integration**: Generate prose using AI with scene beat prompts
- **Rich Text Editor**: Powered by BlockNote with custom extensions
- **Lorebook System**: Manage story details, characters, and world-building
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) with [React](https://reactjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [TailwindCSS](https://tailwindcss.com/)
- **Editor**: [BlockNote](https://www.blocknotejs.org/)
- **Testing**: Vitest with React Testing Library

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with your Supabase credentials:
```bash
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Start the development server:
```bash
npm run dev
```

## 📦 Project Structure
/
├── public/
│ └── favicon.svg
├── src/
│ ├── components/ # React components
│ ├── layouts/ # Astro layouts
│ ├── pages/ # Astro pages
│ ├── store/ # Zustand stores
│ ├── types/ # TypeScript types
│ └── lib/ # Utility functions
├── .astro # Astro configuration
├── .env # Environment variables
├── .gitignore # Git ignore file
├── package.json # Node.js package manager file
├── README.md # This file


## 🧞 Commands

| Command                   | Action                                           |
| :----------------------- | :----------------------------------------------- |
| `npm install`            | Installs dependencies                            |
| `npm run dev`            | Starts local dev server at `localhost:4321`      |
| `npm run build`          | Build your production site to `./dist/`          |
| `npm run preview`        | Preview your build locally                       |
| `npm run test`           | Run tests                                        |
| `npm run coverage`       | Generate test coverage report                    |

## 🔒 Authentication

The app uses Supabase Authentication with GitHub OAuth. Protected routes are handled by the authentication middleware.

## 📝 Editor Features

- Rich text editing with BlockNote
- Custom Scene Beat blocks for AI-assisted writing
- Real-time content saving
- Markdown support
- Custom slash commands

## 🧪 Testing

The project includes unit tests for components using Vitest and React Testing Library. Run tests using:
```bash
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- [Vijaykumar Bhattacharji](https://github.com/vijayk1989) - Initial work

## 🙏 Acknowledgments

- [Astro](https://astro.build/) for the amazing web framework
- [Supabase](https://supabase.com/) for backend services
- [BlockNote](https://www.blocknotejs.org/) for the rich text editor
