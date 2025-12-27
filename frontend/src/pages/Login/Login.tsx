import Logo from "../../assets/images/LogoShadowMini.webp";
import LoginForm from "../../components/Forms/LoginForm/LoginForm";

function Login() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={Logo}
          alt="Logo"
          className="w-28 sm:w-36 md:w-44 lg:w-52 h-auto"
        />
      </div>

      {/* Formulario */}
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
