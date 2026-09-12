import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: Terms,
})

function Terms() {
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
              Termos de Serviço
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-sm  mb-10">
          Versão 1.0 — última atualização em 12/09/2026
        </p>

        <div className="prose prose-neutral max-w-none prose-headings:font-heading text-foreground">
          <h2>1. Objeto</h2>
          <p>
            Os presentes Termos de Serviço (&ldquo;Termos&rdquo;) regulam o
            acesso e utilização da plataforma TheraBase (&ldquo;Serviço&rdquo;),
            um software de gestão para terapeutas que inclui, entre outras
            funcionalidades, gestão de pacientes, agenda, marcação de consultas
            e registo de processo clínico.
          </p>
          <p>
            O Serviço é disponibilizado por Rafael Carvalho, 252675061 (&ldquo;TheraBase&rdquo;, &ldquo;nós&rdquo;). Ao
            criar uma conta, o terapeuta ou clínica (&ldquo;Cliente&rdquo;,
            &ldquo;Utilizador&rdquo;) aceita estes Termos.
          </p>
          <p>
            O Serviço encontra-se atualmente em fase experimental (beta). Isto
            significa que funcionalidades, disponibilidade e requisitos podem
            mudar com regularidade, e que nem todos os processos habituais de um
            produto maduro (ex. suporte 24/7, garantias de disponibilidade) se
            aplicam ainda nesta fase. Esta secção será atualizada quando o
            Serviço sair de fase experimental.
          </p>

          <h2>2. Definições</h2>
          <ul>
            <li>
              &ldquo;Cliente&rdquo; / &ldquo;Utilizador&rdquo;: o terapeuta ou
              profissional que cria e utiliza uma conta na plataforma;
            </li>
            <li>
              &ldquo;Paciente&rdquo;: pessoa cujos dados são inseridos pelo
              Cliente na plataforma, no âmbito da prestação de cuidados;
            </li>
            <li>
              &ldquo;Dados do Cliente&rdquo;: todos os dados inseridos ou
              gerados pelo Cliente na plataforma, incluindo dados de pacientes;
            </li>
            <li>
              &ldquo;DPA&rdquo;: o Acordo de Tratamento de Dados celebrado entre
              o Cliente e a TheraBase, parte integrante destes Termos.
            </li>
          </ul>

          <h2>3. Elegibilidade e criação de conta</h2>
          <p>
            O Serviço destina-se a profissionais habilitados a prestar os
            cuidados/serviços que pretendem gerir na plataforma. O Cliente
            garante que as informações fornecidas no registo são verdadeiras e
            mantidas atualizadas.
          </p>
          <p>
            O registo pode estar sujeito a aprovação prévia por parte da
            TheraBase antes de o Cliente ter acesso pleno às funcionalidades
            relacionadas com dados de pacientes.
          </p>
          <p>
            O acesso à plataforma para introdução de dados de pacientes só é
            disponibilizado após aceitação expressa destes Termos e do DPA, com
            registo de versão e data/hora da aceitação.
          </p>

          <h2>4. Conta e credenciais</h2>
          <ul>
            <li>
              O Cliente é responsável por manter as suas credenciais de acesso
              confidenciais e por todas as ações realizadas através da sua
              conta;
            </li>
            <li>
              A conta é pessoal e intransmissível — não deve ser partilhada com
              terceiros;
            </li>
            <li>
              O Cliente deve notificar a TheraBase imediatamente em caso de
              suspeita de acesso não autorizado à sua conta, através de [A
              PREENCHER: email de suporte/segurança].
            </li>
          </ul>

          <h2>5. Obrigações do Cliente</h2>
          <p>
            O Cliente, enquanto responsável pelo tratamento dos dados dos seus
            pacientes, obriga-se a:
          </p>
          <ul>
            <li>
              Ter fundamento legítimo para introduzir dados de pacientes na
              plataforma, incluindo, quando aplicável, ter prestado ao paciente
              ou ao seu representante legal a informação de privacidade
              adequada;
            </li>
            <li>
              Utilizar o Serviço apenas para as finalidades para que foi
              disponibilizado e em conformidade com a lei aplicável, incluindo o
              RGPD e as regras profissionais/deontológicas a que esteja sujeito;
            </li>
            <li>
              Não carregar dados de pacientes sem base legal ou autorização
              adequada;
            </li>
            <li>
              Gerir diretamente os consentimentos e avisos de privacidade que
              sejam devidos aos seus pacientes — esta responsabilidade não é
              transferida para a TheraBase;
            </li>
            <li>
              Informar a TheraBase de qualquer incidente de segurança de que
              tenha conhecimento relacionado com a sua conta ou com os dados
              nela inseridos.
            </li>
          </ul>

          <h2>6. Papel da TheraBase (RGPD)</h2>
          <p>
            Em relação aos dados de identificação e conta do próprio Cliente
            (terapeuta), a TheraBase atua como responsável pelo tratamento, nos
            termos descritos na Política de Privacidade.
          </p>
          <p>
            Em relação aos dados de pacientes inseridos pelo Cliente, a
            TheraBase atua como subcontratante (art. 28.º do RGPD), processando
            esses dados apenas de acordo com as instruções documentadas do
            Cliente e nos termos do DPA, que é parte integrante destes Termos e
            prevalece, no que respeita ao tratamento de dados de pacientes,
            sobre qualquer disposição em contrário.
          </p>
          <p>
            A TheraBase mantém deveres próprios de confidencialidade, segurança
            e gestão de subcontratantes subsequentes, conforme detalhado no DPA.
          </p>

          <h2>7. Disponibilidade, suporte e alterações ao Serviço</h2>
          <p>
            A TheraBase envida esforços razoáveis para manter o Serviço
            disponível e funcional, mas não garante disponibilidade
            ininterrupta. Poderão ocorrer períodos de manutenção, previamente
            comunicados sempre que possível.
          </p>
          <p>
            O suporte é prestado através de raffacarvalho2000@gmail.com.
          </p>
          <p>
            A TheraBase pode alterar ou descontinuar funcionalidades do Serviço,
            procurando minimizar o impacto para os Clientes e comunicando
            alterações materiais com antecedência razoável.
          </p>

          <h2>8. Propriedade intelectual</h2>
          <p>
            O software, marca, design e demais elementos da plataforma TheraBase
            são propriedade da TheraBase ou dos seus licenciadores. Estes Termos
            não conferem ao Cliente qualquer direito sobre o software, para além
            do direito de uso da plataforma nos termos aqui previstos.
          </p>
          <p>
            Os Dados do Cliente permanecem propriedade do Cliente. A TheraBase
            não reivindica direitos de propriedade sobre esses dados e trata-os
            apenas para prestar o Serviço, nos termos do DPA.
          </p>

          <h2>9. Preços e faturação</h2>
          <p>
            Nesta fase experimental, o Serviço é disponibilizado gratuitamente,
            sem qualquer custo para o Cliente. Caso o modelo venha a incluir
            custos no futuro, os Clientes existentes serão informados com
            antecedência razoável, e a continuação da utilização do Serviço após
            essa alteração ficará sujeita à aceitação dos novos termos.
          </p>

          <h2>10. Suspensão e cessação</h2>
          <ul>
            <li>
              A TheraBase pode suspender ou encerrar uma conta em caso de
              incumprimento destes Termos, uso indevido do Serviço, ou por
              incumprimento de obrigações de pagamento, mediante aviso prévio
              sempre que a situação o permita;
            </li>
            <li>
              O Cliente pode encerrar a sua conta a qualquer momento, através de
              [A PREENCHER: mecanismo/contacto];
            </li>
            <li>
              Em caso de cessação, aplica-se o regime de exportação e eliminação
              de dados previsto na secção seguinte e no DPA.
            </li>
          </ul>

          <h2>11. Exportação e devolução de dados no fim do contrato</h2>
          <p>
            No termo da relação contratual, o Cliente pode solicitar a
            exportação dos Dados do Cliente num formato estruturado, dentro do
            prazo de 30 dias após a cessação. Decorrido esse
            prazo, e sem prejuízo de obrigações legais de conservação, os dados
            serão eliminados ou anonimizados nos termos do DPA.
          </p>

          <h2>12. Limitação de responsabilidade</h2>
          <p>
           O Serviço é disponibilizado 'tal como está', em fase experimental e sem custos. 
           A TheraBase não garante disponibilidade ininterrupta nem ausência de erros, e não se 
           responsabiliza por perdas resultantes de indisponibilidade do Serviço, na medida máxima permitida por lei. 
           Esta cláusula será revista quando o Serviço deixar de ser gratuito/experimental.
          </p>

          <h2>13. Alterações aos Termos</h2>
          <p>
            Podemos atualizar estes Termos para refletir alterações ao Serviço
            ou à legislação aplicável. Alterações materiais serão comunicadas
            aos Clientes e poderá ser pedida nova aceitação expressa antes de o
            Cliente continuar a utilizar o Serviço.
          </p>

          <h2>14. Lei aplicável e foro</h2>
          <p>
            Estes Termos regem-se pela lei portuguesa. Para a resolução de
            qualquer litígio emergente destes Termos, é competente o foro de [A
            PREENCHER: comarca], com renúncia expressa a qualquer outro.
          </p>

          <h2>15. Contactos</h2>
          <p>
            Para questões sobre estes Termos: [A PREENCHER: email de contacto
            geral/suporte].
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="underline hover:text-foreground">
            Política de Privacidade
          </Link>
          <Link to="/dpa" className="underline hover:text-foreground">
            Acordo de Tratamento de Dados
          </Link>
        </div>
      </main>
    </div>
  )
}
