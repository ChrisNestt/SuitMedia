import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IdeasListPage.css';

const IdeasListPage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('-published_at');
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0); 
  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://suitmedia-backend.suitdev.com/api/ideas', {
        params: {
          'page[number]': page,
          'page[size]': pageSize,
          append: ['small_image', 'medium_image'],
          sort: sortOrder,
        },
      });
      console.log(response.data.data)
      setArticles(response.data.data);
      setTotalItems(response.data.meta.total); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchImg = async () => {
    try {
      const imageUrl = "https://b689qkm0-5000.asse.devtunnels.ms/proxy-image/";
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const imgSrc = URL.createObjectURL(response.data);
      console.log(imgSrc); 
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };
  
  useEffect(() => {
    fetchArticles();
    fetchImg();
  }, [page, pageSize, sortOrder]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="ideas-list-page">
      <header className="banner">
        <div className="banner-content">
          <h1>Ideas</h1>
          <p>Where all our great things begin</p>
        </div>
      </header>

      <div className="content">
        <div className="controls">
          <p>Showing {page} - {pageSize} of {totalItems}</p>
          <div className="controls-right">
            <label>
              Show per page:
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <label>
              Sort by:
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="article-list">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <img src={article.medium_image || article.small_image} alt={article.title} className="article-image" loading="lazy" />
                <p className="article-date">{new Date(article.published_at).toLocaleDateString()}</p>
                <h3 className="article-title">{article.title}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={page === index + 1 ? 'active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeasListPage;
