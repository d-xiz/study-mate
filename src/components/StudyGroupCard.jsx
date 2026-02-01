import { useState, useEffect } from "react";
import Modal from "./Modal";
import { api } from "../api";
const StudyGroupCard = ({ group ,}) => {
    const [open, setOpen] = useState(false);
const [message, setMessage] = useState("");
const [success, setSuccess] = useState(false);

const currentUser = JSON.parse(localStorage.getItem("user"));
const currentUserId = currentUser ? currentUser.id : null;
const isOwner =
  String(group.adminId) === String(currentUserId);

const isMember =
  group.members?.some(
    (m) => String(m._id || m) === String(currentUserId)
  );

const isFull = group.availableSeats <= 0;


const openModal = () => {
  setMessage("");
  setSuccess(false);
  setOpen(true);
};
useEffect(() => {
  if (success) {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 1000); //After 1 seconds the modal will close
    return () => clearTimeout(timer);
  }
}, [success]); 
  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = Number(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}${m !== "00" ? `:${m}` : ""}${suffix}`;
  };

  const scheduleText =
    group.days.length === 1
      ? `Every ${group.days[0]} • ${formatTime(group.startTime)}–${formatTime(group.endTime)}`
      : `${group.days.join(" & ")} • ${formatTime(group.startTime)}–${formatTime(group.endTime)}`;

  return (
    <>
    <div className="group-row">

      <div className="group-main">
        <h4 className="group-title">{group.name}</h4>

        <div className="group-meta">
          <p>
             <span>{"Admin"}</span> {group.adminName}
          </p>
          <p>{scheduleText}</p>
        </div>

        <div className="group-footer">
          <p className="location">{group.location}</p>
          <p className="available-seats">
            <span>Available seats</span> {group.availableSeats} / {group.pax}
          </p>
        </div>
      </div>

     

      <div className="group-action">
 
    {!isOwner && !isMember && !isFull && (
  <button className="join-btn" onClick={openModal}>
    Join
  </button>
)}

{isMember && (
  <button className="join-btn" disabled>
    Joined
  </button>
)}

{isFull && !isMember && (
  <button className="join-btn" disabled>
    Full
  </button>
)}

</div>
       </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Join ${group.name}`}
      >
        <p><strong>Schedule:</strong> {scheduleText}</p>
        <p><strong>Location:</strong> {group.location}</p>
        {success && (
  <p style={{ color: "green", fontWeight: "600" }}>
     Request sent successfully!
  </p>
)}


         <textarea
         className="modal-msg"
          placeholder="Message to admin (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
<div className="modal-action">
        <button className="modal-btn" disabled={success} onClick={() => {
          api.notifications.create({
  type: "group_join",
  senderId: currentUser.id,
  receiverId: group.adminId,
  groupId: group._id,
  message,
}).then(() => {
            setSuccess(true);
          }).catch((err) => {
            console.error("Failed to send request:", err);
          });
          }}>
          Join Group
        </button>
        </div>
      </Modal>
    </>

  );
};

export default StudyGroupCard;
