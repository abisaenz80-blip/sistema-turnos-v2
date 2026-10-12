"use client";
import { useState } from "react";

interface Turno {
  id: number;
  numero: string;
  estado: "fila" | "atendiendo" | "atendido";
  mesa?: number;
}

export default function AppTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [contador, setContador] = useState(1);

  // Tomar turno
  const tomarTurno = () => {
    const nuevo: Turno = {
      id: Date.now(),
      numero: `T-${String(contador).padStart(3, "0")}`,
      estado: "fila",
    };
    setTurnos([...turnos, nuevo]);
    setContador(contador + 1);
  };

  // Llamar siguiente turno desde una mesa (1 a 4)
  const llamarSiguiente = (numeroMesa: number) => {
    const siguiente = turnos.find((t) => t.estado === "fila");
    if (!siguiente) return alert("No hay personas en la fila");

    setTurnos(
      turnos.map((t) =>
        t.id === siguiente.id
          ? { ...t, estado: "atendiendo", mesa: numeroMesa }
          : t
      )
    );
  };

  // Marcar como atendido
  const marcarAtendido = (id: number) => {
    setTurnos(
      turnos.map((t) => (t.id === id ? { ...t, estado: "atendido" } : t))
    );
  };

  const fila = turnos.filter((t) => t.estado === "fila");
  const enAtencion = turnos.filter((t) => t.estado === "atendiendo");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">
        App Gestión de Atención a Clientes
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANEL CLIENTE */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">1. Zona de Clientes</h2>
          <button
            onClick={tomarTurno}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-lg transition"
          >
            Toma Tu Turno
          </button>

          <div className="mt-6">
            <h3 className="font-medium text-slate-400 mb-2">Fila de espera ({fila.length})</h3>
            <div className="flex flex-wrap gap-2">
              {fila.map((t) => (
                <span key={t.id} className="bg-slate-700 px-3 py-1 rounded text-sm font-mono">
                  {t.numero}
                </span>
              ))}
              {fila.length === 0 && <p className="text-sm text-slate-500">No hay nadie en fila.</p>}
            </div>
          </div>
        </div>

        {/* PANEL MESAS */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">2. Mesas de Atención (4 Mesas)</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[1, 2, 3, 4].map((mesaNum) => (
              <button
                key={mesaNum}
                onClick={() => llamarSiguiente(mesaNum)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded transition"
              >
                Avanza Mesa {mesaNum}
              </button>
            ))}
          </div>

          <h3 className="font-medium text-slate-400 mb-2">En Atención</h3>
          <div className="space-y-2">
            {enAtencion.map((t) => (
              <div key={t.id} className="flex justify-between items-center bg-slate-700 p-2 rounded">
                <span>
                  <strong className="text-emerald-400">{t.numero}</strong> en Mesa {t.mesa}
                </span>
                <button
                  onClick={() => marcarAtendido(t.id)}
                  className="bg-sky-600 hover:bg-sky-500 text-xs px-2 py-1 rounded"
                >
                  Marcar Atendido
                </button>
              </div>
            ))}
            {enAtencion.length === 0 && <p className="text-sm text-slate-500">Sin atenciones activas.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}