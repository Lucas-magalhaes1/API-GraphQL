import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const COUNTRIES_QUERY = gql`
  query {
    countries {
      code
      name
      continent {
        name
      }
    }
  }
`;

const CountryList = () => {
  const { loading, error, data } = useQuery(COUNTRIES_QUERY);
  const [searchedCountry, setSearchedCountry] = useState(null);

  const searchCountry = (code) => {
    setSearchedCountry(code);
  };

  const backToList = () => {
    setSearchedCountry(null);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Ocorreu um erro.</p>;

  if (searchedCountry) {
    return (
      <div>
        <h1>Detalhes do País</h1>
        <button onClick={backToList}>Voltar à lista</button>
        <CountryDetails code={searchedCountry} />
      </div>
    );
  }

  return (
    <div>
      <h1>Lista de Países</h1>
      <ul>
        {data.countries.map((country) => (
          <li key={country.code}>
            <button onClick={() => searchCountry(country.code)}>{country.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const COUNTRY_DETAILS_QUERY = gql`
  query ($code: ID!) {
    country(code: $code) {
      name
      capital
      population
      currency
    }
  }
`;

const CountryDetails = ({ code }) => {
  const { loading, error, data } = useQuery(COUNTRY_DETAILS_QUERY, {
    variables: { code }
  });

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Ocorreu um erro.</p>;

  const country = data.country;
  return (
    <div>
      <h2>{country.name}</h2>
      <p><strong>Capital:</strong> {country.capital}</p>
      <p><strong>População:</strong> {country.population}</p>
      <p><strong>Moeda:</strong> {country.currency}</p>
    </div>
  );
};

export default CountryList;
