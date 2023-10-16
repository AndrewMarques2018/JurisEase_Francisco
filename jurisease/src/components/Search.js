import React, { useState, useEffect } from 'react';

function Search({ orientation }) {

  const [busca, setBusca] = useState("");


  useEffect(() => {

    return () => {

    };

  }, []);

  return (
    <footer className={`search ${orientation}`}>
      <div className="search-container">
        <div>
          <input
            type="text"
            placeholder="O que você procura?"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

      </div>
    </footer>
  );
}

export default Search;