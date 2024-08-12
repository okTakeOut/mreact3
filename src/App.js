import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page from './pages/Page';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import SchedulePage from './pages/SchedulePage';
import Settings from './pages/Settings';
import PostPage from './pages/PostPage';
import TodoListPage from './pages/TodoListPage';
import ScheduleDetailPage from './pages/ScheduleDetailPage';
import AboutPage from './pages/AboutPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

function App() {
  const tag = "[APP_MAIN]"

  return (
    <>
      <div className="container" style={{ minHeight: "80vh" }}>
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Page children={<MainPage />} />} />
          <Route path={"/schedules"} element={<Page children={<SchedulePage />} pageName={"Schedule List"} />} />
          <Route path={"/settings"} element={<Page children={<Settings />} pageName={"Settings(...)"}/>} />
          <Route path={"/posting"} element={<Page children={<PostPage />} pageName={"Posting"}/>} />
          <Route path={"/todo"} element={<Page children={<TodoListPage />} pageName={"ToDo List"}/>} />
          <Route path={`/details/:id`} element={<Page children={<ScheduleDetailPage />} pageName={"Schedule Details"}/>} />
          <Route path={`/about`} element={<Page children={<AboutPage />} pageName={"About"}/>} />
          <Route path={`/signup`} element={<Page children={<SignUpPage />} pageName={"Signup Page"}/>} />
          <Route path={`/login`} element={<Page children={<LoginPage />} pageName={"Login Page"}/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
