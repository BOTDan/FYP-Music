import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { mediaProviderFromString } from '../../helper';
import { useAppDispatch, useAppSelector } from '../../store/helper';
import { updateDoSearch, updateProvider, updateSearchTerm } from '../../store/reducers/search';

/**
 * A search store manager, handles URL changes
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 * @returns A Search store manager
 */
export function SearchManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchValue = useAppSelector((state) => state.search.q);
  const searchProvider = useAppSelector((state) => state.search.provider);
  const doSearch = useAppSelector((state) => state.search.doSearch);

  // Startup function to check the URL
  // If it's a search URL, update the store to match it.
  useEffect(() => {
    const loc = location.pathname;
    if (loc.startsWith('/search/')) {
      // We need to do some updating most likely
      const parts = loc.substring('/search/'.length).split('/');
      const provider = mediaProviderFromString(parts[0]);
      const q = parts[1];
      if (provider) {
        dispatch(updateProvider(provider));
      }
      if (q) {
        dispatch(updateSearchTerm(decodeURI(q)));
      }
    }
  }, []);

  useEffect(() => {
    if (searchValue || location.pathname.startsWith('/search')) {
      navigate(`/search/${searchProvider.toLowerCase()}/${encodeURI(searchValue)}`);
    }
  }, [searchValue, searchProvider]);

  useEffect(() => {
    if (doSearch) {
      dispatch(updateDoSearch(false));
      navigate(`/search/${searchProvider.toLowerCase()}/${encodeURI(searchValue)}`);
    }
  }, [doSearch]);
  return (null);
}
