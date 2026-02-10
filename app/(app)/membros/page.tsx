import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import Image from "next/image";

export default function noticia() {
  return (
    <div>
      <div>
        <h1 className="text-8xl font-brand text-center">Membros</h1>
      </div>

      <div className="mt-8 max-w-11/12 mx-auto">
        {/* Listas de membros */}
        <Card>
          <CardHeader>
            <Image
              src="/example.svg" // Substitua pelo caminho real da imagem do membro
              alt="Imagem do membro"
              width={150}
              height={100}
              className="mr-4 flex-shrink-0"
            />
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 dark:text-gray-200 font-bricolage">
            Nome do membro
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
