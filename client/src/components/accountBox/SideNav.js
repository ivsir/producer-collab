// import React from "react";
// import Auth from "../../utils/auth.js";
// import { Link } from "react-router-dom";
// import Brand from "../../assets/images/prodcollab.svg";
// import Search from "../../assets/images/search.png";
// import Home from "../../assets/images/Home.png"
// import Upload from "../../assets/images/Upload.png";
// import Profile from "../../assets/images/Profile.png"


// function SideNav() {
//   const logout = (event) => {
//     event.preventDefault();
//     Auth.logout();
//   };

//   return (
//     <div className="inline-flex relative">
//       <nav className="flex flex-col justify-between p-12 text-nowrap w-[18rem] h-screen sticky top-0">
//         {Auth.loggedIn() ? (
//           <>
//           <div className="flex flex-col">
//             <Link className="flex flex-col mb-6 ml-4 w-12" to="/home">
//               <img src={Brand} alt="Home" /> {/* Corrected usage of <Link> */}
//             </Link>
//             <Link className="flex flex-row gap-4 justify-start items-center px-5 py-3 hover:bg-secondary rounded-lg" to="/home">
//               <div className="w-6 h-6">
//                 <img src={Home} alt="ProdCollab homepage" /> {/* Corrected usage of <Link> */}
//               </div>
//               <h2 className="text-md">Home</h2>
//             </Link>
//             <Link className="flex flex-row gap-4 justify-start items-center px-5 py-3 hover:bg-secondary rounded-lg" to="#">
//               <div className="w-6 h-6">
//                 <img src={Search} alt="Discover new music" /> {/* Corrected usage of <Link> */}
//               </div>
//               <h2 className="text-md">Explore</h2>
//             </Link>
//             <Link className="flex flex-row gap-4 justify-start items-center px-5 py-3 hover:bg-secondary rounded-lg" to="/projectform">
//               <div className="w-6 h-6">
//                 <img src={Upload} alt="Upload a track" /> {/* Corrected usage of <Link> */}
//               </div>
//               <h2 className="text-md">Upload</h2>
//             </Link>
//             <Link className="flex flex-row gap-4 justify-start items-center px-5 py-3 hover:bg-secondary rounded-lg" to="/profile">
//               <div className="w-6 h-6">
//                 <img src={Profile} alt="View your profile" /> {/* Corrected usage of <Link> */}
//               </div>
//               <h2 className="text-md">Profile</h2>
//             </Link>
//           </div>

//             <Link className="flex flex-row gap-4 justify-start items-center px-5 py-3 text-white opacity-50 hover:opacity-100 hover:bg-secondary rounded-lg" onClick={logout} to="/">
//               <h2 className="text-md">Logout</h2>
//             </Link>
//           </>
//         ) : (
//           <Link to="/">Login</Link>
//         )}
//       </nav>
//     </div>
//   );
// }

// export default SideNav;

import React from "react";
import Auth from "../../utils/auth.js";
import { Link } from "react-router-dom";
import Brand from "../../assets/images/prodcollab.png";
import Search from "../../assets/images/search.png";
import Home from "../../assets/images/Home.png"
import Upload from "../../assets/images/Upload.png";
import Profile from "../../assets/images/Profile.png"


function SideNav() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <div className="inline-flex relative">
      <nav className="flex flex-col justify-between p-12 text-nowrap w-[18rem] h-screen sticky top-0">
        {Auth.loggedIn() ? (
          <>
          <div className="flex flex-col">
            <Link className="flex flex-col mb-6 ml-4 w-12" to="/home">
              <img src={Brand} alt="Home" /> {/* Corrected usage of <Link> */}
            </Link>
            <Link className="flex flex-row gap-4 justify-start items-center px-5 py-2 hover:bg-secondary rounded-xl" to="/home">
              <div className="w-6 h-6">
                <img src={Home} alt="ProdCollab homepage" /> {/* Corrected usage of <Link> */}
              </div>
              <h2 className="text-md">Home</h2>
            </Link>
            <Link className="flex flex-row gap-4 justify-start items-center px-5 py-2 hover:bg-secondary rounded-xl" to="#">
              <div className="w-6 h-6">
                <img src={Search} alt="Discover new music" /> {/* Corrected usage of <Link> */}
              </div>
              <h2 className="text-md">Explore</h2>
            </Link>
            <Link className="flex flex-row gap-4 justify-start items-center px-5 py-2 hover:bg-secondary rounded-xl" to="/projectform">
              <div className="w-6 h-6">
                <img src={Upload} alt="Upload a track" /> {/* Corrected usage of <Link> */}
              </div>
              <h2 className="text-md">Upload</h2>
            </Link>
            <Link className="flex flex-row gap-4 justify-start items-center px-5 py-2 hover:bg-secondary rounded-xl" to="/profile">
              <div className="w-6 h-6">
                <img src={Profile} alt="View your profile" /> {/* Corrected usage of <Link> */}
              </div>
              <h2 className="text-md">Profile</h2>
            </Link>
          </div>

            <Link className="flex flex-row gap-4 justify-start items-center px-5 py-2 text-white opacity-50 hover:opacity-100 hover:bg-secondary rounded-xl" onClick={logout} to="/">
              <h2 className="text-md">Logout</h2>
            </Link>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </nav>
    </div>
  );
}

export default SideNav;
