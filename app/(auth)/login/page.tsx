"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("LOGIN DATA", data);
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-zinc-950/90 to-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl">
        <CardHeader className="flex flex-col gap-2 text-center pb-2 mb-6">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Acesso Restrito
          </h1>
          <p className="text-sm text-zinc-400">
            Faça login para continuar no sistema
          </p>
        </CardHeader>

        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              type="email"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              classNames={{
                input: "text-white placeholder:text-zinc-400",
                inputWrapper: [
                  "bg-zinc-900",
                  "border border-zinc-700",
                  "hover:border-zinc-500",
                  "focus-within:border-primary",
                ].join(" "),
              }}
              {...register("email")}
            />

            <Input
              type="password"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Senha"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              classNames={{
                input: "text-white placeholder:text-zinc-400",
                inputWrapper: [
                  "bg-zinc-900",
                  "border border-zinc-700",
                  "hover:border-zinc-500",
                  "focus-within:border-primary",
                ].join(" "),
              }}
              {...register("password")}
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={loading}
              className="mt-2 font-medium"
            >
              Entrar
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
