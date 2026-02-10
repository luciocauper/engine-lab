import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-9xl font-extrabold text-red-600">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold mt-4">
        Oops! Página não encontrada
      </h2>

      <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg max-w-md">
        A página que você está procurando não existe ou foi movida para outro
        lugar.
      </p>

      <Button
        as={Link}
        href="/"
        radius="sm"
        className="mt-6 border-2 border-red-600 bg-transparent text-red-600 text-lg shadow-md hover:bg-red-600 hover:text-white transition dark:text-white"
      >
        Voltar para a página principal
      </Button>
    </div>
  );
}
