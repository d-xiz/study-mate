import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useEffect } from "react";
import { useParams } from "react-router-dom";



const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    subject: "",
    days: [],
    startTime: "",
    endTime: "",
    location: "",
    pax: "",
    welcomeMessage: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");


  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentUser = JSON.parse(localStorage.getItem("user"));
    
  const { groupId } = useParams();
  const isEdit = Boolean(groupId);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };


  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Group name is required";
    if (!form.subject.trim())
  err.subject = "Subject is required";

    if (form.days.length === 0) err.days = "Select at least one day";
    if (!form.startTime || !form.endTime)
      err.time = "Start and end time required";
    if (form.startTime >= form.endTime)
      err.time = "End time must be later than start time";
    if (!form.location.trim()) err.location = "Location required";
    if (!form.pax || Number(form.pax) < 2)
      err.pax = "Minimum 2 participants";

    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const isFormValid =
  form.name &&
  form.subject &&
  form.days.length > 0 &&
  form.startTime &&
  form.endTime &&
  form.location &&
  Number(form.pax) >= 2 &&
  form.welcomeMessage.trim() !== "";

const generateWelcomeMessage = () => {
  const adminId = currentUser.adminNumber || "studentID"; 
  const adminName = currentUser.name || "Admin Name";

  return `✨ MISSION ACCOMPLISHED: You're in! ✨

Hi there! I'm thrilled to welcome you to ${form.name || "our study group"}. We're coming together to master ${form.subject || "this module"} and I'm glad to have you with us.

📅 OUR SCHEDULE
Every: ${form.days.join(", ") || "scheduled days"}
Time: ${form.startTime || "--:--"} to ${form.endTime || "--:--"}

📍 WHERE WE MEET
Location: ${form.location || "To be confirmed"}
Note: These sessions are held strictly at Temasek Polytechnic campus for TP students only.

💡 NEXT STEPS:
1. Mark these dates in your calendar so you don't miss out.
2. Review any upcoming materials for ${form.subject || "this module"}.
3. Bring your questions and a positive vibe!
This group is held exclusively at Temasek Polytechnic for TP students only. Please ensure you have your student ID ready for verification.

📧 CONTACT & MS TEAMS
If you have questions, reach out,contact me (Admin: ${adminName}) via MS Teams or Email:
Contact: ${adminId}@student.tp.edu.sg

I've set this group up for a maximum of ${form.pax || "X"} people to keep our sessions focused.
Looking forward to our first session! 🚀`;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!validate()) return;

  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser) {
  alert("Please login again");
  navigate("/login");
  return;
}


  const payload = {
    name: form.name,
    subject: form.subject.toUpperCase(),
    adminId: currentUser.id,
    adminName: currentUser.name,
    days: form.days,
    startTime: form.startTime,
    endTime: form.endTime,
    location: form.location,
    pax: Number(form.pax),
    welcomeMessage: form.welcomeMessage,
    
  };
 

   try {
    if (isEdit) {
      //  EDIT MODE
      await api.groups.update(groupId, payload);
      setMessage("Study group updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } else {
      //  CREATE MODE
      await api.groups.create({ ...payload, adminId: currentUser.id, adminName: currentUser.name });
      setMessage("Study group created successfully!");
    
    setTimeout(() => {
      navigate("/search?tab=group");
    }, 1500);
  }
} catch(err) {
    console.error(err);
    alert("Failed to create group. Check console.");
  };

};

useEffect(() => {
  // auto-fill 
  if (
    form.welcomeMessage.trim() === "" &&
    form.name &&
    form.days.length > 0 &&
    form.startTime &&
    form.endTime &&
    form.location&&
    currentUser
  ) {
    setForm(prev => ({
      ...prev,
      welcomeMessage: generateWelcomeMessage(),
    }));
  }
}, [
  form.name,
  form.subject,
  form.days,
  form.startTime,
  form.endTime,
  form.location,
]);

useEffect(() => {
  if (!isEdit) return;

  api.groups.getById(groupId).then(group => {
    setForm({
      name: group.name,
      subject: group.subject,
      days: group.days,
      startTime: group.startTime,
      endTime: group.endTime,
      location: group.location,
      pax: group.pax,
      welcomeMessage: group.welcomeMessage,
    });
  })
  .catch(err => {
    console.error(err);
    alert("Failed to fetch group details.");
    navigate("/profile");
  });
}, [groupId]);


  return (
    <main className="container">
      <h1>{isEdit ? "Edit Study Group" : "Create Study Group"}</h1>
<form className="group-form" onSubmit={handleSubmit} noValidate>

  {/* BASIC INFO */}
  <fieldset>
    <legend>Basic Information</legend>

    <div className="form-field">
      <label>Group Name</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      {errors.name && <span className="error">{errors.name}</span>}
    </div>

   <div className="form-field">
  <label>Module / Subject</label>
  <input
    name="subject"
    placeholder="e.g. FWEB"
    value={form.subject}
    onChange={handleChange}
  />
  {errors.subject && <span className="error">{errors.subject}</span>}
</div>

  </fieldset>

  {/* SCHEDULE */}
  <fieldset>
    <legend>When & Where</legend>

    <div className="form-field">
      <label>Days</label>
      <div className="checkbox-row">
        {daysOfWeek.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={form.days.includes(day)}
              onChange={() => toggleDay(day)}
            />
            {day}
          </label>
        ))}
      </div>
      {errors.days && <span className="error">{errors.days}</span>}
    </div>

    <div className="form-row">
      <div className="form-field">
        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
        />
      </div>
    </div>

    {errors.time && <span className="error">{errors.time}</span>}
 


 
    

    <div className="form-field">
      <label>Location</label>
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
      />
      {errors.location && <span className="error">{errors.location}</span>}
    </div>

    <div className="form-field">
      <label>Total Pax</label>
      <input
        type="number"
        min="2"
        name="pax"
        value={form.pax}
        onChange={handleChange}
      />
      {errors.pax && <span className="error">{errors.pax}</span>}
    </div>
  </fieldset>
  <fieldset>
  <legend>Welcome Message (Sent after approval)</legend>

  <div className="form-field">
    <textarea
      name="welcomeMessage"
      className="welcome-message"
      rows={15}
      value={form.welcomeMessage}
      onChange={handleChange}
    />
    <small className="muted">
      This message will be sent to members when they are accepted.
      You can edit it if you want.
    </small>
  </div>
</fieldset>


 

  <button type="submit" disabled={!isFormValid}>{isEdit ? "Update Group" : "Create Group"}</button>
</form>


      {message && (
  <div className="success-toast">
    {message}
  </div>
)}

    </main>
  );
};

export default CreateGroupPage;
