"use client";

import { useEffect, useState } from "react";

type Tarea = {
  id: string;
  texto: string;
  completada: boolean;
};

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [texto, setTexto] = useState("");
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const datos = localStorage.getItem("tareas");
      if (datos) setTareas(JSON.parse(datos));
    } catch {
      console.error("No se pudieron recuperar las tareas");
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      localStorage.setItem("tareas", JSON.stringify(tareas));
    }
  }, [tareas, cargado]);

  function agregarTarea(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!texto.trim()) return;

    setTareas((actuales) => [
      ...actuales,
      {
        id: crypto.randomUUID(),
        texto: texto.trim(),
        completada: false,
      },
    ]);
    setTexto("");
  }

  function completarTarea(id: string) {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      )
    );
  }

  function eliminarTarea(id: string) {
    setTareas((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto mt-12 max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">Gestor de tareas</h1>
        <p className="mb-6 text-slate-500">
          Organiza tus tareas de forma sencilla.
        </p>

        <form onSubmit={agregarTarea} className="mb-6 flex gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe una tarea"
            aria-label="Nueva tarea"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 p-3"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700"
          >
            Añadir
          </button>
        </form>

        <ul className="space-y-3">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
            >
              <label className="flex min-w-0 items-center gap-3">
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() => completarTarea(tarea.id)}
                />
                <span className={tarea.completada ? "break-words line-through text-slate-400" : "break-words"}>
                  {tarea.texto}
                </span>
              </label>
              <button
                onClick={() => eliminarTarea(tarea.id)}
                className="text-sm font-medium text-red-600"
                aria-label={`Eliminar ${tarea.texto}`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        {cargado && tareas.length === 0 && (
          <p className="text-center text-slate-500">
            Todavía no hay tareas.
          </p>
        )}

        <p className="mt-6 text-sm text-slate-500">
          {tareas.filter((t) => t.completada).length} de {tareas.length} tareas completadas
        </p>
      </section>
    </main>
  );
}















































