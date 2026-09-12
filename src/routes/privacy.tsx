import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-3">
          <Link to="/">
            <img
              alt="TheraBase"
              className="h-10 w-10"
              src="/DB_Logo_Round.png"
            />
          </Link>
          <div>
            <p className="font-heading text-lg leading-tight">TheraBase</p>
            <p className="text-sm text-muted-foreground leading-tight">
              Política de Privacidade
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-sm  mb-10">
          Versão 1.0 — última atualização em 12/09/2026
        </p>

        <div className="prose prose-neutral max-w-none prose-headings:font-heading text-foreground">
          <p className="italic text-muted-foreground">
            Este documento aplica-se a terapeutas/utilizadores que criam conta
            na plataforma TheraBase, a pessoas que pedem demonstração ou
            suporte, e a visitantes do site. Não substitui o aviso de
            privacidade que o terapeuta/clínica deve fornecer aos seus próprios
            pacientes — esse é um documento separado, da responsabilidade do
            terapeuta.
          </p>

          <h2>1. Quem somos</h2>
          <p>
            A TheraBase (&ldquo;nós&rdquo;, &ldquo;a plataforma&rdquo;) é
            operada por Rafael Carvalho, 252675061.
          </p>
          <p>Contacto geral: raffacarvalho2000@gmail.com</p>
          <p>Contacto de privacidade: raffacarvalho2000@gmail.com</p>
          <p>
            Nesta fase não existe a obrigação de nomear um Encarregado de
            Proteção de Dados (DPO) formal, mas o contacto de privacidade acima
            desempenha essa função de ponto de contacto. Caso a atividade cresça
            de forma a exigir um DPO nos termos do artigo 37.º do RGPD, esta
            política será atualizada.
          </p>

          <h2>2. A quem se aplica esta política</h2>
          <p>Esta política aplica-se aos dados pessoais de:</p>
          <ul>
            <li>
              Terapeutas e administradores de clínica que criam e utilizam uma
              conta na TheraBase;
            </li>
            <li>
              Pessoas que contactam a TheraBase para pedir uma demonstração,
              suporte técnico ou informação comercial;
            </li>
            <li>Visitantes do site público da TheraBase.</li>
          </ul>
          <p>
            Não se aplica aos dados dos pacientes inseridos pelos terapeutas na
            plataforma. Em relação a esses dados, a TheraBase atua como
            subcontratante do terapeuta/clínica (o responsável pelo tratamento),
            nos termos do Acordo de Tratamento de Dados (DPA) celebrado com cada
            cliente. Os pacientes devem procurar informação sobre o tratamento
            dos seus dados junto do seu terapeuta/clínica.
          </p>

          <h2>3. Que dados recolhemos</h2>
          <h3>3.1 Dados da conta do terapeuta</h3>
          <ul>
            <li>
              Nome completo e dados de identificação profissional (conforme
              fornecidos no registo);
            </li>
            <li>
              Email e credenciais de acesso (palavra-passe armazenada de forma
              cifrada/hashed);
            </li>
            <li>Dados de faturação, quando aplicável;</li>
            <li>
              Registo de aceitação dos Termos de Serviço e do DPA (versão e
              data/hora).
            </li>
          </ul>
          <h3>3.2 Dados de suporte e comunicação</h3>
          <ul>
            <li>Conteúdo de emails ou mensagens trocadas com o suporte;</li>
            <li>
              Dados fornecidos em formulários de contacto ou pedido de
              demonstração.
            </li>
          </ul>
          <h3>3.3 Dados técnicos e de segurança</h3>
          <ul>
            <li>
              Registos de acesso (logs), incluindo endereço IP, data/hora e tipo
              de ação;
            </li>
            <li>
              Informação do dispositivo e navegador, na medida do necessário
              para segurança e resolução de problemas;
            </li>
            <li>
              Cookies estritamente necessários ao funcionamento da plataforma
              (ver secção 9).
            </li>
          </ul>

          <h2>4. Finalidades e bases legais</h2>
          <ul>
            <li>
              Criar e gerir a conta do terapeuta — execução de contrato (Termos
              de Serviço);
            </li>
            <li>
              Prestar o serviço contratado (acesso à plataforma, funcionalidades
              de gestão clínica) — execução de contrato;
            </li>
            <li>
              Prestar suporte técnico — execução de contrato / interesse
              legítimo em responder a pedidos;
            </li>
            <li>
              Garantir a segurança da plataforma, prevenir fraude e uso indevido
              — interesse legítimo;
            </li>
            <li>
              Faturação e cumprimento de obrigações fiscais — obrigação legal;
            </li>
            <li>
              Comunicações sobre alterações ao serviço, termos ou incidentes de
              segurança — execução de contrato / obrigação legal;
            </li>
            <li>
              Comunicações comerciais ou de marketing, quando aplicável — apenas
              com consentimento prévio, revogável a qualquer momento.
            </li>
          </ul>

          <h2>5. Com quem partilhamos dados</h2>
          <p>
            Recorremos aos seguintes tipos de fornecedores para operar a
            plataforma. Só estão aqui listados os que efetivamente utilizamos —
            esta lista deve ser mantida atualizada:
          </p>
          <ul>
            <li>
              Alojamento de base de dados e infraestrutura: Supabase — West EU
              (Ireland) — atua como subcontratante subsequente;
            </li>
            <li>Vercel</li>
          </ul>
          <p>
            Não vendemos nem alugamos dados pessoais a terceiros para fins de
            marketing. Os dados só são partilhados com estes fornecedores na
            medida do necessário para operar o serviço, ao abrigo de contratos
            que impõem obrigações de confidencialidade e segurança equivalentes
            às aqui descritas.
          </p>

          <h2>6. Transferências internacionais</h2>
          <p>
            Os dados alojados na base de dados (Supabase, região UE-Irlanda)
            permanecem dentro do Espaço Económico Europeu. O alojamento da
            aplicação é feito através da Vercel Inc., sediada nos EUA; nas
            transferências de dados associadas a este serviço aplicam-se as
            Cláusulas Contratuais-Tipo da Comissão Europeia, ao abrigo do Data
            Processing Addendum da Vercel.
          </p>

          <h2>7. Prazos de conservação</h2>
          <ul>
            <li>
              Dados da conta do terapeuta: enquanto a conta estiver ativa, e por
              2 anos após o encerramento, findo o qual são eliminados ou
              anonimizados;
            </li>
            <li>
              Dados de faturação: pelo prazo legal aplicável em Portugal (regra
              geral, 10 anos, nos termos da legislação fiscal e comercial);
            </li>
            <li>Registos de suporte: 24 meses após o último contacto;</li>
            <li>Logs técnicos de segurança: 6 a 12 meses.</li>
          </ul>

          <h2>8. Os seus direitos</h2>
          <p>
            Nos termos do RGPD, tem direito a aceder aos seus dados,
            retificá-los, solicitar o seu apagamento ou a limitação do
            tratamento, opor-se a determinados tratamentos e à portabilidade dos
            dados, nos termos e limites previstos na lei.
          </p>
          <p>
            Para exercer estes direitos, contacte-nos através de
            raffacarvalho2000@gmail.com. Responderemos no prazo legalmente
            previsto, após confirmação da sua identidade.
          </p>
          <p>
            Tem também o direito de apresentar reclamação junto da Comissão
            Nacional de Proteção de Dados (CNPD) —{' '}
            <a href="https://www.cnpd.pt" target="_blank" rel="noreferrer">
              www.cnpd.pt
            </a>{' '}
            — caso considere que o tratamento dos seus dados viola o RGPD.
          </p>

          <h2>9. Cookies</h2>
          <p>
            Utilizamos apenas o cookie estritamente necessário para manter a sua
            sessão de autenticação. Não utilizamos cookies de terceiros,
            analytics ou publicidade.
          </p>

          <h2>10. Segurança</h2>
          <p>
            Aplicamos medidas técnicas e organizativas adequadas ao risco,
            incluindo cifra de dados sensíveis em repouso, controlo de acessos
            por utilizador, registo de auditoria das operações sobre dados e
            boas práticas de gestão de credenciais. Estas medidas são revistas
            periodicamente à luz da evolução tecnológica e dos riscos
            identificados.
          </p>
          <p>
            Não garantimos segurança absoluta — nenhum sistema o é — mas
            comprometemo-nos a agir com diligência na prevenção, deteção e
            resposta a incidentes, incluindo a notificação das autoridades e dos
            clientes afetados nos casos e prazos legalmente exigidos.
          </p>

          <h2>11. Alterações a esta política</h2>
          <p>
            Podemos atualizar esta política para refletir alterações ao serviço
            ou à legislação aplicável. A data da última atualização é indicada
            no topo do documento. Alterações materiais serão comunicadas aos
            terapeutas registados.
          </p>

          <h2>12. Contactos</h2>
          <p>
            Para qualquer questão sobre esta política ou sobre o tratamento dos
            seus dados pessoais: raffacarvalho2000@gmail.com.
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="underline hover:text-foreground">
            Termos de Serviço
          </Link>
          <Link to="/dpa" className="underline hover:text-foreground">
            Acordo de Tratamento de Dados
          </Link>
        </div>
      </main>
    </div>
  )
}
