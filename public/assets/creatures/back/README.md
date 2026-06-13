# 🔄 Creature Back Images

Imagens **traseiras** das criaturas — usadas quando o jogador está **controlando** a criatura em batalha.

Contextos de uso:
- Batalha em Masmorras (PvE) — sua criatura vista de costas
- Batalha PvP — sua criatura vista de costas

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

A criatura deve estar **virada para a direita, de costas para o jogador**, olhando na direção do oponente. Posição de combate defensiva/estratégica.
