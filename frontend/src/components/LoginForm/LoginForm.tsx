import {Link} from 'react-router-dom';
import Button from '../../components/UI/Button/Button.tsx'

function LoginForm() {
  return (
    <>
      <form className="flex flex-col w-1/4 h-auto rounded-xl text-2xl gap-2">
        <div className="flex flex-row w-full justify-center text-4xl font-bold mb-4">
          <p>Iniciar sesión</p>
        </div>
        <label className="text-base">Nombre de usuario</label>
        <input type="text"
               className="border-white text-base px-1 py-7px drop-shadow-md rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
        <label className="text-base">Contraseña</label>
        <input type="password"
               className="border-white text-base px-1 py-7px drop-shadow-md rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
        <div className="flex flex-row w-full justify-center text-lg mt-10">
          <Button>
            Enviar
          </Button>
        </div>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            ¿No tiene una cuenta? Regístrate haciendo click {" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer text-sm"
            >
              aquí
            </Link>
          </span>
        </div>
      </form>
    </>
  )
}

export default LoginForm;