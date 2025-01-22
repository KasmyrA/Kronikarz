/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="p-4 bg-gray-800 text-white w-full relative flex justify-between footer-padding">
      <p>&copy; 2025 Kronikarz. Wszelkie prawa zastrzeżone.</p>
      <ul className="mt-2 flex space-x-4">
        <li className="flex flex-col items-start">
          <a href="https://github.com/KasmyrA" className="text-blue-400 flex items-center">
            <img src="https://github.com/KasmyrA.png" alt="Kacper Smyrak" className="w-6 h-6 rounded-full mr-2" />
            GitHub Kacper Smyrak
          </a>
          <a href="https://linkedin.com/in/kacper-smyrak-596761241/" className="text-blue-400 flex items-center mt-2">
            LinkedIn 
          </a>
        </li>
        <li className="flex flex-col items-start">
          <a href="https://github.com/Gojodzojo" className="text-blue-400 flex items-center">
            <img src="https://github.com/Gojodzojo.png" alt="Mateusz Goik" className="w-6 h-6 rounded-full mr-2" />
            GitHub Mateusz Goik
          </a>
          <a href="https://linkedin.com/in/mateuszgoik/" className="text-blue-400 flex items-center mt-2">
            LinkedIn 
          </a>
        </li>
        <li className="flex flex-col items-start">
          <a href="https://github.com/MFSTL1" className="text-blue-400 flex items-center">
            <img src="https://github.com/MFSTL1.png" alt="MFSTL1" className="w-6 h-6 rounded-full mr-2" />
            GitHub MFSTL1
          </a>
        </li>
        <li className="flex flex-col items-start">
          <a href="https://github.com/Hipcio10" className="text-blue-400 flex items-center">
            <img src="https://github.com/Hipcio10.png" alt="Hipcio10" className="w-6 h-6 rounded-full mr-2" />
            GitHub Hipcio10
          </a>
        </li>
      </ul>
    </footer>
  );
}
