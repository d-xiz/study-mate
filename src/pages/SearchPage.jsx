
import TutorCard from "../components/TutorCard";
import StudyGroupCard from "../components/StudyGroupCard";
import { api } from "../api";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useLocation } from "react-router-dom";


const SearchPage = () => {
 
const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get("tab");
  const q = searchParams.get("q") || "";

  const [mode, setMode] = useState(initialTab === "group" ? "group" : "tutor");
  const [query, setQuery] = useState(q);
  const [appliedQuery, setAppliedQuery] = useState(q);

  const [tutors, setTutors] = useState([]);
  const [groups, setGroups] = useState([]);
const [currentUser, setCurrentUser] = useState(null);



  useEffect(() => {
    if (initialTab === "group" || initialTab === "tutor") {
      setMode(initialTab);
    }
  }, [initialTab]);

   useEffect(() => {
    if (!currentUser) return;
    if (mode === "tutor") {
     api.tutors.getAll(appliedQuery).then((tutors) => {
    const filtered = tutors.filter(
      t => String(t.userId) !== String(currentUser.id)
    );
    setTutors(filtered);
  });
    } else {
     api.groups.getAll(appliedQuery).then((groups) => {
    const filtered = groups.filter(
      g => String(g.adminId) !== String(currentUser.id)
    );
    setGroups(filtered);
  });
  }
}, [appliedQuery, mode, currentUser]);



useEffect(() => {
 const storedUser = JSON.parse(localStorage.getItem("user"));
  setCurrentUser({...storedUser, _id: storedUser.id});
}, []);
if (!currentUser) {
  return <p>Loading user…</p>;
}
  return (
   <main>

  
  <section className="search-toolbar">
    <div className="container search-toolbar-inner">
 <div className="search-center">
      <div className="search-input-group">
        <input
          placeholder="Search module (e.g. LOMA)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="search-btn"
          onClick={() => setAppliedQuery(query.trim())}
        >
          Search
        </button>
      </div>
      </div>
 </div>
 <div className="container search-toolbar-cta">
      <button
        className="toolbar-cta"
        onClick={() =>
          navigate(mode === "tutor" ? "/become-tutor" : "/create-group")
        }
      >
        {mode === "tutor" ? "Become Tutor" : "Add Study Group"}
      </button>

   </div>
  </section>


  <section className="search-tabs-bar">
    <div className="container">
      <p className="results-meta">
        Search results for: <strong>{appliedQuery || "All"}</strong>
      </p>

      <div className="tabs">
        <button
          className={mode === "tutor" ? "tab active" : "tab"}
          onClick={() => setMode("tutor")}
        >
          Tutors
        </button>
        <button
          className={mode === "group" ? "tab active" : "tab"}
          onClick={() => setMode("group")}
        >
          Study Group
        </button>
      </div>
    </div>
  </section>

  <section className="section">
    <div className="container">
      {mode === "tutor" && (
        <div className="tutor-grid">
          {tutors.map((t) => (
            <TutorCard key={t._id} tutor={t} />
          ))}
        </div>
      )}

      {mode === "group" && (
        <div className="group-list">
          {groups.map((g) => (
            <StudyGroupCard
  key={g._id}
  group={g}
/>

          ))}
        </div>
      )}
    </div>
  </section>

</main>

  );
};

export default SearchPage;
