import { useState, useEffect } from "react";
import axios from "axios";
import {
    listarClientesActivos,
    crearCliente,
    actualizarCliente,
    anularCliente
} from "../services/clienteServices";

const formInicial = {
    idCliente: null,
    nombre: "",
    apellido: "",
    email: "",
    telefono: ""
};

// Función para extraer el mensaje de error de Axios o JavaScript
const obtenerMensajeError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Ocurrió un error inesperado";
};

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState(formInicial);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const cargarClientes = async () => {
        try {
            const respuesta = await listarClientesActivos();
            setClientes(respuesta.data);
        } catch (error) {
            console.error("Error al listar clientes", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelarEdicion = () => {
        setForm(formInicial);
        setModoEdicion(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let respuesta;
            if (modoEdicion) {
                respuesta = await actualizarCliente(form.idCliente, form);
            } else {
                respuesta = await crearCliente(form);
            }
            setMensaje(respuesta.data.mensaje || "Operación realizada con éxito");
            setForm(formInicial);
            setModoEdicion(false);
            cargarClientes();
        } catch (error) {
            console.error("Error al guardar cliente", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    const handleModificar = (cliente) => {
        setForm(cliente);
        setModoEdicion(true);
    };

    const handleAnular = async (idCliente) => {
        const confirmar = window.confirm("¿Seguro que deseas anular este cliente?");
        if (!confirmar) return;
        try {
            await anularCliente(idCliente);
            setMensaje("Cliente anulado correctamente");
            cargarClientes();
        } catch (error) {
            console.error("Error al anular el cliente", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    return (
        <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-4">
                {modoEdicion ? "Modificar Cliente" : "Ingresar Clientes"}
            </h2>

            {mensaje && <p className="text-center text-red-600 mb-4">{mensaje}</p>}

            <form className="flex flex-col justify-center items-center gap-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="mx-4 font-bold" htmlFor="nombre">Nombre:</label>
                    <input
                        className="border-1 border-black rounded-lg outline-none px-2 py-1"
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="mx-4 font-bold" htmlFor="apellido">Apellido:</label>
                    <input
                        className="border-1 border-black rounded-lg outline-none px-2 py-1"
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="mx-4 font-bold" htmlFor="email">Email:</label>
                    <input
                        className="border-1 border-black rounded-lg outline-none px-2 py-1"
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="mx-4 font-bold" htmlFor="telefono">Teléfono:</label>
                    <input
                        className="border-1 border-black rounded-lg outline-none px-2 py-1"
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex gap-x-4">
                    <button
                        className="border-1 border-black rounded-xl px-4 py-2 bg-blue-600 text-white hover:scale-105 transition cursor-pointer"
                        type="submit"
                    >
                        {modoEdicion ? "Actualizar" : "Guardar"}
                    </button>

                    {modoEdicion && (
                        <button
                            type="button"
                            onClick={handleCancelarEdicion}
                            className="border-1 border-black rounded-xl px-4 py-2 bg-gray-600 text-white hover:scale-105 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h2 className="my-6 text-2xl text-black text-center">Listado de Clientes</h2>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-xl">
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody className="justify-center items-center text-center">
                    {clientes.map((cliente) => (
                        <tr key={cliente.idCliente}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.email || "-"}</td>
                            <td>{cliente.telefono || "-"}</td>
                            <td>
                                <button
                                    className="border-1 border-black rounded-xl px-4 py-2 bg-orange-600 text-white hover:scale-105 transition cursor-pointer my-2"
                                    onClick={() => handleModificar(cliente)}
                                >
                                    Modificar
                                </button>
                            </td>
                            <td>
                                <button
                                    className="border-1 border-black rounded-xl px-4 py-2 bg-red-800 text-white hover:scale-105 transition cursor-pointer my-2"
                                    onClick={() => handleAnular(cliente.idCliente)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Clientes;