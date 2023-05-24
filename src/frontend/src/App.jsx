import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/links?search=${searchTerm}`);
      setLinks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/links', formData);
      setFormData({
        title: '',
        url: '',
        type: ''
      });
      fetchLinks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (linkId) => {
    try {
      await axios.delete(`http://localhost:3001/api/links/${linkId}`);
      fetchLinks();
    } catch (error) {
      console.error(error);
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
          {/* <button type="submit">Pesquisar</button> */}
        </form>
      </div>

      <ul>
        {filteredLinks.map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.title}</a>
            <button onClick={() => handleDelete(link.id)}>Deletar</button>
            <button onClick={() => handleUpdate(link)}>Ver URL</button>
            {selectedLink && selectedLink.id === link.id && (
              <div>
                <p>URL: {selectedLink.url}</p>
                <p>Tipo: {selectedLink.type}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      

      <button className="dark-mode-button" onClick={handleToggleDarkMode}>
        {darkMode ? <i className="material-icons">Lua</i> : <i className="material-icons">Sol</i>}
      </button>
    </div>
  );
};

export default App;
