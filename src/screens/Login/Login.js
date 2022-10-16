import LoginForm from "../../components/LoginForm/LoginForm";
import PropTypes from "prop-types";
import "./LoginStyle.css";
import axios from "axios";

export default function Login({ handleLogin }) {
  function handleResponse(res) {
    if (res.status === 201) {
      console.log(res);
      handleLogin(res.data);
      return;
    }
    if (res.status === 405) {
      alert("Email not found");
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
    return axios.post(
      "https://634ab9a333bb42dca409da46.mockapi.io/api/login/",
      credentials
    );
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
