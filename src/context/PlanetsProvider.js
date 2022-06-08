import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';
import response from '../testData';

function PlanetsProvider({ children }) {
  const [data, setData] = useState([]);
  console.log(data);

  const [filters, setFilters] = useState(
    {
      filterByName: {
        name: '',
      },
      filterByNumericValues: [],
      order: {
        column: 'Name', sort: 'ASC',
      },
    },
  );

  function requestApi() {
    fetch('https://swapi-trybe.herokuapp.com/api/planets/')
      .then((result) => result.json());
    //   .then((result) => setData(result.results));
    setData(response.results);
  }

  return (
    <PlanetsContext.Provider
      value={
        { data, setData, requestApi, filters, setFilters }
      }
    >
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.string.isRequired,
};
export default PlanetsProvider;
