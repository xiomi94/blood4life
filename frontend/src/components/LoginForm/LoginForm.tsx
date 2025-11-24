import {Link} from 'react-router-dom';
import Button from '../../components/Button/Button'

function LoginForm() {
  return (
    <>
      <form className="flex flex-col w-1/4 h-auto rounded-xl text-2xl gap-2">
        <label>Nombre de usuario</label>
        <input type="text"
               className="border-white text-lg px-1 py-7px drop-shadow-md rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
        <label>Contraseña</label>
        <input type="password"
               className="border-white text-lg px-1 py-7px drop-shadow-md rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
        <div className="w-fit self-center whitespace-nowrap">
          <Button type="submit">
            Iniciar sesión
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