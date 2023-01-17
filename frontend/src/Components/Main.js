import React from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const navreg = () => {
    navigate("/Register");
  };
  const navlog = () => {
    navigate("/LogIn");
  };
  return (
    <div className="container for-border">
      <div className="row mt-5">
        <center>
          <h3>Exercise Tracking</h3>
        </center>
      </div>
      <div className="row mt-3 mb-5">
        <div className="col-md-2"></div>
        <div className="col-md-4">
          <center>
            {" "}
            <button className="btn btn-primary" onClick={navreg}>
              SignUp
            </button>
          </center>
        </div>
        <div className="col-md-4">
          <center>
            <button className="btn btn-primary" onClick={navlog}>
              Log In
            </button>
          </center>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default Main;
