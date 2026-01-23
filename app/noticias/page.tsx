import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import Image from "next/image";

export default function noticia() {
  return (
    <div>
      <div>
        <h1 className="text-8xl font-brand text-center">Notícias</h1>
      </div>

      <div className="mt-8 max-w-11/12 mx-auto">
        {/* Listas de notícias */}
        <Card className="flex flex-row items-center p-4 mb-4 shadow-md rounded-lg text-left">
          <Image
            src="/example.svg" // Substitua pelo caminho real da imagem da notícia
            alt="Imagem da notícia"
            width={150}
            height={100}
            className="mr-4 flex-shrink-0"
          />
          <div className="flex flex-col flex-grow">
            <CardHeader className="text-xl font-bold text-gray-900 dark:text-white">Título da Notícia</CardHeader>
            <CardBody className="text-gray-700 text-base dark:text-gray-200">Resumo da notícia...</CardBody>
            <CardFooter className="text-sm text-gray-500 dark:text-gray-400">Data da publicação</CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
