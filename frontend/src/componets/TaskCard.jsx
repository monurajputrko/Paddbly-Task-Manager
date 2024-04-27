import axios from "axios";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setUserTasksCount, updateTaskStatus } from "../redux/task.slice";
import toast from "react-hot-toast";
import { deleteATask } from "../../../backend/controllers/task.conrollers";
import EditTaskModal from "./EditTaskModal";
import { CountdownTimer } from "./CountdownTimer";

const TaskCard = ({
  title,
  description,
  status,
  priority,
  dueDate,
  _id,
  publishedAt,
}) => {
  const access_token = useSelector((store) => store.auth.token);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const priorityColor = {
    low: "bg-green-500",
    medium: "bg-yellow-400",
    high: "bg-red-500",
  };

  const statusColor = {
    pending: "bg-yellow-400",
    "in progress": "bg-blue-500",
    completed: "bg-green-500",
  };

  const handleStatusChange = async (e) => {
    console.log("trying status change");
    try {
      const status = e.target.value;
      const response = await axios.post(
        "https://paddbly-task-manager.vercel.app/task/updateStatus",
        { taskId: _id, status },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      const { status: newStatus, _id: taskId } = response.data.task;
      dispatch(updateTaskStatus({ taskId, newStatus }));
      FetchAllTasksCount();
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskDelete = async () => {
    try {
      const response = await axios.post(
        "https://paddbly-task-manager.vercel.app/task/deleteTask",
        { taskId: _id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const id = await response.data.taskId;
      // dispatch(deleteATask({ taskId: response.data.taskId }));
      // dispatch(deleteATask(id));
      window.location.reload();
      toast.success("Task Deleted updated 👍");
    } catch (err) {
      console.log(err);
    }
  };

  const FetchAllTasksCount = async () => {
    try {
      const response = await axios.get("https://paddbly-task-manager.vercel.app/task/count", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {},
      });
      dispatch(setUserTasksCount(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    FetchAllTasksCount();
  }, [dispatch, _id]);
  return (
    <div className={`${status === "completed" ? "h-[155px]" : "h-[190px]"} p-4 rounded-2xl border-2 border-black/40`}>
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl capitalize line-clamp-1`}
        >
          {title}
        </h1>
        <div className="flex gap-2">
          <MdOutlineEdit
            onClick={openModal}
            size={24}
            className="hover:cursor-pointer"
          />
          <MdDeleteOutline
            size={24}
            className="hover:cursor-pointer"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleTaskDelete();
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                  });
                }
              });
            }}
          />
        </div>
        <EditTaskModal
          isOpen={isOpen}
          onClose={closeModal}
          title={title}
          description={description}
          status={status}
          task_priority={priority}
          _id={_id}
          publishedAt={publishedAt}
        />
      </div>
      <p
        className={`line-clamp-2 capitalize ${
          status === "completed" && "decoration-1"
        }`}
      >
        {description}
      </p>
      <div className="mt-2 flex justify-center gap-2 border-2 border-black/20 rounded-lg bg-gray-800 text-white">
        <label className="mr-2">
          <input
            type="radio"
            value="pending"
            checked={status === "pending"}
            onChange={handleStatusChange}
            className="mr-1"
          />
          Pending
        </label>
        <label className="mr-2">
          <input
            type="radio"
            value="in progress"
            checked={status === "in progress"}
            onChange={handleStatusChange}
            className="mr-1"
          />
          In Progress
        </label>
        <label>
          <input
            type="radio"
            value="completed"
            checked={status === "completed"}
            onChange={handleStatusChange}
            className="mr-1"
          />
          Completed
        </label>
      </div>

      <div className="flex justify-between items-center capitalize text-white">
        <div className="flex gap-2">
          <div
            className={`${priorityColor[priority]} rounded-lg px-4 text-center mt-3`}
          >
            {priority}
          </div>
          <div
            className={`${statusColor[status]} rounded-lg px-2 text-center mt-3`}
          >
            {status}
          </div>
        </div>

        <div className="pt-2 text-sm text-black">
          Due Date : {new Date(dueDate).toLocaleDateString()}
          {console.log("Dat is =",dueDate)}
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:"10px",color:"black"}}>
         {status === "completed" ? "" : <CountdownTimer targetDate={dueDate} />}
      </div>
    </div>
  );
};

export default TaskCard;
