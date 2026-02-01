import { useState, useEffect } from "react";
import Modal from "./Modal";
import { api } from "../api";
 const formatTime = (time) => {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${m !== "00" ? `:${m}` : ""}${suffix}`;
};

const formatAvailability = ({ days, startTime, endTime }) => {
  const time = `${formatTime(startTime)}–${formatTime(endTime)}`;

  if (days.length === 1) {
    return `Every ${days[0]} • ${time}`;
  }

  return `${days.join(", ")} • ${time}`;
};



const TutorCard = ({ tutor }) => {

  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const[endTime,setEndTime]=useState("")

const isValidDay = (dateStr) => {
  const day = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
  });
  return tutor.days.includes(day);
};
const handleBooking = async () => {
  setError("");

  if (!date || !time || !endTime) {
    setError("Please select date, start time and end time");
    return;
  }

  if (!isValidDay(date)) {
    setError("Tutor is not available on this day");
    return;
  }

  try {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    await api.sessions.create({
      tutorId: tutor._id,
      studentId: currentUser.id,
      date,
      startTime: time,
      endTime: endTime,
      stu_message: message,
      module: selectedModule,
    });

    setSuccess(true);
  } catch (err) {
    setError(err.message);
  }
};

  const openModal = () => {
  if (!tutor.modules || tutor.modules.length === 0) return;
  setSelectedModule(tutor.modules[0]);
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

  
  const availabilityText = formatAvailability({
  days: tutor.days,
  startTime: tutor.startTime,
  endTime: tutor.endTime,
});

  return (
    <>
    <div className="card tutor-card">
      
      <div className="card-top">
       <img
  src={
    tutor.userId?.avatar ||
    `https://ui-avatars.com/api/?name=${tutor.userId?.name}`
  }
  alt={`${tutor.userId?.name} profile`}
  className="avatar"
/>



        <div className="card-info">
          <h3>{tutor.name}</h3>
          <p className="qualification">{tutor.qualification}</p>
          <p className="availability">{availabilityText}</p>

          <p className="expert">Expert in:</p>
{tutor.modules?.length > 0 && (
          <div className="tags">
            {tutor.modules.map((m) => (
              <span key={m} className="tag">
                {m}
              </span>
            ))}
          </div>
          )}
        </div>
      </div>
      <div className="card-actions">
<button
 className="view-btn"
  
  onClick={() => setOpenProfile(true)}
>
  View Profile
</button>
     <button className="request-btn" onClick={openModal}>
  Request
</button>
          </div>

        </div>
       <Modal
  open={openProfile}
  onClose={() => setOpenProfile(false)}
  title={tutor.name}
>
  {/* Qualification */}
  <p className="profile-role">{tutor.qualification}</p>

  {/* Modules */}
  <h4>Modules Taught</h4>
  <div className="tag-row">
    {tutor.modules.map((m) => (
      <span key={m} className="tag">{m}</span>
    ))}
  </div>

  {/* Availability */}
  <h4 style={{ marginTop: "16px" }}>Availability</h4>
  <p>
    {tutor.days.join(", ")} •{" "}
{formatTime(tutor.startTime)} –{" "}
{formatTime(tutor.endTime)}

  </p>

  {/* CTA */}
  <div className="modal-action">
    <button
      className="modal-btn"
      onClick={() => {
        setOpenProfile(false);
        setOpen(true);
      }}
    >
      Request Session
    </button>
  </div>
</Modal>

      
      <Modal
      open={open}
        onClose={() => setOpen(false)}
        title={`Request session with ${tutor.name}`}
      ><div className="form-field">
        <p >Select module: </p>
        <select
        className=" module-select"
  value={selectedModule}
  onChange={(e) => setSelectedModule(e.target.value)}
  
>
          {tutor.modules.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select></div>
{success && (
  <p style={{ color: "green", fontWeight: "600" }}>
     Request sent successfully!
  </p>
)}
<div className="form-field date-inputs">
<label>Date</label>
<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
</div>
<div className="form-field time-inputs"> 
<label>Start Time</label>
<input
  type="time"
  value={time}
  onChange={(e) => setTime(e.target.value)}
/>
<label>End Time</label>
<input
  type="time"
  value={endTime}
  onChange={(e) => setEndTime(e.target.value)}
/>
</div>
{error && <p className="error">{error}</p>}

       <textarea
  className="modal-msg form-field"
  placeholder="Message to tutor (optional)"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
<div className="modal-action">

        <button className="modal-btn" onClick={handleBooking}>
  Book Session
</button>

        </div>
      </Modal>
      </>
          
  );
};

export default TutorCard;
