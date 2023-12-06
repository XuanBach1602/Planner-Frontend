import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useContext, useEffect } from "react";
import { v4 as uuid } from "uuid";
import PlanContext from "../PlanContext";
import TaskView from "../components/TaskView/TaskView";
import "./Calendar.css"

export default function ScheduleCalendar() {
  const {
    id:planId,
    categoryList,
    taskList,
    fetchCategoryData,
    fetchTaskData,
    currentUser,
  } = useContext(PlanContext)
  const [openAddTask, setOpenAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const showAddTask = () => {
    setOpenAddTask(true);
    // console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  function getHoursMinutesFromString(timeString) {
    const [hours, minutes] = timeString.split(":");
    return { hours, minutes };
  }
  

  const getStatusClass = (status, dueDate) => {
    const currentDate = Date.now();
    const dueDateTime = new Date(dueDate);
  
    if (status === "Not started") {
      return "not-started-task";
    }
    if (status === "Completed") {
      return "completed-task";
    }
    if (status === "In progress") {
      if (dueDateTime < currentDate) {
        return "late-task"; // Nếu quá hạn
      } else {
        return "in-progress-task"; // Nếu chưa quá hạn và đang tiến hành
      }
    }
  };
    const eventList = taskList.reduce((acc, task) => {
      const start = new Date(task.startDate);
      const end = new Date(task.dueDate);
      const [startHour, startMinute] = task.startTime.split(":");
      const [endHour, endMinute] = task.endTime.split(":");
      let currentDate = new Date(start);
    
      if(task.frequency === "Weekly"){
        while (currentDate <= end) {
          if (currentDate >= start) {
            const eventStart = new Date(currentDate);
            const eventEnd = new Date(currentDate);
      
            // Đặt giờ bắt đầu và kết thúc trong khoảng từ 8h đến 10h
            eventStart.setHours(startHour, startMinute,0); // Giờ bắt đầu (8 giờ)
            eventEnd.setHours(endHour, endMinute,0); // Giờ kết thúc (10 giờ)
      
            acc.push({
              title: task.name,
              start: eventStart,
              end: eventEnd,
              task: task,
              classNames: getStatusClass(task.status, task.dueDate) + "hover-event"
            });
          }
          currentDate.setDate(currentDate.getDate() + 7);
        }
      }
      else {
        while (currentDate <= end) {
          if (currentDate >= start) {
            const eventStart = new Date(currentDate);
            const eventEnd = new Date(currentDate);
      
            // Đặt giờ bắt đầu và kết thúc trong khoảng từ 8h đến 10h
            eventStart.setHours(startHour, startMinute,0); // Giờ bắt đầu (8 giờ)
            eventEnd.setHours(endHour, endMinute,0);
      
            acc.push({
              title: task.name,
              start: eventStart,
              end: eventEnd,
              task: task,
              classNames: getStatusClass(task.status, task.dueDate)
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    
      return acc;
    }, []);
               
  const [events, setEvents] = useState(eventList);
  const handleSelect = (info) => {
    const { start, end } = info;
    const eventNamePrompt = prompt("Enter, event name");
    if (eventNamePrompt) {
      setEvents([
        ...events,
        {
          start,
          end,
          title: eventNamePrompt,
          id: uuid(),
        },
      ]);
    }
  };

  useEffect(() => {
    setEvents(eventList);
  },[taskList])
  return (
    <div style={{ backgroundColor: "white" }} className="calendar-container">
      <FullCalendar
  editable
  selectable
  events={events}
  headerToolbar={{
    start: "today prev next",
    center: "title",
    end: "dayGridMonth timeGridWeek timeGridDay listWeek",
  }}
  displayEventTime={true}
  plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
  views={{
    dayGridMonth: { type: 'dayGridMonth' }, // Giữ nguyên cấu trúc mặc định
    dayGridWeek: { type: 'timeGridWeek', slotDuration: '01:00:00' }, // Đặt độ dài mỗi khung là 1 giờ
    dayGridDay: { type: 'timeGridDay', slotDuration: '01:00:00' }, // Đặt độ dài mỗi khung là 1 giờ
    listWeek: { type: 'listWeek', duration: { days: 7 } } // Đặt độ dài mỗi ô là 1 tuần
  }}
  initialView="timeGridWeek" // Chọn chế độ xem mặc định
  eventClick={(info) => {
    showAddTask();
    const selectedEvent = info.event;
    const selectedTask = selectedEvent.extendedProps.task;
    setSelectedTask(selectedTask);
    fetchTaskData(); 
  }}
/>



      {openAddTask && 
      <TaskView
      showModal={openAddTask}
      hideModal={hideAddTask}
      selectedTask={selectedTask}
      planId={planId}
      fetchTaskData={fetchTaskData}
    />}
    </div>
  );
}


