import { useNavigate } from 'react-router';
import Logo from '../../assets/images/LogoShadow.webp';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">

        {/* Header Section */}
        <div className="text-center">
          <img
            className="mx-auto h-24 w-auto mb-4"
            src={Logo}
            alt="Blood4Life Logo"
          />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Política de Privacidad
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Última actualización: Enero 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 mt-8 text-gray-700 dark:text-gray-300 text-base leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Introducción</h2>
            <p>
              En Blood4Life, nos comprometemos a proteger su privacidad y sus datos personales. Esta Política de Privacidad
              explica cómo recopilamos, usamos, compartimos y protegemos su información personal, en cumplimiento con el
              Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la normativa española vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Responsable del Tratamiento</h2>
            <p>
              El responsable del tratamiento de sus datos es:<br />
              <strong>Blood4Life S.L.</strong><br />
              Dirección: Calle Tecnología 123, 28000 Madrid, España<br />
              Email de contacto: privacidad@blood4life.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Datos que Recopilamos</h2>
            <p>
              Recopilamos la siguiente información para gestionar la plataforma:<br />
              <ul className="list-disc list-inside ml-4 mt-2 mb-2">
                <li><strong>Datos de Identificación:</strong> Nombre, apellidos, DNI/NIE.</li>
                <li><strong>Datos de Contacto:</strong> Correo electrónico, número de teléfono, dirección postal.</li>
                <li><strong>Datos de Salud (Categoría Especial):</strong> Grupo sanguíneo, historial de elegibilidad para donar (tratados con su consentimiento explícito o bajo interés público en el ámbito de la salud pública).</li>
                <li><strong>Datos de Sesión:</strong> Dirección IP, logs de acceso, cookies técnicas.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Finalidad del Tratamiento</h2>
            <p>
              Sus datos se tratarán para las siguientes finalidades:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Gestión de usuarios (donantes y hospitales) y autenticación.</li>
                <li>Coordinación de citas y campañas de donación de sangre.</li>
                <li>Envío de comunicaciones relevantes (recordatorios de citas, alertas de escasez) si ha dado su consentimiento.</li>
                <li>Cumplimiento de obligaciones legales sanitarias.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Base Legal</h2>
            <p>
              La base legal para el tratamiento de sus datos es:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li><strong>Consentimiento:</strong> Al registrarse, usted consiente explícitamente el tratamiento de sus datos.</li>
                <li><strong>Interés Público:</strong> Para la gestión de servicios de salud pública y donaciones.</li>
                <li><strong>Obligación Legal:</strong> Para cumplir con normativas sanitarias y fiscales.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Destinatarios de los Datos</h2>
            <p>
              Sus datos podrán ser comunicados a:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Hospitales y centros de transfusión autorizados conectados a la plataforma.</li>
                <li>Autoridades sanitarias competentes cuando la ley lo requiera.</li>
                <li>Proveedores de servicios tecnológicos (encargados del tratamiento) que garantizan la seguridad de los datos.</li>
              </ul>
              No vendemos ni alquilamos sus datos personales a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Conservación de los Datos</h2>
            <p>
              Conservaremos sus datos personales mientras mantenga su cuenta activa. Una vez cerrada la cuenta,
              se mantendrán bloqueados durante el tiempo necesario para cumplir con las obligaciones legales (ej. normativas sanitarias sobre trazabilidad de donaciones), tras lo cual serán eliminados de forma segura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Sus Derechos (Derechos ARCO+)</h2>
            <p>
              Según el RGPD, usted tiene derecho a:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li><strong>Acceso:</strong> Saber qué datos tenemos sobre usted.</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos.</li>
                <li><strong>Supresión ("Derecho al Olvido"):</strong> Solicitar el borrado de sus datos cuando ya no sean necesarios.</li>
                <li><strong>Limitación:</strong> Solicitar que se limite el tratamiento en ciertas circunstancias.</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado.</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos.</li>
              </ul>
              Para ejercer estos derechos, contáctenos en: privacidad@blood4life.com
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
