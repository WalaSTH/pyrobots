import LoginForm from "../../components/LoginForm/LoginForm";
import "./LoginStyle.css";

export default function Login({ setToken }) {
  const handleResponse = (res) => {
    if (res.status !== 200) {
      console.log("Algo salio mal");
      return;
    }
    if (res.status === 400) {
      console.log("salio re mal bro");
      return;
    }
    setToken(res.data);
  };

  return (
    <div className="divLogin">
      <LoginForm setToken={handleResponse} />
    </div>
  );
}
