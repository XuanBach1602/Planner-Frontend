import React, { useState } from "react";
import { Input, Form, Button } from "antd";
import "./SignUp.css";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordComfirm, setComfirmPassword] = useState("");

  const SignUp = () => {
    console.log("Sign up successfully");
  }
  return (
    <div className="signup-page">
      <div className="signup-main">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <Form>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please fill your name!",
                },
              ]}
            >
              <Input
                className="data-input"
                placeholder="Fill your name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
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
                placeholder="Fill your email!"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please fill password!",
                },
              ]}
            >
              <Input type="password"
                className="data-input"
                placeholder="Fill password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Refill password",
                },
              ]}
            >
              <Input type="password"
                className="data-input"
                placeholder="Refill your password"
                onChange={(e) => setComfirmPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please fill your phone number",
                },
              ]}
            >
              <Input
                className="data-input"
                placeholder="Fill your phone number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Item>
            <span></span>
          </Form>
          <Button type="primary" onClick={SignUp}>Create account</Button>
          <p className="signIn">Do you already have an account? <a href="/signin" style={{textDecoration:"none"}}>Sign In</a></p>
        </div>
        <div className="description">
          <h2 style={{ color: "white" }}>Glad to see you</h2>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
