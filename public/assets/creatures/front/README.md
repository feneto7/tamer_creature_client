# 🎭 Creature Front Images

Imagens **frontais** das criaturas — usadas quando a criatura é o **oponente** (encarando o jogador).

Contextos de uso:
- Batalha em Masmorras (PvE) — criatura selvagem de frente
- Batalha PvP — criatura do adversário de frente
- Tela de captura "Erga-se"

## Especificações

| Propriedade   | Valor           |
|---------------|-----------------|
| Dimensão      | **64 × 64 px** ou **96 × 96 px** |
| Formato       | `.png` (fundo transparente) |
| Estilo        | Pixel Art       |
| Renderização  | `image-rendering: pixelated` |

## Nomenclatura

O nome do arquivo DEVE ser o `speciesId` da criatura.

Exemplos:
- `shadow_bat.png`
- `fire_salamander.png`
- `venom_serpent.png`
- `earth_golem.png`
- `wind_falcon.png`
- `spirit_wolf.png`
- `ember_dragon.png`

## Orientação Visual

A criatura deve estar **virada para a esquerda**, encarando o jogador. Posição de combate ofensiva.
