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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let respuesta;
            if (modoEdicion) {
                respuesta = await actualizarCliente(form.idCliente, form);
            } else {
                respuesta = await crearCliente(form);
            }
            setMensaje(respuesta.data.mensaje);
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
            cargarClientes();
        } catch (error) {
            console.error("Error al anular el cliente", error);
            setMensaje(obtenerMensajeError(error));
        }
    };

    return (
        <div>
            <h2>Ingresar/Modificar Clientes</h2>
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
                    <label htmlFor="apellido">Apellido:</label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Guardar</button>
            </form>

            <h2>Listado de Clientes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.idCliente}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                                <button onClick={() => handleModificar(cliente)}>Modificar</button>
                            </td>
                            <td>
                                <button onClick={() => handleAnular(cliente.idCliente)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Clientes;