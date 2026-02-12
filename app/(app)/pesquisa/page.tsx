"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/react";
import { projetoService } from "@/services/projeto.service";
import { Projeto } from "@/types/projeto";
import { getImageUrl } from "@/libs/media";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";




export default function Pesquisa() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchProjetos() {
      const data = await projetoService.list();
      setProjetos(data);
    }
    fetchProjetos();
  }, []);

  const orderedProjetos = useMemo(() => {
    return [...projetos].sort(
      (a, b) =>
        new Date(b.date_begin).getTime() - new Date(a.date_begin).getTime(),
    );
  }, [projetos]);

  return (
    <>
      <div>
        <h1 className="text-8xl font-brand">Pesquisas</h1>
        <p className="text-xl">
          Nosso laboratório tem três linhas de pesquisas principais: Visão
          computacional, Processamento de Linguagem Natural e Internet of Things
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-6">
        {orderedProjetos.map((projeto) => {
          const cover =
            projeto.images && projeto.images.length > 0
              ? projeto.images[0]
              : null;

          return (
            <Card key={projeto.id} className="max-w-[400px]">
              <CardHeader>
                {projeto.images?.length ? (
                  <img
                    src={getImageUrl(projeto.images[0])}
                    alt={projeto.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-default-100 rounded-lg text-default-400">
                    Sem imagem
                  </div>
                )}
              </CardHeader>

              <CardBody>
                <h3 className="text-xl font-semibold">{projeto.name}</h3>
              </CardBody>

              <Divider />

              <CardFooter>
                <Button
                  variant="light"
                  onPress={() => router.push(`/pesquisa/${projeto.id}`)}
                >
                  Saiba mais
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
