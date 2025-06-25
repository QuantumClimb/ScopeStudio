# ScopeStudio - Content-First Wireframing Tool

ScopeStudio helps developers, writers, and clients stay aligned by turning raw copy into clean wireframes instantly. No more back-and-forth over Word docs.

## 🚀 Features

- **Content-First Workflow**: Write content and see it come to life in wireframes
- **Multiple Pages**: Create up to 4 pages (free) or 6 pages (pro)
- **Live Preview**: See changes in real-time as you edit
- **Export Functionality**: Download your site data as JSON
- **Local Database**: SQLite for persistent data storage
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, shadcn/ui

## 🏗️ Project Structure

```
ScopeStudio/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── types/              # TypeScript interfaces
│   ├── services/           # Database service (SQLite)
│   └── api/                # API layer
├── server/                 # Express backend
└── scopestudio.db         # SQLite database (created automatically)
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ScopeStudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   The SQLite database will be created automatically when you first run the server.

## 🎯 Running the Application

### Option 1: Frontend Only (with localStorage)
```bash
npm run dev
```
- Runs on `http://localhost:8080` or `http://localhost:8081`
- Uses localStorage for data persistence
- Good for development and testing

### Option 2: Full Stack (Frontend + Backend)
```bash
npm run dev:full
```
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3001`
- Uses SQLite database for persistence
- Production-ready setup

### Option 3: Backend Only
```bash
npm run server
```
- Runs API server on `http://localhost:3001`
- For testing API endpoints

## 🗃️ Database

### SQLite Setup
The application uses SQLite for local data storage:

- **Database file**: `scopestudio.db` (created in project root)
- **Tables**: 
  - `users` - User accounts and plans
  - `site_data` - Page content and structure

### Database API Endpoints
- `POST /api/users` - Create/update user
- `GET /api/users/:email` - Get user data
- `POST /api/site-data` - Save site data
- `GET /api/site-data/:email` - Get site data
- `GET /api/site-data/:email/exists` - Check if data exists
- `GET /api/health` - Health check

### Moving to Supabase (Future)
The database service is designed to easily migrate to Supabase:
1. Update connection strings in `src/services/database.ts`
2. Replace SQLite queries with Supabase client calls
3. Update API endpoints to use Supabase

## 🧪 Testing

### Default Login Credentials
- **Email**: `test@scopestudio.com`
- **Password**: `password123`
- **Plan**: Free (4 pages max)

### Data Flow
1. **New Users**: Get default 4-page starter content
2. **Existing Users**: Load saved data from database/localStorage
3. **Data Persistence**: All changes auto-save to database
4. **Export**: Download complete site data as JSON

## 📁 Page Structure

Each page contains:
- **Basic Info**: ID, name, title, description
- **Hero Section**: Title, subheading, background image
- **Body Content**: Text content, body image
- **No Subpages**: Simplified structure (removed in latest version)

## 🎨 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite (better-sqlite3)
- **Backend**: Express.js, CORS
- **Build**: Vite, ts-node
- **State**: React hooks, localStorage fallback

## 🚧 Development

### Scripts
- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend API server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Key Components
- **Dashboard**: Main editing interface
- **PageEditor**: Content editing form
- **Preview**: Live wireframe preview
- **DashboardSidebar**: Page navigation
- **WireframeNavbar**: Preview navigation

### Data Persistence
- **Primary**: SQLite database via API
- **Fallback**: localStorage (client-side)
- **Auto-save**: All changes save immediately
- **Export**: JSON download with metadata

## 🔧 Configuration

### Environment Variables
```env
PORT=3001                    # Backend port
VITE_API_URL=localhost:3001  # API URL for frontend
```

### Database Configuration
Located in `src/services/database.ts`:
- Connection settings
- Table schemas
- Query operations

## 📖 Usage

1. **Login** with test credentials
2. **Edit Pages** using the sidebar navigation
3. **Preview** your wireframes in real-time
4. **Export** your data as JSON
5. **Add Pages** (up to plan limits)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Author

**Onomatix** - `juncando@gmail.com`

Built by Quantum Climb - Tools for the next generation of makers.

---

## 🔗 Future Enhancements

- [ ] Supabase migration
- [ ] HTML/CSS export
- [ ] Team collaboration
- [ ] Custom themes
- [ ] Advanced layouts
- [ ] Image upload
- [ ] Version history
