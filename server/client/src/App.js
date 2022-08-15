import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Dashboard from "./Pages/Dashboard";
import Newpost from "./Pages/Newpost";
import PreviewImage from "./Pages/PreviewImage";
import { DataContextProvider } from "./Context/DataContext";
import { UserProvider } from "./Context/AuthContext";
import ProtectedRoute from "./utilities/ProtectedRoute";

function App() {
  return (
    <DataContextProvider>
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/privacy" element={<p>Privacy</p>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newpost"
                element={
                  <ProtectedRoute>
                    <Newpost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/previewImage"
                element={
                  <ProtectedRoute>
                    <PreviewImage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </div>
      </UserProvider>
    </DataContextProvider>
  );
}

export default App;
