import Logo from "../assets/images/LogoShadow.webp"

function Index() {
  return (
    <>
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex flex-row justify-center aspect-auto">
          <img className="m-5 w-100 h-100" src={Logo} alt="Logo"/>
        </div>
        <div className="text-5xl font-bold mb-4">Blood4Life</div>
      </div>
    </>
  )
}

export default Index;