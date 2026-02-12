"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Member } from "@/types/member";
import { memberService } from "@/services/member.service";
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

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;

    const term = search.toLowerCase();

    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(term) ||
        m.cargo?.toLowerCase().includes(term) ||
        m.curso?.toLowerCase().includes(term),
    );
  }, [members, search]);

  async function fetchMembers() {
    try {
      setLoading(true);
      const data = await memberService.list();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createMember(member: Member) {
    await memberService.create(member, selectedFile ?? undefined);
  }

  async function updateMember(member: Member) {
    await memberService.update(member, selectedFile ?? undefined);
  }

  async function deleteMember(id: string) {
    await memberService.delete(id);
  }

  const handleSave = async () => {
    if (!form.name.trim()) return;

    if (form.id) {
      await updateMember(form);
    } else {
      await createMember(form);
    }

    setSelectedFile(null);
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Membros</h1>

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
              setForm(emptyMember);
              setSelectedFile(null);
              onOpen();
            }}
          >
          </Button>
        </div>
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
            {filteredMembers.map((m) => (
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

                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => fileInputRef.current?.click()}
                      >
                        Selecionar imagem
                      </Button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome"
                    value={form.name}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <Input
                    label="Cargo"
                    value={form.cargo}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("cargo", e.target.value)}
                  />
                  <Input
                    label="Curso"
                    value={form.curso}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("curso", e.target.value)}
                  />
                  <Input
                    label="Área de Pesquisa"
                    value={form.research}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("research", e.target.value)}
                  />
                  <Input
                    label="Lattes"
                    value={form.lattes}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("lattes", e.target.value)}
                  />
                  <Input
                    label="ORCID"
                    value={form.orcid}
                    isDisabled={readOnly}
                    onChange={(e) => handleChange("orcid", e.target.value)}
                  />
                </div>

                <Textarea
                  label="Descrição"
                  value={form.descricao}
                  isDisabled={readOnly}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  minRows={4}
                />
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
