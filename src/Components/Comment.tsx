import { useEffect, useState } from "react";
import { Requests } from "../api/postsApi";
import { Requests as ProfileRequests } from "../api/profilesApi";
import { useUserContext } from "../Providers/UserProvider";
import { Ellipsis } from "./Ellipsis";
import { EditMenu } from "./EditMenu";
import { useHomeContext } from "../Providers/HomeProvider";
import { TProfile } from "./Friends";

type TCommentProps = {
  commentText: string;
  user: string;
  id: number;
};

export const Comment = ({ commentText, user, id }: TCommentProps) => {
  const [ellipsisVisible, setEllipsisVisible] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [display, setDisplay] = useState<"text" | "editBox">("text");
  const [commentUpdate, setCommentUpdate] = useState<string>(commentText);
  const [currentProfile, setCurrentProfile] = useState<TProfile>(
    {} as TProfile
  );

  const updateComment = (e: React.FormEvent) => {
    e.preventDefault();
    Requests.updateComment(id, { text: commentUpdate }).then(() => {
      setDisplay("text");
      refetchAllComments();
    });
  };

  const { currentUser } = useUserContext();
  const { refetchAllComments } = useHomeContext();

  useEffect(() => {
    ProfileRequests.getAllProfiles()
      .then((res) => res.find((profile: TProfile) => profile.user === user))
      .then(setCurrentProfile);
  }, []);

  return (
    <>
      <div
        className="comment"
        onMouseOver={() => setEllipsisVisible(true)}
        onMouseOut={() => setEllipsisVisible(false)}
      >
        <img
          className="comment_user_thumbnail"
          src={currentProfile.picture}
          alt="profile picture thumbnail"
        />
        <div className="comment_content">
          <h2>@{user}</h2>

          {display === "text" && <p className="comment_text">{commentText}</p>}

          {display === "editBox" && (
            <form onSubmit={updateComment}>
              <textarea
                value={commentUpdate}
                className="edit_comment_textarea"
                onChange={(e) => setCommentUpdate(e.target.value)}
              ></textarea>
              <input
                type="submit"
                value="Save"
                style={{ position: "absolute", bottom: "0" }}
              />
            </form>
          )}
        </div>
        {ellipsisVisible && currentUser.username === user && (
          <Ellipsis
            setMenuVisible={setMenuVisible}
            className="comment_ellipsis"
          />
        )}
        {menuVisible && (
          <EditMenu
            setDisplay={setDisplay}
            setMenuVisible={setMenuVisible}
            id={id}
          />
        )}
      </div>
    </>
  );
};
