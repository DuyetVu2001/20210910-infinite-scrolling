import { useCallback, useRef, useState } from 'react';
import useBookSearch from './useBookSearch';

function App() {
	const [query, setQuery] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	const { books, error, hasMore, loading } = useBookSearch(query, pageNumber);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((state) => state + 1);
				}
			});
			if (node) observer.current.observe(node);
		},

		[loading, observer, hasMore]
	);

	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};

	return (
		<div>
			<input type="text" value={query} onChange={handleSearch} />
			{books.map((book, index) =>
				books.length - 1 === index ? (
					<div key={book} ref={lastBookElementRef}>
						{index + 1 + '. ' + book}
					</div>
				) : (
					<div key={book}>{index + 1 + '. ' + book}</div>
				)
			)}
			<div>{loading && '------------Loading------------'}</div>
			<div>{error && '------------Error------------'}</div>
		</div>
	);
}

export default App;
