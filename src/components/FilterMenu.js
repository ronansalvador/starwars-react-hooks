import React from 'react';

function FilterMenu() {
  return (
    <div className="filters">
      <label htmlFor="column">
        Coluna
        <select
          name="column"
          id="column"
          onChange={ handleColumn }
          data-testid="column-filter"
          value={ inputColumn }
        >
          {columnsName
    && columnsName.map((element, index) => (
      <option value={ element } key={ index }>
        {element}
      </option>
    ))}
        </select>
      </label>
      <label htmlFor="comparison">
        Operador
        <select
          name="comparison"
          id="comparison"
          onChange={ handleComparison }
          data-testid="comparison-filter"
          value={ inputComparison }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
      </label>
      <input
        type="number"
        onChange={ handleNumber }
        name="value"
        data-testid="value-filter"
        value={ inputNumber }
      />
      <button
        type="button"
        onClick={ saveNumericFilters }
        data-testid="button-filter"
      >
        Filtrar
      </button>
      <label htmlFor="orderColumns">
        Ordenar
        <select
          id="orderColumns"
          value={ orderColumn }
          onChange={ ({ target }) => setOrderColumn(target.value) }
        >
          { allColumns.map((column, index) => (
            <option value={ column } key={ index }>
              {column}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="asc">
        ASC:
        <input
          type="radio"
          name="sort"
          id="asc"
          value="ASC"
          data-testid="column-sort-input-asc"
          onClick={ ({ target }) => setInputSort(target.value) }
        />
      </label>
      <label htmlFor="desc">
        DESC:
        <input
          type="radio"
          name="sort"
          id="desc"
          value="DESC"
          data-testid="column-sort-input-desc"
          onClick={ ({ target }) => setInputSort(target.value) }
        />
      </label>
      <button
        type="button"
        data-testid="column-sort-button"
        onClick={ orderPlanets }
      >
        Ordernar
      </button>

      <button
        type="button"
        data-testid="button-remove-filters"
        onClick={ removeAllFilters }
      >
        Remover Filtros
      </button>
    </div>
  );
}

export default FilterMenu;
