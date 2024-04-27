import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authenticate } from "../redux/auth.slice";
import '../componets/new.css'

const Register = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/register", user);
      console.log(res.data);
      dispatch(authenticate(res.data));
    } catch ({ response: { data } }) {
      console.log("Error ->", data.error);
      toast.error(data.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };
  return (
    <div style={{ background: 'rgb(2,0,36)', backgroundImage: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(16,16,112,1) 0%, rgba(0,212,255,1) 100%)' }} className="bg-[#ffffff] h-screen w-full flex items-center justify-center">
      <div className="flex justify-center items-center">
        <form className="flex flex-col gap-3 w-[400px] border-2 rounded-lg border-black/45 p-6 text-black bg-[#5cd669]">
          <h1 className="text-4xl text-center">Register</h1>

          <label className="bg-gray-800 w-20 rounded-lg text-center text-white px-2">
            Fullname
          </label>
          <input
            type="text"
            placeholder="Fullname"
            className="p-2 text-black rounded-md"
            value={user.fullname}
            onChange={handleChange}
            name="fullname"
          />

          <label className="bg-gray-800 w-20 rounded-lg text-center text-white px-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="p-2 text-black rounded-md"
            value={user.email}
            onChange={handleChange}
            name="email"
          />
          <label className="bg-gray-800 w-24 rounded-lg text-center text-white px-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="p-2 border-blue-500 rounded-md"
            value={user.password}
            onChange={handleChange}
            name="password"
          />

          {/* <button
            type="submit"
            onClick={handleRegister}
            className="border-2 p-2 border-black rounded-lg  bg-gray-800 text-white hover:bg-white hover:text-black"
          >
            Register
          </button> */}

          <button
            type="submit"
            onClick={handleRegister}
            className="m-auto px-6 py-2 font-medium bg-gray-800 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            Register
          </button>
          <div className="flex justify-end items-center">
            Already have a account?{" "}
            <Link to="/login">
              <span className="bg-yellow-300 px-3 py-1 rounded-lg ml-4">
                Login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
