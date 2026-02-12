"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";

const API_URL = "http://localhost:8000/api/pessoas";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface Member {
  id: number;
  name: string;
  image: string | null;
  research: string | null;
  lattes: string | null;
  orcid: string | null;
  descricao: string | null;
  cargo: string | null;
  curso: string | null;
}

export default function Membros() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function getImageUrl(image: string | null) {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${API_BASE}/storage/${image}`;
  }

  async function fetchMembers() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Erro ao buscar membros", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="px-8 py-12 max-w-7xl mx-auto">
      <h1 className="text-6xl font-brand text-center mb-12">
        Membros
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {members.map((member) => (
            <Card
              key={member.id}
              isPressable
              onPress={() => {
                setSelected(member);
                onOpen();
              }}
              className="hover:scale-105 transition-transform"
            >
              <CardHeader className="flex justify-center">
                <div className="w-32 h-32 relative rounded-full overflow-hidden">
                  {member.image ? (
                    <Image
                      src={getImageUrl(member.image)!}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm">
                      Sem imagem
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardBody className="text-center">
                <p className="font-semibold text-lg">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500">
                  {member.cargo}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selected?.name}
              </ModalHeader>

              <ModalBody className="space-y-6">
                {selected?.image && (
                  <div className="flex justify-center">
                    <div className="w-40 h-40 relative rounded-full overflow-hidden">
                      <Image
                        src={getImageUrl(selected.image)!}
                        alt={selected.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold">Cargo</h3>
                  <p>{selected?.cargo}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Curso</h3>
                  <p>{selected?.curso}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Área de Pesquisa</h3>
                  <p>{selected?.research}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Lattes</h3>
                  <p>{selected?.lattes}</p>
                </div>

                <div>
                  <h3 className="font-semibold">ORCID</h3>
                  <p>{selected?.orcid}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Descrição</h3>
                  <p>{selected?.descricao}</p>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
