import { useEffect, useState } from "react";
import { TSchedules } from "./Schedule";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useUserContext } from "../Providers/UserProvider";
import { Requests } from "../api/schedulesApi";
import { TProfile } from "./Friends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

type TScheduleTDProps = {
  day: TSchedules[];
  dayOfWeekIndex: number;
  profile: TProfile;
  fetchUserScheduleData: (user: string) => void;
};

export const ScheduleTD = ({
  day,
  dayOfWeekIndex,
  profile,
  fetchUserScheduleData,
}: TScheduleTDProps) => {
  const [tdButtonsVisible, setTdButtonsVisible] = useState<boolean>(false);
  const [newListItemVisible, setNewListItemVisible] = useState<boolean>(false);
  const [newListItemContent, setNewListItemContent] = useState<string>("");
  const [newApptSaveButtonVisible, setNewApptSaveButtonVisible] =
    useState<boolean>(false);
  const [listItemView, setListItemView] = useState<"display" | "delete">(
    "display"
  );

  const { currentUser } = useUserContext();

  const newScheduleData = {
    user: currentUser.username,
    day: dayOfWeekIndex,
    event: newListItemContent,
  };

  const handleListItemContentChange = (e: ContentEditableEvent) => {
    setNewListItemContent(e.target.value);
  };

  let deletionQueue: number[] = [];

  useEffect(() => {
    if (newListItemVisible) {
      setNewListItemVisible(false);
    }
  }, []);

  return (
    <>
      <td
        key={`day-of-the-week-${dayOfWeekIndex}`}
        onMouseOver={() => setTdButtonsVisible(true)}
        onMouseLeave={() => setTdButtonsVisible(false)}
      >
        {tdButtonsVisible && profile.user === currentUser.username && (
          <>
            {/* Trashcan button */}
            {listItemView === "display" && (
              <button
                className="schedule_trashcan_btn"
                onClick={() => setListItemView("delete")}
              >
                {<FontAwesomeIcon icon={faTrashCan} />}
              </button>
            )}

            {/* Cancel and Delete buttons */}
            {listItemView === "delete" && (
              <div className="delete_or_cancel_btn_container">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => {
                    setListItemView("display");
                    deletionQueue = [];
                  }}
                />
                <input
                  type="button"
                  value="Delete"
                  onClick={async () =>
                    await Promise.all(
                      deletionQueue.map((id: number) =>
                        Requests.deleteScheduleAppointment(id)
                      )
                    ).then(() => {
                      fetchUserScheduleData(profile.user);
                      setListItemView("display");
                      deletionQueue = [];
                    })
                  }
                />
              </div>
            )}

            {/* Add new list item button */}
            <input
              type="button"
              value="+"
              onClick={() => {
                setNewListItemVisible(true);
                setNewApptSaveButtonVisible(true);
              }}
            />
          </>
        )}

        <ul>
          {/* Either displays appointments, or displays a list of checkboxes to select appointments to delete  */}
          {day.length
            ? day.map((obj, eventIndex) =>
                listItemView === "display" ? (
                  <li
                    className="li_margin_bottom"
                    key={`day-${dayOfWeekIndex}-event-${eventIndex}`}
                    suppressContentEditableWarning
                    contentEditable={profile.user === currentUser.username}
                    onBlur={(e) => {
                      Requests.updateScheduleAppointment(obj.id, {
                        event: e.currentTarget.innerText,
                      });
                    }}
                  >
                    {obj.event}
                  </li>
                ) : (
                  <div
                    className="delete_queue_list_item"
                    key={`deletion_item_day-${dayOfWeekIndex}-event-${eventIndex}`}
                  >
                    <input
                      onChange={() => {
                        deletionQueue.includes(obj.id)
                          ? deletionQueue.splice(
                              deletionQueue.indexOf(obj.id),
                              1
                            )
                          : deletionQueue.push(obj.id);
                      }}
                      type="checkbox"
                      className="appointment_deletion_checkbox"
                    />
                    <label>{obj.event}</label>
                  </div>
                )
              )
            : null}

          {newListItemVisible && (
            <>
              <li
                className={`li_margin_bottom ${
                  newApptSaveButtonVisible ? "underline" : "no_underline"
                }`}
              >
                <ContentEditable
                  className="new_appointment"
                  html={newListItemContent}
                  onChange={handleListItemContentChange}
                />
              </li>

              {newApptSaveButtonVisible && (
                <>
                  <input
                    type="button"
                    value="cancel"
                    className="new_schedule_item_save_btn"
                    onClick={() => {
                      setNewApptSaveButtonVisible(false);
                      setNewListItemVisible(false);
                    }}
                  />
                  <input
                    type="button"
                    value="save"
                    className="new_schedule_item_save_btn"
                    onClick={() => {
                      Requests.postNewScheduleData(newScheduleData).then(() => {
                        setNewApptSaveButtonVisible(false);
                        fetchUserScheduleData(profile.user);
                        setNewListItemContent("");
                        setNewListItemVisible(false);
                      });
                    }}
                  />
                </>
              )}
            </>
          )}
        </ul>
      </td>
    </>
  );
};
