const SearchBar = ({ query, setQuery }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search by module (e.g. FWEB)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
