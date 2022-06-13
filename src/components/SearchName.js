import React, { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContext';

function SearchName() {
  const { filters, setFilters } = useContext(PlanetsContext);
  function handleChange({ target }) {
    setFilters(
      { ...filters,
        filterByName: {
          name: target.value,
        } },
    );
  }
  return (
    <div className="filterName">
      <label htmlFor="filterName">
        Buscar por nome:
        <input
          type="text"
          onChange={ handleChange }
          data-testid="name-filter"
          id="filterName"
        />
      </label>
    </div>
  );
}

export default SearchName;
