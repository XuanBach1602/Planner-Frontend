import React, { useState } from "react";
import "./SignIn.css";
import { Input, Form, Button } from "antd";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="signin-page">
      <div className="signin-main">
        <div className="signin-form">
            <h2 style={{marginTop:"30px"}}>Sign In</h2>
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
          <Button type="primary">Log In</Button>
          <p className="signIn">Do not have an account ? <a href="/signup" style={{textDecoration:"none"}}>Sign Up</a></p>
        </div>
        <div className="description">
          <h2 style={{ color: "white" }}>Glad to see you</h2>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
