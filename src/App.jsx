import "./App.css";
import Student from "./modules/Student";
import Mainwindow from "./modules/Mainwindow";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Customer from "./modules/Customer";
import Vehicle from "./modules/Vehicle";
import Login from "./modules/Login";
import { useState } from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./modules/Home";
function App() {
  const [isAuthnticate, setIsAuthnticate] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={() => setIsAuthnticate(true)} />} />
          <Route path="/main" element={<ProtectedRoute isAuthenticated={true}>
            <Mainwindow />
          </ProtectedRoute>}>
            {/* default route*/}
            <Route index element={<Home />} />
            <Route path="home" element={<Navigate to='/main' replace/>} />
            <Route path="student" element={<Student />} />
            <Route path="customer" element={<Customer />} />
            <Route path="vehicle" element={<Vehicle />} />
          </Route>
          {/* for Invalid URL */}
          <Route path="*" element={<Navigate to='/' replace/>}/>
          

        </Routes>
      </BrowserRouter>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/main" element={<Mainwindow/>}>
            <Route path="student" element={<Student/>}/>
            <Route path="customer" element={<Customer/>}/>
            <Route path="vehicle" element={<Vehicle/>}/>
          </Route>
        </Routes>
      </BrowserRouter> */}
      {/* <Student/> */}
      {/* <Mainwindow/> */}
    </>
  );
}

export default App;
