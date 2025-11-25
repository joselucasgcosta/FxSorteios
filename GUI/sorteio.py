import customtkinter as ctk
from tkinter import filedialog, messagebox
import pandas as pd
import random
import time
import threading

# --- Configuração de Tema e Cores ---
ctk.set_appearance_mode("Dark")  # Modo Escuro
ctk.set_default_color_theme("dark-blue")

# Paleta de Cores (FxBlack)
COLOR_BLACK = "#0a0a0a"
COLOR_DARK = "#171717"
COLOR_ORANGE = "#f97316"
COLOR_ORANGE_HOVER = "#c2410c"
COLOR_TEXT_GRAY = "#a3a3a3"
COLOR_WHITE = "#ffffff"


class SorteioApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Configuração da Janela
        self.title("FxBlack Sorteador Ponderado")
        self.geometry("900x600")
        self.configure(fg_color=COLOR_BLACK)

        # Variáveis de Estado
        self.participants = []  # Lista de participantes carregados
        self.is_animating = False

        # Layout Principal (Grid 2 colunas: Sidebar | Main)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.create_sidebar()
        self.create_main_area()

    def create_sidebar(self):
        """Cria a barra lateral com controles e histórico"""
        self.sidebar = ctk.CTkFrame(
            self, width=260, corner_radius=0, fg_color=COLOR_DARK)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_rowconfigure(4, weight=1)  # Faz o histórico expandir

        # Título
        self.logo = ctk.CTkLabel(
            self.sidebar,
            text="FxBlack\nSorteios",
            font=ctk.CTkFont(family="Arial", size=28, weight="bold"),
            text_color=COLOR_ORANGE
        )
        self.logo.grid(row=0, column=0, padx=20, pady=(30, 10))

        self.lbl_desc = ctk.CTkLabel(
            self.sidebar,
            text="Sistema de Sorteio Ponderado",
            font=ctk.CTkFont(size=12),
            text_color=COLOR_TEXT_GRAY
        )
        self.lbl_desc.grid(row=1, column=0, padx=20, pady=(0, 20))

        # Botão Carregar Arquivo
        self.btn_load = ctk.CTkButton(
            self.sidebar,
            text="📂 Carregar Excel (.xlsx)",
            command=self.load_file,
            fg_color="#262626",
            border_color=COLOR_ORANGE,
            border_width=1,
            hover_color="#333333",
            height=40,
            font=ctk.CTkFont(weight="bold")
        )
        self.btn_load.grid(row=2, column=0, padx=20, pady=10, sticky="ew")

        # Status
        self.lbl_status = ctk.CTkLabel(
            self.sidebar, text="Aguardando arquivo...", text_color=COLOR_TEXT_GRAY)
        self.lbl_status.grid(row=3, column=0, padx=20, pady=5)

        # Histórico
        self.lbl_history_title = ctk.CTkLabel(
            self.sidebar,
            text="Histórico de Ganhadores:",
            font=ctk.CTkFont(size=14, weight="bold"),
            anchor="w"
        )
        self.lbl_history_title.grid(
            row=4, column=0, padx=20, pady=(20, 0), sticky="sw")

        self.txt_history = ctk.CTkTextbox(
            self.sidebar,
            fg_color=COLOR_BLACK,
            text_color=COLOR_WHITE,
            font=ctk.CTkFont(size=12)
        )
        self.txt_history.grid(row=5, column=0, padx=20,
                              pady=(5, 20), sticky="nsew")
        self.txt_history.configure(state="disabled")

    def create_main_area(self):
        """Cria a área principal de sorteio"""
        self.main_frame = ctk.CTkFrame(self, fg_color=COLOR_BLACK)
        self.main_frame.grid(row=0, column=1, sticky="nsew", padx=20, pady=20)

        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_rowconfigure(1, weight=1)
        self.main_frame.grid_rowconfigure(2, weight=1)

        # Área do Vencedor
        self.container_winner = ctk.CTkFrame(
            self.main_frame, fg_color=COLOR_BLACK)
        self.container_winner.grid(row=1, column=0, sticky="ew")

        self.lbl_code = ctk.CTkLabel(
            self.container_winner,
            text="",
            font=ctk.CTkFont(size=18),
            text_color=COLOR_TEXT_GRAY
        )
        self.lbl_code.pack(pady=(0, 10))

        self.lbl_winner = ctk.CTkLabel(
            self.container_winner,
            text="Carregue a planilha\npara começar",
            font=ctk.CTkFont(size=48, weight="bold"),
            text_color=COLOR_WHITE,
            wraplength=600
        )
        self.lbl_winner.pack()

        # Botão de Sorteio
        self.btn_draw = ctk.CTkButton(
            self.main_frame,
            text="REALIZAR SORTEIO",
            command=self.start_draw,
            fg_color=COLOR_ORANGE,
            hover_color=COLOR_ORANGE_HOVER,
            text_color="black",
            font=ctk.CTkFont(size=20, weight="bold"),
            height=60,
            width=300,
            corner_radius=30
        )
        self.btn_draw.grid(row=2, column=0, pady=50)
        self.btn_draw.configure(state="disabled")

    def load_file(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Arquivos Excel", "*.xlsx")])
        if not file_path:
            return

        try:
            # Lê o arquivo Excel
            # Assumindo cabeçalhos na linha 1. Se não houver, ajuste 'header'.
            df = pd.read_excel(file_path)

            if len(df.columns) < 3:
                messagebox.showerror(
                    "Erro", "O arquivo precisa ter as colunas A, B e C.")
                return

            # Seleciona as 3 primeiras colunas (A=0, B=1, C=2)
            # Renomeia para facilitar manipulação
            data = df.iloc[:, [0, 1, 2]].copy()
            data.columns = ['code', 'name', 'weight']

            # Tratamento de dados
            # Garante que peso é numérico, converte erros para NaN e preenche com 0
            data['weight'] = pd.to_numeric(
                data['weight'], errors='coerce').fillna(0)

            # Remove pesos zerados ou negativos
            valid_data = data[data['weight'] > 0]

            # Converte para lista de dicionários
            self.participants = valid_data.to_dict('records')

            if not self.participants:
                messagebox.showwarning(
                    "Aviso", "Nenhum participante com peso > 0 encontrado.")
                return

            # Atualiza UI
            self.lbl_status.configure(
                text=f"{len(self.participants)} participantes carregados")
            self.lbl_winner.configure(
                text="Pronto para Sortear!", text_color=COLOR_WHITE)
            self.lbl_code.configure(text="")
            self.btn_draw.configure(state="normal")

            # Visual feedback
            messagebox.showinfo("Sucesso", "Arquivo carregado com sucesso!")

        except Exception as e:
            messagebox.showerror("Erro", f"Falha ao ler arquivo: {str(e)}")

    def start_draw(self):
        if not self.participants or self.is_animating:
            return

        self.is_animating = True
        self.btn_draw.configure(state="disabled", text="SORTEANDO...")
        self.btn_load.configure(state="disabled")

        # Executa a animação em uma thread separada para não travar a GUI
        threading.Thread(target=self.run_animation, daemon=True).start()

    def run_animation(self):
        """Lógica do Sorteio + Animação"""

        # 1. Lógica do Sorteio Ponderado
        # Cria lista de pesos correspondentes
        weights = [p['weight'] for p in self.participants]

        # Escolhe um vencedor baseado no peso (random.choices retorna lista, pegamos o [0])
        winner = random.choices(self.participants, weights=weights, k=1)[0]

        # 2. Animação (Efeito de roleta)
        duration = 3.0  # Segundos de animação
        end_time = time.time() + duration

        while time.time() < end_time:
            # Escolhe um nome aleatório APENAS para efeito visual
            temp_display = random.choice(self.participants)

            # Atualiza a interface (deve ser feito na thread principal se possível,
            # mas TKinter tolera edições simples de texto de threads)
            self.lbl_winner.configure(
                text=temp_display['name'], text_color=COLOR_TEXT_GRAY)
            self.lbl_code.configure(text=f"Cód: {temp_display['code']}")

            time.sleep(0.1)  # Velocidade da troca de nomes

        # 3. Revelação Final
        self.is_animating = False
        self.show_winner(winner)

    def show_winner(self, winner):
        # Atualiza Labels
        self.lbl_winner.configure(text=winner['name'], text_color=COLOR_ORANGE)
        self.lbl_code.configure(text=f"Código Cliente: {winner['code']}")

        # Reseta Botões
        self.btn_draw.configure(state="normal", text="SORTEAR NOVAMENTE")
        self.btn_load.configure(state="normal")

        # Adiciona ao Histórico
        timestamp = time.strftime("%H:%M:%S")
        history_text = f"[{timestamp}] {winner['name']} (Peso: {winner['weight']})\n"

        self.txt_history.configure(state="normal")
        self.txt_history.insert("0.0", history_text)  # Insere no topo
        self.txt_history.configure(state="disabled")


if __name__ == "__main__":
    app = SorteioApp()
    app.mainloop()
