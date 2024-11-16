import axios from "axios";
import { Client } from "./client";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DataTable } from "./components/ui/data-table";
import { clientColumns } from "./data-columns";

const formSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
});

type FormSchema = z.infer<typeof formSchema>;

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("access_token") || null
  );
  const [clients, setClients] = useState<Client[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormSchema) {
    const formData = new FormData();
    formData.append("username", data.email);
    formData.append("password", data.password);

    const response = await axios.post(
      "https://junior-app-o9ku.onrender.com/token",
      formData
    );
    localStorage.setItem("access_token", response.data.access_token);
    setToken(response.data.access_token);
  }

  useEffect(() => {
    async function getClients() {
      try {
        const response = await axios.get<Client[]>(
          "https://junior-app-o9ku.onrender.com/client",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClients(response.data);
      } catch (error) {
        localStorage.removeItem("access_token");
        setToken(null);
      }
    }

    getClients();
  }, []);

  return (
    <>
      {token ? (
        <>
          <div className="flex flex-col space-y-6 bg-gray-100 min-h-screen p-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Clientes</h1>
              <Button>Adicionar cliente</Button>
            </div>

            <DataTable data={clients} columns={clientColumns} />
          </div>
        </>
      ) : (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Login</h1>
            <form
              id="loginForm"
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  type="text"
                  {...form.register("email")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {form.formState.errors && (
                  <p>{form.formState.errors.email?.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <input
                  type="password"
                  {...form.register("password")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {form.formState.errors && (
                  <p>{form.formState.errors.password?.message}</p>
                )}
              </div>

              <Button className="w-full" type="submit">
                Login
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
