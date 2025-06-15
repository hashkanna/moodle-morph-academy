
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MaterialProvider } from "@/contexts/MaterialContext";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Calendar from "./pages/Calendar";
import Quiz from "./pages/Quiz";
import AnkiCards from "./pages/AnkiCards";
import MockExam from "./pages/MockExam";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MaterialProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/anki-cards" element={<AnkiCards />} />
            <Route path="/mock-exam" element={<MockExam />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MaterialProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
