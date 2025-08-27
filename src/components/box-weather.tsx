/* eslint-disable @next/next/no-img-element */
import { WeatherResponse } from "@/types/Response.types";
import React, { useEffect, useState } from "react";
import SUNSET from "../assets/sunset.png";
import SUNRISE from "../assets/sunrise.png";
import Image from "next/image";

const BoxWeather = ({
  weatherData,
}: {
  weatherData?: {
    location?: string;
    data?: WeatherResponse;
  };
}) => {
  const [iconUrl, setIconUrl] = useState("");
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    setLoaded(false);

    return () => {
      setLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (weatherData?.data?.weather?.[0]?.icon) {
      setIconUrl(
        `http://openweathermap.org/img/wn/${weatherData.data.weather[0].icon}.png`
      );
    }
  }, [weatherData?.data?.weather]);

  let background_string = ``;

  switch (weatherData?.data?.weather?.[0]?.main) {
    case "Clear":
      background_string = "bg-blue-500/70 text-white";
      break;
    case "Clouds":
      background_string = "bg-gray-500 text-white";
      break;
    case "Rain":
      background_string = "bg-blue-800 text-white";
      break;
    case "Snow":
      background_string = "bg-white text-neutral-800";
      break;
    default:
      background_string = "bg-gray-600";
  }

  if (loaded) {
    return <div className="md:w-80 w-70 min-h-96">Loading...</div>;
  }

  if (!weatherData || !weatherData.data) {
    return null;
  }

  return (
    <div
      className={`md:w-80 w-70 min-h-96 ${background_string} py-4 rounded-md shadow`}
    >
      <div className="border-white/30 flex items-center justify-between px-6 pb-2 border-b">
        <p className="font-semibold">
          {weatherData?.location}, {weatherData.data.sys.country}
        </p>
        <p className="text-sm">
          {new Date(
            (weatherData?.data?.dt || new Date().getTime()) * 1000
          ).toLocaleDateString()}
        </p>
      </div>
      <div className="border-white/30 px-6 py-2 space-y-2 text-center border-b">
        <div className="flex flex-col items-center justify-center">
          <img src={iconUrl || undefined} alt="icon weather" />
        </div>
        <div>
          {Number(weatherData.data.main.temp).toFixed(0)}°C -{" "}
          {weatherData.data.weather[0].description}
        </div>
      </div>
      <div className="border-white/30 px-6 py-2 space-y-1 text-sm border-b">
        <p>
          Feels like: {Number(weatherData.data.main.feels_like).toFixed(0)}°C
        </p>
        <p>
          Min: {Number(weatherData.data.main.temp_min).toFixed(0)}°C | Max:{" "}
          {Number(weatherData.data.main.temp_max).toFixed(0)}°C
        </p>
        <p>Humidity: {weatherData.data.main.humidity}%</p>
        <p>
          Wind: {Number(weatherData.data.wind.speed).toFixed(1)} m/s (
          {weatherData.data.wind.deg}°)
        </p>
        <p>Clouds: {weatherData.data.clouds.all}%</p>
        <p>Visibility: {weatherData.data.visibility / 1000} km</p>
      </div>
      <div className="md:flex-row md:gap-0 flex flex-col items-center justify-between gap-1 px-8 pt-2">
        <div className="flex flex-col items-center">
          <Image src={SUNRISE} alt="Sunrise" width={40} height={40} />
          {new Date(weatherData.data.sys.sunrise * 1000).toLocaleTimeString()}
        </div>
        <div className="flex flex-col items-center">
          <Image src={SUNSET} alt="Sunset" width={40} height={40} />
          {new Date(weatherData.data.sys.sunset * 1000).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default BoxWeather;
