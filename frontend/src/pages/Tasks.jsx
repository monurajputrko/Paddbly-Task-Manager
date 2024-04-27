import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Modal from "../componets/Modal";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "../componets/TaskCard";
import { addATask, setUserTasks, setUserTasksCount } from "../redux/task.slice";
import { logout } from "../redux/auth.slice";
import { Link } from "react-router-dom";

const Tasks = () => {
  const user = useSelector((store) => store.auth);
  const access_token = useSelector((store) => store.auth.token);
  const tasks = useSelector((store) => store.task.tasks);
  const dispatch = useDispatch();

  const task_count = useSelector((store) => store.task.count);

  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [statusQuery, setStatusQuery] = useState("");
  const [priorityQuery, setPriorityQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allTasksCount, setAllTasksCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/task/get", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          status: statusQuery,
          priority: priorityQuery,
          page,
        },
      });
      dispatch(setUserTasks(response.data.tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const FetchAllTasksCount = async () => {
    try {
      const response = await axios.get("http://localhost:3000/task/count", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          priority: priorityQuery,
          status: statusQuery,
        },
      });
      // console.log("ers", response.data);
      dispatch(setUserTasksCount(response.data));
      setAllTasksCount(response.data.queriedTaskCount);
      // dispatch(setUserTasks(response.data.tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    FetchAllTasksCount();
  }, [page, dispatch, allTasksCount, totalPages]);

  useEffect(() => {
    setPage(1);
    fetchTasks();
    FetchAllTasksCount();
  }, [statusQuery, priorityQuery]);

  useEffect(() => {
    if (task_count.queriedTaskCount === 0) {
      setTotalPages(Math.ceil(task_count.allTasksCount / 3));
    } else {
      setTotalPages(Math.ceil(task_count.queriedTaskCount / 3));
    }
  }, [task_count.queriedTaskCount, task_count.allTasksCount]);

  const createTask = async (data) => {
    try {
      setCreateTaskLoading(true);
      const { title, description, priority } = data;

      if (!title) {
        return toast.error("Add a title");
      }

      if (!description) {
        return toast.error("Add some description");
      }

      if (!priority) {
        return toast.error("Select priority");
      }
      const response = await axios.post(
        "http://localhost:3000/task/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(response.data);
      setIsOpen(false);
      dispatch(addATask(response.data.newTask));
      toast.success("Task Created");
    } catch (err) {
      console.log(err);
    } finally {
      setCreateTaskLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>

<nav className="main-menu">
      <ul>
        {/* <li>
          <a href="#">
          <img style={{marginRight:"20px",marginLeft:"15px"}} width="24" height="24" src="https://img.icons8.com/ios-filled/50/FFFFFF/home.png" alt="home"/>
            <span className="nav-text">Home</span>
          </a>
        </li> */}

        <li>
          <a href="#">
            <i className="fa fa-bell nav-icon"></i>
            <span className="nav-text font-extrabold text-white text-3xl mb-5">Tasks</span>
          </a>
        </li>

        <li>
          <a href="#">
          <img style={{marginRight:"20px",marginLeft:"15px"}} width="24" height="24" src="https://img.icons8.com/external-bearicons-glyph-bearicons/64/FFFFFF/external-All-miscellany-texts-and-badges-bearicons-glyph-bearicons.png" alt="home"/>
            <span className="nav-text font-bold text-white">All Tasks {task_count.allTasksCount}</span>
          </a>
        </li>

        <li>
          <a href="#">
          <img style={{marginRight:"20px",marginLeft:"15px"}} width="24" height="24" src="https://img.icons8.com/glyph-neue/64/FFFFFF/connection-status-off.png" alt="home"/>
            <span className="nav-text font-bold text-white">Pending {task_count.pendingTasksCount}</span>
          </a>
        </li>

        <li>
          <a href="#">
          <img style={{marginRight:"20px",marginLeft:"15px"}} width="24" height="24" src="https://img.icons8.com/pulsar-line/48/FFFFFF/spinner-frame-1.png" alt="home"/>
            <span className="nav-text font-bold text-white">In Progress {task_count.inProgressTasksCount}</span>
          </a>
        </li>

        <li>
          <a href="#">
          <img style={{marginRight:"20px",marginLeft:"15px"}} width="24" height="24" src="https://img.icons8.com/pulsar-line/48/FFFFFF/task-completed.png" alt="home"/>
            <span className="nav-text font-bold text-white">Completed {task_count.completedTasksCount}</span>
            {console.log(task_count)}
          </a>
        </li>
      </ul>

      <ul className="logout">
      <li>
          <a href="#">
          <Link style={{marginRight:"20px",marginLeft:"5px"}} to="/profile">
            <div className="bg-sky-400 size-10 rounded-full flex items-center justify-center capitalize text-lg text-slate-800 hover:cursor-pointer">
              {user.fullname
                .split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </div>
          </Link>
            <span className="nav-text font-bold text-white">Profile</span>
          </a>
        </li>
        <li onClick={handleLogout}>
          <a href="#">
          <img style={{marginRight:"20px",marginLeft:"15px"}} width="24" height="24" src="https://img.icons8.com/ios-filled/50/FFFFFF/exit.png" alt="logout"/>
            <span className="nav-text font-bold text-white">Logout</span>
          </a>
        </li>
      </ul>
   </nav>

      <div className="flex justify-center flex-col items-center">
        <h1 className="text-5xl mb-5 mt-4 font-bold text-white">Your Tasks</h1>
        <div className="flex gap-3 items-center">
          
          <div
            onClick={() => setPriorityQuery("low")}
            className={`border-2 ${
              priorityQuery === "low" && "bg-green-500 text-white"
            } border-green-500 w-24 text-center rounded-full hover:cursor-pointer`}
          >
            Low
          </div>
          <div
            onClick={() => setPriorityQuery("medium")}
            className={`border-2 ${
              priorityQuery === "medium" && "bg-yellow-400 text-white"
            } border-yellow-400 w-24 text-center rounded-full hover:cursor-pointer`}
          >
            Medium
          </div>

          <div
            onClick={() => setPriorityQuery("high")}
            className={`border-2 ${
              priorityQuery === "high" && "bg-red-500 text-white"
            } border-red-500 w-24 text-center rounded-full hover:cursor-pointer`}
          >
            High
          </div>

         
        </div>

        {/* Tasks here */}
        <button
          onClick={openModal}
          style={{border: '1px solid black'}}
          className="mt-6 px-6 py-2 rounded-md font-medium bg-white-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center"
        >
          <FaPlus className="mr-3" /> Add a task
        </button>

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          createTask={createTask}
          createTaskLoading={createTaskLoading}
        />

        <div className="w-[500px] mt-4 flex flex-col gap-2 p-4 rounded-lg">
          {tasks && tasks.map((task) => <TaskCard {...task} key={task._id} />)}
          {tasks.length === 0 && (
            <div className="bg-gray-800 text-white h-10 flex justify-center rounded-full items-center">
              <h1>No {} Priority task found!</h1>
            </div>
          )}

          {tasks.length >= 3 && (
            <div className="flex justify-end gap-3 items-center mt-1">
              <button
                disabled={page == 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <FaArrowAltCircleLeft
                  size={35}
                  className={`${
                    page == 1 ? "text-gray-400" : "text-gray-800"
                  } hover:cursor-pointer`}
                />
              </button>
              Page : {page}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <FaArrowAltCircleRight
                  size={35}
                  className={`${
                    page === totalPages ? "text-gray-400" : "text-gray-800"
                  } hover:cursor-pointer`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
