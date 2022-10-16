import LoginForm from "../../components/LoginForm/LoginForm";
import "./LoginStyle.css";

export default function Login({ setToken }) {
  const handleResponse = (res) => {
    if (res.status !== 200) {
      console.log("Algo salio mal");
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
    setToken(res.data);
  };

  return (
    <div className="divLogin">
      <LoginForm setToken={handleResponse} />
    </div>
  );
}
