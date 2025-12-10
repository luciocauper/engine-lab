import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/*Seção de apresentação*/}
      <section className="bg-green-700 p-16">
        <div className="center mb-8">
          <Image
            src="/example.svg"
            alt="Imagem company svg from freepik"
            width={850}
            height={150}
            priority
          />
        </div>
        <h1 className="font-brand text-8xl text-white items-center justify-center text-center pb-4">
          Somos Engine Lab
        </h1>
      </section>
      {/*Seção de linhas de pesquisa*/}
      <section className=" bg-sky-500 p-8 center">
        <div>
          <h1 className="text-6xl text-white font-syne mb-24 font-bricolage text-center">
            Áreas de pesquisa
          </h1>

          <div className="grid gap-16 justify-items-start ">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Image
                src="/icons/iot-icon.png"
                alt="Ícone de Internet das Coisas"
                width={100}
                height={100}
                priority
              />
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">
                  Internet das Coisas (IoT)
                </h2>
                <p className="text-white mt-1 text-base">
                  Pesquisa e desenvolvimento de sistemas inteligentes e
                  conectados.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Image
                src="/icons/pln-icon.png"
                alt="Ícone em forma de cerebro representando processamento de linguage natural"
                width={100}
                height={100}
                priority
              />
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white font-bricolage">
                  Processamento de Linguagem Natural
                </h2>
                <p className="text-white mt-1 text-base">
                  Algoritmos que conseguem escrever textos de forma natural.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Image
                src="/icons/computer-vision-icon.png"
                alt="Íconde de visão computacional"
                width={100}
                height={100}
                priority
              />
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">
                  Visão Computacional
                </h2>
                <p className="text-white mt-1 text-base">
                  Desenvolvimento de algoritmos e sistemas que conseguem ver o
                  ambiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Seção de contate-nos*/}
      <section className="bg-sky-800 p-8 text-center">
        <div>
          <h2 className="text-5xl text-white mt-4 mb-4 font-bricolage">
            Quer fazer parte do nosso time?
          </h2>
          <span className="text-white center text-2xl mt-4 font-bricolage">
            <Button variant="ghost" size="lg" color="success" radius="sm">
              saiba mais
            </Button>
          </span>
        </div>
      </section>

      {/*Seção de notícias*/}
      <section className="bg-neutral-100 dark:bg-neutral-700 p-8">
        <h1 className="text-6xl font-syne mb-24 text-center font-bricolage">
          Notícias, publicações e cursos
        </h1>

        <div className="inline-grid grid-cols-3 gap-4 center">
          <Card className="p-4">
            <CardHeader>
              <h1>Titulo</h1>
            </CardHeader>
            <CardBody>
              <p>lorem ipsun dolor sit amet</p>
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <h1>Titulo</h1>
            </CardHeader>
            <CardBody>
              <p>lorem ipsun dolor sit amet</p>
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <h1>Titulo</h1>
            </CardHeader>
            <CardBody>
              <p>lorem ipsun dolor sit amet</p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="bg-neutral-200 p-8">
        <div className="text-center mb-32">
          <h1 className="text-6xl text-red-800 font-syne font-bricolage">
            Conheça nossa equipe
          </h1>
          <p>Professores e alunos que fazem o laboratório diariamente</p>
        </div>

        <div className="inline-grid grid-cols-3 gap-4 center">
          <Card>
            <CardHeader>
              <h1>Professor</h1>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <h1>Professor</h1>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <h1>Professor</h1>
            </CardHeader>
          </Card>

          <h1></h1>
        </div>
      </section>
    </div>
  );
}
