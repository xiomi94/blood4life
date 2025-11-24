import { Link } from 'react-router-dom';

function LoginForm() {
  return (
    <>
      <form className="flex flex-col w-1/4 h-auto rounded-xl text-2xl gap-2">
        <label className="text-base">Nombre de usuario</label>
        <input type="text" className="border-white text-lg px-1 py-7px drop-shadow-md rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
        <label>Contraseña</label>
        <input type="password" className="border-white text-lg px-1 py-7px drop-shadow-md rounded-md bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"/>
        <button type="submit" className="w-fit self-center whitespace-nowrap text-white text-base font-bold rounded-sm mt-8 px-5 py-2 drop-shadow-md bg-indigo-500">
          Iniciar sesión
        </button>
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