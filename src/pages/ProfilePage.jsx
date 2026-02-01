import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

import { 
  Trophy, Star, Users, School,Award, ShieldCheck, Zap, BookOpen 
} from "lucide-react"


  // Map badge names to Lucide Icons
  const getBadgeIcon = (badgeName) => {
    switch (badgeName) {
      case "First Step": return <Zap size={24} color="#f59e0b" />;
      case "Team Player": return <Users size={24} color="#3b82f6" />;
      case "Group Leader": return <ShieldCheck size={24} color="#10b981" />;
      case "Community Builder": return <School size={24} color="#8b5cf6" />;
      case "Helpful Tutor": return <BookOpen size={24} color="#06b6d4" />;
      case "Star Tutor": return <Star size={24} color="#eab308" />;
      case "Expert Tutor": return <Trophy size={24} color="#f43f5e" />;
      case "Rising Star": return <Star size={24} color="#6366f1" />;
      case "Master": return <Award size={24} color="#ec4899" />;
      case "Grand Master": return <Trophy size={24} color="#7c3aed" />;
      default: return <Award size={24} />;
    }
  };

const ProfilePage = () => {
  const navigate = useNavigate();

  // Data States
  const [user, setUser] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [tutor, setTutor] = useState(null);
  
  // UI/Tab States
  const [activeTab, setActiveTab] = useState("overview"); 
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(null);
  const [confirmStopTutor, setConfirmStopTutor] = useState(false);
 const [game, setGame] = useState({
  points: 0,
  badges: [],
});


  // Session States
  const [tutorSessionCount, setTutorSessionCount] = useState(0);
  const [studentSessions, setStudentSessions] = useState([]);
  const [tutorSessions, setTutorSessions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || (!stored._id && !stored.id)) {
      navigate("/login");
      return;
    }
    const userId = stored._id || stored.id;
    api.users.getById(userId).then(setUser).catch(() => navigate("/login"));
  }, [navigate]);
//Data fetching useEffect
  useEffect(() => {
    if (!user) return;
    const userId = user._id || user.id;

    // Groups logic
    api.groups.getAll().then((groups) => {
      setMyGroups(groups.filter(g => String(g.adminId) === String(userId)));
      setJoinedGroups(
  groups.filter(g =>
    g.members?.some(m =>
      String(m._id || m) === String(userId)
    )
  )
);

    });

    // Student sessions
    api.sessions.getForStudent(userId).then(setStudentSessions).catch(() => {});

    // Tutor logic
   if (user.role === "tutor") {
    api.sessions
      .getTutorSessionCount(userId)
      .then(data => setTutorSessionCount(data.count));

    api.tutors
      .getByUserId(userId)
      .then(tutor => {
        setTutor(tutor);
        return api.sessions.getForTutor(tutor._id);
      })
      .then(sessions => setTutorSessions(sessions))
      .catch(err => {
        console.error("Tutor fetch failed:", err);
      });
  }
}, [user]);

  useEffect(() => {
    if (!user) return;
    // Gamification
     api.users.getGamification(user._id).then(setGame);
  }, [user]);

  if (!user) return null;
