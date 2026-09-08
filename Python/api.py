from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

import sqlite3
from datetime import datetime


# ============================================================
# CONFIGURAÇÕES
# ============================================================

BANCO = "gustavo_lab.db"


# ============================================================
# CONEXÃO COM O BANCO
# ============================================================

def conectar_banco():
    return sqlite3.connect(BANCO)


# ============================================================
# PREPARAR BANCO
# ============================================================

def preparar_banco():

    try:

        conexao = conectar_banco()
        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mensagens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                mensagem TEXT NOT NULL,
                data_criacao TEXT NOT NULL
            )
        """)

        conexao.commit()
        conexao.close()

        print(" Banco SQL preparado com sucesso.")

    except Exception as erro:

        print(" Erro ao preparar banco:")
        print(erro)


# ============================================================
# INICIALIZAÇÃO
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print(" Iniciando Gustavo Lab...")

    preparar_banco()

    yield

    print(" Gustavo Lab encerrado.")


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Gustavo Lab API",
    version="1.0.0",
    lifespan=lifespan
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# MODELO DA MENSAGEM
# ============================================================

class Mensagem(BaseModel):

    nome: str
    mensagem: str


# ============================================================
# ROTA INICIAL
# ============================================================

@app.get("/")
def inicio():

    return {
        "sucesso": True,
        "mensagem": " Gustavo Lab API funcionando!",
        "versao": "1.0.0"
    }


# ============================================================
# LISTAR MENSAGENS
# ============================================================

@app.get("/mensagens")
def listar_mensagens():

    try:

        conexao = conectar_banco()
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT
                id,
                nome,
                mensagem,
                data_criacao
            FROM mensagens
            ORDER BY id DESC
        """)

        resultados = cursor.fetchall()

        conexao.close()

        mensagens = []

        for resultado in resultados:

            mensagens.append({
                "id": resultado[0],
                "nome": resultado[1],
                "mensagem": resultado[2],
                "data_criacao": resultado[3]
            })

        return {
            "sucesso": True,
            "quantidade": len(mensagens),
            "mensagens": mensagens
        }

    except Exception as erro:

        print("❌ Erro ao buscar mensagens:")
        print(erro)

        raise HTTPException(
            status_code=500,
            detail="Não foi possível carregar as mensagens."
        )


# ============================================================
# CADASTRAR MENSAGEM
# ============================================================

@app.post("/mensagens")
def cadastrar_mensagem(dados: Mensagem):

    nome = dados.nome.strip()
    mensagem = dados.mensagem.strip()

    # --------------------------------------------------------
    # VALIDAR NOME
    # --------------------------------------------------------

    if not nome:

        raise HTTPException(
            status_code=400,
            detail="Digite seu nome."
        )

    if len(nome) < 2:

        raise HTTPException(
            status_code=400,
            detail="Digite um nome válido."
        )

    if len(nome) > 100:

        raise HTTPException(
            status_code=400,
            detail="O nome deve ter no máximo 100 caracteres."
        )

    # --------------------------------------------------------
    # VALIDAR MENSAGEM
    # --------------------------------------------------------

    if not mensagem:

        raise HTTPException(
            status_code=400,
            detail="Digite uma mensagem."
        )

    if len(mensagem) < 2:

        raise HTTPException(
            status_code=400,
            detail="Digite uma mensagem válida."
        )

    if len(mensagem) > 500:

        raise HTTPException(
            status_code=400,
            detail="A mensagem deve ter no máximo 500 caracteres."
        )

    # --------------------------------------------------------
    # SALVAR NO BANCO
    # --------------------------------------------------------

    try:

        conexao = conectar_banco()
        cursor = conexao.cursor()

        data_atual = datetime.now().strftime(
            "%d/%m/%Y %H:%M"
        )

        cursor.execute("""
            INSERT INTO mensagens
            (
                nome,
                mensagem,
                data_criacao
            )
            VALUES (?, ?, ?)
        """, (
            nome,
            mensagem,
            data_atual
        ))

        conexao.commit()

        novo_id = cursor.lastrowid

        conexao.close()

        print(
            f"✅ Nova mensagem: {nome} - {mensagem}"
        )

        return {
            "sucesso": True,
            "mensagem": "Mensagem enviada com sucesso!",
            "id": novo_id,
            "nome": nome,
            "texto": mensagem
        }

    except Exception as erro:

        print("❌ Erro ao salvar mensagem:")
        print(erro)

        raise HTTPException(
            status_code=500,
            detail="Não foi possível salvar a mensagem."
        )


# ============================================================
# EXCLUIR MENSAGEM
# ============================================================

@app.delete("/mensagens/{mensagem_id}")
def excluir_mensagem(mensagem_id: int):

    try:

        conexao = conectar_banco()
        cursor = conexao.cursor()

        cursor.execute("""
            DELETE FROM mensagens
            WHERE id = ?
        """, (mensagem_id,))

        if cursor.rowcount == 0:

            conexao.close()

            raise HTTPException(
                status_code=404,
                detail="Mensagem não encontrada."
            )

        conexao.commit()
        conexao.close()

        return {
            "sucesso": True,
            "mensagem": "Mensagem excluída com sucesso."
        }

    except HTTPException:
        raise

    except Exception as erro:

        print(" Erro ao excluir mensagem:")
        print(erro)

        raise HTTPException(
            status_code=500,
            detail="Não foi possível excluir a mensagem."
        )


# ============================================================
# EXECUTAR O ARQUIVO DIRETAMENTE
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000
    )