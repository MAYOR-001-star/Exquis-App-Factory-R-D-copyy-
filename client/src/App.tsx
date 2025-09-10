import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { useThemeStore } from './stores/theme.store';
import { applicationRoute } from './routes/app.routes';

export default function App() {
	const { persistTheme } = useThemeStore();

	useEffect(() => { persistTheme(); }, []);

	return <RouterProvider router={applicationRoute} />

}