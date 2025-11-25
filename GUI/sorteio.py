import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
import random


class SorteioApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Sorteio de Clientes")
        self.root.geometry("600x450")

        # Definição de Cores
        self.cor_fundo = "#121212"  # Preto suave
        self.cor_laranja = "#FF6600"  # Laranja vibrante
        self.cor_texto = "#FFFFFF"   # Branco

        self.root.configure(bg=self.cor_fundo)

        # Variáveis
        self.df = None
        self.arquivo_carregado = False

        # --- Elementos da Interface ---

        # Título
        self.lbl_titulo = tk.Label(
            root,
            text="SORTEIO DAS MOTOS - FXBLACK",
            font=("Helvetica", 24, "bold"),
            bg=self.cor_fundo,
            fg=self.cor_laranja
        )
        self.lbl_titulo.pack(pady=30)

        # Botão Carregar Arquivo
        self.btn_carregar = tk.Button(
            root,
            text="📂 Carregar Cupons",
            font=("Arial", 12, "bold"),
            bg=self.cor_laranja,
            fg="black",
            width=25,
            command=self.carregar_arquivo,
            cursor="hand2",
            relief="flat"
        )
        self.btn_carregar.pack(pady=10)

        # Label para mostrar nome do arquivo
        self.lbl_arquivo = tk.Label(
            root,
            text="Nenhum arquivo carregado",
            font=("Arial", 10),
            bg=self.cor_fundo,
            fg="#888888"
        )
        self.lbl_arquivo.pack(pady=5)

        # Linha divisória
        tk.Frame(root, height=2, bg=self.cor_laranja, width=500).pack(pady=20)

        # Botão Realizar Sorteio
        self.btn_sortear = tk.Button(
            root,
            text="🎲 REALIZAR SORTEIO",
            font=("Arial", 16, "bold"),
            bg="#333333",  # Cinza escuro desabilitado inicialmente
            fg="#666666",
            width=20,
            state="disabled",
            command=self.realizar_sorteio,
            relief="flat"
        )
        self.btn_sortear.pack(pady=20)

        # Área do Resultado
        self.lbl_resultado_titulo = tk.Label(
            root,
            text="Vencedor:",
            font=("Arial", 12),
            bg=self.cor_fundo,
            fg=self.cor_texto
        )
        self.lbl_resultado_titulo.pack()

        self.lbl_vencedor = tk.Label(
            root,
            text="---",
            font=("Helvetica", 20, "bold"),
            bg=self.cor_fundo,
            fg=self.cor_laranja
        )
        self.lbl_vencedor.pack(pady=10)

    def carregar_arquivo(self):
        caminho_arquivo = filedialog.askopenfilename(
            title="Selecione o arquivo Excel",
            filetypes=[("Arquivos Excel", "*.xlsx")]
        )

        if caminho_arquivo:
            try:
                # Lê o arquivo Excel.
                # header=0 assume que a primeira linha é cabeçalho.
                self.df = pd.read_excel(caminho_arquivo)

                # Verifica se tem pelo menos 3 colunas
                if len(self.df.columns) < 3:
                    messagebox.showerror(
                        "Erro", "O arquivo precisa ter pelo menos 3 colunas (Código, Nome, Peso).")
                    return

                # Limpeza básica: Converte a coluna C (índice 2) para números, transformando erros em 0
                coluna_peso = self.df.columns[2]
                self.df[coluna_peso] = pd.to_numeric(
                    self.df.iloc[:, 2], errors='coerce').fillna(0)

                self.arquivo_carregado = True
                self.lbl_arquivo.config(
                    text=f"Arquivo carregado: ...{caminho_arquivo[-30:]}", fg="#00FF00")

                # Ativa o botão de sorteio com a cor laranja
                self.btn_sortear.config(
                    state="normal", bg=self.cor_laranja, fg="black", cursor="hand2")

                messagebox.showinfo(
                    "Sucesso", f"{len(self.df)} participantes carregados!")

            except Exception as e:
                messagebox.showerror("Erro", f"Falha ao ler arquivo: {str(e)}")

    def realizar_sorteio(self):
        if not self.arquivo_carregado or self.df is None:
            return

        try:
            # Pega os dados das colunas pelo índice (0=A, 1=B, 2=C)
            codigos = self.df.iloc[:, 0].tolist()
            nomes = self.df.iloc[:, 1].tolist()
            pesos = self.df.iloc[:, 2].tolist()

            # Verifica se a soma dos pesos é maior que 0
            if sum(pesos) <= 0:
                messagebox.showwarning(
                    "Atenção", "A soma dos pesos (coluna C) é zero. Verifique a planilha.")
                return

            # Realiza o sorteio ponderado
            # k=1 significa 1 vencedor
            indice_vencedor = random.choices(
                range(len(self.df)), weights=pesos, k=1)[0]

            vencedor_nome = nomes[indice_vencedor]
            vencedor_codigo = codigos[indice_vencedor]

            # Atualiza a interface
            self.lbl_vencedor.config(
                text=f"🎉 {vencedor_codigo} - {vencedor_nome} 🎉")

        except Exception as e:
            messagebox.showerror("Erro no Sorteio", str(e))


if __name__ == "__main__":
    root = tk.Tk()
    app = SorteioApp(root)
    root.mainloop()
