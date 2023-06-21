import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const baseUrl = "http://localhost:3001/";

const App = () => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: ''
  });
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/links?search=${searchTerm}`);
      setLinks(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao buscar os links.', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}api/links`, formData);
      setFormData({
        title: '',
        url: '',
        type: ''
      });
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao adicionar o link.', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleDelete = async (linkId) => {
    try {
      await axios.delete(`${baseUrl}api/links/${linkId}`);
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao excluir o link.', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleUpdate = (link) => {
    setSelectedLink(link);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLinks();
  };

  const filteredLinks = links.filter((link) => {
    const { title, type } = link;
    const searchRegex = new RegExp(searchTerm, 'i');
    return searchRegex.test(title) || searchRegex.test(type);
  });

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Agregador de Links</h1>
      <form onSubmit={handleSubmit}>
        <label>Título:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
        <label>URL:</label>
        <input type="text" name="url" value={formData.url} onChange={handleChange} />
        <label>Tipo:</label>
        <input type="text" name="type" value={formData.type} onChange={handleChange} />
        <button type="submit">Adicionar Link</button>
      </form>

      <div>
        <form onSubmit={handleSearchSubmit}>
          <label>Pesquisar:</label>
          <input type="text" value={searchTerm} onChange={handleSearch} />
        </form>
      </div>

      <ul>
        {filteredLinks.map((link) => (
          <li key={link.id}>
            <div>
              <strong>{link.title}</strong> - {link.url} ({link.type})
            </div>
            <div>
              <button onClick={() => handleDelete(link.id)}>Excluir</button>
              <button onClick={() => handleUpdate(link)}>Editar</button>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={handleToggleDarkMode}>
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>

      {selectedLink && (
        <div>
          <h2>Editar Link</h2>
          <form onSubmit={handleUpdate}>
            {/* campos de edição */}
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
