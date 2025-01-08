import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();
    const loginAction = async (data) => {
      try {
        const response = await fetch("http://localhost:4000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const res = await response.json();
        const dat = await fetch(`http://localhost:4000/users/${res.insertedId}`)
        const jdat =await dat.json()
        console.log(res)
        if (res.acknowledged) {
          setUser(jdat.username);
          setToken(res.acknowledged);
          localStorage.setItem("site", res.acknowledged);
          console.log(token)
          navigate("/dashboard");
          return;
        }
        throw new Error(res.message);
      } catch (err) {
        console.error(err);
      }
    };
  
    const logOut = () => {
      setUser(null);
      setToken("");
      localStorage.removeItem("site");
      navigate("/login");
    };
  
    return (
      <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
        {children}
      </AuthContext.Provider>
    );
  
  };
  
  export default AuthProvider;
  
  export const useAuth = () => {
    return useContext(AuthContext);
  };
  