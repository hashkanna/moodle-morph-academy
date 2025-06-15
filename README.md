# Moodle Morph Academy

An AI-powered educational platform for Material Science courses, built with modern web technologies.

## 🚀 Features

### Course Material Integration
- **Pre-loaded Material Science Content**: 6 weeks of comprehensive course materials covering:
  - Week 1: Material Classes & Crystal Structures  
  - Week 2: Defects in Crystals & Diffusion
  - Week 3: Elastic Behavior & Viscoelasticity
  - And more advanced topics...
- **File Upload Support**: Upload your own PDF materials
- **Smart Material Selection**: Dropdown selector for easy course navigation

### AI-Powered Learning Tools
- **Quiz Generator**: Generate intelligent quizzes from course materials
- **Anki Flashcards**: Create spaced-repetition flashcards for key concepts
- **Mock Exams**: Full-length practice exams with realistic conditions
- **Dual Mode Operation**: Switch between AI-generated content and demo mode

### Advanced AI Features
- **OpenAI/Claude Integration**: Uses latest AI models for content generation
- **PDF Text Extraction**: Automatically extracts text from course materials
- **Multi-language Support**: Supports German and English content
- **Progress Tracking**: Real-time progress indicators during AI generation
- **Error Handling**: Comprehensive fallback systems

## 🛠 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router
- **State Management**: React Context API
- **AI Integration**: OpenAI API / Claude API
- **PDF Processing**: Custom PDF text extraction service

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Optional: OpenAI API key or Claude API key for AI features

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

### 3. Environment Setup (Optional)

Create a `.env` file in the root directory for AI features:

```bash
# For OpenAI integration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# For Claude integration  
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

**Note**: The app works without API keys using demo/mock content.

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

### Getting Started
1. **Select Course Material**: Navigate to "Course Materials" and choose from pre-loaded content or upload your own PDFs
2. **Choose Learning Tool**: Select from Quiz Generator, Anki Cards, or Mock Exams
3. **Toggle AI Mode**: Switch between AI-generated content and demo mode
4. **Generate Content**: Click generate buttons to create personalized learning materials

### Course Materials
- Browse 6 weeks of Material Science content
- Each week contains multiple chapters with exercises and solutions
- Materials are organized by topics like Crystal Structures, Defects, Elastic Behavior, etc.

### AI Generation
- **Quiz Mode**: Generates 5 questions with multiple choice and explanations
- **Flashcard Mode**: Creates 10 spaced-repetition cards with German language preference
- **Exam Mode**: Comprehensive 8-question exams with 90-minute duration
- All AI content is generated from your selected course material

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── QuizApp.tsx      # Quiz generation interface
│   ├── AnkiCardApp.tsx  # Flashcard interface  
│   ├── MockExamApp.tsx  # Mock exam interface
│   └── MaterialSelector.tsx # Course material selector
├── contexts/            # React contexts
│   └── MaterialContext.tsx # Global material state
├── lib/                 # Core services
│   ├── aiService.ts     # AI integration service
│   ├── courseData.ts    # Course material data
│   ├── mockContent.ts   # Demo content
│   └── pdfExtractor.ts  # PDF text extraction
├── hooks/               # Custom React hooks
│   └── useAIGeneration.ts # AI generation hook
└── pages/               # Page components
    ├── Upload.tsx       # Material upload page
    ├── Quiz.tsx         # Quiz page
    ├── AnkiCards.tsx    # Flashcards page
    └── MockExam.tsx     # Mock exam page
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

### Supported AI Providers
- **OpenAI GPT Models**: GPT-3.5-turbo, GPT-4
- **Anthropic Claude**: Claude 3 series models
- **Fallback System**: Mock content when APIs unavailable

### Content Generation Process
1. **Material Selection**: User selects course material
2. **Text Extraction**: PDF content extracted and cached
3. **Content Validation**: AI service validates material quality
4. **Generation**: AI creates questions/cards/exams based on material
5. **Progress Tracking**: Real-time updates during generation

### Error Handling
- Network timeout handling
- API rate limit management  
- Content validation failures
- Graceful fallback to demo content

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
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI generation | No |
| `VITE_CLAUDE_API_KEY` | Claude API key for AI generation | No |

## 📚 Course Content

The app includes authentic Material Science content covering:

- **Material Classes**: Metals, Ceramics, Polymers, Composites
- **Crystal Structures**: BCC, FCC, HCP arrangements
- **Defects**: Point defects, dislocations, grain boundaries  
- **Diffusion**: Fick's laws, diffusion mechanisms
- **Mechanical Properties**: Elastic behavior, viscoelasticity
- **Advanced Topics**: Fracture mechanics, fatigue, creep

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