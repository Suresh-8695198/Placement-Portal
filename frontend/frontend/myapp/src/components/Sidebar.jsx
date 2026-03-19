// // components/Sidebar.jsx
// import React from "react";
// import { NavLink } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <>
//    <style>{`
//   .sidebar-wrapper {
//     width: 260px;
//     height: 100%;
//     background: rgba(255, 255, 255, 0.82) !important;   /* same glass card bg as Internship */
//     border-top-right-radius: 24px;
//     border-bottom-right-radius: 24px;
//     box-shadow: 
//       0 10px 32px rgba(0,0,0,0.08),
//       inset 0 0 24px rgba(255,255,255,0.4);              /* inner glow like cards */
//     backdrop-filter: blur(24px) saturate(180%);
//     transition: width 0.38s ease;
//     overflow: hidden;
//     border-right: 1px solid rgba(143,188,143,0.18);      /* subtle green border */
//   }

//   @media (max-width: 992px) {
//     .sidebar-wrapper {
//       width: 80px;
//     }
    
//     .sidebar-title,
//     .nav-label {
//       display: none;
//     }
    
//     .nav-link {
//       justify-content: center;
//       padding: 1.2rem 0;
//     }
//   }

//   .sidebar-inner {
//     height: 100%;
//     padding: 2.2rem 1.4rem;
//     display: flex;
//     flex-direction: column;
//   }

//   .sidebar-title {
//     font-size: 2.2rem;
//     font-weight: 800;
//     letter-spacing: -0.4px;
//     margin-bottom: 2.8rem;
//     text-align: center;
//     background: linear-gradient(90deg, #556B2F, #8FBC8F);   /* exact same gradient as section titles */
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//   }

//   .sidebar-wrapper .nav-list {
//     list-style: none;
//     padding: 0;
//     margin: 0;
//     flex: 1;
//   }

//   .sidebar-wrapper .nav-item {
//     margin-bottom: 0.6rem;
//   }

//   .sidebar-wrapper .nav-link {
//     display: flex !important;
//     align-items: center !important;
//     gap: 1rem !important;
//     padding: 1rem 1.3rem !important;
//     color: #475569 !important;                      /* same secondary text color as Internship */
//     text-decoration: none !important;
//     font-size: 1.05rem !important;
//     font-weight: 500 !important;
//     border-radius: 12px !important;
//     transition: all 0.25s ease !important;
//     background: transparent !important;
//   }

//   .sidebar-wrapper .nav-link:hover {
//     background: rgba(143,188,143,0.09) !important;  /* exact same light green bg as internship items */
//     color: #1e293b !important;                      /* main text color on hover */
//     transform: translateX(4px) !important;
//   }

//   .sidebar-wrapper .nav-link.active {
//     background: linear-gradient(135deg, #556B2F, #8FBC8F) !important;  /* same gradient direction & colors */
//     color: white !important;
//     font-weight: 600 !important;
//     box-shadow: 0 4px 16px rgba(85,107,47,0.28) !important;   /* shadow tone from buttons */
//   }

//   .sidebar-wrapper .nav-icon {
//     font-size: 1.45rem !important;
//     min-width: 36px !important;
//     text-align: center !important;
//     color: #475569 !important;                      /* matches text color */
//     transition: transform 0.28s ease, color 0.28s ease !important;
//   }

//   .sidebar-wrapper .nav-link:hover .nav-icon {
//     transform: scale(1.1) !important;
//     color: #1e293b !important;
//   }

//   .sidebar-wrapper .nav-link.active .nav-icon {
//     color: white !important;
//   }

