import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { updateFullname } from "../redux/auth.slice";

const ProfilePage = () => {
  const user = useSelector((store) => store.auth);
  const access_token = useSelector((store) => store.auth.token);

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    fullname: user.fullname,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo.fullname) {
      return toast.error("Please Enter Fullname");
    }

    if (userInfo.password && userInfo.password.length < 6) {
      return toast.error("Password Should be at least 6 letters long!");
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/update",
        {
          fullname: userInfo.fullname,
          password: userInfo.password,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      toast.success("User Info Updated Successfully! 😎");
      console.log(response.data);
      dispatch(updateFullname(response.data.fullname));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ background: 'rgb(2,0,36)', backgroundImage: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(16,16,112,1) 0%, rgba(0,212,255,1) 100%)' }} className="bg-[#ffffff] h-screen w-full flex items-center justify-center">
      <div className="flex justify-center items-center">
        <form className="flex flex-col justify-center gap-3 w-[400px] border-2 rounded-lg border-black/45 p-6 text-black ">
          <div className="capitalize bg-sky-400 size-20 m-auto flex justify-center rounded-full items-center text-2xl">
            {user.fullname
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </div>

          <label className="bg-gray-800 w-20 rounded-lg text-center text-white px-2 -mb-1 font-light">
            Email
          </label>
          <input
            type="text"
            value={user.email}
            disabled
            className="border-2 border-black/50 w-full rounded-lg px-2"
          />

          <label className="bg-gray-800 w-20 rounded-lg text-center text-white px-2 -mb-1 font-light">
            Fullname
          </label>
          <input
            type="text"
            value={userInfo.fullname}
            onChange={handleChange}
            name="fullname"
            className="border-2 border-black/50 w-full rounded-lg px-2"
          />

          <label className="bg-gray-800 w-32 rounded-lg text-center text-white px-2 -mb-1 font-light">
            New Password?
          </label>
          <input
            type="password"
            value={userInfo.password}
            name="password"
            onChange={handleChange}
            className="border-2 border-black/50 w-full rounded-lg px-2"
          />

          <div className="flex gap-2 justify-end">
            <Link to="/tasks">
              <button className="border-2 border-black  px-2 py-1 rounded-md">
                Back
              </button>
            </Link>

            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-sky-500 px-2 py-1 rounded-md text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
