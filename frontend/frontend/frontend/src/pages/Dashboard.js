import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

;


