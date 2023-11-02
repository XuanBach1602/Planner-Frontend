import React, { useEffect, useState } from "react";
import { Input, Form, Button, DatePicker, Select } from "antd";
import "./Account.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useUser } from "../../UserContext";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";

const Account = () => {
  const { user } = useUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [gender, setGender] = useState(user.gender);
  const [dateOfBirth, setDateOfBirth] = useState("2023-10-10");
  const [avatar, setAvatar] = useState();
  const imgUrl = `https://localhost:44302/api/File/avatar/${user.imageUrl}`;
  const [image, setImage] = useState(imgUrl);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatar(file);
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const checkValidInput = () => {
    var bool = (name !== "") && (email !== "") && (phoneNumber !== "" ) && (dateOfBirth !== "") && (avatar !== null);
    setIsValid(bool);
  }

  const updateAccount = async () => {
    console.log(isValid);
    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("gender", gender);
        formData.append("dateOfBirth", dateOfBirth);
        if (avatar) {
          formData.append("file", avatar);
        }
        formData.forEach((value, key) => {
          console.log(key, value);
        });
        const res = await axios.put(
          `https://localhost:44302/api/user/${user.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        
        );
        console.log(res);
        setErrorMessage("");
        navigate("/")
      } catch (error) {
        console.log(error.message);
      }
    }
    else {
      setErrorMessage("Please fill out the form completely! ")
    }
  };

  const fetchAvatar = async() => {
    try {
      const token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ4dWFuYmFjaDE1QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiMTQ4YjZlMDYtMDM1Ni00ZjU4LWI1NGEtODIzZGQwODQwM2QwIiwianRpIjoiNTIzNDg3NGUtNzM1YS00NDQwLTg0ZDAtMDdhMTM1MTM0ZGRiIiwiZXhwIjoxNjk5MDAwNjM2LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo0NDMwMi8iLCJhdWQiOiJ1c2VyIn0.D1MhjIjdDeyOd6p5bf5-gbciEFIoovX7y2ufrGB7OBE";
      const headers = {
        Authorization: `Bearer ${token}`
    };
      const res =await axios.get(`https://localhost:44302/api/File/avatar/${user.imageUrl}`, {headers,responseType: 'blob'});
      console.log(res);
      const blobData = res.data;
      setAvatar(blobData);
      const imageUrl = URL.createObjectURL(blobData);
      setImage(imageUrl);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => fetchAvatar,[]);

  useEffect(() => {
    checkValidInput();
  },[name,email,phoneNumber, gender, dateFormat, avatar]);
  return (
    <div className="account-container">
      <div className="account-form">
        <h2 className="text-center">Account Information</h2>
        <div className="d-flex">
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
                className="account-data-input"
                placeholder="Fill your name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="email">
              <Input
                className="account-data-input"
                placeholder="Fill your email!"
                readOnly
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please fill phoneNumber!",
                },
              ]}
            >
              <Input
                type="number"
                className="account-data-input"
                placeholder="Fill phonenumber"
                defaultValue={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Item>
            <div className="gender-box">
              <span style={{ minWidth: "60px", marginRight: "48px" }}>
                Gender
              </span>
              <Select
                // defaultValue={gender === "" ? "Male" : gender}
                defaultValue={gender}
                style={{
                  width: 120,
                }}
                onChange={(e) => setGender(e)}
                options={[
                  {
                    value: "Male",
                    label: "Male",
                  },
                  {
                    value: "Female",
                    label: "Female",
                  },
                ]}
              />
            </div>
            <div className="dateOfBirth">
              <label htmlFor="" style={{ marginRight: "10px " }}>
                Date Of Birth
              </label>
              <DatePicker
                defaultValue={dayjs("2015-01-01", dateFormat)}
                format={dateFormat}
                value={dayjs(dateOfBirth, "YYYY-MM-DD")}
                onChange={(value) => {
                  if (value) {
                    const formattedValue = value.format("YYYY-MM-DD");
                    setDateOfBirth(formattedValue);
                  }
                }}
              />
            </div>
          </Form>
          <div className="avatar-box w-100">
            <input
              type="file"
              accept="image/png, image/jpeg"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e)}
            />
            <label htmlFor="fileInput" className="ml-4 btn btn-primary">
              Choose Image
            </label>
            <span style={{ marginLeft: "10px" }}>{avatar?.name}</span>
            <div className="preview-avatar-box">
              {image && (
                <img src={image} alt="Preview" className="img-preview mt-3" />
              )}
            </div>
          </div>
        </div>
        <div className="text-danger">{errorMessage}</div>
        <div className="text-center mt-4">
          <Button type="primary " size="large" onClick={() => updateAccount()}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
