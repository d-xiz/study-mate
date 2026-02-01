import { useEffect, useState } from "react";

import { Link,useNavigate } from "react-router-dom";
import {api } from "../api";


const HomePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

   const [subjects, setSubjects] = useState([]);
  const [popularGroups, setPopularGroups] = useState([])

  useEffect(() => {
     api.home.getSubjects().then(setSubjects);
    api.home.getPopularGroups().then(setPopularGroups);
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-content">
          <h1>StudyMate</h1>
          <p className="hero-text">
           Find tutors, join study groups, and learn better — together.</p>

          <div className="hero-search">
         <input
              type="text"
              placeholder="Search by module (e.g. FWEB, DBMS)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              disabled={!query.trim()}
              onClick={() =>
                navigate(`/search?q=${encodeURIComponent(query.trim())}`)
              }
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR SUBJECTS */}
      <section className="container section">
        <h2>Popular Subjects</h2>
      <div className="flex">
          {subjects.map((sub) => (
            <Link
              key={sub.code}
            to={`/search?q=${sub.code}`}

              className="card subject-card"
            >
              <h3>{sub.code}</h3>
              <p>{sub.tutors} tutors</p>
              <p>{sub.groups} study groups</p>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR STUDY GROUPS */}
      <section className="container section">
        <h2>Popular Study Groups</h2>
     <div className="flex">
          {popularGroups.map((group) => (
            <div
              key={group._id}
              className="card group-card"
              onClick={() =>
                navigate("/search?tab=group", {
                  state: { openGroupId: group._id },
                })
              }
            >
              <h3>{group.name}</h3>
              <p>Admin: {group.admin}</p>
              <p>{group.location}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* HOW IT WORKS */}
      <section className="container section">
        <h2>How This Works</h2>
        <div className="flex how-it-works">
          {[
            { step: 1, label: "Search" },
            { step: 2, label: "Connect" },
            { step: 3, label: "Study" },
            { step: 4, label: "Grow" },
          ].map((item) => (
            <div key={item.step} className="step">
             <strong>{item.step}.</strong>
              <span>&nbsp;{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
