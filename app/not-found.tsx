import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-9xl font-extrabold text-emerald-600">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold mt-4">
        Oops! Página não encontrada
      </h2>

      <p className="mt-2 text-gray-600 text-lg max-w-md">
        A página que você está procurando não existe ou foi movida para outro
        lugar.
      </p>

      <Button
        as={Link}
        href="/"
        className="mt-6 border-2 border-emerald-600 bg-transparent text-black text-lg rounded-lg shadow-md hover:bg-emerald-700 hover:text-white transition dark:text-white"
      >
        Voltar para a Home
      </Button>
    </div>
  );
}
