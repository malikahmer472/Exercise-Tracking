import "./App.css";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Main from "./Components/Main";
import LogIn from "./Components/LogIn";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import Addtask from "./Components/Addtask";
import ResetPassword from "./Components/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Main />}/>
      <Route path='/Register' element={<Register />}/>
      <Route path='/LogIn' element={<LogIn />}/>
      <Route path='/Profile' element={<Profile />}/>
      <Route path='/EditProfile' element={<EditProfile />}/>
      <Route path='/Addtask' element={<Addtask />}/>
      <Route path='/ResetPassword' element={<ResetPassword />}/>

      </Routes>
    </Router>
  );
}

export default App;
