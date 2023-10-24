import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Form, Button } from "antd";
import "./SignUp.css";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordComfirm, setComfirmPassword] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const CheckValidInput = () => {
    let bool =
      phoneNumber !== "" &&
      name !== "" &&
      email !== "" &&
      password !== "" &&
      passwordComfirm !== "" &&
      passwordComfirm === password;
    setIsValidInput(bool);
  };

  const SignUp = async (e) => {
    e.preventDefault();
    console.log(isValidInput);
    console.log(name, email, password, passwordComfirm, phoneNumber);
    if (isValidInput) {
      try {
        const data = {
          name: name,
          email: email,
          password: password,
          phonenumber: phoneNumber,
        };
        var res = await axios.post("https://localhost:44302/auth/SignUp", data);
        setValidationMessage("");
        console.log(res);
      } catch (error) {
        console.log(error);
        setValidationMessage("Email is already taken");
      }
    } else {
      setValidationMessage("Please fill full in form");
    }
  };

  useEffect(
    () => CheckValidInput(),
    [name, email, password, passwordComfirm, phoneNumber]
  );
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
              <Input
                type="password"
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
              <Input
                type="password"
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
          </Form>
          <span className="validation-all-signin" style={{ color: "#FF0F00" }}>
            {validationMessage}
          </span>
          <Button type="primary" >
            Create account
          </Button>
          <p className="signIn">
            Do you already have an account?{" "}
            <a href="/signin" style={{ textDecoration: "none" }}>
              Sign In
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

export default SignUp;
