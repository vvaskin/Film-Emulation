import ImageUploader from './imageUploader';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Welcome to Filmify!</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <section id="about" className="mb-8">
          <p className="text-lg text-center">
            Hey! I am a student at The University of Hong Kong, and this website is a side project of mine where I combined by love for photography with programming. Filmify, as is obvious from its name, turns your digital photos into film-like scans. Try it out below:
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
              href="https://instagram.com/aleksvaskin26" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:underline"
            >
              Instagram {' '}
            </a>
             and 
            <a 
              href="https://github.com/vvaskin" 
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