//   .nav-label {
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .sidebar-wrapper {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
  
//   .sidebar-wrapper::-webkit-scrollbar {
//     display: none;
//   }
// `}</style>

//       <div className="sidebar-wrapper">
//         <div className="sidebar-inner">
//           <h3 className="sidebar-title">Portal</h3>

//           <ul className="nav-list">
//             <li className="nav-item">
//               <NavLink
//                 to="profile"
//                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//               >
//                 <i className="fas fa-user nav-icon"></i>
//                 <span className="nav-label">Profile</span>
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="internship"
//                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//               >
//                 <i className="fas fa-briefcase nav-icon"></i>
//                 <span className="nav-label">Internship</span>
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="skills"
//                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//               >
//                 <i className="fas fa-tools nav-icon"></i>
//                 <span className="nav-label">Skills</span>
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="companies"
//                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//               >
//                 <i className="fas fa-building nav-icon"></i>
//                 <span className="nav-label">Companies</span>
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink
//                 to="status"
//                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//               >
//                 <i className="fas fa-check-circle nav-icon"></i>
//                 <span className="nav-label">Status</span>
//               </NavLink>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <style>{`
        .sidebar-wrapper {
          width: 260px;
          height: 100%;
          background: rgba(30, 20, 50, 0.92) !important;
          box-shadow: 0 10px 32px rgba(0,0,0,0.4);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          transition: width 0.38s ease;
          overflow: hidden;
          border-right: 1px solid rgba(75,0,130,0.3);
          border-radius: 0 !important;           /* Sharp edges for sidebar */
        }

        @media (max-width: 992px) {
          .sidebar-wrapper {
            width: 80px;
          }
          
          .sidebar-title,
          .nav-label {
            display: none;
          }
          
          .nav-link {
            justify-content: center;
            padding: 1.2rem 0;
          }
        }

        .sidebar-inner {
          height: 100%;
          padding: 2.2rem 1.4rem;
          display: flex;
          flex-direction: column;
        }

        .sidebar-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.4px;
          margin-bottom: 2.8rem;
          text-align: center;
          background: linear-gradient(90deg, #4B0082, #6A0DAD);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-wrapper .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .sidebar-wrapper .nav-item {
          margin-bottom: 0.7rem;
        }

        .sidebar-wrapper .nav-link {
          display: flex !important;
          align-items: center !important;
          gap: 1rem !important;
          padding: 1.1rem 1.4rem !important;
          color: #d1d5db !important;
          text-decoration: none !important;
          font-size: 1.05rem !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
          background: transparent !important;
          border-radius: 0 !important;              /* No rounding by default */
        }

        /* === Gradient + Rounding on Hover === */
        .sidebar-wrapper .nav-link:hover {
          background: linear-gradient(135deg, rgba(75,0,130,0.45), rgba(106,13,173,0.45)) !important;
          color: #ffffff !important;
          transform: translateX(6px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(75,0,130,0.4) !important;
          border-radius: 14px !important;           /* Rounded only on hover */
        }

        /* === Strong Gradient + Rounding when Active/Clicked === */
        .sidebar-wrapper .nav-link.active {
          background: linear-gradient(135deg, #4B0082, #6A0DAD) !important;
          color: white !important;
          font-weight: 700 !important;
          box-shadow: 0 8px 24px rgba(75,0,130,0.5) !important;
          border-radius: 14px !important;           /* Rounded when selected */
          transform: scale(1.03) !important;
        }

        .sidebar-wrapper .nav-icon {
          font-size: 1.5rem !important;
          min-width: 38px !important;
          text-align: center !important;
          color: #d1d5db !important;
          transition: all 0.3s ease !important;
        }

        .sidebar-wrapper .nav-link:hover .nav-icon,
        .sidebar-wrapper .nav-link.active .nav-icon {
          color: white !important;
          transform: scale(1.2) !important;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-wrapper {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .sidebar-wrapper::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="sidebar-wrapper">
        <div className="sidebar-inner">
          <h3 className="sidebar-title">Portal</h3>

          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="profile"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <i className="fas fa-user nav-icon"></i>
                <span className="nav-label">Profile</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="internship"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <i className="fas fa-briefcase nav-icon"></i>
                <span className="nav-label">Internship</span>
              </NavLink>
            </li>

            <li className="nav-item">
  <NavLink
    to="projects"
    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
  >
    <i className="fas fa-code nav-icon"></i>
    <span className="nav-label">Projects</span>
  </NavLink>
</li>


            <li className="nav-item">
              <NavLink
                to="skills"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <i className="fas fa-tools nav-icon"></i>
                <span className="nav-label">Skills</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="companies"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <i className="fas fa-building nav-icon"></i>
                <span className="nav-label">Companies</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="status"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <i className="fas fa-check-circle nav-icon"></i>
                <span className="nav-label">Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
  <NavLink
    to="announcements"
    className={({ isActive }) =>
      isActive ? "nav-link active" : "nav-link"
    }
  >
    <i className="fas fa-bullhorn nav-icon"></i>
    <span className="nav-label">Announcements</span>
  </NavLink>
</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;