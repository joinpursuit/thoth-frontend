import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getAuth } from "firebase/auth";

import LoginRequired from "./pages/LoginRequired";

import PageWrapper from "./pages/PageWrapper";
import Workspace from "./pages/Workspace";
import ModuleList from "./pages/ModuleList";
import ModuleShow from "./pages/ModuleShow";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/AdminDash";
import ModuleTopics from "./pages/ModuleTopics";

import "./App.css";
import { useEffect, useState } from "react";
import CourseTemplates from "./pages/CourseTemplates";
import CreateCourseTemplate from "./pages/NewCourseTemplate";
import CourseTemplateEditForm from "./pages/CourseTemplateEditForm";
import ClassesIndex from "./pages/ClassIndex";
import NewClassForm from "./pages/ClassNew";
import ClassView from "./pages/ClassShow";
import ClassCurriculum from "./pages/ClassCurriculum";
import ClassMembers from "./pages/ClassMembers";
import UserDashboard from "./pages/UserDashboard";
import ClassModules from "./pages/ClassModules";
import TopicExercises from "./pages/TopicsExercises";

// Needed to initialize app
import firebase from "./firebase";

function App() {

  const auth = getAuth();

  const [uid, setUID] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      axios.interceptors.request.use(
        async config => {
          console.log(user);
          if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        error => {
          console.log(error);
          return Promise.reject(error);
        }
      );

      setCurrentUser(user);
    });
  }, []);

  function wrapWithHeader(component, loginRequired=false) {
    return (
      loginRequired ? (
        <LoginRequired>
          <PageWrapper currentUser={currentUser}>
            { component }
          </PageWrapper>
        </LoginRequired>
      ) : (
        <PageWrapper currentUser={currentUser}>
          { component }
        </PageWrapper>
      )
      
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: wrapWithHeader(<LandingPage userId={uid} />)
    },
    {
      path: "/login",
      element: wrapWithHeader(<LoginPage 
        userId={uid} 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
      />)
    },
    {
      path: "/modules",
      element: wrapWithHeader(<ModuleList currentUser={currentUser} />)
    },
    {
      path: "/modules/:moduleId",
      element: wrapWithHeader(<ModuleShow userId={currentUser?.uid} />)
    },
    {
      path: "/topics/:topicId/practice",
      element: wrapWithHeader(<Workspace userId={currentUser?.uid} />)
    },
    {
      path: "/admin",
      element: wrapWithHeader(<AdminDashboard />)
    },
    {
      path: "/admin/course-templates",
      element: wrapWithHeader(<CourseTemplates />)
    },
    {
      path: "/admin/course-templates/new",
      element: wrapWithHeader(<CreateCourseTemplate />)
    },
    {
      path: "/admin/course-templates/:id/edit",
      element: wrapWithHeader(<CourseTemplateEditForm />)
    },
    {
      path: "/admin/classes",
      element: wrapWithHeader(<ClassesIndex />)
    },
    {
      path: "/admin/classes/new",
      element: wrapWithHeader(<NewClassForm />)
    },
    {
      path: "/admin/classes/:id",
      element: wrapWithHeader(<ClassView />)
    },
    {
      path: "/admin/classes/:id/curriculum",
      element: wrapWithHeader(<ClassCurriculum />)
    },
    {
      path: "/admin/classes/:id/members",
      element: wrapWithHeader(<ClassMembers />)
    },
    {
      path: "/dashboard",
      element: wrapWithHeader(<UserDashboard currentUser={currentUser} />)
    },
    {
      path: "/classes/:classId",
      element: wrapWithHeader(<ClassModules />)
    },
    {
      path: "/classes/:classId/modules/:moduleId/topics",
      element: wrapWithHeader(<ModuleTopics />)
    },
    {
      path: "/classes/:classId/modules/:moduleId/topics/:topicId/exercises",
      element: wrapWithHeader(<TopicExercises />)
    },
    {
      path: "/classes/:classId/modules/:moduleId/topics/:topicId/exercises/:exerciseId",
      element: wrapWithHeader(<Workspace />)
    }
  ])

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
