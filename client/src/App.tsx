import { RouterProvider } from 'react-router-dom';

import { applicationRoute } from './routes/app.routes';

export default function App() {

	return <RouterProvider router={applicationRoute} />
}