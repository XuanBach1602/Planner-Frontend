import React, { useState } from "react";
import "./AddPlan.css";
// function AddPlan() {
//   const [selectedOption, setSelectedOption] = useState("private");
//   const [name, setName] = useState(""); // Thêm state và hàm setName

//   const handleSelectChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleNameChange = (event) => {
//     setName(event.target.value); // Cập nhật giá trị name khi người dùng thay đổi nội dung
//   };

//   return (
//     <div className="AddPlanContainer">
//       <div className="add-form">
//         <div className="title">New plan</div>
//         <label htmlFor="planName" style={{marginTop:"20px"}}>Name your plan</label>
//         <br />
//         <input
//           type="text"
//           required
//           placeholder="Enter plan title"
//           id="planName"
//           value={name} // Hiển thị giá trị của name trong trường nhập liệu
//           onChange={handleNameChange} // Gọi handleNameChange khi có sự thay đổi
//         />
//         <br />
//         <label htmlFor="privacy">Select privacy:</label>
//         <select
//           id="privacy"
//           value={selectedOption}
//           onChange={handleSelectChange}
//         >
//           <option value="private">Private</option>
//           <option value="public">Public</option>
//         </select>
//       </div>
//     </div>
//   );
// }

import { Button, Modal } from 'antd';
const AddPlan = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Modal of 1000px width
      </Button>
      <Modal
        title="Modal 1000px width"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  );
};

export default AddPlan;
