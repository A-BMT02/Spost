import React from "react";
import home from "../images/home.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center md:block md:mx-auto">
      <div className="flex flex-col my-5  mx-5 md:w-10/12 md:mx-auto max-w-lg md:max-w-6xl">
        <nav className="my-3.5 mb-8xl flex justify-between ">
          <h2 className="text-5xl md:text-6xl font-a text-dblue">Spost</h2>
          <div className="flex space-x-6">
            <div>
              <button
                className="bg-dblue text-sm md:text-lg p-2 md:p-3 text-owhite border border-dblue rounded-lg font-bold font-inter hover:bg-lblue hover:text-dblue"
                onClick={(e) => navigate("/signup")}
              >
                Sign up
              </button>
            </div>
            <div>
              <button
                className="bg-lblue border border-dblue text-sm md:text-lg p-2 md:p-3 text-dblue rounded-lg font-bold font-inter hover:bg-dblue hover:text-owhite"
                onClick={(e) => navigate("/signin")}
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        <div className="flex space-x-12 font-inter mt-5 md:m-10 justify-between items-start">
          <div className="flex flex-col items-center mx-auto md:items-start md:w-[36.5rem]">
            <div className="mb-5 md:mb-10 max-w-sm md:max-w-none">
              <h3 className="text-3xl text-center md:text-left md:text-6xl font-inter font-bold">
                Write <span className="text-dblue font-bold">once</span> post{" "}
                <span className="text-dblue font-bold">everywhere</span>
              </h3>
            </div>

            <div className="mb-5 md:mb-6 max-w-sm md:max-w-none">
              <p className="text-md md:text-2xl text-center md:text-left font-inter font-bold">
                Write your content once and post to all your favorite social
                media platforms
              </p>
            </div>

            <div>
              <button
                onClick={(e) => navigate("/signup")}
                className="bg-dblue text-sm md:text-lg p-2 md:p-4 text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2 hover:border-dblue"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="hidden md:block w-[42rem] -mt-10">
            <img src={home} />
          </div>
        </div>
      </div>
    </div>
  );
}
