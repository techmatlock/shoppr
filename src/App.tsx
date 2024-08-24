import { Route, Routes } from "react-router-dom";
import "./App.css";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
