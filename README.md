# DOOD? - AI-Powered Study Platform

An intelligent educational platform that transforms your study materials into personalized learning experiences with AI-generated quizzes, flashcards, and mock exams.

## ✨ Key Features

### 🎯 **Smart Study Calendar**
- **Apple-inspired design** with clean, intuitive interface
- **Automated scheduling** based on your course materials
- **Material-specific activities** - Each calendar event is tied to specific content
- **Progress tracking** with visual indicators for completed activities
- **Weekly overview** with activity type legends and completion stats

### 🤖 **AI-Powered Learning Tools**
- **Interactive Quizzes**: AI generates 10 contextual questions with explanations
- **Anki Flashcards**: Spaced-repetition cards for German technical vocabulary
- **Mock Exams**: Full-length practice exams with realistic timing
- **Auto-generation**: Content automatically generates when you click calendar events

### 📚 **Comprehensive Course Content**
- **6 weeks of Material Science content** covering:
  - Week 1: Material Classes & Crystal Structures  
  - Week 2: Defects in Crystals & Diffusion
  - Week 3: Elastic Behavior & Viscoelasticity
  - Week 4: Mechanical Properties of Metals & Polymers
  - Week 5: Material Failure & Phase Diagrams
  - Week 6: Phase Transformations & Ceramics
- **Multi-language support**: German and English materials
- **File upload capability** for custom PDFs

### 🔄 **Seamless Study Flow**
- **Calendar-driven learning**: Click any activity to jump to dedicated study pages
- **Context-aware AI**: Each activity knows which material to focus on
- **Real-time generation**: AI creates fresh content every time
- **Progress persistence**: Track completion across study sessions

## 🛠 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router
- **State Management**: React Context API
- **AI Integration**: Claude API (Anthropic)
- **PDF Processing**: Custom PDF text extraction service
- **Design System**: Apple-inspired UI components

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Claude API key for AI features (required for full functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd moodle-morph-academy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Claude API integration (required)
VITE_CLAUDE_API_KEY=sk-ant-api03-your_claude_api_key_here
```

**Note**: Get your Claude API key from [console.anthropic.com](https://console.anthropic.com)

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8082`

### 5. Build for Production

```bash
npm run build
```

## 📖 How to Use

### 🎯 **Calendar-Driven Study Flow**
1. **Open the Calendar**: Navigate to the main calendar view (Apple-inspired design)
2. **Browse Weekly Schedule**: See auto-generated study activities across the week
3. **Click Any Activity**: Activities are automatically tied to specific course materials
4. **Study with AI**: Content generates automatically when you click calendar events

### 📅 **Study Calendar Features**
- **Color-coded activities**: Blue (Quiz), Orange (Mock Exam), Purple (Flashcards)
- **Progress tracking**: Visual indicators show completion status
- **Material rotation**: Activities automatically cycle through all available course content
- **Time management**: Each activity shows duration and difficulty level

### 🤖 **AI-Generated Content**
- **Interactive Quizzes**: 10 questions with multiple choice and detailed explanations
- **German Flashcards**: Spaced-repetition cards focused on technical vocabulary  
- **Mock Exams**: Comprehensive 90-minute practice exams
- **Context-aware**: AI generates content specifically for the selected material

### 📚 **Course Content Navigation**
- **6 weeks of content**: Material Science from basics to advanced topics
- **Dual language**: German and English materials available
- **Automatic scheduling**: No manual material selection needed - calendar handles everything

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── StudyCalendar.tsx # Apple-inspired calendar interface
│   ├── QuizApp.tsx      # Interactive quiz generation
│   ├── AnkiCardApp.tsx  # German flashcard system
│   ├── MockExamApp.tsx  # Timed exam interface
│   └── MaterialSelector.tsx # Course content selector
├── contexts/            # React contexts
│   └── MaterialContext.tsx # Global material & progress state
├── lib/                 # Core services
│   ├── aiService.ts     # Claude API integration
│   ├── courseData.ts    # Pre-loaded course materials
│   └── pdfExtractor.ts  # PDF text extraction
├── hooks/               # Custom React hooks
│   └── useAIGeneration.ts # AI content generation logic
└── pages/               # Dedicated study pages
    ├── Calendar.tsx     # Main calendar view
    ├── Quiz.tsx         # Quiz study page
    ├── AnkiCards.tsx    # Flashcard study page
    ├── MockExam.tsx     # Exam study page
    └── Upload.tsx       # Material upload page
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)
- `npm run typecheck` - Run TypeScript type checking

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Component-based architecture with hooks

## 🤖 AI Integration Details

### Claude API Integration
- **Primary Model**: Claude 3.5 Sonnet (latest version)
- **Content Types**: Quizzes, flashcards, and mock exams
- **Language Support**: German technical vocabulary + English explanations
- **Quality Control**: Built-in content validation and formatting

### Smart Content Generation
1. **Calendar Event Trigger**: User clicks calendar activity
2. **Material Context**: System automatically knows which content to use
3. **AI Processing**: Claude analyzes PDF content and generates relevant materials
4. **Real-time Updates**: Progress tracking with visual feedback
5. **Instant Delivery**: Generated content displays immediately

### Advanced Features
- **Context-aware generation**: Each activity knows its specific material
- **Progress persistence**: Completion tracking across sessions  
- **Error resilience**: Comprehensive retry and fallback systems
- **Performance optimization**: Efficient API usage with smart caching

## 🚢 Deployment

### Lovable Platform (Recommended)
1. Visit your [Lovable Project](https://lovable.dev/projects/8b75f2df-24b1-49c2-bdbb-14c056125cb4)
2. Click Share → Publish
3. Your app will be deployed automatically

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables for AI APIs

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLAUDE_API_KEY` | Claude API key for AI generation | Yes |

## 📚 Course Content

The platform includes authentic Material Science content covering 6 comprehensive weeks:

### **Week 1**: Material Classes & Crystal Structures
- Material classification and properties
- Crystal structures (BCC, FCC, HCP)
- Atomic arrangements and unit cells

### **Week 2**: Defects & Diffusion  
- Point defects, dislocations, grain boundaries
- Fick's laws and diffusion mechanisms
- Temperature effects on material behavior

### **Week 3**: Elastic Behavior & Viscoelasticity
- Stress-strain relationships
- Elastic moduli and deformation
- Time-dependent material response

### **Week 4**: Mechanical Properties
- Properties of metals and polymers
- Yield strength and fracture mechanics
- Material testing methodologies

### **Week 5**: Material Failure & Phase Diagrams
- Failure modes and prevention
- Phase equilibria and transformations
- Binary and ternary systems

### **Week 6**: Phase Transformations & Ceramics
- Kinetics of phase changes
- Ceramic properties and applications
- Glass formation and structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is available under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [Issues](../../issues) page
- Visit [Lovable Documentation](https://docs.lovable.dev)
- Contact support through the Lovable platform

---

Built with ❤️ using [Lovable](https://lovable.dev)