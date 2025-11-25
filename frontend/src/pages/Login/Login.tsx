import Logo from "../../assets/images/LogoShadow.webp";
import LoginForm from "../../components/LoginForm/LoginForm.tsx";


function Login() {
  return (
    <>
      <div className="min-h-screen">
        <div className="flex flex-row justify-center">
          <img className="m-5 w-xs h-xs" src={Logo} alt="Logo"/>
        </div>
        <div className="flex flex-col items-center w-full h-auto gap-4">
          <LoginForm/>
        </div>
      </div>
    </>
  )
}

export default Login;