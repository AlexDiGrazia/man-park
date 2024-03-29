import { useLocation, useNavigate } from "react-router-dom";
import { useHomeContext } from "../Providers/HomeProvider";

export const TabSlider = () => {
  const { tab, setTab, setFriendsListDisplay } = useHomeContext();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleTabChange = (tab: string) => {
    pathname !== "/home" && navigate("/home", { replace: true });
    setTab(tab);
    setFriendsListDisplay("friends-list");
  };

  return (
    <>
      <div className="selector_bar">
        <label className="tab" htmlFor="radio-posts">
          <input
            type="radio"
            id="radio-posts"
            name="tabs"
            onChange={() => handleTabChange("posts-tab")}
            checked={tab === "posts-tab"}
          />
          Posts
        </label>
        <label className="tab" htmlFor="radio-events">
          <input
            type="radio"
            id="radio-events"
            name="tabs"
            onChange={() => handleTabChange("events-tab")}
            checked={tab === "events-tab"}
          />
          Events
        </label>
        <label className="tab" htmlFor="radio-friends">
          <input
            type="radio"
            id="radio-friends"
            name="tabs"
            onChange={() => handleTabChange("friends-tab")}
            checked={tab === "friends-tab"}
          />
          Friends
        </label>
        <label className="tab" htmlFor="radio-photos">
          <input
            type="radio"
            id="radio-photos"
            name="tabs"
            onChange={() => handleTabChange("photos-tab")}
            checked={tab === "photos-tab"}
          />
          Photos
        </label>
        <span className={`glider ${tab}`}></span>
      </div>
    </>
  );
};
