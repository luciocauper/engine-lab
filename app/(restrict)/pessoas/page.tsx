"use client";

import { useEffect, useState, useRef } from "react";
import { Member } from "@/types/member";
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

const API_URL = "http://localhost:8000/api/pessoas";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: deleteOpen,
    onOpen: openDelete,
    onOpenChange: onDeleteChange,
  } = useDisclosure();

  const emptyMember: Member = {
    id: "",
    name: "",
    image: "",
    research: "",
    lattes: "",
    orcid: "",
    descricao: "",
    cargo: "",
    curso: "",
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState<Member>(emptyMember);

  const handleChange = (key: keyof Member, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  function getImageUrl(image: string | null | undefined) {
    if (!image) return null;

    if (image.startsWith("http")) return image;

    return `${API_BASE}/storage/${image}`;
  }

  async function fetchMembers() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();

      const normalized = data.map((m: any) => ({
        id: m.id ?? "",
        name: m.name ?? "",
        image: m.image ?? "",
        research: m.research ?? "",
        lattes: m.lattes ?? "",
        orcid: m.orcid ?? "",
        descricao: m.descricao ?? "",
        cargo: m.cargo ?? "",
        curso: m.curso ?? "",
      }));

      setMembers(normalized);
    } catch (err) {
      console.error("Erro ao buscar membros", err);
    } finally {
      setLoading(false);
    }
  }

  async function createMember(member: Member) {
    const formData = new FormData();

    formData.append("name", member.name);
    formData.append("research", member.research ?? "");
    formData.append("lattes", member.lattes ?? "");
    formData.append("orcid", member.orcid ?? "");
    formData.append("descricao", member.descricao ?? "");
    formData.append("cargo", member.cargo ?? "");
    formData.append("curso", member.curso ?? "");

    if (selectedFile) {
      formData.append("image", selectedFile); // 👈 AQUI É O ARQUIVO REAL
    }

    await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
  }

  async function updateMember(member: Member) {
    const formData = new FormData();

    formData.append("name", member.name);
    formData.append("research", member.research ?? "");
    formData.append("lattes", member.lattes ?? "");
    formData.append("orcid", member.orcid ?? "");
    formData.append("descricao", member.descricao ?? "");
    formData.append("cargo", member.cargo ?? "");
    formData.append("curso", member.curso ?? "");

    // Laravel não aceita PUT com multipart diretamente
    // então usamos method spoofing
    formData.append("_method", "PUT");

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    await fetch(`${API_URL}/${member.id}`, {
      method: "POST", // 👈 IMPORTANTE
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    setSelectedFile(null);
  }

  async function deleteMember(id: string) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  }

  const handleSave = async () => {
    if (!form.name.trim()) return;

    if (form.id) {
      await updateMember(form);
    } else {
      await createMember(form);
    }

    await fetchMembers();
    onOpenChange();
  };

  const handleDelete = async () => {
    if (selected) {
      await deleteMember(selected.id);
      await fetchMembers();
      setSelected(null);
    }
    onDeleteChange();
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <main className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Membros</h1>

        <Button
          color="primary"
          onPress={() => {
            setReadOnly(false);
            setForm(emptyMember);
            onOpen();
          }}
        >
          Novo Membro
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table aria-label="Tabela de membros">
          <TableHeader>
            <TableColumn>Nome</TableColumn>
            <TableColumn>Cargo</TableColumn>
            <TableColumn>Curso</TableColumn>
            <TableColumn>Ações</TableColumn>
          </TableHeader>

          <TableBody emptyContent="Nenhum membro encontrado">
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.cargo}</TableCell>
                <TableCell>{m.curso}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => {
                      setReadOnly(true);
                      setForm(m);
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
                      setForm(m);
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
                      setSelected(m);
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {readOnly
                  ? "Visualizar Membro"
                  : form.id
                    ? "Editar Membro"
                    : "Novo Membro"}
              </ModalHeader>

              <ModalBody className="space-y-8">
                {/* ================= FOTO ================= */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-default-200 shadow-md">
                    {form.image ? (
                      <img
                        src={getImageUrl(form.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-default-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  {!readOnly && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            const preview = URL.createObjectURL(file);
                            setForm((prev) => ({ ...prev, image: preview }));
                          }
                        }}
                      />

                      <div className="flex flex-col items-center gap-2">
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={() => fileInputRef.current?.click()}
                        >
                          Selecionar imagem
                        </Button>

                        {selectedFile && (
                          <span className="text-xs text-default-500">
                            {selectedFile.name}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* ================= INFORMAÇÕES BÁSICAS ================= */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome"
                      value={form.name ?? ""}
                      isDisabled={readOnly}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />

                    <Input
                      label="Cargo"
                      value={form.cargo ?? ""}
                      isDisabled={readOnly}
                      onChange={(e) => handleChange("cargo", e.target.value)}
                    />

                    <Input
                      label="Curso"
                      value={form.curso ?? ""}
                      isDisabled={readOnly}
                      onChange={(e) => handleChange("curso", e.target.value)}
                    />

                    <Input
                      label="Área de Pesquisa"
                      value={form.research ?? ""}
                      isDisabled={readOnly}
                      onChange={(e) => handleChange("research", e.target.value)}
                    />
                  </div>
                </div>

                {/* ================= LINKS ACADÊMICOS ================= */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Links Acadêmicos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Lattes"
                      value={form.lattes ?? ""}
                      isDisabled={readOnly}
                      onChange={(e) => handleChange("lattes", e.target.value)}
                    />

                    <Input
                      label="ORCID"
                      value={form.orcid ?? ""}
                      isDisabled={readOnly}
                      onChange={(e) => handleChange("orcid", e.target.value)}
                    />
                  </div>
                </div>

                {/* ================= DESCRIÇÃO ================= */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Descrição</h3>

                  <Textarea
                    label="Descrição"
                    value={form.descricao ?? ""}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    minRows={4}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Fechar
                </Button>

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
              <ModalBody>Tem certeza que deseja apagar este membro?</ModalBody>
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
