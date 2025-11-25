# FxSorteios

Sistema de sorteios ponderados para a Farmix Distribuidora.

## Descrição

FxSorteios é uma aplicação para realização de sorteios com pesos personalizados, desenvolvida para promoções da Farmix. Permite carregar listas de participantes via arquivo Excel e realizar sorteios justos baseados em pesos atribuídos a cada participante.

## Funcionalidades

- **Carregamento de Participantes**: Upload de arquivos Excel (.xlsx) com códigos, nomes e pesos dos participantes.
- **Sorteio Ponderado**: Algoritmo de sorteio baseado em pesos, garantindo justiça proporcional.
- **Interface Web Moderna**: Aplicação React com design responsivo em tema laranja e preto.
- **Animação de Sorteio**: Efeito visual durante o sorteio com confetes no anúncio do vencedor.
- **Histórico de Sorteios**: Registro de todos os sorteios realizados na sessão.
- **Prevenção de Re-sorteio**: Participantes já sorteados não são incluídos em novos sorteios na mesma sessão.
- **Versões Desktop**: Scripts Python com interfaces gráficas usando Tkinter e CustomTkinter.

## Estrutura do Projeto

- `App.tsx`: Componente principal da aplicação web.
- `components/FileUpload.tsx`: Componente para upload de arquivos Excel.
- `components/RaffleScreen.tsx`: Tela principal de realização dos sorteios.
- `utils/excelParser.ts`: Utilitário para processamento de arquivos Excel.
- `GUI/sorteio.py`: Versão desktop básica com Tkinter.
- `GUI/sorteio2.py`: Versão desktop avançada com CustomTkinter e animações.

## Formato do Arquivo Excel

O arquivo Excel deve conter pelo menos 3 colunas:

- **Coluna A**: Código do participante (string/texto)
- **Coluna B**: Nome do participante (string/texto)
- **Coluna C**: Peso do participante (número, peso para o sorteio)

Exemplo:

| Código | Nome          | Cupons |
|--------|---------------|------|
| 001    | João Silva    | 10   |
| 002    | Maria Santos  | 5    |
| 003    | Pedro Costa   | 8    |

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (via classes inline)
- **Excel Processing**: ExcelJS, xlsx
- **UI Components**: Lucide React, React Confetti
- **Desktop GUI**: Python, Tkinter, CustomTkinter, Pandas

## Instalação e Execução

### Aplicação Web

1. **Pré-requisitos**: Node.js (versão 16 ou superior)

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Executar em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Build para produção**:
   ```bash
   npm run build
   ```

5. **Preview da build**:
   ```bash
   npm run preview
   ```

### Versões Desktop (Python)

1. **Pré-requisitos**: Python 3.x, Pandas, Tkinter (incluído no Python), CustomTkinter

2. **Instalar dependências**:
   ```bash
   pip install pandas customtkinter
   ```

3. **Executar versão básica**:
   ```bash
   python GUI/sorteio.py
   ```

4. **Executar versão avançada**:
   ```bash
   python GUI/sorteio2.py
   ```

## Como Usar

1. Abra a aplicação (web ou desktop).
2. Clique em "Carregar Cupons" e selecione um arquivo Excel válido.
3. Aguarde o processamento dos dados.
4. Clique em "SORTEAR AGORA" para iniciar o sorteio.
5. Observe a animação e aguarde o anúncio do vencedor.
6. O histórico é mantido na sessão atual.

## Algoritmo de Sorteio

O sorteio utiliza um algoritmo de seleção aleatória ponderada:

- Cada participante tem uma chance proporcional ao seu peso.
- A soma dos pesos determina o espaço total de seleção.
- Um número aleatório é gerado e mapeado para o participante correspondente.
- Participantes já sorteados são excluídos de sorteios subsequentes na mesma sessão.

## Desenvolvimento

Para contribuir ou modificar:

1. Clone o repositório.
2. Instale as dependências.
3. Faça suas modificações.
4. Teste localmente.
5. Submeta um pull request.

## Licença

Samgae Tecnologia LTDA.

## Contato

José Lucas Costa - joselucasgc@gmail.com
