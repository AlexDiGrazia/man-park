import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Requests } from "../api/profilesApi";
import { useNavigate, useParams } from "react-router-dom";
import { TProfile } from "../Components/Friends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Schedule } from "../Components/Schedule";
import { useUserContext } from "../Providers/UserProvider";
import ReactDatePicker from "react-datepicker";
import { UploadWidget } from "../Components/UploadWidget";

type TProfileProps = {
  setFriendsListDisplay: Dispatch<SetStateAction<"friends-list" | "profile">>;
};

export type TSchedules = {
  user: string;
  day: number;
  event: string;
};

export const Profile = ({ setFriendsListDisplay }: TProfileProps) => {
  const [profile, setProfile] = useState<TProfile>({} as TProfile);
  const [birthday, setBirthday] = useState<Date>(new Date());
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { currentUser, jwtToken } = useUserContext();

  const refetchProfileInformation = () =>
    Requests.getSingleProfile(Number(profileId)).then((res) => {
      setProfile(res);
      setBirthday(new Date(res.birthday));
    });

  useEffect(() => {
    refetchProfileInformation();
  }, []);

  useEffect(() => {
    refetchProfileInformation();
  }, [profileId]);

  return (
    <div style={{ color: "white" }}>
      <div className="profile_img_container">
        {profile.username !== currentUser.username && (
          <img
            src={profile.picture}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "20px",
            }}
          />
        )}
        {profile.username === currentUser.username && (
          <>
            <UploadWidget
              dynamicPropsObject={{
                refetchProfileInformation,
                multiple: false,
                callback: "patch-profile-pic",
                picture: profile.picture,
                cropping: true,
                uploadPreset: import.meta.env
                  .VITE_CLOUDINARY_PROFILE_THUMBNAIL_UPLOAD_PRESET,
              }}
            />
          </>
        )}

        <div className="profile_user_basic_info">
          <h2>{profile.username}</h2>
          <p>
            <span className="user_basic_info_span">Home:</span>{" "}
            <span
              contentEditable={profile.username === currentUser.username}
              suppressContentEditableWarning
              onBlur={(e) =>
                Requests.updateProfile(
                  profile.id,
                  {
                    home: e.currentTarget.innerText,
                  },
                  jwtToken
                )
              }
            >
              {profile.home}
            </span>
          </p>
          <p>
            <span className="user_basic_info_span">Occupation:</span>{" "}
            <span
              contentEditable={profile.username === currentUser.username}
              suppressContentEditableWarning
              onBlur={(e) =>
                Requests.updateProfile(
                  profile.id,
                  {
                    occupation: e.currentTarget.innerText,
                  },
                  jwtToken
                )
              }
            >
              {profile.occupation}
            </span>
          </p>
          <div>
            <span className="user_basic_info_span">Birthday:</span>{" "}
            {/* Date picker if user is accessing their own profile to edit birthday */}
            {profile.username === currentUser.username && (
              <ReactDatePicker
                className="profile_birthday_date_picker"
                selected={birthday}
                onChange={(birthday: Date) => {
                  setBirthday(birthday);
                  Requests.updateProfile(
                    profile.id,
                    {
                      birthday: new Date(birthday),
                    },
                    jwtToken
                  );
                }}
              />
            )}
            {/* Span for all profiles not belonging to current user so other's profiles can't be edited*/}
            {profile.username !== currentUser.username && (
              <span>
                {profile.birthday /* makes sure birthday is defined */ &&
                  new Date(profile.birthday).toLocaleDateString("en-US")}
              </span>
            )}
          </div>
          <p>
            <span className="user_basic_info_span">Age:</span>{" "}
            <span>
              {" "}
              {/* Progammatic calculation of age - milliseconds from date of birth to today -> divided by milliseconds in one year */}
              {profile.birthday /* makes sure birthday is defined */ &&
                Math.floor(
                  (Date.parse(new Date().toLocaleDateString("en-US")) -
                    Date.parse(
                      new Date(profile.birthday).toLocaleDateString("en-US")
                    )) /
                    (1000 * 60 * 60 * 24 * 365.25)
                )}
            </span>
          </p>
        </div>
      </div>
      <span
        className="profile_back_btn"
        onClick={() => {
          setFriendsListDisplay("friends-list");
          navigate("/home");
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Back</span>
      </span>
      <p
        className="profile_bio"
        contentEditable={profile.username === currentUser.username}
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={(e) =>
          Requests.updateProfile(
            profile.id,
            {
              bio: e.currentTarget.innerText,
            },
            jwtToken
          )
        }
      >
        {profile.bio ? profile.bio : "User has not yet submitted a bio"}
      </p>
      <Schedule profile={profile} />
    </div>
  );
};
