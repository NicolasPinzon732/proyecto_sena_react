import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";


function Catalogo({ productos = [], categorias = [] }) {
    const [busqueda, setBusqueda] = useState("");
    const [categoriaActiva, setCategoriaActiva] = useState("");

    // Filtrar productos
    const productosFiltrados = productos.filter((producto) => {
        const nombre = producto.nombre || "";
        const categoria = producto.categoria || "";

        const coincideNombre = nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase());

        const coincideCategoria =
            !categoriaActiva || categoria === categoriaActiva;

        return coincideNombre && coincideCategoria;
    });

    // Obtener URL de la imagen
    const obtenerImagen = (imagen) => {
        if (!imagen) return "";

        if (
            imagen.startsWith("http://") ||
            imagen.startsWith("https://") ||
            imagen.startsWith("/")
        ) {
            return imagen;
        }

        return `/storage/${imagen.replace(/^storage\//, "")}`;
    };

    return (
        <>
            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-content">
                    <p className="hero-tag">
                        Nueva colección 2025
                    </p>

                    <h1 className="hero-title">
                        Colección de
                        <br />
                        <em>chaquetas</em>
                    </h1>

                    <p className="hero-sub">
                        Descubre nuestra selección premium de chaquetas
                        para cada ocasión
                    </p>
                </div>

                <div className="hero-decoration"></div>
            </section>

            {/* Filtros y catálogo */}
            <div className="catalog-container">

                {/* Barra de búsqueda y filtros */}
                <div className="search-filter-bar">

                    <div className="search-wrap">
                        <i className="bi bi-search search-icon"></i>

                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar chaquetas..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="filter-pills">

                        {/* Todas */}
                        <button
                            className={`pill ${
                                categoriaActiva === "" ? "active" : ""
                            }`}
                            onClick={() => setCategoriaActiva("")}
                        >
                            Todas
                        </button>

                        {/* Categorías */}
                        {categorias.map((categoria, index) => (
                            <button
                                key={index}
                                className={`pill ${
                                    categoriaActiva === categoria
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setCategoriaActiva(categoria)
                                }
                            >
                                {categoria}
                            </button>
                        ))}

                    </div>
                </div>

                {/* Productos */}
                <div className="products-grid">

                    {productosFiltrados.length > 0 ? (

                        productosFiltrados.map((producto) => {

                            const nombre = producto.nombre || "";
                            const categoria = producto.categoria || "";
                            const imagen = obtenerImagen(producto.imagen);

                            return (
                                <Link
                                    key={producto.id}
                                    to={`/cliente/producto/${producto.id}`}
                                    className="product-card"
                                >

                                    {/* Imagen */}
                                    <div className="product-img-wrap">

                                        {imagen ? (
                                            <img
                                                src={imagen}
                                                alt={nombre}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="product-img-placeholder">
                                                <i className="bi bi-image"></i>
                                            </div>
                                        )}

                                        <span className="product-category-badge">
                                            {categoria}
                                        </span>

                                    </div>

                                    {/* Información */}
                                    <div className="product-info">

                                        <div className="product-top">

                                            <div>
                                                <p className="product-name">
                                                    {nombre}
                                                </p>

                                                <p className="product-desc">
                                                    {producto.descripcion_corta}
                                                </p>
                                            </div>

                                            <span
                                                className={`product-status ${
                                                    producto.stock_total > 0
                                                        ? "disponible"
                                                        : "agotado"
                                                }`}
                                            >
                                                {producto.stock_total > 0
                                                    ? "Disponible"
                                                    : "Agotado"}
                                            </span>

                                        </div>

                                        <div className="product-bottom">

                                            <span className="product-price">
                                                $
                                                {Number(
                                                    producto.precio || 0
                                                ).toLocaleString("es-CO")}
                                            </span>

                                        </div>

                                    </div>

                                </Link>
                            );
                        })

                    ) : (

                        <div className="col-12 text-center text-muted py-5">

                            <i className="bi bi-box fs-2 d-block mb-2"></i>

                            No hay productos disponibles.

                        </div>

                    )}

                </div>
            </div>
        </>
    );
}

export default Catalogo;

