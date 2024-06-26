"use client";

import { useActions, useUIState, useAIState } from "ai/rsc";

import type { ClientMessage, AIState } from "../../server/actions";

import WeatherImage, { WeatherTypeProps } from "../weather-image";

type WeatherProps = {
  temp: number;
  weather: WeatherTypeProps;
};

export type CurrentWeatherProps = {
  location: string;
  countryCode: string;
  units: "metric" | "imperial";
  currentHour: number;
  currentDate: Date;
  current: WeatherProps;
  hourly: WeatherProps[];
};

export default function CurrentWeatherCard({
  currentWeather,
}: {
  currentWeather: CurrentWeatherProps;
}) {
  const [, setMessages] = useUIState();
  const [, setAIState] = useAIState();

  const { getWeatherForecastUI, getCurrentWeatherUI } = useActions();

  const handleGetWeatherForecast = async (
    location: string,
    forecastDays: number,
    countryCode: string | undefined,
    units: "metric" | "imperial" | undefined,
  ) => {
    setAIState((AIState: AIState) => ({
      ...AIState,
      isFinished: false,
    }));
    const response = await getWeatherForecastUI(
      location,
      forecastDays,
      countryCode,
      units,
    );
    setMessages((messages: ClientMessage[]) => [...messages, response]);
  };

  const handleGetCurrentWeather = async (
    location: string,
    countryCode: string | undefined,
    units: "metric" | "imperial" | undefined,
  ) => {
    setAIState((AIState: AIState) => ({
      ...AIState,
      isFinished: false,
    }));
    const response = await getCurrentWeatherUI(location, countryCode, units);
    setMessages((messages: ClientMessage[]) => [...messages, response]);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="text-xs font-medium text-zinc-400">
          Weather Forecast: {currentWeather.location}
          {currentWeather.countryCode ? `, ${currentWeather.countryCode}` : ""}
        </h5>
        <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-blue-400 p-3 text-white shadow-md md:p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-1">
            <h5 className="text-xs font-medium">
              {new Date(currentWeather.currentDate).toLocaleDateString(
                undefined,
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row gap-1">
                <h2 className="text-2xl font-semibold">
                  {currentWeather.current.temp}
                </h2>
                <h5>{currentWeather.units === "metric" ? "°C" : "°F"}</h5>
              </div>
              <WeatherImage
                height={48}
                width={48}
                weather={currentWeather.current.weather}
              />
            </div>
          </div>
          <div className="grid w-full auto-cols-min grid-cols-7 gap-4">
            {currentWeather.hourly
              .slice(0, 7)
              .map((hour: any, index: number) => (
                <div
                  className="flex w-8 flex-col items-center gap-1"
                  key={index}
                >
                  <h5 className="text-xs text-zinc-100">
                    {index === 0
                      ? "Now"
                      : ((currentWeather.currentHour + index) % 24)
                          .toString()
                          .padStart(2, "0")}
                  </h5>
                  <WeatherImage height={32} width={32} weather={hour.weather} />
                  <div className="flex flex-row items-center gap-[0.125rem] font-semibold">
                    <h4 className="font-medium">{Math.round(hour.temp)}</h4>
                    <h5 className="text-xs">°</h5>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-2">
        <button
          className="flex w-fit flex-row items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-600 ring-slate-950/20 hover:bg-zinc-100 focus:outline-none focus-visible:ring-[3px] dark:ring-white/40"
          onClick={() =>
            handleGetWeatherForecast(
              currentWeather.location,
              3,
              currentWeather.countryCode,
              currentWeather.units,
            )
          }
        >
          <svg
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="14"
            fill="currentcolor"
          >
            <path
              d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
              fill="currentColor"
            ></path>
          </svg>
          3 day forecast
        </button>
        <button
          className="flex w-fit flex-row items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-600 ring-slate-950/20 hover:bg-zinc-100 focus:outline-none focus-visible:ring-[3px] dark:ring-white/40"
          onClick={() =>
            handleGetWeatherForecast(
              currentWeather.location,
              5,
              currentWeather.countryCode,
              currentWeather.units,
            )
          }
        >
          <svg
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="14"
            fill="currentcolor"
          >
            <path
              d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
              fill="currentColor"
            ></path>
          </svg>
          5 day forecast
        </button>
        <button
          className="flex w-fit flex-row items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-600 ring-slate-950/20 hover:bg-zinc-100 focus:outline-none focus-visible:ring-[3px] dark:ring-white/40"
          onClick={() =>
            handleGetCurrentWeather(
              currentWeather.location === "New York" ? "London" : "New York",
              currentWeather.countryCode === "US" ? "GB" : "US",
              currentWeather.units,
            )
          }
        >
          <svg
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="14"
            fill="currentcolor"
          >
            <path
              d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
              fill="currentColor"
            ></path>
          </svg>
          Weather in{" "}
          {currentWeather.location === "New York" ? "London" : "New York"}
        </button>
      </div>
    </>
  );
}
