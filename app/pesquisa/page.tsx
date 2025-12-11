"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/outline";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function Pesquisa() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <h1 className="text-8xl font-brand">Pesquisas</h1>

      <div className="mt-8 text-left">
        <h2 className="text-4xl font-bricolage">2025</h2>

        <Card className="max-w-[400px]">
          <CardHeader>{/* Imagem do projeto */}</CardHeader>
          <CardBody>{/* Nome do projeto */}</CardBody>
          <Divider />

          <CardFooter>
            <Button onPress={onOpen} variant="light">
              Saiba mais
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Nome da pesquisa</ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vestibulum dictum tincidunt nisl non maximus. Quisque non
                  rutrum mauris, suscipit ornare lacus. Donec viverra tincidunt
                  ipsum, eu laoreet mi fermentum in. Nullam in lacus feugiat,
                  pretium turpis venenatis, malesuada dui. Integer sagittis
                  ornare dui. Vivamus porttitor porta imperdiet. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames
                  ac turpis egestas. Praesent scelerisque risus ut consectetur
                  porta. Aenean euismod enim ipsum. Duis nulla nisi, egestas non
                  odio sed, vehicula tempor ipsum. Nunc dignissim sed nulla ut
                  hendrerit. Duis mauris diam, luctus vitae commodo sit amet,
                  vehicula eget ligula. Aliquam metus nulla, tincidunt at
                  tincidunt quis, accumsan sit amet ipsum. Cras feugiat
                  fringilla nisl, non laoreet risus facilisis nec.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  teste
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
