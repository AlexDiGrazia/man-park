import { useEffect, useState } from "react";
import { Requests } from "../api/schedulesApi";
import { Requests as ProfileRequests } from "../api/profilesApi";
import { useParams } from "react-router-dom";
import { ScheduleTD } from "./ScheduleTD";
import { TProfile } from "./Friends";

export type TSchedules = {
  user: string;
  day: number;
  event: string;
  id: number;
};

type TScheduleProps = {
  profile: TProfile;
};

export const Schedule = ({ profile }: TScheduleProps) => {
  const [scheduleData, setScheduleData] = useState<TSchedules[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { profileId } = useParams();
  const daysOfWeekNumbers = [0, 1, 2, 3, 4, 5, 6];
  const dayOfWeekNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  /* filters scheduleData into collections by day */
  const scheduleEachDayOfWeek = daysOfWeekNumbers.map((day) =>
    scheduleData.filter((obj) => obj.day === day)
  );

  const fetchUserScheduleData = (user: string) => {
    Requests.getCurrentUserScheduleData(user).then(setScheduleData);
  };

  useEffect(() => {
    ProfileRequests.getSingleProfile(Number(profileId)).then((profileData) => {
      fetchUserScheduleData(profileData.username);
    });
  }, []);

  useEffect(() => {
    ProfileRequests.getSingleProfile(Number(profileId)).then((profileData) => {
      fetchUserScheduleData(profileData.username);
    });
  }, [profileId]);

  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });

  return (
    <>
      {/* Vertical Schedule */}
      {windowWidth < 1200 && (
        <table className="schedule">
          {scheduleEachDayOfWeek.map((day, dayOfWeekIndex) => (
            <tr>
              {/* TO_DO schedule children need keys, check error when going to profile from profile button */}
              <th>{dayOfWeekNames[dayOfWeekIndex]}</th>
              <ScheduleTD
                key={`day_of_the_week_day_${dayOfWeekIndex}`}
                profile={profile}
                day={day}
                dayOfWeekIndex={dayOfWeekIndex}
                fetchUserScheduleData={fetchUserScheduleData}
              />
            </tr>
          ))}
        </table>
      )}

      {/* Horizontal Schedule  */}
      {windowWidth > 1200 && (
        <table className="schedule">
          <thead>
            <tr>
              {dayOfWeekNames.map((day) => (
                <th key={`day_of_the_week_header_${day}`}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {scheduleEachDayOfWeek.map((day, dayOfWeekIndex) => (
                <ScheduleTD
                  key={`day_of_the_week_day_${dayOfWeekIndex}`}
                  profile={profile}
                  day={day}
                  dayOfWeekIndex={dayOfWeekIndex}
                  fetchUserScheduleData={fetchUserScheduleData}
                />
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};
