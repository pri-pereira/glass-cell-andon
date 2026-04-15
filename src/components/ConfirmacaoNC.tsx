import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Siren } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getTerminalId } from "@/utils/terminalId";

const getSaoPauloTimestamp = () => {
    try {
        const formatter = new Intl.DateTimeFormat("sv-SE", {
            timeZone: "America/Sao_Paulo",
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
        return formatter.format(new Date()).replace(" ", "T") + "-03:00";
    } catch {
        return new Date().toISOString();
    }
};

export interface PendingNC {
    id: string;
    motivo: string;
    tacto: string;
    lado: string;
}

const ConfirmacaoNC = () => {
    const [pendingNCs, setPendingNCs] = useState<PendingNC[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        let active = true;
        const myTerminalId = getTerminalId();

        const fetchExisting = async () => {
            const { data } = await supabase
                .from("nao_conformidades")
                .select("id, motivo, tacto, lado")
                .eq("status", "aguardando_confirmacao_operador")
                .eq("terminal_id", myTerminalId);

            if (active && data && data.length > 0) {
                setPendingNCs(data);
            }
        };

        fetchExisting();

        // Realtime
        const channel = supabase
            .channel(`realtime-ncs-${myTerminalId}`)
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "nao_conformidades" },
                (payload) => {
                    const record = payload.new as any;
                    if (record.terminal_id !== myTerminalId) return;

                    if (record.status === "aguardando_confirmacao_operador") {
                        setPendingNCs((prev) => {
                            if (prev.find((nc) => nc.id === record.id)) return prev;
                            return [...prev, record as PendingNC];
                        });
                    }

                    if (record.status === "resolvido") {
                        setPendingNCs((prev) => prev.filter((nc) => nc.id !== record.id));
                    }
                }
            )
            .subscribe();

        return () => {
            active = false;
            supabase.removeChannel(channel);
        };
    }, []);

    if (pendingNCs.length === 0) return null;

    const first = pendingNCs[0];

    const handleConfirm = async () => {
        setLoading(true);
        const now = getSaoPauloTimestamp();
        
        const { error } = await supabase
            .from("nao_conformidades")
            .update({ status: "resolvido", resolved_at: now })
            .eq("id", first.id);

        if (error) {
            toast({ title: "Erro ao confirmar", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "✅ Resolução validada!", description: `Problema de ${first.motivo} resolvido.` });
            setPendingNCs((prev) => prev.filter((nc) => nc.id !== first.id));
        }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                key="modal-backdrop-nc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9600] flex items-center justify-center px-4"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            >
                <motion.div
                    key="modal-content-nc"
                    initial={{ scale: 0.9, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 24 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-4 border-yellow-400"
                >
                    {/* Modal Header */}
                    <div className="bg-yellow-500 px-6 pt-6 pb-5 relative flex items-center gap-3">
                        <div className="p-2.5 bg-black/10 rounded-xl flex-shrink-0">
                            <Siren className="h-7 w-7 text-yellow-900" />
                        </div>
                        <div>
                            <p className="text-yellow-900/60 text-xs font-bold uppercase tracking-widest">Duplo-Check de Logística</p>
                            <h2 className="text-xl font-black text-yellow-950 leading-tight">
                                A Logística diz ter resolvido o problema.
                            </h2>
                        </div>
                    </div>

                    {/* Report Details */}
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div className="bg-red-50 rounded-2xl p-4 flex flex-col gap-2 border border-red-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Aviso</span>
                                <span className="text-xs font-bold bg-white text-red-600 px-2 py-0.5 rounded-full shadow-sm">
                                    TACTO {first.tacto} · {first.lado}
                                </span>
                            </div>
                            <p className="text-xl font-black text-red-800 tracking-tight leading-snug">{first.motivo}</p>
                        </div>

                        <p className="text-sm font-medium text-gray-500 text-center">
                            Valide fisicamente na célula se a peça ou rack já está na posição e lado corretos conforme a etiqueta antes de confirmar.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2.5 mt-2">
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="w-full h-14 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                {loading ? "Confirmando..." : "Sim, Validar Resolução"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmacaoNC;
