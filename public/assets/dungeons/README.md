# Cenários das Masmorras

Coloque aqui as imagens de fundo para cada Masmorra.

## Formato Esperado

| Propriedade   | Valor Esperado  |
|---------------|-----------------|
| Tamanho Recomendado | **360 × 400 px** ou proporção equivalente a uma tela mobile no modo paisagem/retrato. |
| Formato       | `.png` ou `.jpg` |
| Estilo        | Pixel Art       |

## Nomenclatura

O nome do arquivo DEVE ser o ID exato da masmorra (conforme cadastrado em `server/src/data/dungeons.ts`).

Exemplos:
- `forest.png`
- `crystal_cave.png`
- `volcano.png`

No CSS, usaremos `background-size: cover` ou `contain` com `image-rendering: pixelated` para que ele expanda preenchendo a tela do `BattleScreen`.
