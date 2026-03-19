// import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{
      width: "220px",
      background: "#1e293b",
      color: "white",
      padding: "20px"
    }}>
      <h3>Student Panel</h3>
      {/* <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="profile">Profile</Link></li>
        <li><Link to="resume">Resume</Link></li>
        <li><Link to="skills">Skills</Link></li>
        <li><Link to="companies">Eligible Companies</Link></li>
        <li><Link to="status">Application Status</Link></li>
      </ul> */}
    </div>
  );
};

export default Sidebar;
