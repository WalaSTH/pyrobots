import LoginForm from "../../components/LoginForm/LoginForm";
import PropTypes from "prop-types";
import "./LoginStyle.css";
import axios from "axios";

export default function Login({ handleLogin }) {
  function handleResponse(res) {
    if (res.status === 422) {
      console.log("Bad request");
      return;
    }
    if (res.status === 200) {
      console.log("All good");
      handleLogin(res.data);
      return;
    }
    if (res.status === 406) {
      alert("Password do not match");
      return;
    }
    if (res.status === 402) {
      alert("Fallo en la seguridad");
      return;
    }
  }

  async function loginUser(credentials) {
    const params = new URLSearchParams();
    params.append("username", credentials.e.username);
    params.append("password", credentials.e.password);
    // const obj = {
    //   username: credentials.e.username,
    //   password: credentials.e.password,
    // };
    // const json_object = JSON.stringify(obj);
    // console.log(json_object);
    return axios.post("http://127.0.0.1:8000/token", params);
  }

  const handleSubmit = async (e) => {
    const fetchedData = await loginUser({
      e,
    });
    handleResponse(fetchedData);
  };
  return (
    <div className="divLogin">
      <LoginForm handleSubmit={handleSubmit} />
    </div>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
