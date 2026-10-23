# CP05 — Pipeline DevSecOps completo

Checkpoint da disciplina **DevSecOps and Cloud Computing** (FIAP, Engenharia de Software).

Cenário: uma chave de API vazou num commit público da Arcanjosa, e a diretoria
decretou pipeline de segurança obrigatório em todos os repositórios. Este é o
pipeline de referência. Ele precisa **barrar** segredos, código vulnerável e
imagem com CVE crítico — e **provar** que barra, com testes de sabotagem.

## O que há no repositório

| Caminho | O que é |
|---|---|
| `site/` | Portal de status estático (HTML, CSS e JS puro) |
| `Dockerfile` | Imagem Nginx que serve o portal |
| `.github/workflows/security.yml` | O pipeline: três jobs, um por barreira |

## As três barreiras

| Job | Ferramenta | O que barra | Quando falha |
|---|---|---|---|
| `gitleaks` | [Gitleaks](https://github.com/gitleaks/gitleaks) | Segredos no histórico do git (chaves AWS, tokens, senhas) | Qualquer segredo encontrado em qualquer commit do push ou PR |
| `semgrep` | [Semgrep](https://semgrep.dev) | Código vulnerável (SAST) com as regras `p/javascript` e `p/security-audit` | Qualquer achado (`--error`) |
| `trivy` | [Trivy](https://github.com/aquasecurity/trivy) | Vulnerabilidades conhecidas (CVE) na imagem Docker construída | Qualquer CVE **CRITICAL** com correção disponível |

O workflow dispara em todo `push` e `pull_request`.

## Provas de sabotagem

Cada barreira foi testada com um branch que introduz o problema de propósito.
O pipeline **falha** no branch sabotado e **passa** na `main`.

| Branch | Sabotagem | Barreira acionada |
|---|---|---|
| `sabotagem/segredo` | Commit com chave de acesso AWS falsa em `config/aws.env` | Gitleaks |
| `sabotagem/eval` | `eval()` sobre entrada do usuário em `site/app.js` | Semgrep |
| `sabotagem/imagem-vulneravel` | `FROM nginx:1.14` (base antiga, com CVEs críticos) | Trivy |

Os prints de cada execução e a explicação de cada barreira estão no PDF entregue
junto com o checkpoint.

## Rodar localmente

```bash
docker build -t arcanjosa-portal .
docker run --rm -p 8080:80 arcanjosa-portal
# http://localhost:8080
```

Os mesmos scanners do pipeline podem ser rodados na máquina:

```bash
gitleaks git --verbose .
semgrep scan --config p/javascript --config p/security-audit --error
trivy image --severity CRITICAL --ignore-unfixed arcanjosa-portal
```
