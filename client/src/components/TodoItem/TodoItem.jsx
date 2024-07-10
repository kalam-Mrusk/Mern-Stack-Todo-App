import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { loginFailure, loginSuccess } from "../src/redux/user.slice.js";
import { loadingEnd } from "../src/redux/loading.slice.js";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
function App() {
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.loading.refresh);
  const loading = useSelector((state) => state.loading.status);
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/todo-app/user/get-current-user",
        {
          withCredentials: true,
        }
      );
      dispatch(loginSuccess(res.data?.data));
      dispatch(loadingEnd());
    } catch (error) {
      console.log(error);
      dispatch(loginFailure());
      dispatch(loadingEnd());
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, [refresh]);
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5rem",
          }}
        >
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="black"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default App;
