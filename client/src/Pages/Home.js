import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pointSocial from "../images/pointSocial.png";
import business from "../images/business.png";
import publish from "../images/publish.png";

export default function Home() {
  const [year, setYear] = useState(null);
  useEffect(() => {
    const date = new Date();
    setYear(date.getFullYear());
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="flex flex-col my-5 mx-5 md:my-10 md:mx-10 lg:my-15 lg:mx-15 w-full max-w-[1200px]">
        <nav className="mb-8xl flex justify-between ">
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
          <div className="flex flex-col items-center mx-auto ">
            <div className="mb-5 md:mb-10 max-w-sm md:max-w-none">
              <h3 className="text-3xl text-center md:text-6xl font-inter font-bold">
                Write <span className="text-dblue font-bold">once</span> post{" "}
                <span className="text-dblue font-bold">everywhere</span>
              </h3>
            </div>

            <div className="mb-5 md:mb-6 max-w-sm md:max-w-none">
              <p className="text-md md:text-2xl text-center font-inter font-bold">
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
        </div>

        <div className="flex flex-col font-inter justify-center items-center">
          <div className="flex pt-5 pb-5 flex-col my-10 p-10  w-full rounded-md bg-dblue justify-center space-y-6 md:flex-row md:justify-around  max-w-[500px] md:max-w-[900px] md:pt-20 md:pb-20">
            <div className="flex flex-col space-y-4 justify-center md:w-7/12 ">
              <p className="text-owhite text-center font-bold md:text-left md:text-2xl">
                Supports Facebook Business, Instagram Business/Creator and
                Twitter accounts
              </p>
              <p className="text-owhite text-center md:text-left md:text-xl">
                Create or change your Facebook and Instagram to a
                Business/Creator account. Works with all twitter accounts
              </p>
            </div>
            <div className="flex justify-center ">
              <img src={business} className=" w-[58px] h-[64px]" />
            </div>
          </div>

          <div className="flex pt-5 pb-5 flex-col my-10 p-10  w-full rounded-md bg-dblue justify-center space-y-6 md:flex-row md:justify-around  max-w-[500px] md:max-w-[900px] md:pt-20 md:pb-20">
            <div className="flex flex-col space-y-4 justify-center  md:w-7/12">
              <p className="text-owhite text-center font-bold md:text-left md:text-2xl">
                Connect your social media accounts
              </p>
              <p className="text-owhite text-center md:text-left md:text-xl">
                Click on the social media icons to connect your social media
                account
              </p>
            </div>
            <div className="flex justify-center ">
              <img src={pointSocial} />
            </div>
          </div>

          <div className="flex pt-5 pb-5 flex-col my-10 p-10  w-full rounded-md bg-dblue justify-center space-y-6 md:flex-row md:justify-around  max-w-[500px] md:max-w-[900px] md:pt-20 md:pb-20">
            <div className="flex flex-col space-y-4 justify-center md:w-7/12">
              <p className="text-owhite text-center font-bold md:text-left md:text-2xl">
                Write your content and post
              </p>
              <p className="text-owhite text-center md:text-left md:text-xl">
                Customize your content based on the social media platforms and
                post with a click of a button
              </p>
            </div>
            <div className="flex justify-center ">
              <img src={publish} />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-5 font-sm">
          <p>Spost - All rights reserved {year}.</p>
        </div>
      </div>
    </div>
  );
}
