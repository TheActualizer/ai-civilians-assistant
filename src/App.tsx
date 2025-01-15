import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import LearnMore from "./pages/LearnMore";
import Login from "./pages/Login";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;