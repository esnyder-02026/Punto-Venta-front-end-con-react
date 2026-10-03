import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
    obtenerProductos, 
    obtenerCategorias, 
    obtenerProductosPorNombre, 
    obtenerCategoriasPorNombre 
} from "../services/reporteServices";

function Reportes() {
    const [filtroCat, setFiltroCat] = useState("");
    const [filtroProd, setFiltroProd] = useState("");
    const [mostrarInputCat, setMostrarInputCat] = useState(false);
    const [mostrarInputProd, setMostrarInputProd] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // 1. Reporte Productos PDF
    const generarReporteProductos = async () => {
        try {
            const res = await obtenerProductos();
            const productos = res.data || [];

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Reporte General de Productos", 14, 15);
            doc.setFontSize(10);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 22);

            const columnas = ["ID", "Nombre", "Descripción", "Precio", "Stock"];
            const filas = productos.map(p => [
                p.idProducto, 
                p.nombre, 
                p.descripcion || "-", 
                `Q${p.precio}`, 
                p.stock
            ]);

            autoTable(doc, { head: [columnas], body: filas, startY: 26 });
            doc.save("reporte_productos.pdf");
            setMensaje("Reporte de Productos generado con éxito.");
        } catch (error) {
            console.error(error);
            setMensaje("Error al generar el reporte de productos.");
        }
    };

    // 2. Reporte Categorías PDF
    const generarReporteCategorias = async () => {
        try {
            const res = await obtenerCategorias();
            const categorias = res.data || [];

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Reporte General de Categorías", 14, 15);
            doc.setFontSize(10);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 22);

            const columnas = ["ID", "Nombre", "Descripción"];
            const filas = categorias.map(c => [
                c.idCategoria, 
                c.nombre, 
                c.descripcion || "-"
            ]);

            autoTable(doc, { head: [columnas], body: filas, startY: 26 });
            doc.save("reporte_categorias.pdf");
            setMensaje("Reporte de Categorías generado con éxito.");
        } catch (error) {
            console.error(error);
            setMensaje("Error al generar el reporte de categorías.");
        }
    };

    // 3. Filtro Categorías y exportación
    const ejecutarFiltroCategorias = async () => {
        try {
            const res = await obtenerCategoriasPorNombre(filtroCat);
            const categorias = res.data || [];

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(`Reporte Categorías - Filtro: "${filtroCat}"`, 14, 15);
            doc.setFontSize(10);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 22);

            const columnas = ["ID", "Nombre", "Descripción"];
            const filas = categorias.map(c => [c.idCategoria, c.nombre, c.descripcion || "-"]);

            autoTable(doc, { head: [columnas], body: filas, startY: 26 });
            doc.save(`categorias_filtro_${filtroCat || "todas"}.pdf`);
            setMensaje("Reporte filtrado de Categorías generado.");
        } catch (error) {
            console.error(error);
            setMensaje("Error al aplicar filtro en categorías.");
        }
    };

    // 4. Filtro Productos y exportación
    const ejecutarFiltroProductos = async () => {
        try {
            const res = await obtenerProductosPorNombre(filtroProd);
            const productos = res.data || [];

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(`Reporte Productos - Filtro: "${filtroProd}"`, 14, 15);
            doc.setFontSize(10);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 22);

            const columnas = ["ID", "Nombre", "Descripción", "Precio", "Stock"];
            const filas = productos.map(p => [p.idProducto, p.nombre, p.descripcion || "-", `Q${p.precio}`, p.stock]);

            autoTable(doc, { head: [columnas], body: filas, startY: 26 });
            doc.save(`productos_filtro_${filtroProd || "todos"}.pdf`);
            setMensaje("Reporte filtrado de Productos generado.");
        } catch (error) {
            console.error(error);
            setMensaje("Error al aplicar filtro en productos.");
        }
    };

    // 5. Productos y Categorías a PDF
    const generarProductosYCategoriasPDF = async () => {
        try {
            const resProd = await obtenerProductos();
            const resCat = await obtenerCategorias();

            const productos = resProd.data || [];
            const categorias = resCat.data || [];

            const doc = new jsPDF();
            
            // Sección Categorías
            doc.setFontSize(16);
            doc.text("Reporte Unificado: Categorías y Productos", 14, 15);
            doc.setFontSize(12);
            doc.text("Listado de Categorías", 14, 24);

            const colCat = ["ID", "Nombre", "Descripción"];
            const filCat = categorias.map(c => [c.idCategoria, c.nombre, c.descripcion || "-"]);

            autoTable(doc, { head: [colCat], body: filCat, startY: 28 });

            // Sección Productos
            const posFinalTablaCat = doc.lastAutoTable.finalY + 12;
            doc.text("Listado de Productos", 14, posFinalTablaCat);

            const colProd = ["ID", "Nombre", "Precio", "Stock"];
            const filProd = productos.map(p => [p.idProducto, p.nombre, `Q${p.precio}`, p.stock]);

            autoTable(doc, { head: [colProd], body: filProd, startY: posFinalTablaCat + 4 });

            doc.save("reporte_unificado_productos_categorias.pdf");
            setMensaje("Reporte Unificado generado con éxito.");
        } catch (error) {
            console.error(error);
            setMensaje("Error al generar el reporte unificado.");
        }
    };

    return (
        <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6">Reportes</h2>

            {mensaje && <p className="text-center text-blue-600 mb-4">{mensaje}</p>}

            {/* Botonera con el diseño exacto recibido */}
            <div className="flex justify-center flex-wrap gap-4 my-4">
                <button 
                    onClick={generarReporteProductos} 
                    className="border-1 border-black rounded-xl px-4 py-2 bg-sky-600 text-white hover:scale-105 transition cursor-pointer"
                >
                    Reporte Productos PDF
                </button>

                <button 
                    onClick={generarReporteCategorias} 
                    className="border-1 border-black rounded-xl px-4 py-2 bg-sky-600 text-white hover:scale-105 transition cursor-pointer"
                >
                    Reporte Categorías PDF
                </button>

                <button 
                    onClick={() => {
                        setMostrarInputCat(!mostrarInputCat);
                        setMostrarInputProd(false);
                    }} 
                    className="border-1 border-black rounded-xl px-4 py-2 bg-indigo-600 text-white hover:scale-105 transition cursor-pointer"
                >
                    Filtro Categorías
                </button>

                <button 
                    onClick={() => {
                        setMostrarInputProd(!mostrarInputProd);
                        setMostrarInputCat(false);
                    }} 
                    className="border-1 border-black rounded-xl px-4 py-2 bg-indigo-600 text-white hover:scale-105 transition cursor-pointer"
                >
                    Filtro Productos
                </button>

                <button 
                    onClick={generarProductosYCategoriasPDF} 
                    className="border-1 border-black rounded-xl px-4 py-2 bg-green-600 text-white hover:scale-105 transition cursor-pointer"
                >
                    Productos y Categorías a PDF
                </button>
            </div>

            {/* Input emergente para Filtro Categorías */}
            {mostrarInputCat && (
                <div className="flex justify-center items-center gap-x-4 my-4">
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={filtroCat}
                        onChange={(e) => setFiltroCat(e.target.value)}
                        className="border-1 border-black rounded-lg outline-none px-3 py-1 bg-white"
                    />
                    <button
                        onClick={ejecutarFiltroCategorias}
                        className="border-1 border-black rounded-xl px-4 py-2 bg-purple-600 text-white hover:scale-105 transition cursor-pointer"
                    >
                        Descargar PDF
                    </button>
                </div>
            )}

            {/* Input emergente para Filtro Productos */}
            {mostrarInputProd && (
                <div className="flex justify-center items-center gap-x-4 my-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={filtroProd}
                        onChange={(e) => setFiltroProd(e.target.value)}
                        className="border-1 border-black rounded-lg outline-none px-3 py-1 bg-white"
                    />
                    <button
                        onClick={ejecutarFiltroProductos}
                        className="border-1 border-black rounded-xl px-4 py-2 bg-purple-600 text-white hover:scale-105 transition cursor-pointer"
                    >
                        Descargar PDF
                    </button>
                </div>
            )}
        </div>
    );
}

export default Reportes;