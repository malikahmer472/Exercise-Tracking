import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const checkfield = (e) => {
    e.preventDefault();
    if (!firstName || !email || !password || !confPassword) {
      return toast.error("Please fill all fields");
    }
    if (password.length < 8) {
      return toast.error("Enter Password more than 8 charachters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter valid email");
    }
    if (password !== confPassword) {
      return toast.error("Password should be same as confirm password");
    }
    axios
      .post("http://localhost:8081/", {
        firstName,
        lastName,
        email,
        password,
      })
      .then(function (response) {
        const data = response.data;
        if (data.success) {
          localStorage.setItem("token", data.token);
          const tkn = localStorage.getItem("token");
          console.log(tkn);
          toast.success("User Created Successfully");
          if (tkn) {
            navigate("/Profile");
          }
        } else {
          toast.error("There has been some issue");
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
              <h1>Sign Up</h1>
            </center>
            <form onSubmit={checkfield} id="signup">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div className="form-group mt-2">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
              <div className="form-group mt-2">
                <label>Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mt-2"
                  placeholder="Enter email"
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group mt-2">
                <label>Password</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <p id="pswd"></p>
              </div>
              <div className="form-group mt-2">
                <label>Confirm Password</label>
                <input
                  type="text"
                  className="form-control mt-2"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </div>
              <button type="submit" className="btn btn-primary mt-2">
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

export default Register;
