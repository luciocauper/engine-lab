import { buildUrl } from "@/libs/apiClient";
import { http } from "@/libs/http";
import { Projeto } from "@/types/projeto";

const RESOURCE = "/api/projetos";

export const projetoService = {
  async list(): Promise<Projeto[]> {
    return http<Projeto[]>(buildUrl(RESOURCE));
  },

  async show(id: number): Promise<Projeto> {
    return http<Projeto>(buildUrl(`${RESOURCE}/${id}`));
  },

  async create(projeto: Projeto, files: File[] = []): Promise<void> {
    const formData = buildFormData(projeto, files);

    await fetch(buildUrl(RESOURCE), {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
  },

  async update(projeto: Projeto, files: File[] = []): Promise<void> {
    const formData = buildFormData(projeto, files);
    formData.append("_method", "PUT");

    await fetch(buildUrl(`${RESOURCE}/${projeto.id}`), {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
  },

  async delete(id: number): Promise<void> {
    await http<void>(buildUrl(`${RESOURCE}/${id}`), {
      method: "DELETE",
    });
  },
};

function buildFormData(projeto: Projeto, files: File[] = []): FormData {
  const formData = new FormData();

  formData.append("name", projeto.name);
  formData.append("description", projeto.description ?? "");
  formData.append("status", projeto.status ?? "");
  formData.append("date_begin", projeto.date_begin ?? "");
  formData.append("date_end", projeto.date_end ?? "");

  // 🔥 Imagens antigas (strings)
  if (projeto.images?.length) {
    projeto.images.forEach((img) => {
      formData.append("images[]", img);
    });
  }

  // 🔥 Novos arquivos
  files.forEach((file) => {
    formData.append("images[]", file);
  });

  return formData;
}
