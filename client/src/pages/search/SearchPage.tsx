import React from 'react';
import {
  Outlet, Route, Routes, useParams,
} from 'react-router';
import './SearchPage.scss';
import { SearchPageLanding } from './SearchPageLanding';
import { SearchPageResults } from './SearchPageResults';

function SearchPageContent() {
  const { provider, q } = useParams();

  let element = <p>Empty</p>;

  if (q && provider) {
    element = <SearchPageResults provider={provider} q={q} />;
  } else if (provider && !q) {
    element = <SearchPageLanding provider={provider} />;
  }

  return element;
}

export function SearchPage() {
  return (
    <div className="SearchPage">
      <Outlet />
      <Routes>
        <Route path="/" element={<p>None</p>} />
        <Route path=":provider" element={<SearchPageContent />} />
        <Route path=":provider/:q" element={<SearchPageContent />} />
      </Routes>
    </div>
  );
}
