import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


function Login() {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!correo.trim() || !contraseña) {
            setError("El correo y la contraseña son obligatorios");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            setError("Correo o contraseña incorrectos");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    correo: correo,
                    contraseña: contraseña
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Correo o contraseña incorrectos");
                return;
            }

            setSuccess("Inicio de sesión exitoso");

            if (data.user) {
                localStorage.setItem(
                    "usuario",
                    JSON.stringify(data.user)
                );
            }

        } catch (error) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center login-container">
            <div className="col-12 col-md-6 col-lg-4">

                <div className="card login-card text-center">

                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="logo mx-auto"
                    />

                    <h5 className="mb-4">
                        Inicia sesión en Creaciones Camar
                    </h5>

                    {success && (
                        <div className="app-validation-alert alert alert-success">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="app-validation-alert alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <input
                                type="text"
                                name="correo"
                                className="form-control"
                                placeholder="Correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                name="contraseña"
                                className="form-control"
                                placeholder="Contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-main w-100 mb-3"
                        >
                            Iniciar sesión
                        </button>

                        <div className="mt-2 text-center">
                            <a
                                href="/register"
                                className="d-block text-muted small"
                                style={{ color: "#adb5bd" }}
                            >
                                Crear cuenta
                            </a>

                            <a
                                href="/forgot-password"
                                className="d-block text-muted small"
                                style={{ color: "#adb5bd" }}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
}

export default Login;