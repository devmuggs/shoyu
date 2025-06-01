import "./App.css";
import MainLayout from "./components/layouts/MainLayout";

function App() {
	return (
		<MainLayout
			header={undefined}
			sidebar={undefined}
			className="bg-neutral-900 w-screen h-screen overflow-y-auto overflow-x-hidden"
		>
			welcome to shoyu
		</MainLayout>
	);
}

export default App;
