import { buildUrl } from "@/libs/apiClient";
import { http } from "@/libs/http";
import { Member } from "@/types/member";

const RESOURCE = "/api/pessoas";

export const memberService = {
  async list(): Promise<Member[]> {
    return http<Member[]>(buildUrl(RESOURCE));
  },

  async create(member: Member, file?: File): Promise<void> {
    const formData = buildFormData(member, file);

    await fetch(buildUrl(RESOURCE), {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
  },

  async update(member: Member, file?: File): Promise<void> {
    const formData = buildFormData(member, file);
    formData.append("_method", "PUT");

    await fetch(buildUrl(`${RESOURCE}/${member.id}`), {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
  },

  async delete(id: string): Promise<void> {
    await http<void>(buildUrl(`${RESOURCE}/${id}`), {
      method: "DELETE",
    });
  },
};

function buildFormData(member: Member, file?: File): FormData {
  const formData = new FormData();

  formData.append("name", member.name);
  formData.append("research", member.research ?? "");
  formData.append("lattes", member.lattes ?? "");
  formData.append("orcid", member.orcid ?? "");
  formData.append("descricao", member.descricao ?? "");
  formData.append("cargo", member.cargo ?? "");
  formData.append("curso", member.curso ?? "");

  if (file) {
    formData.append("image", file);
  }

  return formData;
}
