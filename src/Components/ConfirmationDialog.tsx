import { useHomeContext } from "../Providers/HomeProvider";
import { Requests as EventRequests } from "../api/eventsApi";
import { Requests as PostRequests } from "../api/postsApi";

export const ConfirmationDialog = () => {
  const {
    setDialogVisible,
    currentEvent,
    currentComment,
    refetchAllEvents,
    refetchAllComments,
    tab,
  } = useHomeContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "events-tab") {
      EventRequests.deleteEvent(currentEvent).then(() => refetchAllEvents());
    }
    if (tab === "posts-tab") {
      currentComment !== null &&
        PostRequests.deleteComment(currentComment).then(() =>
          refetchAllComments()
        );
    }
    setDialogVisible(false);
  };

  return (
    <>
      <div className="confirmation_dialog" style={{}}>
        <p>Are you sure you want to delete this event?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="button"
            value="Cancel"
            onClick={() => setDialogVisible(false)}
          />
          <input type="submit" value="Delete" />
        </form>
      </div>
    </>
  );
};
