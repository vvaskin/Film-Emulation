import ImageUploader from './imageUploader';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Welcome to Filmify!</h1>
          <nav className="mt-4">
            <ul className="flex space-x-6">
              <li>
                <a href="#about" className="hover:underline">About</a>
              </li>
              <li>
                <a href="#features" className="hover:underline">Features</a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section id="about" className="mb-8">
          <p className="text-lg">
            Filmify is an innovative film emulator that lets you apply classic film effects to your digital images.
            This project was created by [Your Name] to explore the fusion of analog aesthetics with modern technology.
          </p>
        </section>

        {/* Image Uploader Section */}
        <section id="upload">
          <ImageUploader />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Filmify. All rights reserved.</p>
          <p className="mt-2">
            Follow me on 
            <a 
              href="https://twitter.com/yourhandle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:underline"
            >
              Twitter
            </a>
            and 
            <a 
              href="https://github.com/yourhandle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}


export default App
