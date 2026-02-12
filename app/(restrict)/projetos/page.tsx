"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Projeto } from "@/types/projeto";
import { projetoService } from "@/services/projeto.service";
import { getImageUrl } from "@/libs/media";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { Search, Plus } from "lucide-react";

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [selected, setSelected] = useState<Projeto | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: deleteOpen,
    onOpen: openDelete,
    onOpenChange: onDeleteChange,
  } = useDisclosure();

  const emptyProjeto: Projeto = {
    id: undefined,
    name: "",
    images: [],
    description: "",
    status: "",
    date_begin: "",
    date_end: "",
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<Projeto>(emptyProjeto);

  const handleChange = (key: keyof Projeto, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProjetos = useMemo(() => {
    if (!search.trim()) return projetos;
    const term = search.toLowerCase();
    return projetos.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.status?.toLowerCase().includes(term),
    );
  }, [projetos, search]);

  async function fetchProjetos() {
    try {
      setLoading(true);
      const data = await projetoService.list();
      setProjetos(data);
    } finally {
      setLoading(false);
    }
  }

  async function createProjeto(projeto: Projeto) {
    await projetoService.create(projeto, selectedFiles);
  }

  async function updateProjeto(projeto: Projeto) {
    await projetoService.update(projeto, selectedFiles);
  }

  async function deleteProjeto(id: number) {
    await projetoService.delete(id);
  }

  const handleSave = async () => {
    if (!form.name.trim()) return;

    if (form.id) {
      await updateProjeto(form);
    } else {
      await createProjeto(form);
    }

    setSelectedFiles([]);
    setImagePreviews([]);
    await fetchProjetos();
    onOpenChange();
  };

  const handleDelete = async () => {
    if (selected?.id) {
      await deleteProjeto(selected.id);
      await fetchProjetos();
      setSelected(null);
    }
    onDeleteChange();
  };

  useEffect(() => {
    fetchProjetos();
  }, []);

  return (
    <main className="p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Projetos</h1>

        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-sm"
            startContent={<Search size={18} className="text-default-400" />}
          />

          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onPress={() => {
              setReadOnly(false);
              setForm(emptyProjeto);
              setSelectedFiles([]);
              setImagePreviews([]);
              onOpen();
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table aria-label="Tabela de projetos">
          <TableHeader>
            <TableColumn>Nome</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Início</TableColumn>
            <TableColumn>Conclusão</TableColumn>
            <TableColumn>Ações</TableColumn>
          </TableHeader>

          <TableBody emptyContent="Nenhum projeto encontrado">
            {filteredProjetos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.date_begin}</TableCell>
                <TableCell>
                  {p.date_end ? p.date_end : "Em desenvolvimento"}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => {
                      setReadOnly(true);
                      setForm(p);
                      setSelectedFiles([]);
                      setImagePreviews([]);
                      onOpen();
                    }}
                  >
                    Ver
                  </Button>

                  <Button
                    size="sm"
                    color="warning"
                    variant="flat"
                    onPress={() => {
                      setReadOnly(false);
                      setForm(p);
                      setSelectedFiles([]);
                      setImagePreviews([]);
                      onOpen();
                    }}
                  >
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      setSelected(p);
                      openDelete();
                    }}
                  >
                    Apagar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent className="max-h-[90vh]">
          {(onClose) => (
            <>
              <ModalHeader className="flex-shrink-0">
                {readOnly
                  ? "Visualizar Projeto"
                  : form.id
                    ? "Editar Projeto"
                    : "Novo Projeto"}
              </ModalHeader>

              <ModalBody className="space-y-6 overflow-y-auto max-h-[65vh] pr-2">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {form.images?.map((img, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative w-full aspect-square rounded-lg overflow-hidden border shadow-md"
                      >
                        <img
                          src={getImageUrl(img)}
                          className="w-full h-full object-cover"
                        />

                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}

                    {imagePreviews.map((preview, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative w-full aspect-square rounded-lg overflow-hidden border shadow-md"
                      >
                        <img
                          src={preview}
                          className="w-full h-full object-cover"
                        />

                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFiles((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                              setImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {!readOnly && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          if (!files.length) return;

                          setSelectedFiles((prev) => [...prev, ...files]);

                          const previews = files.map((file) =>
                            URL.createObjectURL(file),
                          );

                          setImagePreviews((prev) => [...prev, ...previews]);

                          e.target.value = "";
                        }}
                      />

                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => fileInputRef.current?.click()}
                      >
                        Adicionar imagens
                      </Button>
                    </>
                  )}
                </div>

                <Input
                  label="Nome"
                  value={form.name}
                  isDisabled={readOnly}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <Input
                  label="Status"
                  value={form.status}
                  isDisabled={readOnly}
                  onChange={(e) => handleChange("status", e.target.value)}
                />

                <Input
                  type="date"
                  label="Data Início"
                  value={form.date_begin}
                  isDisabled={readOnly}
                  onChange={(e) => handleChange("date_begin", e.target.value)}
                />

                <Input
                  type="date"
                  label="Data Fim"
                  value={form.date_end ?? ""}
                  isDisabled={readOnly}
                  onChange={(e) => handleChange("date_end", e.target.value)}
                />

                <Textarea
                  label="Descrição"
                  value={form.description ?? ""}
                  isDisabled={readOnly}
                  onChange={(e) => handleChange("description", e.target.value)}
                  minRows={4}
                />
              </ModalBody>

              <ModalFooter>
                {!readOnly && (
                  <Button color="primary" onPress={handleSave}>
                    Salvar
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteOpen} onOpenChange={onDeleteChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirmar Exclusão</ModalHeader>
              <ModalBody>Tem certeza que deseja apagar este projeto?</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Apagar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