const handleDeleteGroup = (groupId) => {
    if (!window.confirm("Delete this group?")) return;
       api.groups
      .delete(groupId, user._id)
      .then(() => {
        setMyGroups((prev) =>
          prev.filter((g) => g._id !== groupId)
        );
      })
      .catch(() => alert("Not authorized to delete"));
  };
  const handleLeaveGroup = (groupId) => {
    api.groups.leave(groupId, user._id).then(() => {
      setJoinedGroups(prev => prev.filter(g => g._id !== groupId));
    });
  };



  return (
    <main className="profile-page">
      {/* HEADER SECTION */}
      <header className="profile-header-new">
        <div className="profile-info-main">
          <img 
            src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name} 
            className="avatar-sm" 
            alt="profile" 
          />
          <div className="user-details">
            <h1>{user.name}</h1>
            <span className="badge-role">{user.role}</span>
            <div>
              <button className="view-btn" style={{width: 'auto', padding: '8px 16px'}} onClick={() => {
                setProfileForm({
                  about: user.about || "",
                  course: user.course || "",
                  strongModules: user.strongModules || [],
                  helpModules: user.helpModules || [],
                  avatar: user.avatar || "",
                  moduleInput: ""
                });
                setEditingProfile(true);
              }}>
                Edit Profile
              </button>
            </div>
          </div>
         

        </div>
        

        <div className="profile-stats-grid">
          <div className="stat-card">
            <strong>{myGroups.length + joinedGroups.length}</strong>
            <span>Groups</span>
          </div>
          {user.role === "tutor" && (
            <div className="stat-card">
              <strong>{tutorSessionCount}</strong>
              <span>Sessions</span>
            </div>
          )}
          <div className="stat-card">
              <strong>{game?.points || 0}</strong>
              <span>Points</span>
            </div>
        </div>
      </header>
       <section className="gamification-section">
              <h3 className="section-title">Earned Badges</h3>

              {game?.badges?.length === 0 && (
                <p className="empty-state">Complete tasks to earn your first badge!</p>
              )}

              <div className="badge-grid">
              {game.badges.map((b) => (
                <div key={b} className="badge-card">
                  <div className="badge-icon-wrapper">
                    {getBadgeIcon(b)}
                  </div>
                  <span className="badge-name">{b}</span>
                </div>
             ))}
        </div>
            </section>

      {/* TAB NAVIGATION */}
      <nav className="profile-tabs">
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Overview</button>
        <button className={activeTab === "groups" ? "active" : ""} onClick={() => setActiveTab("groups")}>My Groups</button>
        {user.role === "tutor" && (
          <button className={activeTab === "tutoring" ? "active" : ""} onClick={() => setActiveTab("tutoring")}>Tutoring</button>
        )}
      </nav>

      {/* TAB CONTENT */}
      <div className="profile-body-new">
        
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="fade-in">
            <div className="grid-2-col">
              <section className="card-v2">
                <h4>About</h4>
                <p>{user.about || "No bio provided."}</p>
                <p style={{marginTop: '16px'}}><strong>Course:</strong> {user.course || "—"}</p>
              </section>

              <section className="card-v2">
                <h4>Modules</h4>
                <div style={{marginBottom: '12px'}}>
                  <p><strong>Strong Modules:</strong></p>
                  <div className="tag-row">
                    {user.strongModules?.map(m => <span key={m} className="tag">{m}</span>)}
                  </div>
                </div>
                <div>
                  <p><strong>Needs Help In:</strong></p>
                  <div className="tag-row">
                    {user.helpModules?.map(m => <span key={m} className="tag muted">{m}</span>)}
                  </div>
                </div>
              </section>
            </div>

            <section className="card-v2 full-width">
              <h4>Upcoming Student Sessions</h4>
              {studentSessions.length === 0 ? <p className="empty-state">No sessions scheduled.</p> : (
                studentSessions.map(s => (
                  <div key={s._id} className="list-item-row">
                    <div className="list-item-info">
                      <strong>{s.date}</strong>
                      <span>{s.startTime} – {s.endTime}</span>
                    </div>
                    <span className={`tag ${s.status === 'confirmed' ? '' : 'muted'}`}>{s.status}</span>
                  </div>
                ))
              )}
            </section>
          </div>
        )}

        {/* TAB: GROUPS */}
        {activeTab === "groups" && (
          <div className="fade-in">
            <section className="card-v2" style={{marginBottom: '24px'}}>
              <h4>Groups I Lead</h4>
              {myGroups.map(g => (
                <div key={g._id} className="list-item-row">
                  <div className="list-item-info">
                    <strong>{g.name}</strong>
                    <span>{g.days.join(", ")} • {g.startTime}–{g.endTime}</span>
                     <div className="group-members">
                  {g.members?.map(m => (
                    <div key={m._id} className="member-row">
                      <span>{m.name}</span>
                      <span className="muted">{m.adminNumber}</span>
                    </div>
                  ))}
                </div>
                  
                  <button className="view-btn" style={{width: 'auto'}} onClick={() => {
                   navigate(`/groups/edit/${g._id}`);
                  }}>Edit</button>
                  <button className="view-btn" style={{width: 'auto', background: 'var(--danger)'}} onClick={() => handleDeleteGroup(g._id)}>Delete</button>
</div>
                </div>
              ))}
            </section>

            <section className="card-v2">
              <h4>Groups I've Joined</h4>
              {joinedGroups.map(g => (
                <div key={g._id} className="list-item-row">
                  <div className="list-item-info">
                    <strong>{g.name}</strong>
                    <span>{g.startTime}–{g.endTime}</span>
                    <button className="request-btn" onClick={() => handleLeaveGroup(g._id)}>Leave</button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* TAB: TUTORING */}
        {activeTab === "tutoring" && tutor && (
          <div className="fade-in">
            <section className="card-v2" style={{borderLeft: '4px solid var(--primary)', marginBottom: '24px'}}>
              <h4>Tutor Profile</h4>
              <p><strong>Qualification:</strong> {tutor.qualification}</p>
              <p><strong>Teaching:</strong> {tutor.modules.join(", ")}</p>
              <div style={{marginTop: '16px', display: 'flex', gap: '10px'}}>
                <button className="view-btn" style={{width: 'auto'}} onClick={() => navigate("/become-tutor")}>Edit Tutor Info</button>
                <button className="request-btn" style={{width: 'auto', background: 'var(--danger)'}} onClick={() => setConfirmStopTutor(true)}>Stop Being a Tutor</button>
              </div>
            </section>

            <section className="card-v2">
              <h4>Upcoming Teaching Sessions</h4>
              {tutorSessions.length === 0 && (
                <p className="empty-state">No upcoming sessions</p>
              )}
              {tutorSessions.map(s => (
                <div key={s._id} className="list-item-row">
                  <div className="list-item-info">
                    <strong>{s.studentId?.name || "Student"}</strong>
                    <span>{s.date} • {s.startTime}–{s.endTime}</span>
                  </div>
                   {s.status === "accepted" && (
                       <button
                          className="request-btn"
                          style={{ width: "auto", background: "var(--danger)" }}
                          onClick={async () => {
                            if (!window.confirm("Cancel this session?")) return;

                            try {
                              await api.sessions.cancel(s._id);

                              // remove from UI
                              setTutorSessions(prev =>
                                prev.filter(x => x._id !== s._id)
                              );

                              // update points locally (optional but nice)
                              setGame(prev => ({
                                ...prev,
                                points: Math.max(0, prev.points - 10),
                              }));
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                        >
                          Cancel
                        </button>
                      )}
                </div>
              ))}
            </section>
          </div>
        )}

      </div>

      {editingProfile && profileForm && (
  <Modal
    open={editingProfile}
    onClose={() => setEditingProfile(false)}
    title="Edit Profile"
  >
    {/* ABOUT */}
    <div className="form-field">
      <label>About</label>
      <textarea
        value={profileForm.about}
        onChange={(e) =>
          setProfileForm({ ...profileForm, about: e.target.value })
        }
      />
    </div>

    {/* COURSE */}
    <div className="form-field">
      <label>Course</label>
      <input
        value={profileForm.course}
        onChange={(e) =>
          setProfileForm({ ...profileForm, course: e.target.value })
        }
      />
    </div>

    {/* AVATAR */}
    <div className="form-field">
      <label>Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          if (file.size > 1024 * 1024) {
            alert("Image must be under 1MB");
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileForm({ ...profileForm, avatar: reader.result });
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>

    {/* MODULE INPUT */}
    <div className="form-field">
      <label>Module Code</label>
      <input
        value={profileForm.moduleInput}
        onChange={(e) =>
          setProfileForm({ ...profileForm, moduleInput: e.target.value })
        }
      />
    </div>

    <div className="form-row">
      <button
        type="button"
        onClick={() => {
          const m = profileForm.moduleInput.trim().toUpperCase();
          if (!m || profileForm.strongModules.includes(m)) return;
          setProfileForm({
            ...profileForm,
            strongModules: [...profileForm.strongModules, m],
            moduleInput: "",
          });
        }}
      >
        Add Strong
      </button>

      <button
        type="button"
        onClick={() => {
          const m = profileForm.moduleInput.trim().toUpperCase();
          if (!m || profileForm.helpModules.includes(m)) return;
          setProfileForm({
            ...profileForm,
            helpModules: [...profileForm.helpModules, m],
            moduleInput: "",
          });
        }}
      >
        Add Help
      </button>
    </div>

    {/* STRONG MODULES */}
    <div className="tag-row">
      {profileForm.strongModules.map(m => (
        <span key={m} className="tag">
          {m}
          <button
            onClick={() =>
              setProfileForm({
                ...profileForm,
                strongModules: profileForm.strongModules.filter(x => x !== m),
              })
            }
          >
            ✕
          </button>
        </span>
      ))}
    </div>

    {/* HELP MODULES */}
    <div className="tag-row">
      {profileForm.helpModules.map(m => (
        <span key={m} className="tag muted">
          {m}
          <button
            onClick={() =>
              setProfileForm({
                ...profileForm,
                helpModules: profileForm.helpModules.filter(x => x !== m),
              })
            }
          >
            ✕
          </button>
        </span>
      ))}
    </div>

    {/* SAVE */}
    <button
      className="modal-btn"
      onClick={() => {
        api.users
          .completeProfile(user._id, {
            about: profileForm.about,
            course: profileForm.course,
            strongModules: profileForm.strongModules,
            helpModules: profileForm.helpModules,
            avatar: profileForm.avatar,
          })
          .then((updated) => {
            setUser(updated);
            setEditingProfile(false);
          })
          .catch(() => alert("Failed to update profile"));
      }}
    >
      Save Changes
    </button>
  </Modal>
)}
{confirmStopTutor && (
  <Modal
    open={confirmStopTutor}
    onClose={() => setConfirmStopTutor(false)}
    title="Stop Being a Tutor?"
  >
    <p>
      This will remove your tutor profile and you will no longer appear in tutor searches.
    </p>

    <p className="muted">
      You can become a tutor again later.
    </p>

    <div className="modal-action">
      <button
        className="delete-btn"
        onClick={async () => {
          try {
            // 1️⃣ delete tutor profile
            await api.tutors.delete(tutor._id);

            // 2️⃣ downgrade role
            const updatedUser = await api.users.updateRole(
              user._id,
              "student"
            );

            // 3️⃣ update state + storage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            setTutor(null); 
            setConfirmStopTutor(false);
            navigate("/profile");
          } catch {
            alert("Failed to remove tutor profile");
          }
        }}
      >
        Yes, stop being a tutor
      </button>

      <button
        className="view-btn"
        onClick={() => setConfirmStopTutor(false)}
      >
        Cancel
      </button>
    </div>
  </Modal>
)}

    </main>
  );
};

export default ProfilePage;
