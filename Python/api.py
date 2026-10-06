import os
import secrets

import psycopg2
from psycopg2.extras import RealDictCursor

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from dotenv import load_dotenv


# ============================================================
# CARREGAR VARIÁVEIS DE AMBIENTE
# ============================================================

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")


# ============================================================
# CONEXÃO COM O BANCO
# ============================================================

def conectar_banco():

    if not DATABASE_URL:

        raise RuntimeError(
            "DATABASE_URL não foi configurada."
        )

    return psycopg2.connect(
        DATABASE_URL
    )


# ============================================================
# PREPARAR BANCO
# ============================================================

def preparar_banco():

    conexao = None

    try:

        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mensagens (
                id BIGSERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                mensagem VARCHAR(500) NOT NULL,
                data_criacao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conexao.commit()

        cursor.close()

        print(
            "Banco PostgreSQL preparado com sucesso."
        )

    except Exception as erro:

        print(
            "Erro ao preparar banco:"
        )

        print(
            erro
        )

        raise

    finally:

        if conexao:

            conexao.close()


# ============================================================
# INICIALIZAÇÃO
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print(
        "Iniciando Gustavo Lab..."
    )

    preparar_banco()

    yield

    print(
        "Gustavo Lab encerrado."
    )


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Gustavo Lab API",
    version="2.0.0",
    lifespan=lifespan
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_credentials=False,

    allow_methods=[
        "GET",
        "POST",
        "DELETE",
        "OPTIONS"
    ],

    allow_headers=[
        "*"
    ]
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
        "mensagem": "Gustavo Lab API funcionando!",
        "versao": "2.0.0",
        "banco": "PostgreSQL"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def verificar_api():

    conexao = None

    try:

        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute(
            "SELECT 1"
        )

        cursor.fetchone()

        cursor.close()

        return {
            "sucesso": True,
            "api": "online",
            "banco": "conectado"
        }

    except Exception as erro:

        print(
            "Erro no health check:"
        )

        print(
            erro
        )

        raise HTTPException(
            status_code=500,
            detail="Banco de dados indisponível."
        )

    finally:

        if conexao:

            conexao.close()


# ============================================================
# LISTAR MENSAGENS
# ============================================================

@app.get("/mensagens")
def listar_mensagens():

    conexao = None

    try:

        conexao = conectar_banco()

        cursor = conexao.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute("""
            SELECT
                id,
                nome,
                mensagem,
                data_criacao
            FROM mensagens
            ORDER BY id DESC
            LIMIT 100
        """)

        resultados = cursor.fetchall()

        cursor.close()

        mensagens = []


        for resultado in resultados:

            data = resultado["data_criacao"]

            data_formatada = None


            if data:

                data_formatada = (
                    data.isoformat()
                )


            mensagens.append({

                "id":
                    resultado["id"],

                "nome":
                    resultado["nome"],

                "mensagem":
                    resultado["mensagem"],

                # Mantemos os dois nomes por compatibilidade
                # com versões anteriores do JavaScript.

                "data_criacao":
                    data_formatada,

                "data_mensagem":
                    data_formatada

            })


        return {

            "sucesso": True,

            "quantidade":
                len(mensagens),

            "mensagens":
                mensagens

        }

    except Exception as erro:

        print(
            "Erro ao buscar mensagens:"
        )

        print(
            erro
        )

        raise HTTPException(
            status_code=500,
            detail="Não foi possível carregar as mensagens."
        )

    finally:

        if conexao:

            conexao.close()


# ============================================================
# CADASTRAR MENSAGEM
# ============================================================

@app.post("/mensagens")
def cadastrar_mensagem(
    dados: Mensagem
):

    nome = (
        dados.nome.strip()
    )

    mensagem = (
        dados.mensagem.strip()
    )


    # ========================================================
    # VALIDAR NOME
    # ========================================================

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


    # ========================================================
    # VALIDAR MENSAGEM
    # ========================================================

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


    # ========================================================
    # SALVAR MENSAGEM
    # ========================================================

    conexao = None

    try:

        conexao = conectar_banco()

        cursor = conexao.cursor(
            cursor_factory=RealDictCursor
        )


        cursor.execute("""
            INSERT INTO mensagens
            (
                nome,
                mensagem
            )
            VALUES
            (
                %s,
                %s
            )
            RETURNING
                id,
                data_criacao
        """, (
            nome,
            mensagem
        ))


        nova_mensagem = (
            cursor.fetchone()
        )


        conexao.commit()


        cursor.close()


        print(
            f"Nova mensagem recebida de {nome}"
        )


        return {

            "sucesso": True,

            "mensagem":
                "Mensagem enviada com sucesso!",

            "id":
                nova_mensagem["id"],

            "nome":
                nome,

            "texto":
                mensagem,

            "data_mensagem":
                nova_mensagem[
                    "data_criacao"
                ].isoformat()

        }

    except Exception as erro:

        if conexao:

            conexao.rollback()


        print(
            "Erro ao salvar mensagem:"
        )

        print(
            erro
        )


        raise HTTPException(
            status_code=500,
            detail="Não foi possível salvar a mensagem."
        )

    finally:

        if conexao:

            conexao.close()


# ============================================================
# EXCLUIR MENSAGEM
# ============================================================

@app.delete(
    "/mensagens/{mensagem_id}"
)
def excluir_mensagem(
    mensagem_id: int,
    x_admin_token: str | None = Header(
        default=None
    )
):

    # ========================================================
    # PROTEGER EXCLUSÃO
    # ========================================================

    if not ADMIN_TOKEN:

        raise HTTPException(
            status_code=503,
            detail="ADMIN_TOKEN não configurado."
        )


    if not x_admin_token:

        raise HTTPException(
            status_code=401,
            detail="Token administrativo não informado."
        )


    if not secrets.compare_digest(
        x_admin_token,
        ADMIN_TOKEN
    ):

        raise HTTPException(
            status_code=401,
            detail="Token administrativo inválido."
        )


    conexao = None


    try:

        conexao = conectar_banco()

        cursor = conexao.cursor()


        cursor.execute("""
            DELETE FROM mensagens
            WHERE id = %s
        """, (
            mensagem_id,
        ))


        if cursor.rowcount == 0:

            conexao.rollback()

            cursor.close()

            raise HTTPException(
                status_code=404,
                detail="Mensagem não encontrada."
            )


        conexao.commit()

        cursor.close()


        return {

            "sucesso": True,

            "mensagem":
                "Mensagem excluída com sucesso."

        }

    except HTTPException:

        raise

    except Exception as erro:

        if conexao:

            conexao.rollback()


        print(
            "Erro ao excluir mensagem:"
        )

        print(
            erro
        )


        raise HTTPException(
            status_code=500,
            detail="Não foi possível excluir a mensagem."
        )

    finally:

        if conexao:

            conexao.close()


# ============================================================
# EXECUTAR LOCALMENTE
# ============================================================

if __name__ == "__main__":

    import uvicorn


    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000
    )