import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    HardHat,
    Package,
    Wrench,
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Wifi,
    RotateCcw,
    Layers,
    ClipboardList,
    LogIn,
    LayoutDashboard,
    PackageCheck,
    Smartphone,
} from "lucide-react";

type Section = "operador" | "logistica" | "faq";

interface FaqItem {
    question: string;
    icon: React.ReactNode;
    answer: string;
}

const faqItems: FaqItem[] = [
    {
        icon: <RotateCcw className="h-5 w-5 text-amber-600" />,
        question: "O app travou ou ficou lento?",
        answer:
            "Feche e abra o aplicativo novamente. Os dados de Tacto e Lado são reconhecidos automaticamente na próxima sessão.",
    },
    {
        icon: <Wifi className="h-5 w-5 text-amber-600" />,
        question: "Sem Wi-Fi na linha?",
        answer:
            "O SmartAndon VW possui modo de resiliência. Continue operando normalmente — os dados serão sincronizados assim que a conexão for restabelecida.",
    },
    {
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        question: "Peça entregue, mas não chegou ao posto?",
        answer:
            "Use o botão de 'Divergência' na tela de confirmação de entrega. Isso notifica a logística imediatamente para revisão e novo atendimento.",
    },
];

const FaqCard = ({ item, index }: { item: FaqItem; index: number }) => {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        >
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex-shrink-0 p-2 bg-amber-50 rounded-xl border border-amber-100">
                    {item.icon}
                </div>
                <span className="flex-1 text-sm md:text-base font-bold text-gray-800 leading-snug">
                    {item.question}
                </span>
                {open ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed pt-3">{item.answer}</p>
                </div>
            )}
        </motion.div>
    );
};

