import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dpa')({
  component: Dpa,
})

function Dpa() {
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
              Acordo de Tratamento de Dados
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-sm  mb-10">
          Versão 1.0 — última atualização em 12/09/2026 — nos termos do artigo
          28.º do RGPD
        </p>

        <div className="prose prose-neutral max-w-none prose-headings:font-heading text-foreground">
          <p>
            O presente Acordo de Tratamento de Dados (&ldquo;DPA&rdquo;)
            aplica-se a qualquer Cliente (terapeuta ou clínica) que crie uma
            conta na plataforma TheraBase e aceite este documento no momento do
            registo, e regula o tratamento de dados pessoais de pacientes
            efetuado pela TheraBase por conta desse Cliente, enquanto
            responsável pelo tratamento, no âmbito da utilização da plataforma
            TheraBase. Este DPA é parte integrante dos Termos de Serviço aceites
            pelo Cliente.
          </p>
          <p>
            A plataforma TheraBase (&ldquo;Subcontratante&rdquo;,
            &ldquo;TheraBase&rdquo;, &ldquo;nós&rdquo;) é operada por Rafael
            Carvalho, titular do NIF 252675061.
          </p>

          <h2>1. Objeto</h2>
          <p>
            O presente DPA regula o tratamento de dados pessoais efetuado pela
            TheraBase, enquanto subcontratante, por conta e segundo instruções
            do Cliente, enquanto responsável pelo tratamento, no contexto do
            fornecimento e alojamento da plataforma TheraBase para gestão da
            atividade clínica do Cliente.
          </p>

          <h2>2. Duração</h2>
          <p>
            Este DPA vigora enquanto durar o contrato de prestação do Serviço
            entre as Partes (Termos de Serviço) e, após a sua cessação, pelo
            período estritamente necessário à exportação e/ou eliminação dos
            dados nos termos da secção 12.
          </p>

          <h2>3. Natureza e finalidade do tratamento</h2>
          <p>
            A TheraBase trata os dados pessoais para os seguintes efeitos, no
            âmbito da prestação do Serviço: armazenamento, organização, consulta
            e atualização de processos clínicos; agendamento de consultas;
            gestão de dados de identificação e contacto de pacientes; suporte
            técnico autorizado pelo Cliente; e execução de cópias de segurança
            (backups) dos dados.
          </p>

          <h2>4. Categorias de titulares dos dados</h2>
          <ul>
            <li>Pacientes do Cliente;</li>
            <li>
              Representantes legais de pacientes menores ou incapazes, quando
              aplicável;
            </li>
            <li>
              Utilizadores da conta do Cliente (o próprio terapeuta e, se
              aplicável, colaboradores autorizados).
            </li>
          </ul>

          <h2>5. Categorias de dados tratados</h2>
          <ul>
            <li>Dados de identificação: nome, data de nascimento;</li>
            <li>
              Dados de processo clínico: diagnóstico terapêutico, diagnóstico
              clínico, notas de consulta;
            </li>
            <li>
              Dados de agendamento: datas, horários, estado das consultas;
            </li>
            <li>
              Dados de vinculação clínica/administrativa: clínica associada,
              número de processo, entidade.
            </li>
          </ul>
          <p>
            Estes dados incluem categorias especiais de dados nos termos do
            artigo 9.º do RGPD (dados de saúde), pelo que estão sujeitos a
            salvaguardas reforçadas, incluindo cifra em repouso dos campos de
            diagnóstico e notas clínicas.
          </p>

          <h2>6. Instruções do Responsável</h2>
          <p>
            A TheraBase apenas trata os dados pessoais mediante instruções
            documentadas do Cliente, incluindo no que respeita a transferências
            para países terceiros, salvo obrigação legal em contrário aplicável
            à TheraBase, caso em que esta informará o Cliente dessa obrigação
            antes do tratamento, exceto se a lei proibir essa informação por
            motivos importantes de interesse público.
          </p>
          <p>
            Constituem instruções documentadas, para este efeito, a utilização
            normal das funcionalidades da plataforma pelo Cliente, bem como
            quaisquer instruções adicionais comunicadas por escrito através dos
            canais de suporte.
          </p>
          <p>
            Caso a TheraBase considere que uma instrução do Cliente viola o RGPD
            ou outras disposições de proteção de dados, informará o Cliente de
            imediato.
          </p>

          <h2>7. Confidencialidade</h2>
          <p>
            A TheraBase garante que as pessoas autorizadas a tratar os dados
            pessoais se comprometeram a observar confidencialidade ou estão
            sujeitas a adequada obrigação legal de confidencialidade, e que o
            acesso aos dados é limitado ao estritamente necessário para a
            prestação do Serviço e do suporte solicitado.
          </p>

          <h2>8. Medidas técnicas e organizativas de segurança</h2>
          <p>
            A TheraBase aplica, no mínimo, as seguintes medidas, adequadas ao
            risco:
          </p>
          <ul>
            <li>
              Cifra de dados sensíveis em repouso (campos de diagnóstico
              clínico/terapêutico e notas de consulta), com gestão de chave de
              cifra restrita;
            </li>
            <li>
              Controlo de acesso por autenticação individual, com segregação dos
              dados de cada terapeuta;
            </li>
            <li>
              Registo de auditoria (audit log) das operações de criação,
              alteração e eliminação sobre dados de pacientes;
            </li>
            <li>
              Encriptação em trânsito (TLS) em todas as comunicações com a
              plataforma;
            </li>
            <li>
              Cópias de segurança periódicas geridas pelo fornecedor de base de
              dados (Supabase);
            </li>
            <li>
              Processo de aprovação de novas contas de terapeuta antes de acesso
              a dados de pacientes;
            </li>
            <li>
              Revisão periódica destas medidas à luz da evolução do risco e do
              estado da técnica.
            </li>
          </ul>

          <h2>9. Subcontratantes subsequentes</h2>
          <p>
            O Cliente autoriza, de forma geral, a TheraBase a recorrer aos
            seguintes subcontratantes subsequentes para a prestação do Serviço:
          </p>
          <ul>
            <li>
              Supabase (base de dados e infraestrutura) — região UE (Irlanda);
            </li>
            <li>
              Vercel Inc. (alojamento e execução da aplicação) — sediada nos
              EUA, ao abrigo do respetivo Data Processing Addendum e Cláusulas
              Contratuais-Tipo.
            </li>
          </ul>
          <p>
            A TheraBase informará o Cliente de qualquer alteração pretendida
            quanto à adição ou substituição de subcontratantes subsequentes, com
            antecedência razoável, dando ao Cliente a oportunidade de a ela se
            opor por motivo fundamentado relacionado com a proteção de dados. A
            TheraBase impõe a estes subcontratantes obrigações de proteção de
            dados equivalentes às previstas neste DPA.
          </p>

          <h2>10. Transferências internacionais</h2>
          <p>
            Sempre que o tratamento envolva transferência de dados para fora do
            Espaço Económico Europeu, a TheraBase assegura a existência de um
            mecanismo de transferência válido nos termos do RGPD (decisão de
            adequação ou Cláusulas Contratuais-Tipo), e informa o Cliente sobre
            tal transferência mediante pedido.
          </p>

          <h2>11. Assistência ao Responsável</h2>
          <h3>11.1 Pedidos de titulares de dados</h3>
          <p>
            Tendo em conta a natureza do tratamento, a TheraBase presta
            assistência técnica razoável ao Cliente, através de meios técnicos e
            organizativos adequados, para o cumprimento da obrigação do Cliente
            de responder a pedidos de exercício de direitos dos titulares
            (acesso, retificação, apagamento, limitação, portabilidade e
            oposição).
          </p>
          <h3>11.2 Incidentes de segurança</h3>
          <p>
            A TheraBase notifica o Cliente sem demora injustificada após ter
            conhecimento de uma violação de dados pessoais que afete dados
            tratados ao abrigo deste DPA, fornecendo a informação razoavelmente
            disponível para permitir ao Cliente cumprir as suas próprias
            obrigações de notificação, incluindo à CNPD e aos titulares, quando
            aplicável.
          </p>
          <h3>11.3 Auditoria e informação</h3>
          <p>
            A TheraBase disponibiliza ao Cliente a informação razoavelmente
            necessária para demonstrar o cumprimento das obrigações previstas
            neste DPA e permite e contribui para auditorias, incluindo
            inspeções, realizadas pelo Cliente ou por auditor por si mandatado,
            mediante aviso prévio razoável e em condições que não comprometam a
            segurança de outros Clientes.
          </p>

          <h2>12. Fim do contrato — exportação e eliminação</h2>
          <p>
            Após a cessação do contrato, e a pedido do Cliente formulado dentro
            do prazo previsto nos Termos de Serviço, a TheraBase disponibiliza
            os dados do Cliente para exportação num formato estruturado.
          </p>
          <p>
            Decorrido esse prazo, ou na ausência de pedido de exportação, a
            TheraBase elimina ou anonimiza os dados pessoais tratados ao abrigo
            deste DPA no prazo de 2 anos após o encerramento da conta, exceto na
            medida em que a legislação aplicável exija a sua conservação, caso
            em que os dados serão isolados de qualquer outro tratamento e
            conservados apenas para esse efeito legal.
          </p>

          <h2>13. Responsabilidade</h2>
          <p>
            Cada Parte é responsável pelo cumprimento das obrigações que lhe
            incumbem nos termos do RGPD e deste DPA, nos termos e limites da lei
            aplicável.
          </p>

          <h2>14. Aceitação</h2>
          <p>
            O presente DPA é aceite eletronicamente pelo Cliente no momento do
            registo na plataforma TheraBase, ficando registada a versão do
            documento aceite, bem como a data e hora da aceitação, nos sistemas
            da TheraBase.
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="underline hover:text-foreground">
            Política de Privacidade
          </Link>
          <Link to="/terms" className="underline hover:text-foreground">
            Termos de Serviço
          </Link>
        </div>
      </main>
    </div>
  )
}
