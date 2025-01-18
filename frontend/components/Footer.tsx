export default function Footer() {
  return (
    <footer className="mt-10 p-4 bg-gray-800 text-white w-full absolute bottom-0 flex justify-between">
      <p>&copy; 2025 Kronikarz. Wszelkie prawa zastrzeżone.</p>
      <ul className="mt-2 flex space-x-4">
        <li>
          <a href="https://github.com/KasmyrA" className="text-blue-400 flex items-center">
            <img src="https://github.com/KasmyrA.png" alt="KasmyrA" className="w-6 h-6 rounded-full mr-2" />
            GitHub KasmyrA
          </a>
        </li>
        <li>
          <a href="https://github.com/Gojodzojo" className="text-blue-400 flex items-center">
            <img src="https://github.com/Gojodzojo.png" alt="Gojodzojo" className="w-6 h-6 rounded-full mr-2" />
            GitHub Gojodzojo
          </a>
        </li>
        <li>
          <a href="https://github.com/MFSTL1" className="text-blue-400 flex items-center">
            <img src="https://github.com/MFSTL1.png" alt="MFSTL1" className="w-6 h-6 rounded-full mr-2" />
            GitHub MFSTL1
          </a>
        </li>
        <li>
          <a href="https://github.com/Hipcio10" className="text-blue-400 flex items-center">
            <img src="https://github.com/Hipcio10.png" alt="Hipcio10" className="w-6 h-6 rounded-full mr-2" />
            GitHub Hipcio10
          </a>
        </li>
      </ul>
    </footer>
  );
}
