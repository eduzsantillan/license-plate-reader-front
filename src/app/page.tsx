import { LicensePlateScanner } from "./components/license-plate";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">License Plate Recognition</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Capture an image of a license plate for instant recognition
        </p>
      </header>
      
      <main className="w-full max-w-3xl">
        <LicensePlateScanner />
      </main>
      
      <footer className="w-full max-w-3xl mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} License Plate Recognition App</p>
      </footer>
    </div>
  );
}