const StepItem = ({
    number,
    icon,
    title,
    children,
    delay = 0,
}: {
    number: number;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex gap-4"
    >
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#001E50] text-white flex items-center justify-center font-black text-base">
                {number}
            </div>
            <div className="flex-1 w-0.5 bg-gray-200 min-h-[20px]" />
        </div>
        <div className="pb-6 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-[#001E50]/10 rounded-lg text-[#001E50]">{icon}</div>
                <h3 className="font-black text-gray-900 text-base md:text-lg leading-tight">{title}</h3>
            </div>
            <div className="text-sm md:text-base text-gray-600 leading-relaxed space-y-1.5">
                {children}
            </div>
        </div>
    </motion.div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-2">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#001E50]/40 flex-shrink-0" />
        <span>{children}</span>
    </div>
);

const Ajuda = () => {
    const [activeSection, setActiveSection] = useState<Section>("operador");
    const navigate = useNavigate();

    const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
        { id: "operador", label: "Operador", icon: <HardHat className="h-4 w-4" /> },
        { id: "logistica", label: "Logística", icon: <Package className="h-4 w-4" /> },
        { id: "faq", label: "FAQ", icon: <Wrench className="h-4 w-4" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#001E50] selection:text-white">
            {/* ── STICKY HEADER ── */}
            <header className="sticky top-0 z-30 bg-[#001E50] shadow-lg">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
                        aria-label="Voltar para Home"
                    >
                        <ArrowLeft className="h-5 w-5 text-white" />
                    </button>
                    <div>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">
                            SmartAndon VW · Volkswagen Taubaté
                        </p>
                        <h1 className="text-lg md:text-xl font-black text-white leading-tight">
                            Central de Ajuda
                        </h1>
                    </div>
                </div>

                {/* Tab Nav */}
                <div className="max-w-3xl mx-auto px-4 pb-3">
                    <div className="flex bg-white/10 rounded-2xl p-1 gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeSection === item.id
                                        ? "bg-white text-[#001E50] shadow-sm"
                                        : "text-white/70 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6 pb-16">
                {/* ── OPERADOR ── */}
                {activeSection === "operador" && (
                    <motion.div
                        key="operador"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Hero Banner */}
                        <div className="bg-[#001E50] rounded-2xl p-5 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/15 rounded-xl flex-shrink-0">
                                <HardHat className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black leading-tight">
                                    👷 Painel do Operador
                                </h2>
                                <p className="text-white/70 text-sm mt-0.5">Linha de Montagem · Célula de Vidros</p>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
                            <StepItem number={1} icon={<Smartphone className="h-4 w-4" />} title="Início e Identificação" delay={0.05}>
                                <Bullet>Na tela inicial, toque no botão <strong className="text-gray-800">"Operador"</strong>.</Bullet>
                                <Bullet>O sistema solicitará a identificação da sua estação de trabalho.</Bullet>
                            </StepItem>

                            <StepItem number={2} icon={<Layers className="h-4 w-4" />} title="Configuração de Tacto e Lado (Poka-Yoke)" delay={0.1}>
                                <Bullet><strong className="text-gray-800">Selecionar Lado:</strong> Escolha entre <strong className="text-gray-800">LE</strong> (Lado Esquerdo) ou <strong className="text-gray-800">LD</strong> (Lado Direito).</Bullet>
                                <Bullet><strong className="text-gray-800">Digitar Tacto:</strong> Use o teclado numérico para inserir os 3 dígitos do seu posto (ex: <code className="bg-gray-100 px-1 rounded">001</code>, <code className="bg-gray-100 px-1 rounded">085</code>).</Bullet>
                                <Bullet><strong className="text-gray-800">Validação:</strong> O botão CONFIRMAR só ficará ativo após o preenchimento correto dos 3 dígitos.</Bullet>
                            </StepItem>

                            <StepItem number={3} icon={<ClipboardList className="h-4 w-4" />} title="Solicitação de Peças (Catálogo Digital)" delay={0.15}>
                                <Bullet>Após confirmar, o sistema filtrará automaticamente o catálogo.</Bullet>
                                <Bullet><strong className="text-gray-800">Visualização:</strong> Você verá apenas os cards das peças vinculadas ao seu Tacto e Lado. Confira a cor do card e o código da peça.</Bullet>
                                <Bullet><strong className="text-gray-800">Envio:</strong> Toque na peça desejada. Um checkmark verde confirmará o envio do chamado para a Logística.</Bullet>
                            </StepItem>

                            <StepItem number={4} icon={<PackageCheck className="h-4 w-4" />} title="Double Check (Confirmação de Entrega)" delay={0.2}>
                                <Bullet>Assim que a logística realizar a entrega física, um painel de confirmação aparecerá na sua tela.</Bullet>
                                <Bullet>Toque em <strong className="text-gray-800">CONFIRMAR RECEBIMENTO</strong>. Este passo é obrigatório para fechar o ciclo e garantir que o material está no posto.</Bullet>
                            </StepItem>
                        </div>

                        {/* Tip Alert */}
                        <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 items-start">
                            <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-black text-yellow-800 text-sm">💡 Dica de Ouro</p>
                                <p className="text-yellow-700 text-sm mt-1 leading-relaxed">
                                    Se o sistema indicar <em>"Peça não encontrada"</em>, toque em{" "}
                                    <strong>LIMPAR</strong> e verifique se o Tacto digitado corresponde ao seu posto
                                    atual.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── LOGÍSTICA ── */}
                {activeSection === "logistica" && (
                    <motion.div
                        key="logistica"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Hero Banner */}
                        <div className="bg-emerald-800 rounded-2xl p-5 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/15 rounded-xl flex-shrink-0">
                                <Package className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black leading-tight">
                                    📦 Painel de Logística
                                </h2>
                                <p className="text-white/70 text-sm mt-0.5">Abastecimento · Dashboard de Rastreamento</p>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
                            <StepItem number={1} icon={<LogIn className="h-4 w-4" />} title="Acesso e Segurança" delay={0.05}>
                                <Bullet>Toque em <strong className="text-gray-800">"Logística"</strong> na tela inicial.</Bullet>
                                <Bullet>É necessário realizar o <strong className="text-gray-800">Login</strong> com suas credenciais para acessar o Dashboard de rastreamento.</Bullet>
                            </StepItem>

                            <StepItem number={2} icon={<LayoutDashboard className="h-4 w-4" />} title="Gestão de Chamados" delay={0.1}>
                                <Bullet>No Dashboard, você verá a tabela de chamados ativos com as seguintes colunas:</Bullet>
                                <div className="ml-3 mt-2 flex flex-col gap-2">
                                    {[
                                        ["Tacto / Lado", "Localização exata da entrega"],
                                        ["Código CC / Nome da Peça", "Identificação técnica do material"],
                                        ["Horário", "Tempo decorrido desde a solicitação"],
                                        ["Status", "Acompanhe se o pedido está Aberto, Em transporte ou Entregue"],
                                    ].map(([label, desc]) => (
                                        <div key={label} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold text-gray-800 text-sm">{label}:</span>{" "}
                                                <span className="text-gray-600 text-sm">{desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </StepItem>
                        </div>

                        {/* Info Alert */}
                        <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 items-start">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-black text-blue-800 text-sm">Ciclo de Atendimento</p>
                                <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                                    Ao clicar em <strong>"Confirmar"</strong> no card de chamado, o status muda para{" "}
                                    <em>"Entregue"</em>. A confirmação final é feita pelo Operador na linha de montagem,
                                    encerrando o ciclo completo.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── FAQ ── */}
                {activeSection === "faq" && (
                    <motion.div
                        key="faq"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-4"
                    >
                        {/* Hero Banner */}
                        <div className="bg-gray-800 rounded-2xl p-5 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/15 rounded-xl flex-shrink-0">
                                <Wrench className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black leading-tight">
                                    🛠️ Solução de Problemas
                                </h2>
                                <p className="text-white/70 text-sm mt-0.5">Toque na pergunta para ver a resposta</p>
                            </div>
                        </div>

                        {faqItems.map((item, i) => (
                            <FaqCard key={i} item={item} index={i} />
                        ))}

                        {/* Emergency Alert */}
                        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 items-start mt-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-black text-red-800 text-sm">Problema não listado aqui?</p>
                                <p className="text-red-700 text-sm mt-1 leading-relaxed">
                                    Entre em contato com a <strong>Equipe de Melhoria de Processos · VW Taubaté</strong> para suporte imediato.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400 font-medium">
                        Equipe de Melhoria de Processos · Volkswagen Taubaté
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">Versão 2.0 · Março 2026</p>
                </div>
            </main>
        </div>
    );
};

export default Ajuda;
