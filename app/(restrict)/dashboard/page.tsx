import { Users, FolderKanban, Newspaper, LayoutDashboard } from "lucide-react";

export default function DashboardHome() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="max-w-4xl w-full space-y-14 text-center">
        {/* Cabeçalho */}
        <header className="space-y-4">
          <div className="flex justify-center">
            <LayoutDashboard className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Este é o painel administrativo do sistema.  
            A partir daqui, você pode acessar as áreas de gerenciamento
            utilizando o menu de navegação superior.
          </p>
        </header>

        {/* Seções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Membros */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl font-medium">
              Membros
            </h2>

            <p className="text-zinc-500 leading-relaxed">
              Gerencie os membros da plataforma, mantenha cadastros
              atualizados e acompanhe os usuários ativos.
            </p>
          </div>

          {/* Projetos */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <FolderKanban className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl font-medium">
              Projetos
            </h2>

            <p className="text-zinc-500 leading-relaxed">
              Crie, organize e acompanhe projetos, controlando status,
              responsáveis e o progresso das atividades.
            </p>
          </div>

          {/* Notícias */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <Newspaper className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl font-medium">
              Notícias
            </h2>

            <p className="text-zinc-500 leading-relaxed">
              Publique comunicados e notícias, edite conteúdos e mantenha
              as informações sempre atualizadas.
            </p>
          </div>
        </div>

        {/* Rodapé sutil */}
        <footer className="pt-6">
          <p className="text-sm text-zinc-400">
            Utilize o menu superior para navegar entre as seções do sistema.
          </p>
        </footer>
      </div>
    </section>
  );
}