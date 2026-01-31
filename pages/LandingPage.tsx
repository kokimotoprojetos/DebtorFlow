
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-white dark:bg-background-dark overflow-x-hidden font-display">
      {/* Navegação */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 text-white">
              <span className="material-symbols-outlined text-2xl font-bold">account_balance_wallet</span>
            </div>
            <span className="text-xl font-black tracking-tight text-navy dark:text-white uppercase">DebtorFlow <span className="text-primary">Pro</span></span>
          </div>
          
          <div className="hidden md:flex gap-10 items-center">
            <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">Recursos</a>
            <a href="#stats" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">Resultados</a>
            <button 
              onClick={onStart} 
              className="bg-navy dark:bg-white text-white dark:text-navy px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
            >
              Acessar Plataforma
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Líder em Gestão Financeira
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-navy dark:text-white leading-[1.05] tracking-tighter">
              Pare de perder tempo com <br/>
              <span className="text-primary italic">planilhas lentas.</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              O DebtorFlow Pro é a maneira mais rápida e profissional de gerenciar devedores, automatizar cobranças e liquidar dívidas em segundos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onStart} 
                className="h-14 px-10 bg-primary hover:bg-primary-dark text-white text-base font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3"
              >
                Começar Gestão Agora
                <span className="material-symbols-outlined">trending_flat</span>
              </button>
              <div className="flex items-center gap-3 px-6 py-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} className="size-8 rounded-full border-2 border-white dark:border-navy" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-400">+500 empresas usam</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-emerald-accent/20 rounded-[2rem] blur-2xl group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-white dark:bg-surface-dark p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-[1.5rem] grayscale group-hover:grayscale-0 transition-all duration-700" 
                alt="Plataforma de Gestão" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-800 animate-bounce-slow">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Recuperação</p>
                <h4 className="text-2xl font-black text-emerald-accent">+34.2%</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-background-dark/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 flex flex-col items-center gap-4">
            <h2 className="text-3xl lg:text-4xl font-black text-navy dark:text-white tracking-tight">Construído para Velocidade</h2>
            <div className="h-1.5 w-20 bg-primary rounded-full"></div>
            <p className="text-gray-500 max-w-lg">Nossa interface foi desenhada para que você gaste menos tempo operando o sistema e mais tempo recebendo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Acerto em 3 Cliques",
                desc: "Selecione o devedor, escolha o método e pronto. Nunca foi tão fácil baixar uma dívida.",
                icon: "bolt",
                color: "text-amber-500"
              },
              {
                title: "Histórico Inviolável",
                desc: "Cada real adicionado ou pago é registrado com data e categoria para auditoria instantânea.",
                icon: "verified_user",
                color: "text-primary"
              },
              {
                title: "Dashboard em Tempo Real",
                desc: "Saiba exatamente quanto você tem a receber no mês com gráficos de tendência automáticos.",
                icon: "insights",
                color: "text-emerald-accent"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-surface-dark p-10 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all group">
                <div className={`size-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${f.color}`}>
                  <span className="material-symbols-outlined text-3xl font-bold">{f.icon}</span>
                </div>
                <h3 className="text-xl font-black text-navy dark:text-white mb-4">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section id="stats" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-navy rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 size-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col gap-2">
                <h5 className="text-5xl font-black tracking-tighter">R$ 4.2M</h5>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Recuperados este ano</p>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-5xl font-black tracking-tighter">98.4%</h5>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Satisfação dos Clientes</p>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-5xl font-black tracking-tighter">15k+</h5>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Devedores Gerenciados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white dark:bg-background-dark">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col gap-10">
          <h2 className="text-4xl lg:text-5xl font-black text-navy dark:text-white leading-tight">
            Pronto para profissionalizar sua gestão financeira?
          </h2>
          <p className="text-gray-500">Comece hoje mesmo e veja a diferença na velocidade dos seus recebimentos.</p>
          <button 
            onClick={onStart} 
            className="h-16 px-12 bg-navy dark:bg-white text-white dark:text-navy text-lg font-black rounded-2xl shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-4 self-center"
          >
            Acessar o DebtorFlow Pro
            <span className="material-symbols-outlined">rocket_launch</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <span className="text-sm font-black text-navy dark:text-white">DebtorFlow Pro</span>
          </div>
          <p className="text-gray-400 text-xs">© 2024 DebtorFlow S.A. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Termos</a>
            <a href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
