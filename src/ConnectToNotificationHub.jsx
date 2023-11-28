import * as signalR from "@microsoft/signalr";

const ConnectToNotificationHub = (userId) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_API_URL}/api/NotificationHub`)
    .build();

  // connection.on("ReceiveMessage", (message) => {
  //   console.log("Received notification:", message);
  //   // Xử lý thông báo nhận được từ SignalR Hub
  // });

  connection.on("UserIdAdded", (addedUserId) => {
    console.log(`UserId ${addedUserId} added successfully.`);
  });

  connection
    .start()
    .then(() => {
      console.log("Connected to SignalR Hub!");
      // Gửi userId lên SignalR khi kết nối được thiết lập
      // connection.invoke("AddUserId", userId);
    })
    .catch((error) => {
      console.error("Error connecting to SignalR Hub:", error);
    });
  // return () => {
  //   connection.stop();
  // };
  return connection;
};

export default ConnectToNotificationHub;
