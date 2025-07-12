import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaUpload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

export default function App() {
  const [data, setData] = useState({ nombre: '', telefono: '', email: '', puesto: '' });
  const [imagen, setImagen] = useState(null);
  const cardRef = useRef(null);
  const inputFileRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('tarjetaData');
    const savedImage = localStorage.getItem('tarjetaImagen');
    if (savedData) setData(JSON.parse(savedData));
    if (savedImage) setImagen(savedImage);
  }, []);

  useEffect(() => {
    localStorage.setItem('tarjetaData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (imagen) localStorage.setItem('tarjetaImagen', imagen);
    else localStorage.removeItem('tarjetaImagen');
  }, [imagen]);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleClear = () => {
    setData({ nombre: '', telefono: '', email: '', puesto: '' });
    setImagen(null);
    localStorage.removeItem('tarjetaData');
    localStorage.removeItem('tarjetaImagen');
  };

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 180, 100);
    pdf.save('tarjeta-presentacion.pdf');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagen(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    inputFileRef.current.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100 pb-32">
      <div className="w-full max-w-md p-4 mt-6 space-y-4">
        <input name="nombre" value={data.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" />
        <input name="telefono" value={data.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full p-2 border rounded" />
        <input name="email" value={data.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="puesto" value={data.puesto} onChange={handleChange} placeholder="Puesto" className="w-full p-2 border rounded" />

        {/* Input oculto */}
        <input ref={inputFileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {/* Botón visible para subir imagen */}
        <button
          onClick={triggerImageUpload}
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 justify-center w-full"
        >
          <FaUpload /> Subir Imagen
        </button>

        <div className="flex gap-2 justify-center">
          <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">Descargar PDF</button>
          <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 rounded">Limpiar</button>
        </div>
      </div>

      <div ref={cardRef} className="bg-white shadow-lg rounded-xl p-4 m-4 text-center max-w-sm w-full">
        {imagen && <img src={imagen} alt="Avatar" className="w-24 h-24 mx-auto rounded-full mb-4 object-cover" />}
        <h2 className="text-xl font-bold">{data.nombre}</h2>
        <p>{data.puesto}</p>
        <p>{data.telefono}</p>
        <p>{data.email}</p>
      </div>

      <footer className="bg-gray-800 text-white py-4 px-6 w-full flex flex-col items-center gap-2 mt-8">
        <div className="flex gap-6">
          <a href="https://github.com/JCesar206" target="_blank" rel="noopener noreferrer"><FaGithub size={24} className='hover:text-red-400'/></a>
          <a href="https://www.linkedin.com/in/jcesar206" target="_blank" rel="noopener noreferrer"><FaLinkedin size={24} className='hover:text-blue-400'/></a>
          <a href="mailto:jcesar206@hotmail.com"><FaEnvelope size={24} className='hover:text-lime-400'/></a>
        </div>
        <span className="text-sm">&copy; {new Date().getFullYear()} CardFlash JulyDevops. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
}
