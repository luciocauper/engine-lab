"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projetoService } from "@/services/projeto.service";
import { Projeto } from "@/types/projeto";
import { getImageUrl } from "@/libs/media";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";

export default function PesquisaDetalhePage() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchProjeto() {
      const data = await projetoService.show(Number(id));
      setProjeto(data);
    }

    if (id) fetchProjeto();
  }, [id]);

  if (!projeto) {
    return <div className="p-20 text-center text-lg">Carregando...</div>;
  }

  const images = projeto.images ?? [];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* SLIDER */}
      {images.length > 0 && (
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl mb-10 bg-black flex items-center justify-center">
          <img
            src={getImageUrl(images[current])}
            className="max-h-full max-w-full object-contain transition-all duration-500"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      )}

      {/* INFO META */}
      <div className="flex flex-wrap gap-4 text-sm text-default-500 mb-6 justify-center">
        <span>Início: {projeto.date_begin}</span>
        <span>•</span>
        <span>
          Conclusão:{" "}
          {projeto.date_end ? projeto.date_end : "Em desenvolvimento"}
        </span>
        <span>•</span>
        <span>Status: {projeto.status}</span>
      </div>

      {/* TÍTULO */}
      <h1 className="text-5xl font-bold text-center mb-10 leading-tight">
        {projeto.name}
      </h1>

      <div className="max-w-3xl mx-auto text-lg leading-relaxed break-words whitespace-pre-line text-justify">
        {projeto.description ?? "Descrição não disponível."}
      </div>

      #bloco dizendo os integrantes se tiverem
        {projeto.pessoas && projeto.pessoas.length > 0 && (
            <div className="max-w-3xl mx-auto mt-10">
                <h2 className="text-2xl font-semibold mb-4">Integrantes</h2>
                <ul className="list-disc list-inside text-lg">
                    {projeto.pessoas.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
            </div>
        )}
    </main>
  );
}
