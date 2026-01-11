import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Header from "../components/layout/Header/Header";

function renderWithRoute(route: string) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Header />
        </MemoryRouter>
    );
}

describe("Header Component", () => {

    it("muestra logo e 'Inicio' cuando está en /register", () => {
        renderWithRoute("/register");

        expect(screen.getByAltText("Logo")).toBeInTheDocument();
        expect(screen.getByText("Inicio")).toBeInTheDocument();
    });

    it("muestra botones Iniciar sesión y Registrarse en /index", () => {
        renderWithRoute("/index");

        expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
        expect(screen.getByText("Registrarse")).toBeInTheDocument();
    });

    it("muestra solo botón Inicio en /login", () => {
        renderWithRoute("/login");

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.queryByText("Iniciar sesión")).not.toBeInTheDocument();
    });

    it("muestra el header especial del dashboard", () => {
        renderWithRoute("/dashboard");

        // logo
        expect(screen.getByAltText("Logo")).toBeInTheDocument();

        // avatar
        const avatar = document.querySelector(".w-10.h-10");
        expect(avatar).toBeInTheDocument();

        // botones de notificación
        const buttons = document.querySelectorAll("button");
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it("muestra los botones de inicio de sesión en la ruta raíz /", () => {
        renderWithRoute("/");

        expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
        expect(screen.getByText("Registrarse")).toBeInTheDocument();
    });

});
