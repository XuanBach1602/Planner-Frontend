import React, { useState, useEffect } from "react";
import "./AddPlan.css";
import { Modal } from "antd";
import { Input, Form } from "antd";
import { Select } from "antd";
import { useUser } from "../../UserContext";
import axios from "axios";
const AddPlan = (props) => {
  const [planName, setPLanName] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const fetchPlanData = props.fetchPlanData;
  const setOpen = props.setOpen;
  const open = props.open;
  const {user} = useUser();

  const checkValidInput = () => {
    var bool = planName !== "";
    // console.log(bool);
    setIsValidInput(bool);
  };

  const addNewPlan = async () => {
    // console.log(planName, privacy);
    if (isValidInput) {
      const data = {
        name: planName,
        isPrivacy: privacy,
        createdUserID: user.id,
      };
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/plan`,
          data
        );
        console.log(res);
        setValidationMessage("");
        setPrivacy(true);
        setOpen(false);
        fetchPlanData();
      } catch (error) {
        console.log(error);
        setValidationMessage("Please refill in form");
      }
    } else {
      setValidationMessage("Please fill in form");
    }
  };

  useEffect(() => checkValidInput(), [planName]);
  return (
    <Modal
          title="New plan"
          centered
          open={open}
          onOk={() => {
            setPLanName("");
            addNewPlan();
          }}
          onCancel={() => {
            setPLanName("");
            setOpen(false);
          }}
          width={1100}
          height={600}
          style={{}}
        >
          <div style={{ display: "flex" }}>
            <img
              src="https://res.cdn.office.net/planner/files/plex_prod_20230925.001/create-new-illustration.svg"
              alt=""
            />
            <div className="plan-container">
              <h1>Name your plan</h1>
              <Form>
                <Form.Item
                  name="planName"
                  rules={[
                    {
                      required: true,
                      message: "Please fill your plan name!",
                    },
                  ]}
                >
                  <Input
                    className="planName-input"
                    placeholder="Fill your plan name"
                    onChange={(e) => setPLanName(e.target.value)}
                    onBlur={(e) => (e.target.value = "")}
                  />
                </Form.Item>
                <span
                  className="validation-add-plan"
                  style={{ color: "#FF0F00" }}
                >
                  {validationMessage}
                </span>
              </Form>

              <Select
                defaultValue="Private"
                style={{
                  marginTop: 30,
                  width: 200,
                }}
                onChange={(value) => setPrivacy(value)}
                options={[
                  {
                    label: "Privacy",
                    options: [
                      {
                        label: "Private",
                        value: false,
                      },
                      {
                        label: "Public",
                        value: true,
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </Modal>
  );
};

export default AddPlan;
