import { useState, useEffect } from "react";
import axios from "axios";
import {
    listarProductosActivos,
    crearProducto,
    actualizarProducto,
    anularProducto
} from "../services/productoServices";
import { listarCategoriasActivas } from "../services/categoriaServices";

const formInicial = {
    idProducto: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    idCategoria: ""
};

const obtenerMensajeError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Ocurrió un error inesperado";
};

function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const cargarDatos = async () => {
        try {
            const resProd = await listarProductosActivos();
            setProductos(resProd.data);
            const resCat = await listarCategoriasActivas();
            setCategorias(resCat.data);
        } catch (error) {
            console.error("Error al cargar datos", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let respuesta;
            if (modoEdicion) {
                respuesta = await actualizarProducto(form.idProducto, form);
            } else {
                respuesta = await crearProducto(form);
            }
            setMensaje(respuesta.data.mensaje);
            setForm(formInicial);
            setModoEdicion(false);
            cargarDatos();
        } catch (error) {
            console.error("Error al guardar producto", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    const handleModificar = (producto) => {
        setForm(producto);
        setModoEdicion(true);
    };

    const handleAnular = async (idProducto) => {
        const confirmar = window.confirm("¿Seguro que deseas anular este producto?");
        if (!confirmar) return;
        try {
            await anularProducto(idProducto);
            cargarDatos();
        } catch (error) {
            console.error("Error al anular el producto", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    return (
        <div>
            <h2>Ingresar/Modificar Productos</h2>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <input
                        type="text"
                        id="descripcion"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="precio">Precio:</label>
                    <input
                        type="number"
                        step="0.01"
                        id="precio"
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="stock">Stock:</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="idCategoria">Categoría:</label>
                    <select
                        id="idCategoria"
                        name="idCategoria"
                        value={form.idCategoria}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.idCategoria} value={cat.idCategoria}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Guardar</button>
            </form>

            <h2>Listado de Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((prod) => (
                        <tr key={prod.idProducto}>
                            <td>{prod.nombre}</td>
                            <td>{prod.descripcion}</td>
                            <td>{prod.precio}</td>
                            <td>{prod.stock}</td>
                            <td>
                                <button onClick={() => handleModificar(prod)}>Modificar</button>
                            </td>
                            <td>
                                <button onClick={() => handleAnular(prod.idProducto)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Productos;