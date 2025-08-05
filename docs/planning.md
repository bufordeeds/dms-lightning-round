# Lightning Round Q&A Session Manager - Planning Document

## Project Overview
A web application to manage lightning round Q&A sessions for company meetings. This is a game where someone asks a random question (e.g., "What is your all-time favorite movie?") and collects answers from all employees in rapid succession. The app helps track these sessions, manage the employee roster, and view historical Q&A data.

## Architecture Overview
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Package Manager**: npm

## Supabase Configuration

### Setup Steps
1. Supabase project already created at: https://axgyrbqwfmumzrkidkdv.supabase.co
2. Environment variables configured in `.env.local`
3. Add the same environment variables to Vercel project settings when deploying
4. Run database migrations to create tables (see Database Schema section)

### Why Supabase?
- **Free tier**: Generous for small projects (500MB database, 2GB bandwidth)
- **Built-in features**: Authentication, realtime subscriptions, storage
- **PostgreSQL**: Full SQL support with advanced features
- **Auto-generated APIs**: Instant REST and GraphQL APIs
- **Excellent Next.js integration**: Official SDK and documentation
- **Row Level Security**: Fine-grained access control
- **Dashboard**: Easy database management and monitoring

## Core Features

### 1. Employee Management
- Add new employees to the roster
- Remove employees from the roster
- Edit employee names
- Persistent storage of employee list
- Display total employee count

### 2. Session Management
- Create new lightning round sessions
- Track question and all employee answers
- View complete session history with timestamps
- Navigate through past sessions chronologically
- Search/filter sessions by question or date

### 3. Lightning Round Flow
- Select active employees for the session (some may be absent)
- Enter the question for the round
- Go through roster one by one collecting answers
- Skip option for employees who pass
- Save completed session with timestamp
- Option to export session data

### 4. Session History
- List all past sessions
- Expandable view to see all Q&A pairs
- Sort by date (newest/oldest)
- Statistics (total sessions, average participation)
- Delete old sessions

## Data Structure

### Database Schema (Supabase/PostgreSQL)

```sql
-- Employees table
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table  
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Answers table (junction table)
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### TypeScript Interfaces

```typescript
interface Employee {
  id: string;
  name: string;
  created_at: Date;
}

interface Answer {
  id: string;
  session_id: string;
  employee_id: string;
  answer: string;
  created_at: Date;
  employee?: Employee; // For joined queries
}

interface Session {
  id: string;
  question: string;
  created_at: Date;
  completed_at: Date | null;
  answers?: Answer[]; // For joined queries
}
```

## Page Structure

### 1. Home Page (`/`)
- Dashboard with quick stats
- Recent sessions preview
- Quick actions (New Session, Manage Employees)
- Navigation to all features

### 2. Employee Management (`/employees`)
- List of all employees
- Add employee form
- Edit/Delete buttons for each employee
- Employee count display

### 3. New Session (`/session/new`)
- Step 1: Select participating employees
- Step 2: Enter the question
- Step 3: Collect answers (one by one)
- Progress indicator
- Save and complete

### 4. Session History (`/sessions`)
- List view of all sessions
- Expandable cards showing Q&A details
- Date and participant count
- Delete option for old sessions

### 5. Session Detail (`/session/[id]`)
- Full view of a single session
- Question prominently displayed
- All answers with employee names
- Export options

## Implementation Steps

1. **Set up Supabase**
   - Create Supabase project
   - Set up database tables and relationships
   - Configure Row Level Security policies
   - Add environment variables to Vercel

2. **Set up data layer**
   - Install Supabase client SDK
   - Create TypeScript types from database schema
   - Set up Supabase client configuration
   - Create data access functions

3. **Create employee management page**
   - Employee list component with real-time updates
   - Add/Edit/Delete functionality with database operations
   - Form validation
   - Optimistic UI updates

4. **Create session history page**
   - Session list component with pagination
   - Expandable session cards
   - Server-side sorting and filtering
   - Joined queries for employee data

5. **Create new session page**
   - Multi-step form
   - Employee selection from database
   - Answer collection flow with batch inserts
   - Progress tracking with database transactions

6. **Set up API routes**
   - Employee CRUD operations
   - Session management endpoints
   - Batch answer submissions
   - Statistics queries

7. **Create navigation and home page**
   - Navigation component
   - Dashboard statistics from database aggregations
   - Quick action cards
   - Recent sessions with database queries

8. **Style the application**
   - Consistent color scheme
   - Responsive design
   - Loading states for async operations
   - Error handling UI with retry logic

9. **Testing and optimization**
   - Database query optimization
   - Connection pooling configuration
   - Edge cases (network failures, concurrent updates)
   - Performance with large datasets

## UI/UX Considerations

### Design Principles
- Clean, minimal interface
- Fast navigation between screens
- Clear visual hierarchy
- Mobile-responsive design
- Accessible color contrast

### Color Scheme
- Primary: Blue (for actions)
- Secondary: Gray (for UI elements)
- Success: Green (for completed sessions)
- Warning: Yellow (for warnings)
- Danger: Red (for delete actions)

### User Flow
1. First time: Add employees → Create first session
2. Returning: View dashboard → Quick actions
3. Session flow: Linear progression with clear steps
4. History: Easy browsing and searching

## Technical Considerations

### Performance
- Database query optimization with indexes
- Pagination using Supabase's built-in limits
- Connection pooling for concurrent requests
- Caching strategies for frequently accessed data
- Optimistic UI updates for better UX

### Data Management
- UUID generation handled by PostgreSQL
- Database constraints for data integrity
- Row Level Security for data protection
- Backup via Supabase dashboard
- Import/Export functionality with database transactions

### Error Handling
- Network failure recovery
- Database connection retry logic
- Transaction rollback on failures
- User-friendly error messages
- Conflict resolution for concurrent updates

### Security
- Environment variables for database credentials
- Row Level Security policies
- API route protection
- Input sanitization
- Rate limiting considerations

## Future Enhancements
- Multiple choice questions
- Team/department grouping
- Session templates
- Advanced statistics and analytics with SQL views
- Export to various formats (CSV, PDF)
- User authentication with Supabase Auth
- Real-time collaborative sessions (using Supabase Realtime)
- Mobile app version
- Audit logging for compliance
- Multi-tenant support for different organizations

## Development Timeline
- Phase 1: Core functionality (Employee + Session management)
- Phase 2: Enhanced UI and navigation
- Phase 3: History and statistics
- Phase 4: Export/Import features
- Phase 5: Polish and optimization