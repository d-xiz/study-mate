import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../api";

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // userId passed from signup
  const userId = location.state?.userId;

 
  if (!userId) {
    navigate("/signup");
    return null;
  }

  const [about, setAbout] = useState("");
  const [course, setCourse] = useState("");

  const [strongModules, setStrongModules] = useState([]);
  const [helpModules, setHelpModules] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [wantsTutor, setWantsTutor] = useState(false);



  const [moduleInput, setModuleInput] = useState("");

  const addStrong = () => {
    const value = moduleInput.trim().toUpperCase();
    if (!value || strongModules.includes(value)) return;

    setStrongModules([...strongModules, value]);
    setModuleInput("");
  };

  const addHelp = () => {
    const value = moduleInput.trim().toUpperCase();
    if (!value || helpModules.includes(value)) return;

    setHelpModules([...helpModules, value]);
    setModuleInput("");
  };

  const removeStrong = (m) => {
    setStrongModules(strongModules.filter(x => x !== m));
  };

  const removeHelp = (m) => {
    setHelpModules(helpModules.filter(x => x !== m));
  };

  //handle image upload

  const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 1024 * 1024) {
    alert("Image size should be less than 1MB");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setAvatar(reader.result);
  };
  reader.readAsDataURL(file);
};



  const handleSubmit = () => {
    api.users
      .completeProfile(userId, {
        about,
        course,
        strongModules,
        helpModules,
        avatar
      })
      .then(() => navigate("/login",{
    state: { wantsTutor },
  }))
      .catch(() => alert("Profile setup failed"));
  };

 return (
    <main className="auth-page"> 
      <h2>Complete Your Profile</h2>

      {/* AVATAR UPLOAD */}
      <div className="avatar-upload-section">
        <img 
          src={avatar || "https://ui-avatars.com/api/?name=User"} 
          className="avatar-preview" 
          alt="Avatar Preview" 
        />
        <div className="form-field" style={{ marginBottom: 0 }}>
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAvatarUpload(e)}
          />
        </div>
      </div>

      <div className="flex-column">
        {/* ABOUT */}
        <div className="form-field">
          <label>About You</label>
          <textarea
            placeholder="Tell us a bit about your background and interests..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="4"
          />
        </div>

        {/* COURSE */}
        <div className="form-field">
          <label>Course / Diploma</label>
          <input
            type="text"
            placeholder="e.g. Diploma in IT"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        {/* MODULE SECTION */}
        <div className="module-pill-container">
          <div className="form-field">
            <label>Add Module Codes</label>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="e.g. FWEB, DBMS"
                value={moduleInput}
                onChange={(e) => setModuleInput(e.target.value)}
              />
            </div>
            <div className="form-field">
              <button type="button" onClick={addStrong} className="view-btn">
                + Strong Module
              </button>
              <button type="button" onClick={addHelp} className="view-btn" style={{background: 'var(--btn-muted)'}}>
                + Help Module
              </button>
            </div>
          </div>

          {/* DISPLAY TAGS */}
          {strongModules.length > 0 && (
            <div style={{marginTop: '20px'}}>
              <h4 className="section-sub">Strong Modules</h4>
              <div className="tag-row">
                {strongModules.map((m) => (
                  <span key={m} className="tag">
                    {m} <button onClick={() => removeStrong(m)}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {helpModules.length > 0 && (
            <div style={{marginTop: '20px'}}>
              <h4 className="section-sub">Needs Help In</h4>
              <div className="tag-row">
                {helpModules.map((m) => (
                  <span key={m} className="tag muted">
                    {m} <button onClick={() => removeHelp(m)}>✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TUTOR CHECKBOX */}
        <div className="form-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={wantsTutor}
            onChange={(e) => setWantsTutor(e.target.checked)}
          />
          
            <strong>Become a Tutor</strong>
            <p style={{fontSize: '12px', color: 'var(--text-muted)', margin: 0}}>
              Share your knowledge and help others in your strong modules.
            </p>
          
        </label>
        </div>

        {/* SUBMIT */}
        <div className="auth-button" style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit}>
            Finish Registration
          </button>
        </div>
      </div>
    </main>
  );
};

export default CompleteProfilePage;
