import { useState, useEffect} from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";


const BecomeTutorPage = () => {
  const [form, setForm] = useState({
    qualification: "",
    days: [],
    startTime: "",
    endTime: "",
    modules: [],
    moduleInput: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId =  currentUser._id || currentUser.id


  const [isEdit, setIsEdit] = useState(false);
  const [tutorId, setTutorId] = useState(null);

useEffect(() => {
  if (!userId) return;

  api.tutors.getByUserId(userId)
    .then((myTutor) => {
      setIsEdit(true);
      setTutorId(myTutor._id);
      setForm({
        qualification: myTutor.qualification,
        modules: myTutor.modules,
        days: myTutor.days,
        startTime: myTutor.startTime,
        endTime: myTutor.endTime,
        moduleInput: "",
      });
    })
    .catch(() => {
      setIsEdit(false);
    });
}, [userId]);


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

  const addModule = () => {
    const m = form.moduleInput.trim().toUpperCase();
    if (!m || form.modules.includes(m)) return;

    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, m],
      moduleInput: "",
    }));
  };

  const removeModule = (m) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.filter((x) => x !== m),
    }));
  };

  const validate = () => {
    const err = {};

    if (!form.qualification.trim())
      err.qualification = "Qualification is required";
    if (form.days.length === 0)
      err.days = "Select at least one day";
    if (!form.startTime || !form.endTime)
      err.time = "Start and end time required";
    if (form.startTime >= form.endTime)
      err.time = "End time must be later than start time";
    if (form.modules.length === 0)
      err.modules = "Add at least one module";

    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const resetForm = () => {
  setForm({
    qualification: "",
    days: [],
    startTime: "",
    endTime: "",
    modules: [],
    moduleInput: "",
  });
};


  const isFormValid =
    form.qualification &&
    form.days.length > 0 &&
    form.startTime &&
    form.endTime &&
    form.modules.length > 0;

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!validate()) return;

  
  if (!currentUser) {
    alert("Please login again");
    return;
  }


const payload = {
  userId,
  name: currentUser.name,
  qualification: form.qualification,
  modules: form.modules,
  days: form.days,
  startTime: form.startTime,
  endTime: form.endTime,
};
 try {
  if (isEdit) {
      await api.tutors.update(tutorId, payload);
      setMessage("Tutor profile updated!");
    } else {
  await api.tutors.create(payload)
  const updatedUser = await api.users.updateRole(userId, "tutor");
  localStorage.setItem("user", JSON.stringify(updatedUser));

  setMessage("Tutor profile created successfully!");
    }
  setTimeout(() => {
      navigate("/profile");
  }, 1500);
  
  }catch(err) {
    console.error(err);
    alert("Failed to create tutor.");
  
  resetForm();
  navigate("/");
};

};


  return (
    <main className="container">
      <h1>{isEdit ? "Edit Tutor Profile" : "Become a Tutor"}</h1>


      <form className="group-form" onSubmit={handleSubmit} noValidate>

        {/* BASIC INFO */}
        <fieldset>
          <legend>Basic Information</legend>

          <div className="form-field">
            <label>Qualification</label>
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
            />
            {errors.qualification && (
              <span className="error">{errors.qualification}</span>
            )}
          </div>
        </fieldset>

        {/* AVAILABILITY */}
        <fieldset>
          <legend>Availability</legend>

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
        </fieldset>

        {/* MODULES */}
        <fieldset>
          <legend>Modules</legend>

          <div className="form-row">
            <div className="form-field">
              <label>Add Module</label>
              <input
                value={form.moduleInput}
                onChange={(e) =>
                  setForm({ ...form, moduleInput: e.target.value })
                }
              />
            </div>
            <button type="button" onClick={addModule}>
              Add
            </button>
          </div>

          {form.modules.length > 0 && (
            <ul className="file-list">
              {form.modules.map((m) => (
                <li key={m}>
                  {m}{" "}
                  <button type="button" className="delete-btn" onClick={() => removeModule(m)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}

          {errors.modules && (
            <span className="error">{errors.modules}</span>
          )}
        </fieldset>

        <button type="submit" disabled={!isFormValid}>
          {isEdit ? "Edit Tutor Profile" : "Become a Tutor"}

        </button>
      </form>

      {message && <p className="success">{message}</p>}
    </main>
  );
};

export default BecomeTutorPage;
