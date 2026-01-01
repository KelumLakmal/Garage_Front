import "./App.css";
import Student from "./modules/Student";
import Mainwindow from "./modules/Mainwindow";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customer from "./modules/Customer";
import Vehicle from "./modules/Vehicle";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainwindow/>}>
            <Route path="student" element={<Student/>}/>
            <Route path="customer" element={<Customer/>}/>
            <Route path="vehicle" element={<Vehicle/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Student/> */}
      {/* <Mainwindow/> */}
    </>
  );
}

export default App;
