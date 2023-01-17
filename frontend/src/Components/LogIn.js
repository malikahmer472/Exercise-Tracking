import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  localStorage.clear();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }
    if (password.length < 8) {
      return toast.error("Enter Password more than 8 charachters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter valid email");
    }
    axios
      .post("http://localhost:8081/LogIn", {
        email,
        password,
      })
      .then(function (response) {
        const data = response.data;
        if (data.success) {
          localStorage.setItem("token", data.token);
          toast.success("Logged in Successfully");
          navigate("/Profile");
        }
        if (!data.success) {
          toast.error(data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  return (
    <>
      <div className="container for-border">
        <div className="row my-5">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <center>
              {" "}
              <h1>Log In</h1>
            </center>
            <form onSubmit={login}>
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </>
  );
};

export default Profile;
