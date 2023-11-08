import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { Input, Form, Button } from "antd";
import { useUser } from "../../UserContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState("");
  const {user,setUser, setIsAuthenticated} = useUser();
  const navigate = useNavigate();
  const Post = async () => {
    var isValid = (email !== "") && (password !== "");
    // console.log(email, password);
    // console.log(isValid);
    if (!isValid) {
      setValidation("Please fill in form");
    } else {
      try {
        const data = {
          email: email,
          password: password
        }
        const res = await axios.post("https://localhost:44302/auth/SignIn",data);
        // console.log(res);
        setIsAuthenticated(true);
        setUser(res.data.userInfo);
        localStorage.setItem("token", res.data.token);
        // console.log(res.data.userInfo);
        setValidation("");
        navigate("/");
      } catch (error) {
        setValidation("Wrong password or email");
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const signinAuto = async() => {
      const data = {
        email: "xuanbach15@gmail.com",
        password: "Bach@1602"
      }
      const res = await axios.post("https://localhost:44302/auth/SignIn",data);
      // console.log(res);
      setIsAuthenticated(true);
      setUser(res.data.userInfo);
      localStorage.setItem("user", JSON.stringify(res.data.userInfo));
      localStorage.setItem("token", res.data.token);
      console.log(res);
      navigate("/Plan/58/");
    };
   signinAuto();
  },[]
    
  )
  return (
    <div className="signin-page">
      <div className="signin-main">
        <div className="signin-form">
          <h2 style={{ marginTop: "30px" }}>Sign In</h2>
          <Form>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please fill your email",
                },
              ]}
            >
              <Input
                className="data-input"
                placeholder="Fill your mail"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please fill password",
                },
              ]}
            >
              <Input
                type="password"
                className="data-input"
                placeholder="Fill your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </Form>
          <span className="validation-all-signin" style={{ color: "#FF0F00" }}>
            {validation}
          </span>
          <Button type="primary" onClick={() => Post()}>
            Log In
          </Button>
          <p className="signIn">
            Do not have an account ?{" "}
            <a href="/signup" style={{ textDecoration: "none" }}>
              Sign Up
            </a>
          </p>
        </div>
        <div className="description">
          <h2 style={{ color: "white" }}>Glad to see you</h2>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
